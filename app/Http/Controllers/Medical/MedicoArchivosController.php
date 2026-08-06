<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Archivo;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MedicoArchivosController extends Controller
{
    /**
     * Muestra los archivos que los pacientes compartieron explícitamente
     * con el médico autenticado. Solo lectura: no ve la bóveda completa.
     */
    public function index(): Response
    {
        $medico = Auth::user()->medico;

        abort_unless($medico, 403, 'No autorizado');

        $archivos = Archivo::whereHas('accesos', fn ($q) => $q->where('medico_id', $medico->id))
            ->with(['paciente', 'subidoPor'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Archivo $archivo) => [
                'id' => $archivo->id,
                'nombre_archivo' => $archivo->nombre_archivo,
                'extension' => $archivo->extension,
                'tipo' => $archivo->tipo,
                'paciente' => [
                    'id' => $archivo->paciente->id,
                    'nombre' => $archivo->paciente->nombre_paciente,
                ],
            ]);

        $agrupados = $archivos->groupBy('paciente.id')->values()->map(function ($items) {
            return [
                'paciente' => $items->first()['paciente'],
                'archivos' => $items->map(fn ($item) => [
                    'id' => $item['id'],
                    'nombre_archivo' => $item['nombre_archivo'],
                    'extension' => $item['extension'],
                    'tipo' => $item['tipo'],
                ])->values(),
            ];
        });

        return Inertia::render('medicos/archivos-compartidos', [
            'grupos' => $agrupados,
        ]);
    }
}
