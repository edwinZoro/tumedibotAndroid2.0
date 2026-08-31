<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Models\Paciente;
use App\Notifications\NuevaCitaMedico;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class CitasController extends Controller
{
    /**
     * Muestra el calendario y las citas del paciente autenticado,
     * junto con el buscador de médicos para agendar nuevas citas.
     */
    public function index(Request $request): Response
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        if (! $paciente) {
            return Inertia::render('Paciente/mis-citas', [
                'tienePaciente' => false,
                'citas' => [],
                'medicos' => [
                    'data' => [],
                    'links' => [],
                ],
                'filters' => ['q' => ''],
            ]);
        }

        $citas = CitaPaciente::query()
            ->where('id_paciente', $paciente->id)
            ->with([
                'medico:id,nombre,apellido,especialidad_id,consultorio_costo,foto',
                'medico.especialidad:id,nombre_especialidad',
            ])
            ->with(['historialClinico' => function ($q) {
                $q->where('compartido', true)->select('id', 'id_cita_paciente', 'compartido');
            }])
            ->with(['recetas' => function ($q) {
                $q->where('compartido', true)
                    ->select('id', 'id_cita_paciente', 'compartido')
                    ->latest('id');
            }])
            ->with(['notas' => function ($q) {
                $q->where('compartido', true)
                    ->select('id', 'id_cita_paciente', 'contenido', 'compartido', 'created_at');
            }])
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->get()
            ->map(fn (CitaPaciente $cita) => [
                'id' => $cita->id,
                'fecha' => $cita->fecha?->toDateString(),
                'hora' => $cita->hora,
                'motivo_consulta' => $cita->motivo_consulta,
                'sintomas' => $cita->sintomas,
                'estado_cita' => $cita->estado_cita,
                'tipo' => $cita->tipo,
                'historial_compartido' => $cita->historialClinico?->id,
                'receta_compartida' => $cita->recetas->first()?->id,
                'notas_compartidas' => $cita->notas->map(fn ($nota) => [
                    'id' => $nota->id,
                    'contenido' => $nota->contenido,
                    'creado' => $nota->created_at?->toIso8601String(),
                ])->values()->all(),
                'medico' => $cita->medico ? [
                    'id' => $cita->medico->id,
                    'nombre' => trim(($cita->medico->nombre ?? '').' '.($cita->medico->apellido ?? '')),
                    'especialidad' => $cita->medico->especialidad?->nombre_especialidad,
                    'consultorio_costo' => $cita->medico->consultorio_costo,
                    'foto' => $cita->medico->foto,
                ] : null,
            ]);

        $q = $request->string('q')->trim()->toString();

        $medicosQuery = Medico::query()
            ->where('pagos', 'positive')
            ->with('especialidad:id,nombre_especialidad')
            ->orderBy('nombre')
            ->orderBy('apellido');

        if ($q !== '') {
            $medicosQuery->where(function ($query) use ($q) {
                $query->where('nombre', 'LIKE', '%'.$q.'%')
                    ->orWhere('apellido', 'LIKE', '%'.$q.'%')
                    ->orWhereHas('especialidad', function ($esp) use ($q) {
                        $esp->where('nombre_especialidad', 'LIKE', '%'.$q.'%');
                    });
            });
        }

        $medicos = $medicosQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Medico $medico) => [
                'id' => $medico->id,
                'nombre' => trim(($medico->nombre ?? '').' '.($medico->apellido ?? '')),
                'especialidad' => $medico->especialidad?->nombre_especialidad,
                'consultorio_costo' => $medico->consultorio_costo,
                'foto' => $medico->foto,
            ]);

        return Inertia::render('Paciente/mis-citas', [
            'tienePaciente' => true,
            'citas' => $citas,
            'medicos' => $medicos,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }

    /**
     * Solicita una nueva cita (sin fecha/hora; el médico la agenda después)
     * y notifica al médico elegido.
     */
    public function store(Request $request): RedirectResponse
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        abort_unless($paciente, 422, 'Primero completa tus datos médicos.');

        $validated = $request->validate([
            'id_medico' => ['required', 'integer', 'exists:medicos,id'],
            'motivos' => ['nullable', 'array', 'max:20'],
            'motivos.*' => ['required', 'string', 'min:1', 'max:80'],
            'sintomas' => ['nullable', 'array', 'max:20'],
            'sintomas.*' => ['required', 'string', 'min:1', 'max:80'],
            'tipo' => ['required', 'string', 'in:CONSULTA,VIDEOLLAMADA'],
        ]);

        $medico = Medico::findOrFail($validated['id_medico']);

        $motivos = collect($validated['motivos'] ?? [])
            ->map(fn (string $m) => trim($m))
            ->filter()
            ->unique()
            ->values();

        $motivoConsulta = $motivos->isNotEmpty()
            ? $motivos->implode(', ')
            : 'Consulta en consultorio';

        $sintomas = collect($validated['sintomas'] ?? [])
            ->map(fn (string $s) => trim($s))
            ->filter()
            ->unique()
            ->values();

        $sintomasConsulta = $sintomas->isNotEmpty()
            ? $sintomas->implode(', ')
            : null;

        $cita = CitaPaciente::create([
            'id_paciente' => $paciente->id,
            'id_medico' => $medico->id,
            'fecha' => null,
            'hora' => null,
            'motivo_consulta' => $motivoConsulta,
            'sintomas' => $sintomasConsulta,
            'tipo' => $validated['tipo'],
            'estado_cita' => 'PENDIENTE',
        ]);

        // Relaciona el médico con el paciente en la tabla pivote medico_paciente
        $paciente->medicos()->syncWithoutDetaching([
            $medico->id => ['origen' => 'paciente', 'visible' => true],
        ]);

        // Notificación en la app (tabla notifications) + correo al médico
        $medico->notify(new NuevaCitaMedico($cita->load('paciente')));

        return back()->with('success', 'Solicitud de cita enviada. El médico te asignará fecha y hora.');
    }

    /**
     * Cancela una cita propia del paciente autenticado.
     */
    public function destroy(CitaPaciente $cita): RedirectResponse
    {
        abort_unless($cita->paciente->user_id === Auth::id(), 403, 'No autorizado');

        $cita->delete();

        return back()->with('success', 'Cita cancelada correctamente.');
    }
}
