<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureUserHasRole{
    public function handle(Request $request, Closure $next, string $role)
    {
        if ($request->user()->role !== $role) {
            return response()->json(['message' => 'Anda tidak memiliki akses'], 403);
        }

        return $next($request);
    }
}