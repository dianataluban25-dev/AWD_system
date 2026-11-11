<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ProductController extends Controller
{
    public function image(string $filename)
    {
        abort_unless(preg_match('/^[A-Za-z0-9._-]+\\.(jpg|jpeg|png|webp)$/i', $filename), 404);
        $path = 'product-images/'.$filename;
        abort_unless(Storage::disk('public')->exists($path), 404);

        return Storage::disk('public')->response($path, null, [
            'Cache-Control' => 'public, max-age=31536000, immutable',
        ]);
    }

    public function uploadImage(Request $request)
    {
        if ($request->hasFile('images')) {
            $data = $request->validate([
                'images' => 'required|array|min:1|max:20',
                'images.*' => 'required|image|mimes:jpeg,png,webp|max:5120',
            ]);
            $urls = collect($data['images'])->map(fn ($image) => url('/api/product-images/'.basename($image->storePublicly('product-images', 'public'))))->values();

            return response()->json(['image_urls' => $urls, 'image_url' => $urls->first()], 201);
        }
        $data = $request->validate([
            'image' => 'required|image|mimes:jpeg,png,webp|max:5120',
        ]);
        $path = $data['image']->storePublicly('product-images', 'public');

        return response()->json([
            'image_url' => url('/api/product-images/'.basename($path)),
        ], 201);
    }

    public function recommendations(Request $request, Product $product)
    {
        $data = $request->validate([
            'recommended_product_ids' => 'present|array|max:20',
            'recommended_product_ids.*' => ['required', 'integer', 'distinct', Rule::exists('products', 'id'), Rule::notIn([$product->id])],
        ]);
        DB::transaction(function () use ($product, $data) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $locked->recommended_product_ids = array_map('intval', $data['recommended_product_ids']);
            $locked->save();
        });
        return new ProductResource($product->fresh());
    }

    public function staffIndex()
    {
        return ProductResource::collection(Product::withExists('orderItems')->orderBy('id')->paginate(100));
    }

    public function destroy(Product $product)
    {
        DB::transaction(function () use ($product) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            abort_if($locked->orderItems()->exists(), 409, 'This product has order history. Archive it instead to preserve receipts and sales records.');
            $locked->delete();
        });
        return response()->noContent();
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'sku' => ['sometimes', 'required', 'string', 'max:100', Rule::unique('products')->ignore($product->id)],
            'name' => 'sometimes|required|string|max:255', 'category' => 'sometimes|required|string|max:100',
            'unit' => 'sometimes|required|string|max:50', 'description' => 'sometimes|nullable|string|max:5000',
            'image_url' => 'sometimes|nullable|url:http,https|max:2048',
            'image_urls' => 'sometimes|array', 'image_urls.*' => 'required|url:http,https|max:2048',
            'price_centavos' => 'sometimes|required|integer|min:1|max:100000000',
            'stock' => 'sometimes|required|integer|min:0|max:1000000', 'is_active' => 'sometimes|boolean',
        ]);
        $updated = DB::transaction(function () use ($product, $data) {
            $locked = Product::whereKey($product->id)->lockForUpdate()->firstOrFail();
            $locked->update($data);

            return $locked;
        });

        return new ProductResource($updated);
    }

    public function index(Request $request)
    {
        $filters = $request->validate(['search' => 'sometimes|string|max:100', 'category' => 'sometimes|string|max:100']);
        $products = Product::query()->where('is_active', true)
            ->when($filters['search'] ?? null, fn ($q, $search) => $q->where('name', 'like', '%'.$search.'%'))
            ->when($filters['category'] ?? null, fn ($q, $category) => $q->where('category', $category))
            ->orderBy('id')->paginate(30);

        return ProductResource::collection($products)->additional([
            'store' => \Illuminate\Support\Arr::only(\App\Models\StoreSetting::settings(), [
                'store_name', 'store_address', 'store_phone', 'store_hours',
                'pickup_enabled', 'delivery_enabled', 'delivery_fee_centavos', 'delivery_notice',
            ]),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'sku' => 'required|string|max:100|unique:products,sku',
            'name' => 'required|string|max:255', 'category' => 'required|string|max:100',
            'unit' => 'required|string|max:50', 'description' => 'nullable|string|max:5000',
            'image_url' => 'nullable|url:http,https|max:2048',
            'image_urls' => 'sometimes|array', 'image_urls.*' => 'required|url:http,https|max:2048',
            'price_centavos' => 'required|integer|min:1|max:100000000',
            'stock' => 'required|integer|min:0|max:1000000', 'is_active' => 'sometimes|boolean',
        ]);

        return (new ProductResource(Product::create($data)))->response()->setStatusCode(201);
    }
}
