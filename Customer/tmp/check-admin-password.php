<?php
require __DIR__.'/../backend/vendor/autoload.php';
$app = require __DIR__.'/../backend/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$user = App\Models\User::where('email', 'stdin-check@example.test')->firstOrFail();
if (! $user->is_admin || ! Illuminate\Support\Facades\Hash::check(getenv('ELEE_TEST_PASSWORD'), $user->password)) {
    throw new RuntimeException('Password verification failed.');
}
echo "Admin password stdin check: OK\n";
