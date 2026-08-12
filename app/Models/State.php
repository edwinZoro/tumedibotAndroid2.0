<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'states';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'pais_id',
        'name',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'pais_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el país al que pertenece este estado o provincia.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class, 'pais_id');
    }

    /**
     * Obtiene todas las ciudades que pertenecen a este estado.
     */
    public function ciudades(): HasMany
    {
        // Vincula con la clave foránea 'state_id' declarada en tu modelo Ciudad
        return $this->hasMany(Ciudad::class, 'state_id');
    }

    /**
     * Obtiene todos los médicos registrados en este estado.
     */
    public function medicos(): HasMany
    {
        return $this->hasMany(Medico::class, 'estado_id');
    }
}
