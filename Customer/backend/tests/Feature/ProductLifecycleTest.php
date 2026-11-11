<?php
namespace Tests\Feature;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductLifecycleTest extends TestCase
{
    use RefreshDatabase;
    public function test_delete_preflight_supports_configured_frontend(): void
    {
        $this->withHeaders(['Origin'=>'http://localhost:5173','Access-Control-Request-Method'=>'DELETE'])
            ->options('/api/staff/products/1')->assertNoContent()->assertHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS');
    }
    public function test_archive_restore_and_delete_preserve_order_history(): void
    {
        $product=Product::create(['sku'=>'lifecycle','name'=>'Hammer','category'=>'Tools','unit'=>'piece','stock'=>5,'price_centavos'=>10000,'is_active'=>true]);
        $path='/api/staff/products/'.$product->id;
        $this->deleteJson($path)->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true]));
        $this->patchJson($path,['is_active'=>false])->assertOk();
        $this->getJson('/api/products')->assertJsonCount(0,'data');
        $this->getJson('/api/staff/products')->assertJsonCount(1,'data')->assertJsonPath('data.0.can_delete',true);
        $this->patchJson($path,['is_active'=>true])->assertOk();
        $this->getJson('/api/products')->assertJsonCount(1,'data');
        $this->withHeader('Idempotency-Key','product-lifecycle-order')->postJson('/api/orders',[
            'customer_name'=>'Test','mobile_number'=>'09123456789','fulfillment_method'=>'store_pickup','payment_method'=>'cash_at_store',
            'items'=>[['product_id'=>$product->id,'quantity'=>1]],
        ])->assertCreated();
        $this->getJson('/api/staff/products')->assertJsonPath('data.0.can_delete',false);
        $this->deleteJson($path)->assertStatus(409);
        $this->patchJson($path,['is_active'=>false])->assertOk();
        $this->assertDatabaseCount('order_items',1);
        $unused=Product::create(['sku'=>'unused','name'=>'Unused','category'=>'Tools','unit'=>'piece','stock'=>0,'price_centavos'=>10000,'is_active'=>true]);
        $this->deleteJson('/api/staff/products/'.$unused->id)->assertNoContent();
        $this->assertDatabaseMissing('products',['id'=>$unused->id]);
    }
}
