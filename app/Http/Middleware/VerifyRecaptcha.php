<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class VerifyRecaptcha
{
    public function handle(Request $request, Closure $next)
    {
        $token = $request->input('g-recaptcha-response');
        if (! $token) {
            return response()->json(['message' => 'Falta el token reCAPTCHA'], 422);
        }

        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('recaptcha.secret_key'),
            'response' => $token,
        ]);

        $body = $response->json();

        if (! $body['success'] || ($body['score'] ?? 0) < 0.5) {
            return response()->json(['message' => 'Verificación reCAPTCHA fallida'], 422);
        }

        return $next($request);
    }
}
