<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class RecommendationsTest extends TestCase
{
    use RefreshDatabase;

    public function test_staff_mapping_is_published_to_customer_catalog_and_can_be_removed(): void
    {
        $make = fn ($sku) => Product::create(['sku'=>$sku,'name'=>$sku,'category'=>'Materials','unit'=>'bag','stock'=>5,'price_centavos'=>10000,'is_active'=>true]);
        $cement=$make('cement'); $sand=$make('sand');
        $path='/api/staff/products/'.$cement->id.'/recommendations';
        $this->patchJson($path,['recommended_product_ids'=>[$sand->id]])->assertUnauthorized();
        Sanctum::actingAs(User::factory()->create(['is_staff'=>true]));
        $this->patchJson($path,['recommended_product_ids'=>[$cement->id]])->assertUnprocessable();
        $this->patchJson($path,['recommended_product_ids'=>[$sand->id,$sand->id]])->assertUnprocessable();
        $this->patchJson($path,['recommended_product_ids'=>[9999]])->assertUnprocessable();
        $this->patchJson($path,['recommended_product_ids'=>[$sand->id]])->assertOk()->assertJsonPath('data.recommended_product_ids',[$sand->id]);
        $this->getJson('/api/products')->assertJsonPath('data.0.recommended_product_ids',[$sand->id]);
        $this->patchJson($path,['recommended_product_ids'=>[]])->assertOk();
        $this->getJson('/api/products')->assertJsonPath('data.0.recommended_product_ids',[]);
    }
}
