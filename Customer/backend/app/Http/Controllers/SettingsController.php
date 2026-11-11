<?php

namespace App\Http\Controllers;

use App\Models\StoreSetting;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function publicShow()
    {
        return response()->json(\Illuminate\Support\Arr::only(StoreSetting::settings(), [
            'store_name', 'store_address', 'store_phone', 'store_hours',
            'pickup_enabled', 'delivery_enabled', 'delivery_fee_centavos', 'delivery_notice',
        ]));
    }

    public function show(Request $request)
    {
        return response()->json(StoreSetting::settings());
    }

    public function update(Request $request)
    {
        abort_unless($request->user()->is_admin, 403, 'Admin access required.');
        $data = $request->validate([
            'delivery_fee_centavos' => 'sometimes|required|integer|min:0|max:100000000',
            'store_name' => 'sometimes|required|string|max:255',
            'store_address' => 'sometimes|nullable|string|max:2000',
            'store_phone' => 'sometimes|nullable|string|max:50',
            'store_hours' => 'sometimes|nullable|string|max:500',
            'pickup_enabled' => 'sometimes|boolean', 'delivery_enabled' => 'sometimes|boolean',
            'notify_new_orders' => 'sometimes|boolean', 'notify_order_changes' => 'sometimes|boolean',
            'notify_cancellations' => 'sometimes|boolean', 'notify_low_stock' => 'sometimes|boolean',
            'low_stock_threshold' => 'sometimes|integer|min:0|max:1000000',
        ]);
        \Illuminate\Support\Facades\DB::transaction(function () use ($data) {
            foreach ($data as $key => $value) {
                StoreSetting::updateOrCreate(['key' => $key], ['value' => is_bool($value) ? (int) $value : ($value ?? '')]);
            }
        });

        return $this->show($request);
    }
}
