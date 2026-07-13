<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Clinica extends Model
{
    use HasFactory, EncryptsAttributes;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'clinica';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'tipo_negocio',
        'nombre',
        'direccion',
        'telefono',
        'whatsapp',
        'perfil_clinica',
        'servicios',
        'correo',
        'revendedor',
        'pais_id',
        'estado_id',
        'ciudad_id',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'foto_a',
        'foto_b',
        'foto_c',
        'foto_d',
        'foto_e',
        'foto_f',
        'pagos',
        'user_id',
    ];

    /**
     * Atributos personalizados para tu trait de encriptación.
     *
     * @var array<int, string>
     */
    protected $encrypted = [
        'telefono',
        'whatsapp',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'foto_a',
        'foto_b',
        'foto_c',
        'foto_d',
        'foto_e',
        'foto_f',
        'perfil_clinica',
        'servicios',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'pais_id' => 'integer',
        'estado_id' => 'integer',
        'ciudad_id' => 'integer',
        'user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
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
     * MUTATORS & ACCESSORS (Sintaxis moderna de Laravel 11+)
     * =========================================================================
     */

    /**
     * Mutator y Accessor para el campo nombre.
     */
    protected function nombre(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? ucfirst($value) : null,
            set: fn (?string $value) => $value ? strtolower($value) : null,
        );
    }

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el país asociado a la clínica.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class, 'pais_id');
    }

    /**
     * Obtiene el estado/provincia asociado a la clínica.
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(State::class, 'estado_id');
    }

    /**
     * Obtiene la ciudad asociada a la clínica.
     */
    public function ciudad(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class, 'ciudad_id');
    }

    /**
     * Obtiene el usuario del sistema dueño o administrador de la clínica.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}