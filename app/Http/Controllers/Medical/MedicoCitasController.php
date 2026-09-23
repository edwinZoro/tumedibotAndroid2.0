<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Notifications\CitaAgendadaPaciente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class MedicoCitasController extends Controller
{
    /**
     * Agenda del médico autenticado: citas que le solicitaron + calendario.
     */
    public function index(Request $request): Response
    {
        $medico = $this->medicoAutenticado();

        if (! $medico) {
            return Inertia::render('medicos/citas-agenda', [
                'tieneMedico' => false,
                'citas' => [
                    'data' => [],
                    'links' => [],
                ],
                'agenda' => [],
                'filters' => ['q' => ''],
            ]);
        }

        $q = $request->string('q')->trim()->toString();

        $citasQuery = CitaPaciente::query()
            ->where('id_medico', $medico->id)
            ->whereHas('paciente.medicos', function ($q) use ($medico) {
                $q->where('medicos.id', $medico->id)
                    ->where('medico_paciente.origen', 'paciente');
            })
            ->with('paciente:id,nombre_paciente,email_paciente,tlf_paciente')
            ->orderByRaw('CASE WHEN fecha IS NULL THEN 0 ELSE 1 END')
            ->orderByDesc('fecha')
            ->orderByDesc('id');

        if ($q !== '') {
            // email/teléfono van cifrados; la búsqueda por LIKE solo aplica a nombre
            $citasQuery->whereHas('paciente', function ($query) use ($q) {
                $query->where('nombre_paciente', 'LIKE', '%'.$q.'%');
            });
        }

        $citas = $citasQuery
            ->paginate(10)
            ->withQueryString()
            ->through(fn (CitaPaciente $cita) => $this->mapCita($cita));

        // Todas las citas con fecha (para calendario y lista del día, sin paginar)
        // Solo de pacientes que solicitaron por la app (origen = 'paciente')
        $agenda = CitaPaciente::query()
            ->where('id_medico', $medico->id)
            ->whereHas('paciente.medicos', function ($q) use ($medico) {
                $q->where('medicos.id', $medico->id)
                    ->where('medico_paciente.origen', 'paciente');
            })
            ->whereNotNull('fecha')
            ->with('paciente:id,nombre_paciente,email_paciente,tlf_paciente')
            ->orderBy('fecha')
            ->orderBy('hora')
            ->get()
            ->map(fn (CitaPaciente $cita) => $this->mapCita($cita));

        return Inertia::render('medicos/citas-agenda', [
            'tieneMedico' => true,
            'citas' => $citas,
            'agenda' => $agenda,
            'filters' => [
                'q' => $q,
            ],
        ]);
    }

    /**
     * El médico asigna (o actualiza) fecha y hora de una cita propia.
     * Notifica al paciente en la app y por correo.
     */
    public function asignarFecha(Request $request, CitaPaciente $cita): RedirectResponse
    {
        $medico = $this->medicoAutenticado();

        abort_unless($medico && $cita->id_medico === $medico->id, 403, 'No autorizado');

        $validated = $request->validate([
            'fecha' => ['required', 'date', 'after_or_equal:today'],
            'hora' => ['required', 'date_format:H:i'],
        ]);

        $cita->update([
            'fecha' => $validated['fecha'],
            'hora' => $validated['hora'],
            'estado_cita' => 'CONFIRMADA',
        ]);

        $cita->load(['paciente', 'medico']);

        if ($cita->paciente) {
            $cita->paciente->notify(new CitaAgendadaPaciente($cita));
        }

        return back()->with('success', 'Fecha asignada. El paciente ha sido notificado.');
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }

    /**
     * @return array<string, mixed>
     */
    protected function mapCita(CitaPaciente $cita): array
    {
        $paciente = $cita->paciente;

        return [
            'id' => $cita->id,
            'fecha' => $cita->fecha?->toDateString(),
            'hora' => $cita->hora,
            'motivo_consulta' => $cita->motivo_consulta,
            'sintomas' => $cita->sintomas,
            'estado_cita' => $cita->estado_cita,
            'tipo' => $cita->tipo,
            'paciente' => $paciente ? [
                'id' => $paciente->id,
                'nombre' => $paciente->nombre_paciente,
                'email' => $paciente->email_paciente,
                'telefono' => $paciente->tlf_paciente,
            ] : null,
        ];
    }
}
