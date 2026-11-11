<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConnectedAdminTest extends TestCase
{
    use RefreshDatabase;

    private function place(Product $product, string $key, string $method = 'store_pickup')
    {
        return $this->withHeader('Idempotency-Key', $key)->postJson('/api/orders', [
            'customer_name' => 'Integration Customer', 'mobile_number' => '09123456789',
            'fulfillment_method' => $method, 'payment_method' => $method === 'delivery' ? 'cash_on_delivery' : 'cash_at_store',
            'address' => $method === 'delivery' ? 'Test address' : null,
            'items' => [['product_id' => $product->id, 'quantity' => 1]],
        ])->assertCreated();
    }

    public function test_database_login_requires_an_admin_account_and_logout_revokes_token(): void
    {
        $staff = User::factory()->create(['is_staff' => true, 'password' => 'test-password-123']);
        $admin = User::factory()->create(['is_staff' => true, 'is_admin' => true, 'password' => 'test-password-123']);
        $this->postJson('/api/admin/login', ['email' => $staff->email, 'password' => 'test-password-123'])->assertUnprocessable();
        $this->postJson('/api/admin/login', ['email' => $admin->email, 'password' => 'wrong'])->assertUnprocessable();
        $login = $this->postJson('/api/admin/login', ['email' => $admin->email, 'password' => 'test-password-123'])
            ->assertOk()->assertJsonPath('user.is_admin', true);
        $this->withToken($login->json('token'))->getJson('/api/staff/orders')->assertOk();
        $this->withToken($login->json('token'))->postJson('/api/staff/logout')->assertNoContent();
        $this->assertDatabaseCount('personal_access_tokens', 0);
    }

    public function test_admin_reset_link_is_required_and_can_only_be_used_once(): void
    {
        $admin = User::factory()->create(['is_staff' => true, 'is_admin' => true]);
        $token = \Illuminate\Support\Facades\Password::createToken($admin);
        $admin->createToken('old-session');
        $payload = ['email' => $admin->email, 'token' => $token, 'password' => 'Browser-reset-test-1234', 'password_confirmation' => 'Browser-reset-test-1234'];
        $this->postJson('/api/admin/reset-password', [...$payload, 'token' => 'wrong'])->assertUnprocessable();
        $this->postJson('/api/admin/reset-password', $payload)->assertOk();
        $this->assertDatabaseCount('personal_access_tokens', 0);
        $this->postJson('/api/admin/login', ['email' => $admin->email, 'password' => $payload['password']])->assertOk();
        $this->postJson('/api/admin/reset-password', $payload)->assertUnprocessable();
    }

    public function test_admin_product_changes_checkout_queue_and_customer_status_share_the_database(): void
    {
        $this->getJson('/api/staff/products')->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['is_staff' => true, 'is_admin' => true]));
        $created = $this->postJson('/api/staff/products', [
            'sku' => 'INTEGRATION-01', 'name' => 'Store Hammer', 'category' => 'Tools', 'unit' => 'piece',
            'price_centavos' => 12550, 'stock' => 5,
        ])->assertCreated();
        $id = $created->json('data.id');
        $this->patchJson('/api/staff/products/'.$id, ['price_centavos' => 15025])->assertOk();
        $this->getJson('/api/products')->assertJsonPath('data.0.price', 150.25);
        $product = Product::findOrFail($id);
        $first = $this->place($product, 'integration-order-00001');
        $second = $this->place($product, 'integration-order-00002', 'delivery');
        $firstNumber = $first->json('data.order_number');
        $secondNumber = $second->json('data.order_number');
        $this->getJson('/api/staff/orders?active=1')->assertOk()
            ->assertJsonPath('data.0.order_number', $firstNumber)
            ->assertJsonPath('data.1.queue_position', 2);
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/status', ['status' => 'Processing'])->assertOk();
        $this->withToken($first->json('access_token'))->getJson('/api/orders/'.$firstNumber)
            ->assertOk()->assertJsonPath('data.order_status', 'Processing');
        $this->withToken($second->json('access_token'))->getJson('/api/orders/'.$secondNumber)
            ->assertOk()->assertJsonPath('data.orders_ahead', 1);
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/status', ['status' => 'Ready for Delivery'])->assertConflict();
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/status', ['status' => 'Ready for Pickup'])->assertOk();
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/complete')->assertConflict();
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/paid')->assertOk();
        $this->patchJson('/api/staff/orders/'.$firstNumber.'/complete')->assertOk();
        $this->withToken($second->json('access_token'))->getJson('/api/orders/'.$secondNumber)
            ->assertOk()->assertJsonPath('data.orders_ahead', 0)->assertJsonPath('data.queue_position', 1);
        $this->assertSame(3, $product->fresh()->stock);
    }

    public function test_cancel_returns_stock_once_and_closes_queue_without_allowing_payment(): void
    {
        $product = Product::create(['sku' => 'CANCEL-01', 'name' => 'Hammer', 'category' => 'Tools', 'unit' => 'piece', 'price_centavos' => 10000, 'stock' => 5]);
        $created = $this->place($product, 'integration-cancel-0001');
        $number = $created->json('data.order_number');
        Sanctum::actingAs(User::factory()->create(['is_staff' => true]));
        $this->patchJson('/api/staff/orders/'.$number.'/status', ['status' => 'Cancelled'])->assertOk();
        $this->patchJson('/api/staff/orders/'.$number.'/status', ['status' => 'Cancelled'])->assertOk();
        $this->assertSame(5, $product->fresh()->stock);
        $this->patchJson('/api/staff/orders/'.$number.'/paid')->assertConflict();
        $this->patchJson('/api/staff/orders/'.$number.'/status', ['status' => 'Processing'])->assertConflict();
        $this->withToken($created->json('access_token'))->getJson('/api/orders/'.$number)
            ->assertOk()->assertJsonPath('data.queue_position', null)->assertJsonPath('data.order_status', 'Cancelled');
    }

    public function test_staff_operations_reject_customer_tokens_and_inactive_products_stay_hidden(): void
    {
        $product = Product::create(['sku' => 'HIDE-01', 'name' => 'Hammer', 'category' => 'Tools', 'unit' => 'piece', 'price_centavos' => 10000, 'stock' => 5]);
        $created = $this->place($product, 'integration-auth-00001');
        $this->withToken($created->json('access_token'))->patchJson('/api/staff/products/'.$product->id, ['stock' => 999])->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['is_staff' => true]));
        $this->patchJson('/api/staff/products/'.$product->id, ['is_active' => false])->assertOk();
        $this->getJson('/api/products')->assertJsonCount(0, 'data');
        $this->getJson('/api/staff/products')->assertJsonCount(1, 'data');
    }

    public function test_admin_can_change_fee_and_temporary_email_without_changing_existing_orders(): void
    {
        $admin = User::factory()->create(['email' => 'temporary@example.test', 'is_staff' => true, 'is_admin' => true, 'password' => 'test-password-123']);
        $product = Product::create(['sku' => 'FEE-01', 'name' => 'Hammer', 'category' => 'Tools', 'unit' => 'piece', 'price_centavos' => 10000, 'stock' => 5]);
        $first = $this->place($product, 'integration-fee-000001', 'delivery');
        Sanctum::actingAs($admin);
        $this->patchJson('/api/staff/settings', ['delivery_fee_centavos' => 8000])->assertOk();
        $this->getJson('/api/products')->assertJsonPath('store.delivery_fee_centavos', 8000);
        $second = $this->place($product, 'integration-fee-000002', 'delivery');
        $second->assertJsonPath('data.delivery_fee', 80);
        $this->withToken($first->json('access_token'))->getJson('/api/orders/'.$first->json('data.order_number'))
            ->assertJsonPath('data.delivery_fee', 60);
        $this->patchJson('/api/staff/account', ['name' => 'Store Admin', 'email' => 'client@example.test', 'current_password' => 'wrong'])->assertUnprocessable();
        $this->patchJson('/api/staff/account', ['name' => 'Store Admin', 'email' => 'client@example.test', 'current_password' => 'test-password-123'])
            ->assertOk()->assertJsonPath('email', 'client@example.test');
        Sanctum::actingAs(User::factory()->create(['is_staff' => true, 'is_admin' => false]));
        $this->patchJson('/api/staff/settings', ['delivery_fee_centavos' => 1])->assertForbidden();
    }
}
