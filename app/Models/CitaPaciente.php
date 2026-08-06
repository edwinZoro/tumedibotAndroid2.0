<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class CitaPaciente extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'cita_pacientes';

    /**
     * Indica si el modelo debe tener los campos created_at y updated_at.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'id_paciente',
        'id_medico',
        'fecha',
        'hora',
        'motivo_consulta',
        'sintomas',
        'estado',
        'estado_cita',
        'tipo',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<int, string>
     */
    protected $casts = [
        'id' => 'integer',
        'id_paciente' => 'integer',
        'id_medico' => 'integer',
        'fecha' => 'date',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el paciente asociado a esta cita.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    /**
     * Obtiene el médico asignado a esta cita.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }

    /**
     * Obtiene los historiales clínicos derivados de esta cita.
     */
    public function historiales(): HasMany
    {
        return $this->hasMany(HistorialPaciente::class, 'id_cita');
    }

    /**
     * Obtiene los datos de la videollamada vinculada a esta cita (si aplica).
     */
    public function video_call(): HasOne
    {
        return $this->hasOne(VideoCall::class, 'cita_id', 'id');
    }
}
