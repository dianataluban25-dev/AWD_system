<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
if (config('database.default') !== 'sqlite') {
    throw new RuntimeException('This check requires an isolated SQLite database.');
}
App\Models\Product::where('sku', 'AUTO-TEST')->firstOrFail()->update(['price_centavos' => 17500, 'stock' => 12]);
echo "Isolated product updated.\n";
