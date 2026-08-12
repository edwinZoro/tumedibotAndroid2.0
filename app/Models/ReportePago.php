<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ReportePago extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'reporte_pagos';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaccion_id',
        'banco_emisor',
        'banco_receptor',
        'nmro_referencia',
        'monto_pagado',
        'metodo_transaccion',
        'total',
        'ingreso',
        'egreso',
        'credito',
        'fecha_transaccion',
        'fecha_vence_transaccion',
        'pedidos_id',
        'estado',
        'factura_id',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'pedidos_id' => 'integer',
        'factura_id' => 'integer',
        'monto_pagado' => 'decimal:2', // Garantiza alta precisión para contabilidad/pasarelas de pago
        'total' => 'decimal:2',
        'ingreso' => 'decimal:2',
        'egreso' => 'decimal:2',
        'credito' => 'decimal:2',
        'fecha_transaccion' => 'datetime',
        'fecha_vence_transaccion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene los pedidos asociados a este reporte de pago.
     * (Corregido a HasMany para mantener concordancia con tu lógica interna previa).
     */
    public function pedidos(): HasMany
    {
        return $this->hasMany(Pedido::class, 'pedidos_id');
    }

    /**
     * Obtiene la factura vinculada directamente a este reporte de pago (si aplica).
     */
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'factura_id');
    }
}
