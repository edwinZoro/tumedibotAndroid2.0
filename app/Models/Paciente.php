<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;

class Paciente extends Model
{
    use EncryptsAttributes, HasFactory, Notifiable;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'pacientes';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombre_paciente',
        'tlf_paciente',
        'email_paciente',
        'edad',
        'peso',
        'estatura',
        'user_id',
        'medico_id',
    ];

    /**
     * Campos sensibles que se encriptan con el trait EncryptsAttributes.
     *
     * @var array<int, string>
     */
    protected $encrypted = [
        'tlf_paciente',
        'email_paciente',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'edad' => 'integer',
        'peso' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Retorna los campos que deben ser encriptados por el trait.
     */
    public function getEncryptedFields(): array
    {
        return $this->encrypted;
    }

    /**
     * Configura el canal de envío para las notificaciones por correo electrónico.
     */
    public function routeNotificationForMail(mixed $notification): string
    {
        return $this->email_paciente;
    }

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Relación Muchos a Muchos con Médicos utilizando la tabla pivote intermedia.
     */
    public function medicos(): BelongsToMany
    {
        return $this->belongsToMany(Medico::class, 'medico_paciente', 'paciente_id', 'medico_id')
            ->withPivot(['origen', 'visible', 'created_at', 'updated_at'])
            ->withTimestamps();
    }

    /**
     * Relación con los médicos que pueden ver sus archivos (mucha a mucha)
     */
    public function medicosConAccesoArchivos(): BelongsToMany
    {
        return $this->belongsToMany(Medico::class, 'archivo_medico_acceso', 'archivo_id', 'medico_id')
            ->withPivot(['otorgado_en', 'created_at', 'updated_at']);
    }

    /**
     * Relación con los médicos con los que comparte su vista IoMT
     */
    public function medicosIoMT(): BelongsToMany
    {
        return $this->belongsToMany(Medico::class, 'iomt_medico_acceso', 'paciente_id', 'medico_id')
            ->withTimestamps();
    }

    /**
     * Obtiene los archivos (exámenes, radiologías, recetas) de la bóveda del paciente.
     */
    public function archivos(): HasMany
    {
        return $this->hasMany(Archivo::class, 'paciente_id');
    }

    /**
     * Obtiene las citas médicas del paciente.
     */
    public function citas(): HasMany
    {
        return $this->hasMany(CitaPaciente::class, 'id_paciente');
    }

    /**
     * Obtiene todas las notificaciones del paciente mediante relación polimórfica.
     */
    public function notifications(): MorphMany
    {
        return $this->morphMany(DatabaseNotification::class, 'notifiable')
            ->orderBy('created_at', 'desc');
    }

    /**
     * Obtiene únicamente las notificaciones no leídas del paciente.
     */
    public function unreadNotifications(): MorphMany
    {
        return $this->notifications()->whereNull('read_at');
    }

    /**
     * Recordatorios de medicamentos configurados por el paciente.
     */
    public function recordatoriosMedicamentos(): HasMany
    {
        return $this->hasMany(RecordatorioMedicamento::class, 'paciente_id');
    }
}

