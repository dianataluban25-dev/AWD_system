<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class RequireStaff
{
    public function handle(Request $request, Closure $next)
    {
        abort_unless($request->user()?->is_staff, 403, 'Staff access required.');

        return $next($request);
    }
}
