<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StoreSetting extends Model
{
    protected $primaryKey = 'key';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $guarded = [];

    public static function settings(): array
    {
        $defaults = [
            'store_name' => 'ELEE Hardware', 'store_address' => '', 'store_phone' => '', 'store_hours' => '',
            'pickup_enabled' => true, 'delivery_enabled' => true,
            'notify_new_orders' => true, 'notify_order_changes' => true,
            'notify_cancellations' => true, 'notify_low_stock' => true, 'low_stock_threshold' => 10,
        ];
        $saved = self::whereIn('key', array_keys($defaults))->pluck('value', 'key');
        foreach ($defaults as $key => $default) {
            if ($saved->has($key)) {
                $defaults[$key] = is_bool($default) ? (bool) $saved[$key] : (is_int($default) ? (int) $saved[$key] : $saved[$key]);
            }
        }
        return [...$defaults, 'delivery_fee_centavos' => self::deliveryFee(), 'delivery_notice' => 'No Sunday delivery. Sunday delivery orders are scheduled for Monday.'];
    }

    public static function deliveryFee(): int
    {
        return (int) (self::whereKey('delivery_fee_centavos')->value('value') ?? config('elee.delivery_fee_centavos'));
    }
}
