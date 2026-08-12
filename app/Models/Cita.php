<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Cita extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'citas';

    /**
     * Indica si el modelo debe tener los campos created_at y updated_at de manera automática.
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
        'motivo_consulta',
        'sintomas',
        'estado',
        'estado_cita',
        'tipo',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'id_paciente' => 'integer',
        'id_medico' => 'integer',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el paciente asociado a la cita médica.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    /**
     * Obtiene el médico asignado a la cita.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }

    /**
     * Obtiene los historiales clínicos del paciente que se derivaron de esta cita.
     */
    public function historiales(): HasMany
    {
        return $this->hasMany(HistorialPaciente::class, 'id_cita');
    }

    /**
     * Obtiene los datos de la videollamada vinculada a la cita (si aplica).
     */
    public function video_call(): HasOne
    {
        return $this->hasOne(VideoCall::class, 'cita_id', 'id');
    }
}
