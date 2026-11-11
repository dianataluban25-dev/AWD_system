<?php

namespace App\Services;

use App\Models\Order;
use App\Models\StoreSetting;
use Illuminate\Validation\ValidationException;

/** Item-item collaborative filtering learned from binary order/item interactions. */
class RecommendationModel
{
    public function learnFromCompletedOrder(Order $order): void
    {
        if ($order->payment_status !== 'Paid' || $order->order_status !== 'Completed' || ! $order->wasChanged(['payment_status', 'order_status'])) return;
        try {
            \Illuminate\Support\Facades\Cache::lock('recommendation-training', 120)->get(function () {
                $this->train();
            });
        } catch (ValidationException $exception) {
            // Cold start: preserve fallback until enough eligible orders exist.
        } catch (\Throwable $exception) {
            report($exception); // Training failure must not reverse a completed sale.
        }
    }

    public function model(): array
    {
        $request = request();
        if (! $request->attributes->has('recommendation_model')) {
            $value = StoreSetting::whereKey('recommendation_model')->value('value');
            $request->attributes->set('recommendation_model', $value ? json_decode($value, true, 512, JSON_THROW_ON_ERROR) : []);
        }
        return $request->attributes->get('recommendation_model');
    }

    public function train(): array
    {
        $frequency = []; $pairs = []; $orders = 0; $lastId = 0;
        Order::where('payment_status', 'Paid')->where('order_status', 'Completed')
            ->with('items')->orderBy('id')->chunkById(200, function ($batch) use (&$frequency, &$pairs, &$orders, &$lastId) {
                foreach ($batch as $order) {
                    $ids = $order->items->pluck('product_id')->filter()->unique()->sort()->values()->all();
                    if (! $ids) continue;
                    $orders++; $lastId = max($lastId, $order->id);
                    foreach ($ids as $id) $frequency[$id] = ($frequency[$id] ?? 0) + 1;
                    foreach ($ids as $left) foreach ($ids as $right) {
                        if ($left !== $right) $pairs[$left][$right] = ($pairs[$left][$right] ?? 0) + 1;
                    }
                }
            });
        if ($orders < 3 || ! $pairs) {
            throw ValidationException::withMessages(['training' => 'Need at least 3 paid, completed orders and products purchased together. Manual fallback remains available.']);
        }
        $scores = [];
        foreach ($pairs as $left => $related) foreach ($related as $right => $support) {
            $scores[$left][$right] = round($support / sqrt($frequency[$left] * $frequency[$right]), 6);
        }
        foreach ($scores as &$related) arsort($related); unset($related);
        $model = ['algorithm' => 'item-item collaborative filtering (cosine similarity)',
            'trained_at' => now()->toIso8601String(), 'order_count' => $orders,
            'product_count' => count($frequency), 'last_order_id' => $lastId, 'scores' => $scores];
        StoreSetting::updateOrCreate(['key' => 'recommendation_model'], ['value' => json_encode($model, JSON_THROW_ON_ERROR)]);
        request()->attributes->set('recommendation_model', $model);
        return $this->status();
    }

    public function status(): array
    {
        $model = $this->model();
        $available = Order::where('payment_status', 'Paid')->where('order_status', 'Completed')->count();
        return ['trained' => (bool) $model, 'algorithm' => $model['algorithm'] ?? 'item-item collaborative filtering (cosine similarity)',
            'trained_at' => $model['trained_at'] ?? null, 'training_orders' => $model['order_count'] ?? 0,
            'training_products' => $model['product_count'] ?? 0, 'available_orders' => $available,
            'limited_data' => ($model['order_count'] ?? 0) < 20,
            'new_orders' => Order::where('payment_status', 'Paid')->where('order_status', 'Completed')->where('id', '>', $model['last_order_id'] ?? 0)->count()];
    }
}
