<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HistorialPaciente extends Model
{
    use EncryptsAttributes, HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'historial_clinico';

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
        'id_cita',
        'diagnostico',
        'tratamiento',
        'conclusiones',
        'examen_paraclinico',
        'examen_fisico',
        'examen_funcional',
    ];

    /**
     * Atributos personalizados para tu trait de encriptación.
     *
     * @var array<int, string>
     */
    protected $encrypted = [
        'diagnostico',
        'tratamiento',
        'conclusiones',
        'examen_paraclinico',
        'examen_fisico',
        'examen_funcional',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'id_paciente' => 'integer',
        'id_cita' => 'integer',
    ];

    /**
     * Retorna los campos que deben ser encriptados por tu trait personalizado.
     *
     * @var array<int, string>
     */
    public function getEncryptedFields(): array
    {
        return $this->encrypted;
    }

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene la cita médica de la cual se deriva este historial clínico.
     */
    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'id_cita');
    }

    /**
     * Obtiene el paciente dueño de este historial clínico.
     */
    public function paciente(): BelongsTo
    {
        // Corregido a belongsTo usando la clave foránea 'id_paciente' declarada en tu fillable.
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    /**
     * Obtiene las notas de evolución médica asociadas a este historial.
     */
    public function notas(): HasMany
    {
        return $this->hasMany(Nota::class, 'id_historial');
    }

    /**
     * Obtiene los archivos adjuntos (exámenes, imágenes, PDFs) del paciente de este historial.
     */
    public function archivos(): HasMany
    {
        return $this->hasMany(Archivo::class, 'paciente_id', 'id_paciente');
    }
}
