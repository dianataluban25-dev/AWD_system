<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// The admin React build is served by this same backend and uses /api.
Route::get('/admin/{page?}', function () {
    $path = public_path('admin-assets/index.html');
    abort_unless(is_file($path), 503, 'Build the admin frontend first: npm run build in admin-web/ADMINSIDE/HAKDOG.');

    return response()->file($path, ['Cache-Control' => 'no-store']);
})->where('page', '[a-z-]+');
