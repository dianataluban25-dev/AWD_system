<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = App\Models\User::where('email', 'admin@elee.test')->where('is_admin', true)->where('is_staff', true)->firstOrFail();
$token = Illuminate\Support\Facades\Password::createToken($user);
echo 'http://localhost:8000/admin/reset-password?'.http_build_query(['email' => $user->email, 'token' => $token]).PHP_EOL;
