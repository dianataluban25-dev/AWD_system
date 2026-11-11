<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\CatalogSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class OrderingApiTest extends TestCase
{
    use RefreshDatabase;

    private function product(int $stock = 5): Product
    {
        return Product::create([
            'sku' => 'TEST-'.Product::count(), 'name' => 'Hammer', 'category' => 'Tools',
            'price_centavos' => 7050, 'stock' => $stock, 'unit' => 'piece',
        ]);
    }

    private function payload(Product $product, array $overrides = []): array
    {
        return array_replace([
            'customer_name' => 'Test Customer', 'mobile_number' => '09123456789',
            'address' => 'Test delivery address', 'fulfillment_method' => 'delivery',
            'payment_method' => 'cash_on_delivery',
            'items' => [['product_id' => $product->id, 'quantity' => 2]],
        ], $overrides);
    }

    private function checkout(array $data, string $key = 'test-order-key-00001')
    {
        return $this->withHeader('Idempotency-Key', $key)->postJson('/api/orders', $data);
    }

    private function staff(): User
    {
        $staff = User::factory()->create(['is_staff' => true]);
        Sanctum::actingAs($staff);

        return $staff;
    }

    public function test_queue_is_stable_on_retry_and_advances_after_completion(): void
    {
        $product = $this->product(10);
        $first = $this->checkout($this->payload($product))->assertCreated();
        $second = $this->checkout($this->payload($product), 'test-order-key-00002')
            ->assertCreated()->assertJsonPath('data.orders_ahead', 1);
        $this->checkout($this->payload($product), 'test-order-key-00002')->assertOk()
            ->assertJsonPath('data.queue_number', $second->json('data.queue_number'));
        $url = '/api/orders/'.$second->json('data.order_number');
        $this->getJson($url)->assertNotFound();
        $this->staff();
        $firstPath='/api/staff/orders/'.$first->json('data.order_number');
        $this->patchJson($firstPath.'/status',['status'=>'Processing'])->assertOk();
        $this->patchJson($firstPath.'/status',['status'=>'Ready for Delivery'])->assertOk();
        $this->patchJson('/api/staff/orders/'.$first->json('data.order_number').'/paid')->assertOk();
        $this->withToken($second->json('access_token'))->getJson($url)->assertOk()
            ->assertJsonPath('data.orders_ahead', 0)
            ->assertJsonPath('data.queue_number', $second->json('data.queue_number'));
    }

    public function test_catalog_filters_and_keeps_decimal_prices(): void
    {
        $product = $this->product();
        $hidden = $this->product();
        $hidden->update(['is_active' => false]);
        $this->getJson('/api/products?category=Tools&search=Hammer')->assertOk()
            ->assertJsonCount(1, 'data')->assertJsonPath('data.0.price', 70.5)
            ->assertJsonPath('store.delivery_fee_centavos', 6000);
        $this->getJson('/api/products?category=Plumbing')->assertJsonCount(0, 'data');
    }

    public function test_order_uses_server_totals_and_retry_does_not_reduce_stock_twice(): void
    {
        $product = $this->product();
        $data = $this->payload($product, ['total' => 1, 'payment_status' => 'Paid']);
        $first = $this->checkout($data)->assertCreated()->assertJsonPath('data.total', 201)
            ->assertJsonPath('data.payment_status', 'Unpaid');
        $retry = $this->checkout($data)->assertOk();
        $this->assertSame($first->json('data.order_number'), $retry->json('data.order_number'));
        $this->assertSame($first->json('access_token'), $retry->json('access_token'));
        $this->assertSame(3, $product->fresh()->stock);
        $this->assertSame(1, Order::count());
        $this->checkout($this->payload($product, ['customer_name' => 'Other']))->assertConflict();
        $this->assertSame(3, $product->fresh()->stock);
    }

    public function test_customer_receipt_requires_its_own_token(): void
    {
        $created = $this->checkout($this->payload($this->product()))->assertCreated();
        $url = '/api/orders/'.$created->json('data.order_number');
        $this->getJson($url)->assertNotFound();
        $this->withToken('wrong')->getJson($url)->assertNotFound();
        $this->withToken($created->json('access_token'))->getJson($url)->assertOk()
            ->assertJsonMissingPath('data.access_token_hash');
        $this->getJson('/api/staff/orders')->assertUnauthorized();
    }

    public function test_validation_rejects_cod_pickup_duplicates_and_missing_key(): void
    {
        $product = $this->product();
        $this->postJson('/api/orders', $this->payload($product))->assertUnprocessable();
        $this->checkout($this->payload($product, ['fulfillment_method' => 'store_pickup']))->assertUnprocessable();
        $this->checkout($this->payload($product, ['address' => '']))->assertUnprocessable();
        $this->checkout($this->payload($product, ['items' => [
            ['product_id' => $product->id, 'quantity' => 1],
            ['product_id' => $product->id, 'quantity' => 1],
        ]]))->assertUnprocessable();
        $this->assertSame(5, $product->fresh()->stock);
        $this->assertSame(0, Order::count());
    }

    public function test_failed_order_rolls_back_all_stock(): void
    {
        $first = $this->product();
        $second = $this->product(0);
        $this->checkout($this->payload($first, ['items' => [
            ['product_id' => $first->id, 'quantity' => 2],
            ['product_id' => $second->id, 'quantity' => 1],
        ]]))->assertUnprocessable();
        $this->assertSame(5, $first->fresh()->stock);
        $this->assertSame(0, Order::count());
    }

    public function test_changed_checkout_quote_requires_customer_review_and_preserves_stock(): void
    {
        $product=$this->product();
        $payload=$this->payload($product,['expected_total_centavos'=>1]);
        $this->checkout($payload)->assertUnprocessable()->assertJsonValidationErrors('expected_total_centavos');
        $this->assertSame(5,$product->fresh()->stock);
        $this->assertDatabaseCount('orders',0);
    }

    public function test_staff_payment_is_protected_and_cod_completes_once(): void
    {
        $created = $this->checkout($this->payload($this->product()))->assertCreated();
        $number = $created->json('data.order_number');
        $url = '/api/staff/orders/'.$number.'/paid';
        $this->patchJson($url)->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create());
        $this->patchJson($url)->assertForbidden();
        $staff = $this->staff();
        $this->patchJson($url)->assertConflict();
        $this->patchJson('/api/staff/orders/'.$number.'/status',['status'=>'Processing'])->assertOk();
        $this->patchJson('/api/staff/orders/'.$number.'/status',['status'=>'Ready for Delivery'])->assertOk();
        $paid = $this->patchJson($url)->assertOk()->assertJsonPath('data.payment_status', 'Paid')
            ->assertJsonPath('data.order_status', 'Completed');
        $this->patchJson($url)->assertJsonPath('data.paid_at', $paid->json('data.paid_at'));
        $this->assertSame($staff->id, Order::first()->paid_by);
    }

    public function test_pickup_is_free_and_requires_payment_before_completion(): void
    {
        $created = $this->checkout($this->payload($this->product(), [
            'address' => null, 'fulfillment_method' => 'store_pickup', 'payment_method' => 'cash_at_store',
        ]))->assertCreated()->assertJsonPath('data.delivery_fee', 0)->assertJsonPath('data.total', 141);
        $this->staff();
        $url = '/api/staff/orders/'.$created->json('data.order_number');
        $this->patchJson($url.'/complete')->assertConflict();
        $this->patchJson($url.'/paid')->assertJsonPath('data.order_status', 'Pending');
        $this->patchJson($url.'/complete')->assertConflict();
        $this->patchJson($url.'/status',['status'=>'Processing'])->assertOk();
        $this->patchJson($url.'/status',['status'=>'Ready for Pickup'])->assertOk();
        $this->patchJson($url.'/complete')->assertJsonPath('data.order_status', 'Completed');
    }

    public function test_staff_login_logout_and_customer_cannot_create_products(): void
    {
        $user = User::factory()->create(['password' => 'a-long-test-password']);
        $credentials = ['email' => $user->email, 'password' => 'a-long-test-password'];
        $this->postJson('/api/staff/login', $credentials)->assertUnprocessable();
        $this->postJson('/api/staff/products', [])->assertUnauthorized();
        $user->forceFill(['is_staff' => true])->save();
        $login = $this->postJson('/api/staff/login', $credentials)->assertOk();
        $this->withToken($login->json('token'))->getJson('/api/staff/orders')->assertOk();
        $this->postJson('/api/staff/logout')->assertNoContent();
        $this->assertSame(0, $user->tokens()->count());
    }

    public function test_staff_can_add_products_and_seeding_does_not_reset_inventory(): void
    {
        $this->staff();
        $this->postJson('/api/staff/products', [
            'sku' => 'NEW-01', 'name' => 'Test cement', 'category' => 'Building Materials',
            'unit' => 'bag', 'price_centavos' => 24500, 'stock' => 10,
        ])->assertCreated()->assertJsonPath('data.stock', 10);
        $this->seed(CatalogSeeder::class);
        $product = Product::where('sku', 'HAMMER-01')->first();
        $product->update(['stock' => 1, 'price_centavos' => 9999]);
        $this->seed(CatalogSeeder::class);
        $this->assertSame(1, $product->fresh()->stock);
        $this->assertSame(9999, $product->fresh()->price_centavos);
    }

    public function test_cors_allows_configured_react_origin(): void
    {
        $this->withHeaders([
            'Origin' => 'http://localhost:5173', 'Access-Control-Request-Method' => 'POST',
            'Access-Control-Request-Headers' => 'Content-Type,Idempotency-Key',
        ])->options('/api/orders')->assertNoContent()
            ->assertHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    }
}
