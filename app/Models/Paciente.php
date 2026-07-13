<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\Notifiable;

class Paciente extends Model
{
    use HasFactory, Notifiable;

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
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'edad' => 'integer',
        'peso' => 'decimal:2',     // Ajusta a 'float' o 'decimal:2' según guardes en base de datos
        'estatura' => 'decimal:2', // Ajusta a 'float' o 'decimal:2' según guardes en base de datos
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

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
}