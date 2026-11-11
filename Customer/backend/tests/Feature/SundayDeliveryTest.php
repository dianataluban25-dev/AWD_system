<?php
namespace Tests\Feature;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class SundayDeliveryTest extends TestCase
{
    use RefreshDatabase;
    public function test_sunday_orders_are_accepted_for_monday_and_cannot_be_delivered_sunday(): void
    {
        $this->travelTo(\Carbon\Carbon::parse('2026-10-18 10:00:00','Asia/Manila'));
        $product=Product::create(['sku'=>'sunday','name'=>'Hammer','category'=>'Tools','unit'=>'piece','stock'=>10,'price_centavos'=>10000,'is_active'=>true]);
        $this->getJson('/api/store')->assertJsonPath('delivery_notice','No Sunday delivery. Sunday delivery orders are scheduled for Monday.');
        $response=$this->withHeader('Idempotency-Key','sunday-delivery-order')->postJson('/api/orders',[
            'customer_name'=>'Customer','mobile_number'=>'09123456789','address'=>'Test Address','fulfillment_method'=>'delivery','payment_method'=>'cash_on_delivery',
            'items'=>[['product_id'=>$product->id,'quantity'=>1]],
        ])->assertCreated()->assertJsonPath('data.delivery_not_before','2026-10-19');
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true]));
        $path='/api/staff/orders/'.$response->json('data.order_number').'/paid';
        $statusPath='/api/staff/orders/'.$response->json('data.order_number').'/status';
        $this->patchJson($statusPath,['status'=>'Processing'])->assertOk();
        $this->patchJson($statusPath,['status'=>'Ready for Delivery'])->assertOk();
        $this->patchJson($path)->assertStatus(409);
        $this->assertDatabaseHas('orders',['order_number'=>$response->json('data.order_number'),'payment_status'=>'Unpaid','order_status'=>'Ready for Delivery']);
        $this->travelTo(\Carbon\Carbon::parse('2026-10-19 09:00:00','Asia/Manila'));
        $this->patchJson($path)->assertOk()->assertJsonPath('data.order_status','Completed')->assertJsonPath('data.delivery_not_before','2026-10-19');
        $this->travelBack();
    }
}
