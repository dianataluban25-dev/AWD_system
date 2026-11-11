<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $ahead = $this->resource->ordersAhead();

        return [
            'order_number' => $this->order_number,
            'queue_number' => 'Q-'.str_pad((string) $this->id, 4, '0', STR_PAD_LEFT),
            'orders_ahead' => $ahead,
            'queue_position' => $ahead === null ? null : $ahead + 1,
            'customer_name' => $this->customer_name, 'mobile_number' => $this->mobile_number,
            'address' => $this->address, 'fulfillment_method' => $this->fulfillment_method,
            'delivery_not_before' => $this->delivery_not_before,
            'delivery_notice' => $this->delivery_not_before ? 'Sunday order: delivery scheduled for Monday, '.$this->delivery_not_before.'.' : null,
            'payment_method' => $this->payment_method, 'payment_status' => $this->payment_status,
            'order_status' => $this->order_status, 'currency' => 'PHP',
            'subtotal' => $this->subtotal_centavos / 100,
            'delivery_fee' => $this->delivery_fee_centavos / 100,
            'total' => $this->total_centavos / 100,
            'total_centavos' => $this->total_centavos,
            'created_at' => $this->created_at->toIso8601String(),
            'paid_at' => $this->paid_at?->toIso8601String(),
            'items' => $this->items->map(fn ($item) => [
                'product_id' => $item->product_id, 'name' => $item->name, 'unit' => $item->unit,
                'quantity' => $item->quantity, 'price' => $item->unit_price_centavos / 100,
                'line_total' => $item->line_total_centavos / 100,
            ]),
        ];
    }
}
