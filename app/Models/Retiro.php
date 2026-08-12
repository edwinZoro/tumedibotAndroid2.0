<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Retiro extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'retiros';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'medico_id',
        'monto_solicitado_bruto',
        'comision_plataforma',
        'monto_a_pagar_neto',
        'estado',
        'metodo',
        'datos_metodo',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'medico_id' => 'integer',
        'monto_solicitado_bruto' => 'decimal:2', // Garantiza precisión exacta en operaciones contables
        'comision_plataforma' => 'decimal:2',    // Evita errores flotantes con el porcentaje de comisión
        'monto_a_pagar_neto' => 'decimal:2',       // Formato limpio para transferencias o pasarelas
        'datos_metodo' => 'array',               // Mapea automáticamente el JSON de la BD a un array de PHP
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el médico que solicitó el retiro de fondos.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'medico_id');
    }
}
