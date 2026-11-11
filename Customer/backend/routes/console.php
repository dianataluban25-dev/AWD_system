<?php

\Illuminate\Support\Facades\Artisan::command('recommendations:train', function () {
    $model = app(\App\Services\RecommendationModel::class);
    try {
        $result = $model->train();
        $this->info('Model trained on '.$result['training_orders'].' completed orders.');
    } catch (\Illuminate\Validation\ValidationException $exception) {
        $this->warn(collect($exception->errors())->flatten()->first());
        $this->line('Eligible completed orders: '.$model->status()['available_orders']);
    }
})->purpose('Train local collaborative filtering using real paid, completed orders');

use App\Models\User;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Validator;

Artisan::command('elee:deployment-check', function () {
    $checks = [
        'PHP 8.2 or newer' => version_compare(PHP_VERSION, '8.2', '>='),
        'Production environment' => app()->environment('production'),
        'Debug disabled' => ! config('app.debug'),
        'HTTPS application URL' => str_starts_with((string) config('app.url'), 'https://') && ! str_contains((string) config('app.url'), 'YOUR-'),
        'Application key configured' => filled(config('app.key')),
        'Secure session cookie' => (bool) config('session.secure'),
        'Admin web build present' => is_file(public_path('admin-assets/index.html')),
        'Customer web build present' => is_file(public_path('customer/main.dart.js')),
        'Brand font present' => is_file(public_path('brand/NotoSans-Regular.ttf')),
    ];
    try {
        \Illuminate\Support\Facades\DB::connection()->getPdo();
        $checks['Database reachable'] = true;
        $checks['Dedicated non-root database user'] = config('database.connections.'.config('database.default').'.username') !== 'root';
        $checks['Admin account exists'] = User::where('is_staff', true)->where('is_admin', true)->exists();
        $checks['Delivery schedule migration applied'] = \Illuminate\Support\Facades\Schema::hasColumn('orders', 'delivery_not_before');
    } catch (\Throwable $exception) {
        $checks['Database reachable'] = false;
    }
    foreach ($checks as $label => $passed) {
        $this->line(($passed ? '[PASS] ' : '[NEEDS SETUP] ').$label);
    }
    $this->line('This check does not verify backups, load capacity, HTTPS reachability or actual phone behavior.');
    return in_array(false, $checks, true) ? 1 : 0;
})->purpose('Read-only production readiness checks without displaying credentials');

Artisan::command('elee:create-staff {email} {--name=} {--admin} {--password-stdin}', function () {
    $email = $this->argument('email');
    $name = $this->option('name') ?: $this->ask('Staff name');
    $password = $this->option('password-stdin')
        ? rtrim(stream_get_contents(STDIN), "\r\n")
        : $this->secret('Password (at least 12 characters)');
    $validator = Validator::make(compact('email', 'name', 'password'), [
        'email' => 'required|email|unique:users,email',
        'name' => 'required|string|max:255', 'password' => 'required|string|min:12|max:255',
    ]);
    if ($validator->fails()) {
        foreach ($validator->errors()->all() as $message) {
            $this->error($message);
        }

        return 1;
    }
    $user = new User(compact('name', 'email', 'password'));
    $user->is_staff = true;
    $user->is_admin = (bool) $this->option('admin');
    $user->save();
    $this->info($user->is_admin ? 'Admin account created.' : 'Staff account created.');

    return 0;
})->purpose('Create a staff account without putting its password in shell history');

Artisan::command('elee:ensure-admin {email} {--check-only}', function () {
    if (User::where('is_admin', true)->exists()) {
        $this->info('An admin account is already configured.');

        return 0;
    }

    if ($this->option('check-only')) {
        return 2;
    }

    return $this->call('elee:create-staff', ['email' => $this->argument('email'), '--admin' => true]);
})->purpose('Prompt for the first admin password without using fixed credentials');

Artisan::command('elee:reset-admin-password {email} {--password-stdin}', function () {
    $user = User::where('email', $this->argument('email'))->where('is_admin', true)->where('is_staff', true)->first();
    if (! $user) {
        $this->error('Admin account not found.');

        return 1;
    }
    $password = $this->option('password-stdin')
        ? rtrim(stream_get_contents(STDIN), "\r\n")
        : $this->secret('New password (at least 12 characters)');
    $validator = Validator::make(compact('password'), ['password' => 'required|string|min:12|max:255']);
    if ($validator->fails()) {
        $this->error($validator->errors()->first());

        return 1;
    }
    \Illuminate\Support\Facades\DB::transaction(function () use ($user, $password) {
        $user->update(['password' => $password]);
        $user->tokens()->delete();
    });
    $this->info('Admin password updated. Sign in with the new password.');

    return 0;
})->purpose('Reset a local admin password and revoke previous login tokens');

Artisan::command('elee:verify-admin-login {email} {--password-stdin}', function () {
    $password = $this->option('password-stdin') ? rtrim(stream_get_contents(STDIN), "\r\n") : $this->secret('Password');
    $user = User::where('email', $this->argument('email'))->where('is_admin', true)->where('is_staff', true)->first();
    if (! $user || ! \Illuminate\Support\Facades\Hash::check($password, $user->password)) {
        $this->error('Saved password verification failed.');

        return 1;
    }
    $this->info('Saved password verified.');
    try {
        $response = \Illuminate\Support\Facades\Http::timeout(10)->post('http://127.0.0.1:8000/api/admin/login', [
            'email' => $user->email, 'password' => $password,
        ]);
        if (! $response->successful()) {
            $this->error('Live login verification failed (HTTP '.$response->status().').');

            return 1;
        }
        $tokenId = explode('|', (string) $response->json('token'))[0];
        $user->tokens()->whereKey($tokenId)->delete();
        $this->info('Live admin login verified.');
    } catch (\Illuminate\Http\Client\ConnectionException $exception) {
        $this->info('Password saved. Start the localhost server before signing in.');
    }

    return 0;
})->purpose('Verify the saved password against the local admin login without exposing credentials');
