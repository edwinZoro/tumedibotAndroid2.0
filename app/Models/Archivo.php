<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Archivo extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'archivos';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'paciente_id',
        'subido_por_user_id',
        'nombre_archivo',
        'ruta_archivo',
        'extension',
        'tipo',
    ];

    /**
     * Los atributos que son convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'paciente_id' => 'integer',
        'subido_por_user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el paciente dueño de este archivo.
     */
    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    /**
     * Obtiene el usuario (médico o paciente) que subió el archivo.
     */
    public function subidoPor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'subido_por_user_id');
    }

    /**
     * Obtiene los accesos otorgados a médicos para este archivo.
     */
    public function accesos(): HasMany
    {
        return $this->hasMany(ArchivoMedicoAcceso::class, 'archivo_id');
    }

    /**
     * Obtiene los médicos con acceso a este archivo mediante la tabla pivote.
     */
    public function medicos(): BelongsToMany
    {
        return $this->belongsToMany(Medico::class, 'archivo_medico_acceso', 'archivo_id', 'medico_id')
            ->withPivot('otorgado_en');
    }
}
