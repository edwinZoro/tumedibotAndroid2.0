<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Especialidades extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     * En Laravel por defecto sería 'especialidades', pero respetamos tu tabla 'especialidad'.
     *
     * @var string
     */
    protected $table = 'especialidad';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre_especialidad',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene todos los médicos que pertenecen a esta especialidad.
     */
    public function medicos(): HasMany
    {
        return $this->hasMany(Medico::class, 'especialidad_id');
    }
}
