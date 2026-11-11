<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_staff')->default(false);
        });
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('sku')->unique();
            $table->string('name');
            $table->string('category')->index();
            $table->string('unit')->default('piece');
            $table->text('description')->nullable();
            $table->string('image_url', 2048)->nullable();
            $table->unsignedInteger('price_centavos');
            $table->unsignedInteger('stock');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->string('access_token_hash', 64);
            $table->string('idempotency_key', 64)->unique();
            $table->string('request_hash', 64);
            $table->string('customer_name');
            $table->string('mobile_number', 30);
            $table->text('address')->nullable();
            $table->string('fulfillment_method');
            $table->string('payment_method');
            $table->string('payment_status')->default('Unpaid');
            $table->string('order_status')->default('Pending');
            $table->unsignedInteger('subtotal_centavos');
            $table->unsignedInteger('delivery_fee_centavos');
            $table->unsignedInteger('total_centavos');
            $table->timestamp('paid_at')->nullable();
            $table->foreignId('paid_by')->nullable()->constrained('users');
            $table->timestamps();
        });
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->string('name');
            $table->string('unit');
            $table->unsignedInteger('quantity');
            $table->unsignedInteger('unit_price_centavos');
            $table->unsignedInteger('line_total_centavos');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
        Schema::dropIfExists('products');
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_staff'));
    }
};
