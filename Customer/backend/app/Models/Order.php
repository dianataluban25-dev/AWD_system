<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    public const ACTIVE_STATUSES = ['Pending', 'Processing', 'Ready for Pickup', 'Ready for Delivery'];

    public function ordersAhead(): ?int
    {
        if (! in_array($this->order_status, self::ACTIVE_STATUSES, true)) {
            return null;
        }

        return self::whereIn('order_status', self::ACTIVE_STATUSES)
            ->where(fn ($query) => $query->where('created_at', '<', $this->created_at)
                ->orWhere(fn ($sameTime) => $sameTime->where('created_at', $this->created_at)->where('id', '<', $this->id)))
            ->count();
    }

    protected $guarded = ['id'];

    protected $hidden = ['access_token_hash', 'idempotency_key', 'request_hash'];

    protected function casts(): array
    {
        return ['paid_at' => 'datetime'];
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
