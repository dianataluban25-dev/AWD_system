<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = App\Models\User::where('email', 'admin@elee.test')->first();
echo json_encode([
    'account_exists' => (bool) $user,
    'is_staff' => $user?->is_staff,
    'is_admin' => $user?->is_admin,
    'admin_accounts' => App\Models\User::where('is_admin', true)->count(),
    'updated_at' => $user?->updated_at?->toIso8601String(),
]).PHP_EOL;
