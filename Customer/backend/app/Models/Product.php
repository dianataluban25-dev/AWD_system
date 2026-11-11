<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    public function orderItems(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
    protected $fillable = ['sku', 'name', 'category', 'unit', 'description', 'image_url', 'image_urls', 'price_centavos', 'stock', 'is_active'];

    protected function casts(): array
    {
        return ['price_centavos' => 'integer', 'stock' => 'integer', 'is_active' => 'boolean', 'image_urls' => 'array', 'recommended_product_ids' => 'array'];
    }
}
