<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Nota extends Model
{
    use EncryptsAttributes, HasFactory;

    protected $table = 'notas';

    protected $fillable = [
        'id_historial',
        'id_cita_paciente',
        'id_medico',
        'id_paciente',
        'contenido',
        'compartido',
    ];

    protected $encrypted = [
        'contenido',
    ];

    protected $casts = [
        'id' => 'integer',
        'id_historial' => 'integer',
        'id_cita_paciente' => 'integer',
        'id_medico' => 'integer',
        'id_paciente' => 'integer',
        'compartido' => 'boolean',
    ];

    public function getEncryptedFields(): array
    {
        return $this->encrypted;
    }

    public function historialPaciente(): BelongsTo
    {
        return $this->belongsTo(HistorialPaciente::class, 'id_historial');
    }

    public function citaPaciente(): BelongsTo
    {
        return $this->belongsTo(CitaPaciente::class, 'id_cita_paciente');
    }

    public function medico(): BelongsTo
    {
        return $this->belongsTo(Medico::class, 'id_medico');
    }

    public function paciente(): BelongsTo
    {
        return $this->belongsTo(Paciente::class, 'id_paciente');
    }
}
