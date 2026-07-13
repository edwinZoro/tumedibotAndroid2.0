<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PedidoClinica extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'pedidos_clinicas';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'transaccion_id',
        'total',
        'sub_total',
        'iva',
        'facturas_clinicas_id',
        'plan',
        'ticket',
        'fecha_pedido',
        'fecha_vence_pedido',
        'estado',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'facturas_clinicas_id' => 'integer',
        'total' => 'decimal:2',     // Garantiza precisión exacta para montos y pasarelas de pago
        'sub_total' => 'decimal:2',
        'iva' => 'decimal:2',
        'fecha_pedido' => 'datetime',       // Convierte automáticamente el string a instancia de Carbon
        'fecha_vence_pedido' => 'datetime', // Convierte automáticamente el string a instancia de Carbon
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene la factura de la clínica asociada a este pedido.
     */
    public function facturaClinica(): BelongsTo
    {
        return $this->belongsTo(FacturaClinica::class, 'facturas_clinicas_id');
    }
}