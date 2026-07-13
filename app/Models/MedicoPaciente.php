<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class MedicoPaciente extends Pivot
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo pivote.
     *
     * @var string
     */
    protected $table = 'medico_paciente';

    /**
     * Indica si los IDs de la tabla intermedia son autoincrementales.
     * Cambiar a true si tu tabla pivote tiene una columna 'id' primaria autoincremental.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'medico_id',
        'paciente_id',
        'origen',
        'visible',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'medico_id' => 'integer',
        'paciente_id' => 'integer',
        'visible' => 'boolean', // Si 'visible' actúa como bandera (0 o 1), es mejor castearlo a boolean
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES (Opcionales dentro de un Pivot, pero útiles para consultas directas)
     * =========================================================================
     */

    /**
     * Obtiene el médico asociado a este registro intermedio.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'medico_id');
    }

    /**
     * Obtiene el paciente asociado a este registro intermedio.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }
}