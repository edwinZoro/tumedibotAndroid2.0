<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MedicoSaldo extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'medico_saldos';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'medico_id',
        'saldo_disponible',
        'saldo_pendiente',
        'total_ganado',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'medico_id' => 'integer',
        'saldo_disponible' => 'decimal:2', // Fuerza a conservar dos decimales como flotante/string preciso
        'saldo_pendiente' => 'decimal:2',
        'total_ganado' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el médico dueño de este registro de saldos y ganancias.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'medico_id');
    }
}