<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Archivo;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MedicoArchivosController extends Controller
{
    /**
     * Muestra los archivos que los pacientes compartieron explícitamente
     * con el médico autenticado. Solo lectura: no ve la bóveda completa.
     *
     * Se listan los pacientes que tienen al menos un archivo compartido
     * (10 por página), con búsqueda por nombre y filtro por fecha de
     * subida. Los archivos de cada paciente se ordenan del más reciente
     * al más antiguo.
     */
    public function index(Request $request): Response
    {
        $medico = Auth::user()->medico;

        $q = $request->string('q')->trim()->toString();
        $desde = $request->string('desde')->trim()->toString();
        $hasta = $request->string('hasta')->trim()->toString();

        $totalPacientes = 0;
        $pacientesQuery = Paciente::query();

        if ($medico) {
            $totalPacientes = Paciente::query()
                ->whereHas('archivos.accesos', fn ($query) => $query->where('medico_id', $medico->id))
                ->count();

            $pacientesQuery->whereHas('archivos', function ($query) use ($medico, $desde, $hasta) {
                $query->whereHas('accesos', fn ($acceso) => $acceso->where('medico_id', $medico->id));

                if ($desde !== '') {
                    $query->where('archivos.created_at', '>=', $desde.' 00:00:00');
                }

                if ($hasta !== '') {
                    $query->where('archivos.created_at', '<=', $hasta.' 23:59:59');
                }
            });
        } else {
            $pacientesQuery->whereRaw('0 = 1');
        }

        if ($q !== '') {
            $pacientesQuery->whereRaw(
                'LOWER(pacientes.nombre_paciente) LIKE ?',
                ['%'.mb_strtolower($q).'%'],
            );
        }

        $pacientes = $pacientesQuery
            ->with([
                'archivos' => fn ($query) => $query
                    ->whereHas('accesos', fn ($acceso) => $acceso->where('medico_id', $medico?->id ?? 0)),
            ])
            ->orderBy('pacientes.nombre_paciente')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Paciente $paciente) => [
                'paciente' => [
                    'id' => $paciente->id,
                    'nombre' => $paciente->nombre_paciente,
                ],
                'archivos' => $paciente->archivos
                    ->sortByDesc(fn (Archivo $archivo) => $archivo->created_at?->timestamp ?? 0)
                    ->values()
                    ->map(fn (Archivo $archivo) => [
                        'id' => $archivo->id,
                        'nombre_archivo' => $archivo->nombre_archivo,
                        'extension' => $archivo->extension,
                        'tipo' => $archivo->tipo,
                        'subido_en' => $archivo->created_at?->toDateString(),
                    ]),
            ]);

        return Inertia::render('medicos/archivos-compartidos', [
            'pacientes' => $pacientes,
            'total' => $totalPacientes,
            'esMedico' => $medico !== null,
            'filters' => [
                'q' => $q,
                'desde' => $desde,
                'hasta' => $hasta,
            ],
        ]);
    }
}
