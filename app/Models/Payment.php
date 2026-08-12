<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'payments';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'appointment_id',
        'paypal_order_id',
        'paypal_capture_id',
        'gross_amount',
        'status',
        'released_at',
        'notes',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'appointment_id' => 'integer',
        'gross_amount' => 'decimal:2', // Conserva el formato numérico preciso para montos monetarios
        'released_at' => 'datetime',   // Reemplaza la propiedad obsoleta $dates
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene la cita médica vinculada a este pago.
     */
    public function cita(): BelongsTo
    {

        return $this->belongsTo(Cita::class, 'appointment_id');
    }
}
