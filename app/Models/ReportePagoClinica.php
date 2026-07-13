<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReportePagoClinica extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'reportes_pagos_clinicas';

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
        'estado',
        'facturas_clinicas_id',
        'pedidos_clinicas_id',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'facturas_clinicas_id' => 'integer',
        'pedidos_clinicas_id' => 'integer',
        'monto_pagado' => 'decimal:2', // Alta precisión para evitar errores flotantes en contabilidad
        'total' => 'decimal:2',
        'ingreso' => 'decimal:2',
        'egreso' => 'decimal:2',
        'credito' => 'decimal:2',
        'fecha_transaccion' => 'datetime',       // Convierte automáticamente a objeto Carbon
        'fecha_vence_transaccion' => 'datetime', // Convierte automáticamente a objeto Carbon
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene la factura de la clínica asociada a este reporte de pago.
     */
    public function facturaClinica(): BelongsTo
    {
        return $this->belongsTo(FacturaClinica::class, 'facturas_clinicas_id');
    }

    /**
     * Obtiene el pedido de la clínica asociado a este reporte de pago.
     */
    public function pedidoClinica(): BelongsTo
    {
        return $this->belongsTo(PedidoClinica::class, 'pedidos_clinicas_id');
    }
}