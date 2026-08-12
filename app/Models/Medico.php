<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;

class Medico extends Model
{
    use EncryptsAttributes, HasFactory, Notifiable;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'medicos';

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre',
        'apellido',
        'second_name',
        'last_name',
        'sexo',
        'telefono',
        'whatsapp',
        'correo',
        'revendedor',
        'pais_id',
        'estado_id',
        'ciudad_id',
        'direccion',
        'especialidad_id',
        'consultorio_costo',
        'horario',
        'experiencia',
        'usted_es',
        'perfil_medico',
        'tratamientos',
        'foto',
        'facebook',
        'twitter',
        'linkedin',
        'instagram',
        'pagos',
        'route',
        'name_temp',
        'name_original',
        'user_id',
        'logo',
        'firma_medico',
        'sello_medico',
    ];

    /**
     * Atributos personalizados para tu trait de encriptación.
     *
     * @var array<int, string>
     */
    protected $encrypted = [
        'telefono',
        'whatsapp',
        'revendedor',
        'horario',
        'direccion',
        'experiencia',
        'usted_es',
        'firma_medico',
        'sello_medico',
    ];

    /**
     * Atributos que deben ser convertidos (Casteados).
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'pais_id' => 'integer',
        'estado_id' => 'integer',
        'ciudad_id' => 'integer',
        'especialidad_id' => 'integer',
        'user_id' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Configura el canal de envío para las notificaciones por correo.
     */
    public function routeNotificationForMail(mixed $notification): string
    {
        return $this->correo;
    }

    /**
     * Obtiene las notificaciones del médico utilizando la relación polimórfica nativa.
     */
    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Obtiene las notificaciones no leídas del médico.
     */
    public function unreadNotifications(): MorphMany
    {
        return $this->notifications()->whereNull('read_at');
    }

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
     * Mutator y Accessor para el campo apellido.
     */
    protected function apellido(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ? ucfirst($value) : null,
            set: fn (?string $value) => $value ? strtolower($value) : null,
        );
    }

    /**
     * =========================================================================
     * RELACIONES (Definiciones de claves e índices)
     * =========================================================================
     */

    /**
     * Relación inversa uno a uno / muchos con User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relación con Especialidades.
     */
    public function especialidad(): BelongsTo
    {
        // Nota: Asegúrate de que el modelo se llame 'Especialidades' (en plural) como tenías en tu código original.
        return $this->belongsTo(Especialidades::class, 'especialidad_id');
    }

    /**
     * Relación inversa con el Calendario asignado.
     */
    public function calendar(): BelongsTo
    {
        return $this->belongsTo(Calendar::class, 'medico_id', 'id');
    }

    /**
     * Relación con el País.
     */
    public function pais(): BelongsTo
    {
        return $this->belongsTo(Pais::class, 'pais_id');
    }

    /**
     * Relación con el Estado/Provincia.
     */
    public function estado(): BelongsTo
    {
        return $this->belongsTo(State::class, 'estado_id');
    }

    /**
     * Relación con la Ciudad.
     */
    public function ciudad(): BelongsTo
    {
        return $this->belongsTo(Ciudad::class, 'ciudad_id');
    }

    /**
     * Relación Muchos a Muchos con Pacientes usando la tabla pivote intermedia.
     */
    public function pacientes(): BelongsToMany
    {
        return $this->belongsToMany(Paciente::class, 'medico_paciente', 'medico_id', 'paciente_id')
            ->withPivot(['origen', 'visible', 'created_at', 'updated_at'])
            ->withTimestamps();
    }
}
