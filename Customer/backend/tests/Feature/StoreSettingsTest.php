<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StoreSettingsTest extends TestCase
{
    use RefreshDatabase;

    public function test_settings_are_saved_and_only_admin_can_change_them(): void
    {
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true]));
        $this->getJson('/api/staff/settings')->assertOk()->assertJsonPath('notify_new_orders',true);
        $this->patchJson('/api/staff/settings',['store_name'=>'Changed'])->assertForbidden();
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true,'is_admin'=>true]));
        $this->patchJson('/api/staff/settings',[
            'store_name'=>'Actual Store','store_address'=>'Main Street','store_phone'=>'09123456789',
            'store_hours'=>'8 AM–5 PM','delivery_enabled'=>false,'notify_new_orders'=>false,
            'low_stock_threshold'=>5,
        ])->assertOk()->assertJsonPath('store_name','Actual Store')->assertJsonPath('delivery_enabled',false);
        $this->getJson('/api/staff/settings')->assertJsonPath('notify_new_orders',false)->assertJsonPath('low_stock_threshold',5);
        $this->getJson('/api/store')->assertOk()->assertJsonPath('store_name','Actual Store')
            ->assertJsonPath('delivery_enabled',false)->assertJsonMissingPath('notify_new_orders');
        $this->patchJson('/api/staff/settings',['low_stock_threshold'=>-1])->assertUnprocessable();
    }

    public function test_disabled_fulfillment_rejects_checkout_without_deducting_stock(): void
    {
        \App\Models\StoreSetting::create(['key'=>'delivery_enabled','value'=>'0']);
        $product=Product::create(['sku'=>'settings-test','name'=>'Hammer','category'=>'Tools','unit'=>'piece','stock'=>5,'price_centavos'=>10000,'is_active'=>true]);
        $this->withHeader('Idempotency-Key','settings-disabled-order')->postJson('/api/orders',[
            'customer_name'=>'Customer','mobile_number'=>'09123456789','fulfillment_method'=>'delivery',
            'payment_method'=>'cash_on_delivery','address'=>'Test Street','items'=>[['product_id'=>$product->id,'quantity'=>1]],
        ])->assertUnprocessable();
        $this->assertEquals(5,$product->fresh()->stock);
        $this->assertDatabaseCount('orders',0);
    }

    public function test_password_change_requires_current_password_and_confirmation(): void
    {
        $admin=User::factory()->create(['is_staff'=>true,'is_admin'=>true,'password'=>'Old-password-1234']);
        Sanctum::actingAs($admin);
        $payload=['name'=>$admin->name,'email'=>$admin->email,'current_password'=>'incorrect',
            'password'=>'New-password-1234','password_confirmation'=>'New-password-1234'];
        $this->patchJson('/api/staff/account',$payload)->assertUnprocessable();
        $payload['current_password']='Old-password-1234';
        $this->patchJson('/api/staff/account',$payload)->assertOk();
        $this->assertTrue(Hash::check('New-password-1234',$admin->fresh()->password));
    }
}
