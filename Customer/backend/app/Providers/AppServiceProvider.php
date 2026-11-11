<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        \Illuminate\Support\Facades\RateLimiter::for('staff-login', function ($request) {
            $email = mb_strtolower(trim((string) $request->input('email')));
            return [
                \Illuminate\Cache\RateLimiting\Limit::perMinute(5)->by('login-account:'.$request->ip().':'.hash('sha256', $email)),
                \Illuminate\Cache\RateLimiting\Limit::perMinute(30)->by('login-ip:'.$request->ip()),
            ];
        });
        \Illuminate\Support\Facades\RateLimiter::for('recommendation-training', fn ($request) =>
            \Illuminate\Cache\RateLimiting\Limit::perMinute(2)->by('recommendation-training:'.$request->user()->id));
    }
}
