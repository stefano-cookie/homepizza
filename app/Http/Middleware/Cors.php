<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Cors
{
    public function handle(Request $request, Closure $next)
    {
        // Gestisce le richieste preflight OPTIONS
        if ($request->isMethod('OPTIONS')) {
            $response = response('', 200);
        } else {
            $response = $next($request);
        }

        // Aggiunge gli header CORS
        return $response
            ->header('Access-Control-Allow-Origin', 'http://localhost:5173')
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization, X-XSRF-TOKEN')
            ->header('Access-Control-Allow-Credentials', 'true');
    }
}