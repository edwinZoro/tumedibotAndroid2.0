<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nota extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'notas';

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
        'id_historial',
        'contenido',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'id_historial' => 'integer',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el historial clínico al que pertenece esta nota de evolución.
     */
    public function historialPaciente(): BelongsTo
    {
        return $this->belongsTo(HistorialPaciente::class, 'id_historial');
    }
}