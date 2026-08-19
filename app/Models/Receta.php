<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Receta extends Model
{
    use EncryptsAttributes, HasFactory;

    protected $table = 'recetas';

    protected $fillable = [
        'id_paciente',
        'id_medico',
        'id_cita_paciente',
        'tipo_receta',
        'medicamentos',
        'indicaciones',
        'diagnostico',
        'proxima_cita',
        'compartido',
    ];

    protected $encrypted = [
        'medicamentos',
        'indicaciones',
        'diagnostico',
    ];

    protected $casts = [
        'id' => 'integer',
        'id_paciente' => 'integer',
        'id_medico' => 'integer',
        'id_cita_paciente' => 'integer',
        'proxima_cita' => 'date',
        'compartido' => 'boolean',
    ];

    public function getEncryptedFields(): array
    {
        return $this->encrypted;
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }

    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }

    public function citaPaciente(): BelongsTo
    {
        return $this->belongsTo(CitaPaciente::class, 'id_cita_paciente');
    }
}
