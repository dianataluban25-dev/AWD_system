<?php
namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RecommendationModelTest extends TestCase
{
    use RefreshDatabase;

    public function test_model_learns_cosine_scores_from_completed_orders_and_ignores_cancelled_orders(): void
    {
        $products=[];
        foreach(['Cement','Sand','Paint'] as $name) $products[]=Product::create(['sku'=>$name,'name'=>$name,'category'=>'Materials','unit'=>'bag','stock'=>20,'price_centavos'=>10000,'is_active'=>true]);
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true]));
        $this->getJson('/api/staff/recommendation-model')->assertJsonPath('trained',false);
        $this->postJson('/api/staff/recommendation-model/train')->assertUnprocessable();
        foreach([[0,1],[0,1],[0,2],[1,2]] as $index=>$basket) {
            $response=$this->withHeader('Idempotency-Key','model-training-order-'.$index)->postJson('/api/orders',[
                'customer_name'=>'Training fixture','mobile_number'=>'09123456789','fulfillment_method'=>'store_pickup','payment_method'=>'cash_at_store',
                'items'=>array_map(fn($id)=>['product_id'=>$products[$id]->id,'quantity'=>1],$basket),
            ])->assertCreated();
            $number=$response->json('data.order_number');
            Order::where('order_number',$number)->update(['payment_status'=>$index===3?'Unpaid':'Paid','order_status'=>$index===3?'Cancelled':'Ready for Pickup']);
            if ($index!==3) $this->patchJson('/api/staff/orders/'.$number.'/complete')->assertOk();
        }
        $this->getJson('/api/staff/recommendation-model')->assertJsonPath('trained',true)->assertJsonPath('training_orders',3);
        $this->postJson('/api/staff/recommendation-model/train')->assertOk()->assertJsonPath('trained',true)->assertJsonPath('training_orders',3);
        $catalog=$this->getJson('/api/products')->assertOk()->assertJsonPath('data.0.recommendation_source','trained_model');
        $scores=$catalog->json('data.0.ml_recommendation_scores');
        $this->assertEqualsWithDelta(2/sqrt(6),$scores[$products[1]->id],0.000001);
        $this->assertEqualsWithDelta(1/sqrt(3),$scores[$products[2]->id],0.000001);
        $sandScores=$catalog->json('data.1.ml_recommendation_scores');
        $this->assertArrayNotHasKey($products[2]->id,$sandScores);
        $this->assertDatabaseHas('store_settings',['key'=>'recommendation_model']);
    }
}
