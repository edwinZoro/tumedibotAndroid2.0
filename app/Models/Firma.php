<?php

namespace App\Models;

use App\Models\Traits\EncryptsAttributes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Firma extends Model
{
    use EncryptsAttributes, HasFactory;

    protected $table = 'firmas';

    protected $fillable = [
        'id_historial',
        'id_medico',
        'id_paciente',
        'logo_medico',
        'firma_medico',
        'sello_medico',
        'sello_hospital',
        'nombre_hospital',
        'direccion_hospital',
    ];

    protected $encrypted = [
        'logo_medico',
        'firma_medico',
        'sello_medico',
        'sello_hospital',
    ];

    protected $casts = [
        'id' => 'integer',
        'id_historial' => 'integer',
        'id_medico' => 'integer',
        'id_paciente' => 'integer',
    ];

    public function getEncryptedFields(): array
    {
        return $this->encrypted;
    }

    public function historial(): BelongsTo
    {
        return $this->belongsTo(HistorialPaciente::class, 'id_historial');
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
