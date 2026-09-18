<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modelo de auditoría de consentimientos legales.
 *
 * Registra cada vez que un usuario acepta los documentos legales
 * (Términos de Servicio, Política de Privacidad, Política de Cookies).
 *
 * @property int         $id
 * @property int         $user_id
 * @property string      $type            'terms' | 'privacy' | 'cookies' | 'all'
 * @property string      $policy_version  Ej: "v1.0"
 * @property string|null $ip_address      IP del cliente
 * @property string|null $user_agent      Navegador/dispositivo
 * @property \Carbon\Carbon $accepted_at  Timestamp exacto de la aceptación
 */
class ConsentLog extends Model
{
    /**
     * La tabla asociada al modelo.
     */
    protected $table = 'consent_logs';

    /**
     * Este modelo no usa updated_at, solo accepted_at.
     * Desactivamos el manejo automático de timestamps.
     */
    public $timestamps = false;

    /**
     * Los atributos que son asignables en masa.
     */
    protected $fillable = [
        'user_id',
        'type',
        'policy_version',
        'ip_address',
        'user_agent',
        'accepted_at',
    ];

    /**
     * Conversiones de tipos.
     */
    protected $casts = [
        'user_id'    => 'integer',
        'accepted_at' => 'datetime',
    ];

    // =========================================================================
    // RELACIONES
    // =========================================================================

    /**
     * El usuario que otorgó el consentimiento.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    // =========================================================================
    // MÉTODOS DE CONVENIENCIA (Factory Methods)
    // =========================================================================

    /**
     * Crea un registro de consentimiento completo a partir de una Request HTTP.
     *
     * Obtiene la IP real del usuario manejando:
     * - Proxies / Load balancers (X-Forwarded-For)
     * - Cloudflare (CF-Connecting-IP)
     * - Servidor directo
     *
     * @param  int    $userId        ID del usuario recién creado
     * @param  \Illuminate\Http\Request $request  Request HTTP de Fortify
     * @param  string $type          Tipo de consentimiento (default: 'all')
     * @param  string $policyVersion Versión de la política (default: config)
     */
    public static function record(
        int $userId,
        \Illuminate\Http\Request $request,
        string $type = 'all',
        ?string $policyVersion = null,
    ): static {
        return static::create([
            'user_id'        => $userId,
            'type'           => $type,
            'policy_version' => $policyVersion ?? config('app.policy_version', 'v1.0'),
            'ip_address'     => static::resolveClientIp($request),
            'user_agent'     => $request->userAgent(),
            'accepted_at'    => now(),
        ]);
    }

    /**
     * Obtiene la IP real del cliente con soporte para proxies y CDN.
     *
     * Orden de prioridad:
     *  1. CF-Connecting-IP (Cloudflare)
     *  2. X-Real-IP (Nginx reverse proxy)
     *  3. El primer IP de X-Forwarded-For (load balancer / proxy genérico)
     *  4. IP directa de la conexión TCP
     */
    public static function resolveClientIp(\Illuminate\Http\Request $request): ?string
    {
        // 1. Cloudflare pone la IP real del visitante en este header
        if ($cfIp = $request->header('CF-Connecting-IP')) {
            return filter_var(trim($cfIp), FILTER_VALIDATE_IP) ?: null;
        }

        // 2. Nginx con proxy_set_header X-Real-IP $remote_addr
        if ($realIp = $request->header('X-Real-IP')) {
            return filter_var(trim($realIp), FILTER_VALIDATE_IP) ?: null;
        }

        // 3. Cabecera estándar de proxy — tomamos solo el primer IP de la cadena
        if ($forwardedFor = $request->header('X-Forwarded-For')) {
            $ips = array_map('trim', explode(',', $forwardedFor));
            foreach ($ips as $ip) {
                if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE)) {
                    return $ip;
                }
            }
            // Si todos son privados (raro pero posible en dev), tomamos el primero igual
            if (filter_var($ips[0], FILTER_VALIDATE_IP)) {
                return $ips[0];
            }
        }

        // 4. IP directa de la conexión (método nativo de Laravel)
        return $request->ip();
    }
}
