<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user() || !in_array($request->user()->rol, $roles)) {
            // If user is student trying to access admin area, redirect to dashboard or 403
            if ($request->user() && $request->user()->rol === 'estudiante') {
                return redirect()->route('dashboard')->withErrors(['error' => 'No tiene permisos para acceder a esta sección.']);
            }
            abort(403, 'No tiene autorización para acceder a este recurso.');
        }

        return $next($request);
    }
}
