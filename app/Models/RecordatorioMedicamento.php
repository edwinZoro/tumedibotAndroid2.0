<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RecordatorioMedicamento extends Model
{
    use HasFactory;

    protected $table = 'recordatorio_medicamentos';

    protected $fillable = [
        'paciente_id',
        'medicamento_id',
        'nombre_libre',
        'presentacion',
        'dosis',
        'intervalo_horas',
        'hora_inicio',
        'dias_semana',
        'fecha_inicio',
        'fecha_fin',
        'email_recordatorio',
        'notas',
        'activo',
    ];

    protected $casts = [
        'dias_semana' => 'array',
        'fecha_inicio' => 'date:Y-m-d',
        'fecha_fin' => 'date:Y-m-d',
        'email_recordatorio' => 'boolean',
        'activo' => 'boolean',
        'intervalo_horas' => 'integer',
    ];

    /**
     * Obtiene el nombre legible del medicamento (ya sea del catálogo o nombre libre)
     */
    public function getNombreMedicamentoAttribute(): string
    {
        if ($this->medicamento) {
            return $this->medicamento->nombre_comercial ?? $this->medicamento->principio_activo ?? $this->nombre_libre ?? 'Medicamento';
        }

        return $this->nombre_libre ?? 'Medicamento';
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'paciente_id');
    }

    public function medicamento(): BelongsTo
    {
        return $this->belongsTo(Medicamento::class, 'medicamento_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(RecordatorioMedicamentoLog::class, 'recordatorio_id');
    }
}
