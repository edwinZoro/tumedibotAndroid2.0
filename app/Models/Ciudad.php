<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ciudad extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'ciudades';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'state_id',
        'name',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'state_id' => 'integer',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el estado o provincia al que pertenece la ciudad.
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(State::class, 'state_id');
    }

    /**
     * Obtiene todos los médicos registrados en esta ciudad.
     */
    public function medicos(): HasMany
    {
        return $this->hasMany(Medico::class, 'ciudad_id');
    }
}
