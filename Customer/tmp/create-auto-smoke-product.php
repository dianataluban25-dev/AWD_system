<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.default') !== 'sqlite') {
    throw new RuntimeException('This check requires an isolated SQLite database.');
}
App\Models\Product::updateOrCreate(['sku' => 'AUTO-TEST'], ['name' => 'Automatic update test item', 'category' => 'Tools', 'unit' => 'piece', 'price_centavos' => 10000, 'stock' => 5]);
