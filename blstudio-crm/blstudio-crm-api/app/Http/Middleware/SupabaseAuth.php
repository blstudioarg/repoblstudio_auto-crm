<?php

namespace App\Http\Middleware;

use Closure;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Valida el JWT emitido por Supabase Auth.
 *
 * Los access tokens de Supabase se firman con HS256 usando el JWT secret
 * del proyecto (SUPABASE_JWT_SECRET). Si el token es válido, los claims
 * quedan disponibles en $request->attributes->get('supabase_user').
 */
class SupabaseAuth
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $this->extractToken($request);

        if (! $token) {
            return response()->json(['message' => 'Token no provisto.'], 401);
        }

        $secret = config('services.supabase.jwt_secret');

        if (! $secret) {
            return response()->json(['message' => 'SUPABASE_JWT_SECRET no configurado.'], 500);
        }

        try {
            $decoded = JWT::decode($token, new Key($secret, 'HS256'));
        } catch (ExpiredException $e) {
            return response()->json(['message' => 'Token expirado.'], 401);
        } catch (\Throwable $e) {
            return response()->json(['message' => 'Token inválido.'], 401);
        }

        // Supabase usa 'authenticated' como rol para usuarios logueados.
        if (($decoded->role ?? null) !== 'authenticated') {
            return response()->json(['message' => 'Rol no autorizado.'], 401);
        }

        $request->attributes->set('supabase_user', [
            'id'    => $decoded->sub ?? null,
            'email' => $decoded->email ?? null,
            'role'  => $decoded->role ?? null,
        ]);

        return $next($request);
    }

    private function extractToken(Request $request): ?string
    {
        $header = $request->header('Authorization', '');

        if (str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }

        return null;
    }
}
