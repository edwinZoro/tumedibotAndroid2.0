<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VideoCall extends Model
{
    use HasFactory;

    /**
     * La tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'video_calls';

    /**
     * Los atributos que son asignables en masa (Mass Assignable).
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cita_id',
        'room_name',
        'started_at',
        'ended_at',
        'enlace_medico',
        'enlace_paciente',
    ];

    /**
     * Los atributos que deben ser convertidos a tipos nativos.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'id' => 'integer',
        'cita_id' => 'integer',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * =========================================================================
     * ACCESORES Y MÉTODOS DE NEGOCIO
     * =========================================================================
     */

    /**
     * Accesor moderno para calcular la duración de la llamada en minutos.
     * Reemplaza el antiguo getDurationAttribute() usando la sintaxis de Atributos de Laravel.
     *
     * Uso: $videoCall->duration
     */
    protected function duration(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes): int {
                if (! isset($attributes['started_at']) || ! isset($attributes['ended_at']) || ! $attributes['ended_at']) {
                    return 0;
                }

                // Al acceder mediante array de atributos crudos, nos aseguramos de parsear las fechas correctamente
                $started = $this->asDateTime($attributes['started_at']);
                $ended = $this->asDateTime($attributes['ended_at']);

                return (int) $started->diffInMinutes($ended);
            }
        );
    }

    /**
     * Finaliza la videollamada registrando la hora actual.
     */
    public function end(): void
    {
        $this->update([
            'ended_at' => now(),
        ]);
    }

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene la cita médica vinculada directamente a esta videollamada de telemedicina.
     */
    public function cita(): BelongsTo
    {
        return $this->belongsTo(Cita::class, 'cita_id');
    }
}