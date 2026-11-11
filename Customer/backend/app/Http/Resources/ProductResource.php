<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $model = app(\App\Services\RecommendationModel::class)->model();
        $scores = $model['scores'][$this->id] ?? [];
        return [
            'id' => $this->id, 'sku' => $this->sku, 'name' => $this->name,
            'category' => $this->category, 'unit' => $this->unit,
            'description' => $this->description, 'image_url' => $this->image_url,
            'image_urls' => $this->image_urls ?: ($this->image_url ? [$this->image_url] : []),
            'price' => $this->price_centavos / 100, 'price_centavos' => $this->price_centavos,
            'stock' => $this->stock, 'is_active' => $this->is_active,
            'recommended_product_ids' => $this->recommended_product_ids ?? [],
            'can_delete' => $request->user()?->is_staff
                ? ! ($this->resource->getAttribute('order_items_exists') ?? $this->resource->orderItems()->exists()) : false,
            'ml_recommendation_scores' => (object) $scores,
            'recommendation_source' => $scores ? 'trained_model' : 'manual_fallback',
        ];
    }
}
