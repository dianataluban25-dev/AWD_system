<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->boolean('is_admin')->default(false));
        Schema::table('orders', fn (Blueprint $table) => $table->index(['created_at', 'id'], 'orders_fifo_index'));
    }

    public function down(): void
    {
        Schema::table('users', fn (Blueprint $table) => $table->dropColumn('is_admin'));
        Schema::table('orders', fn (Blueprint $table) => $table->dropIndex('orders_fifo_index'));
    }
};
