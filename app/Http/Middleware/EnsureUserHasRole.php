<?php

namespace App\Http\Middleware;

use App\Enums\UserRole;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        abort_unless(
            $user !== null && collect($roles)->contains(fn (string $role) => $user->hasRole(UserRole::from($role))),
            Response::HTTP_FORBIDDEN,
        );

        return $next($request);
    }
}
