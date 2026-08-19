<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Medicamento extends Model
{
    use HasFactory;

    protected $table = 'medicamentos';

    protected $fillable = [
        'nombre_comercial',
        'principio_activo',
        'presentaciones',
        'dosis_options',
        'frecuencia_options',
        'duracion_options',
        'indicaciones',
        'categoria',
    ];

    protected $casts = [
        'id' => 'integer',
        'presentaciones' => 'array',
        'dosis_options' => 'array',
        'frecuencia_options' => 'array',
        'duracion_options' => 'array',
    ];
}
