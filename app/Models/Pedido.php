<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Pedido extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'pedidos';

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
        'factura_id',
        'plan',
        'ticket',
        'fecha_pedido',
        'fecha_vence_pedido',
        'fecha_vence_transaccion',
        'metodo_transaccion',
        'estado',
        'fecha_aprobacion',
        'dias_duracion',
        'reminder_7d_sent',
        'reminder_3d_sent',
        'reminder_1d_sent',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'factura_id' => 'integer',
        'total' => 'decimal:2',     // Manejo preciso de valores financieros/monetarios
        'sub_total' => 'decimal:2',
        'iva' => 'decimal:2',
        'fecha_pedido' => 'datetime',
        'fecha_vence_pedido' => 'datetime',
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
     * Obtiene la factura asociada a este pedido.
     */
    public function factura(): BelongsTo
    {
        return $this->belongsTo(Factura::class, 'factura_id');
    }

    /**
     * Obtiene los reportes de pago asociados a este pedido (Relación Muchos a Muchos).
     */
    public function reporte_pago(): BelongsToMany
    {
        return $this->belongsToMany(ReportePago::class);
    }

    /**
     * Obtiene la duración en días del pedido, usando el valor del atributo o el config por defecto.
     */
    public function getDuracionDiasAttribute($value)
    {
        return $value ?? config("planes.{$this->plan}.dias", 30);
    }
}
