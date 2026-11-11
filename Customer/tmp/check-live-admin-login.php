<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$password = bin2hex(random_bytes(16));
$user = new App\Models\User(['name' => 'Temporary login verification', 'email' => 'login-check-'.bin2hex(random_bytes(8)).'@example.test', 'password' => $password]);
$user->is_staff = true;
$user->is_admin = true;
$user->save();
try {
    $response = Illuminate\Support\Facades\Http::timeout(10)->post('http://127.0.0.1:8000/api/admin/login', ['email' => $user->email, 'password' => $password]);
    echo json_encode(['http_status' => $response->status(), 'login_succeeded' => $response->successful() && $response->json('user.is_admin') === true]).PHP_EOL;
} finally {
    $user->tokens()->delete();
    $user->delete();
}
