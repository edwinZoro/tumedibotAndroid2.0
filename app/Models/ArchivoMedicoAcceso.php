<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArchivoMedicoAcceso extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'archivo_medico_acceso';

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
        'archivo_id',
        'medico_id',
        'otorgado_en',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'archivo_id' => 'integer',
        'medico_id' => 'integer',
        'otorgado_en' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el archivo al que se otorgó acceso.
     */
    public function archivo(): BelongsTo
    {
        return $this->belongsTo(Archivo::class, 'archivo_id');
    }

    /**
     * Obtiene el médico al que se otorgó acceso.
     */
    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'medico_id');
    }
}
