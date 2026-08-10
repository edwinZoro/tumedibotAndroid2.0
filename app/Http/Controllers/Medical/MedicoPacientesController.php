<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Models\Paciente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MedicoPacientesController extends Controller
{
    /**
     * Lista de pacientes del médico (incluye los registrados de consultorio
     * y los que le solicitaron cita desde su panel de Paciente).
     */
    public function index(Request $request): Response
    {
        $medico = $this->medicoAutenticado();

        if (! $medico) {
            return Inertia::render('medicos/mis-pacientes', [
                'tieneMedico' => false,
                'pacientes' => [
                    'data' => [],
                    'links' => [],
                ],
                'filters' => ['q' => ''],
            ]);
        }

        $q = $request->string('q')->trim()->toString();

        $pacientesQuery = $medico->pacientes()
            ->withPivot(['origen', 'visible'])
            ->with(['citas' => function ($query) use ($medico) {
                $query->where('id_medico', $medico->id)
                    ->where('tipo', 'VIDEOLLAMADA')
                    ->where('estado_cita', 'CONFIRMADA')
                    ->orderByDesc('fecha')
                    ->orderByDesc('id');
            }])
            ->orderByDesc('medico_paciente.created_at')
            ->orderByDesc('pacientes.id');

        if ($q !== '') {
            $pacientesQuery->whereRaw(
                'LOWER(pacientes.nombre_paciente) LIKE ?',
                ['%'.mb_strtolower($q).'%'],
            );
        }

        $pacientes = $pacientesQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Paciente $paciente) => $this->mapPaciente($paciente));

        return Inertia::render('medicos/mis-pacientes', [
            'tieneMedico' => true,
            'pacientes' => $pacientes,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }

    /**
     * El médico registra un paciente de su consultorio (persona sin cuenta en
     * la app) y crea una cita pendiente (sin fecha/hora; luego se agenda desde
     * Citas con "Añadir fecha").
     */
    public function storePaciente(Request $request): RedirectResponse
    {
        $medico = $this->medicoAutenticado();

        abort_unless($medico, 403, 'No tienes perfil de médico.');

        $validated = $request->validate([
            'nombre_paciente' => ['required', 'string', 'min:2', 'max:20'],
            'email_paciente' => ['required', 'email', 'max:255'],
            'tlf_paciente' => ['required', 'string', 'max:20', 'regex:/^[+]?[\d\s-]+$/'],
            'edad' => ['nullable', 'integer', 'min:1', 'max:120'],
            'peso' => ['nullable', 'integer', 'min:1', 'max:255'],
            'estatura' => ['nullable', 'string', 'max:20'],
            'motivos' => ['nullable', 'array', 'max:20'],
            'motivos.*' => ['required', 'string', 'min:1', 'max:80'],
            'sintomas' => ['nullable', 'array', 'max:20'],
            'sintomas.*' => ['required', 'string', 'min:1', 'max:80'],
            'tipo' => ['required', 'string', 'in:CONSULTA,VIDEOLLAMADA'],
        ]);

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

        $paciente = Paciente::create([
            'nombre_paciente' => $validated['nombre_paciente'],
            'email_paciente' => $validated['email_paciente'],
            'tlf_paciente' => $validated['tlf_paciente'],
            'edad' => $validated['edad'] ?? null,
            'peso' => $validated['peso'] ?? null,
            'estatura' => $validated['estatura'] ?? null,
            'user_id' => null,
        ]);

        $medico->pacientes()->syncWithoutDetaching([
            $paciente->id => ['origen' => 'medico', 'visible' => true],
        ]);

        CitaPaciente::create([
            'id_paciente' => $paciente->id,
            'id_medico' => $medico->id,
            'fecha' => null,
            'hora' => null,
            'motivo_consulta' => $motivoConsulta,
            'sintomas' => $sintomasConsulta,
            'tipo' => $validated['tipo'],
            'estado_cita' => 'PENDIENTE',
        ]);

        return back()->with('success', 'Paciente añadido. Ahora puedes asignarle fecha y hora desde Citas (Agenda).');
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }

    /**
     * @return array<string, mixed>
     */
    protected function mapPaciente(Paciente $paciente): array
    {
        $citaVideo = $paciente->citas->first();

        return [
            'id' => $paciente->id,
            'nombre' => $paciente->nombre_paciente,
            'email' => $paciente->email_paciente,
            'telefono' => $paciente->tlf_paciente,
            'edad' => $paciente->edad,
            'peso' => $paciente->peso,
            'estatura' => $paciente->estatura,
            'origen' => $paciente->pivot?->origen ?? null,
            'video_cita_id' => $citaVideo?->id,
            'video_cita_fecha' => $citaVideo?->fecha?->toDateString(),
            'video_cita_hora' => $citaVideo?->hora,
        ];
    }
}
