<?php

namespace App\Http\Controllers;

use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\QueryException;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'customer_name' => 'required|string|max:255',
            'mobile_number' => ['required', 'string', 'regex:/^\+?[0-9]{10,15}$/'],
            'fulfillment_method' => ['required', Rule::in(['delivery', 'store_pickup'])],
            'payment_method' => ['required', Rule::in(['cash_at_store', 'cash_on_delivery'])],
            'address' => 'required_if:fulfillment_method,delivery|nullable|string|max:2000',
            'items' => 'required|array|min:1|max:100',
            'items.*.product_id' => 'required|integer|min:1|distinct',
            'items.*.quantity' => 'required|integer|min:1|max:1000',
            'expected_total_centavos' => 'sometimes|integer|min:0|max:2100000000',
        ]);
        validator(['key' => $request->header('Idempotency-Key')], [
            'key' => 'required|string|min:16|max:64|regex:/^[a-zA-Z0-9_-]+$/',
        ])->validate();
        if ($data['fulfillment_method'] === 'store_pickup' && $data['payment_method'] === 'cash_on_delivery') {
            throw ValidationException::withMessages(['payment_method' => 'COD is available for delivery only.']);
        }
        // Stable key order and item order make retries independent of JSON field order.
        $data['address'] = $data['address'] ?? null;
        $data['items'] = array_map(fn ($item) => [
            'product_id' => (int) $item['product_id'], 'quantity' => (int) $item['quantity'],
        ], $data['items']);
        usort($data['items'], fn ($a, $b) => $a['product_id'] <=> $b['product_id']);
        ksort($data);
        $key = $request->header('Idempotency-Key');
        $hash = hash('sha256', json_encode($data, JSON_THROW_ON_ERROR));
        $token = hash_hmac('sha256', 'order:'.$key, config('app.key'));

        try {
            [$order, $created] = DB::transaction(function () use ($data, $key, $hash, $token) {
                if ($existing = Order::where('idempotency_key', $key)->first()) {
                    return [$this->checkRetry($existing, $hash), false];
                }
                $settings = \App\Models\StoreSetting::settings();
                $enabled = $data['fulfillment_method'] === 'delivery' ? 'delivery_enabled' : 'pickup_enabled';
                if (! $settings[$enabled]) {
                    throw ValidationException::withMessages(['fulfillment_method' => 'This fulfillment option is currently unavailable.']);
                }
                // Lock in a consistent order so concurrent checkouts cannot oversell.
                $products = Product::whereIn('id', array_column($data['items'], 'product_id'))
                    ->orderBy('id')->lockForUpdate()->get()->keyBy('id');
                if ($existing = Order::where('idempotency_key', $key)->lockForUpdate()->first()) {
                    return [$this->checkRetry($existing, $hash), false];
                }
                $subtotal = 0;
                $rows = [];
                foreach ($data['items'] as $index => $item) {
                    $product = $products->get($item['product_id']);
                    if (! $product || ! $product->is_active || $product->stock < $item['quantity']) {
                        throw ValidationException::withMessages(["items.$index.quantity" => 'Product unavailable or insufficient stock.']);
                    }
                    $lineTotal = $product->price_centavos * $item['quantity'];
                    $subtotal += $lineTotal;
                    if ($subtotal > 2000000000) {
                        throw ValidationException::withMessages(['items' => 'Order exceeds the supported total.']);
                    }
                    $rows[] = [
                        'product_id' => $product->id, 'name' => $product->name, 'unit' => $product->unit,
                        'quantity' => $item['quantity'], 'unit_price_centavos' => $product->price_centavos,
                        'line_total_centavos' => $lineTotal,
                    ];
                    $product->decrement('stock', $item['quantity']);
                }
                $fee = $data['fulfillment_method'] === 'delivery' ? \App\Models\StoreSetting::deliveryFee() : 0;
                if (isset($data['expected_total_centavos']) && $data['expected_total_centavos'] !== $subtotal + $fee) {
                    throw ValidationException::withMessages(['expected_total_centavos' => 'Prices or delivery fee changed. Return to your cart and review the updated total before placing your order.']);
                }
                $order = Order::create([
                    'order_number' => 'ELEE-'.Str::ulid(), 'idempotency_key' => $key,
                    'request_hash' => $hash, 'access_token_hash' => hash('sha256', $token),
                    'customer_name' => $data['customer_name'], 'mobile_number' => $data['mobile_number'],
                    'address' => $data['address'], 'fulfillment_method' => $data['fulfillment_method'],
                    'payment_method' => $data['payment_method'],
                    'payment_status' => 'Unpaid', 'order_status' => 'Pending',
                    'delivery_not_before' => $data['fulfillment_method'] === 'delivery' && now('Asia/Manila')->isSunday() ? now('Asia/Manila')->addDay()->toDateString() : null,
                    'subtotal_centavos' => $subtotal, 'delivery_fee_centavos' => $fee,
                    'total_centavos' => $subtotal + $fee,
                ]);
                $order->items()->createMany($rows);

                return [$order, true];
            }, 3);
        } catch (QueryException $exception) {
            // A simultaneous retry may hit the unique key after the other transaction commits.
            if (! $exception instanceof UniqueConstraintViolationException
                || ! ($existing = Order::where('idempotency_key', $key)->first())) {
                throw $exception;
            }
            $order = $this->checkRetry($existing, $hash);
            $created = false;
        }

        return (new OrderResource($order->load('items')))->additional(['access_token' => $token])
            ->response()->setStatusCode($created ? 201 : 200);
    }

    private function checkRetry(Order $order, string $hash): Order
    {
        abort_unless(hash_equals($order->request_hash, $hash), 409, 'Idempotency key already used for a different order.');

        return $order;
    }

    public function show(Request $request, string $number)
    {
        $order = Order::where('order_number', $number)->firstOrFail();
        abort_unless(hash_equals($order->access_token_hash, hash('sha256', $request->bearerToken() ?? '')), 404);

        return new OrderResource($order->load('items'));
    }

    public function index(Request $request)
    {
        $filters = $request->validate([
            'active' => 'sometimes|boolean', 'search' => 'sometimes|string|max:100',
            'status' => ['sometimes', Rule::in([...Order::ACTIVE_STATUSES, 'Completed', 'Cancelled'])],
        ]);
        $orders = Order::with('items')
            ->when($filters['active'] ?? false, fn ($query) => $query->whereIn('order_status', Order::ACTIVE_STATUSES))
            ->when($filters['status'] ?? null, fn ($query, $status) => $query->where('order_status', $status))
            ->when($filters['search'] ?? null, fn ($query, $search) => $query->where(fn ($match) =>
                $match->where('order_number', 'like', '%'.$search.'%')->orWhere('customer_name', 'like', '%'.$search.'%')))
            ->orderBy('created_at')->orderBy('id')->paginate(100);

        return OrderResource::collection($orders);
    }

    public function status(Request $request, string $number)
    {
        $data = $request->validate(['status' => ['required', Rule::in([
            'Processing', 'Ready for Pickup', 'Ready for Delivery', 'Cancelled',
        ])]]);
        $order = DB::transaction(function () use ($data, $number) {
            $order = Order::where('order_number', $number)->lockForUpdate()->firstOrFail();
            $next = $data['status'];
            if ($order->order_status === $next) {
                return $order;
            }
            abort_if(in_array($order->order_status, ['Completed', 'Cancelled'], true), 409, 'This order is already closed.');
            if ($next === 'Cancelled') {
                abort_if($order->payment_status === 'Paid', 409, 'Paid orders require a refund before cancellation.');
                foreach ($order->items()->orderBy('product_id')->get() as $item) {
                    $product = Product::whereKey($item->product_id)->lockForUpdate()->firstOrFail();
                    $product->increment('stock', $item->quantity);
                }
            } else {
                $ready = $order->fulfillment_method === 'store_pickup' ? 'Ready for Pickup' : 'Ready for Delivery';
                $allowed = ($order->order_status === 'Pending' && $next === 'Processing')
                    || ($order->order_status === 'Processing' && $next === $ready);
                abort_unless($allowed, 409, 'Invalid order status transition.');
            }
            $order->update(['order_status' => $next]);

            return $order;
        }, 3);

        return new OrderResource($order->load('items'));
    }

    public function paid(Request $request, string $number)
    {
        $order = DB::transaction(function () use ($request, $number) {
            $order = Order::where('order_number', $number)->lockForUpdate()->firstOrFail();
            abort_if($order->order_status === 'Cancelled', 409, 'Cannot record payment for a cancelled order.');
            if ($order->payment_status !== 'Paid') {
                $order->payment_status = 'Paid';
                $order->paid_at = now();
                $order->paid_by = $request->user()->id;
                if ($order->payment_method === 'cash_on_delivery') {
                    abort_unless($order->order_status === 'Ready for Delivery', 409, 'Prepare this order and mark it Ready for Delivery before confirming delivery and payment.');
                    $this->checkDeliveryDay($order);
                    $order->order_status = 'Completed';
                }
                $order->save();
            }

            return $order;
        });

        app(\App\Services\RecommendationModel::class)->learnFromCompletedOrder($order);
        return new OrderResource($order->load('items'));
    }

    public function complete(string $number)
    {
        $order = DB::transaction(function () use ($number) {
            $order = Order::where('order_number', $number)->lockForUpdate()->firstOrFail();
            abort_if($order->order_status === 'Cancelled', 409, 'Cannot complete a cancelled order.');
            abort_unless($order->payment_status === 'Paid', 409, 'Record payment before completing an order.');
            $ready = $order->fulfillment_method === 'delivery' ? 'Ready for Delivery' : 'Ready for Pickup';
            abort_unless(in_array($order->order_status, [$ready, 'Completed'], true), 409, 'Mark this order '.$ready.' before completing it.');
            $this->checkDeliveryDay($order);
            $order->update(['order_status' => 'Completed']);

            return $order;
        });

        app(\App\Services\RecommendationModel::class)->learnFromCompletedOrder($order);
        return new OrderResource($order->load('items'));
    }
    private function checkDeliveryDay(Order $order): void
    {
        if ($order->fulfillment_method !== 'delivery') return;
        abort_if(now('Asia/Manila')->isSunday(), 409, 'No Sunday delivery. Complete delivery on Monday or the next delivery day.');
        abort_if($order->delivery_not_before && now('Asia/Manila')->toDateString() < $order->delivery_not_before, 409, 'This delivery is scheduled for '.$order->delivery_not_before.'.');
    }
}
