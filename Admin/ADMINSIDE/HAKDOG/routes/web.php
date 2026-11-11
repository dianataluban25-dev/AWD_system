<?php

use Illuminate\Support\Facades\Route;

// Serve the operational admin and API together from the shared backend.
Route::get('/{page?}', fn () => redirect(rtrim(config('app.shared_backend_url', 'http://localhost:8000'), '/').'/admin'))
    ->where('page', '.*');
