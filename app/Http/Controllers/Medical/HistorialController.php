<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Mail\HistorialMedicoMail;
use App\Models\CitaPaciente;
use App\Models\Firma;
use App\Models\HistorialPaciente;
use App\Models\Medico;
use App\Notifications\HistorialCompartidoPaciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class HistorialController extends Controller
{
    /**
     * Obtiene el historial clínico de una cita de paciente, si existe.
     * Si no existe, devuelve nulo, indicando que se debe crear.
     */
    public function index(CitaPaciente $citaPaciente)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        $historial = HistorialPaciente::with('firma')->where('id_cita_paciente', $citaPaciente->id)->first();

        if ($historial && $historial->firma) {
            $historial->firma->decryptAttributes();
        }

        $f = $historial && $historial->firma ? $historial->firma : null;

        $paciente = $citaPaciente->paciente;

        return response()->json([
            'historial' => $historial,
            'paciente_email' => $paciente?->email_paciente,
            'paciente_nombre' => $paciente?->nombre_paciente,
            'medico_configurado' => $this->medicoConfigurado($medico),
            'firma_medico' => $f?->firma_medico ?? '',
            'sello_medico' => $f?->sello_medico ?? '',
            'logo' => $f?->logo_medico ?? '',
            'sello_hospital' => $f?->sello_hospital ?? '',
            'nombre_hospital' => $f?->nombre_hospital ?? '',
            'direccion_hospital' => $f?->direccion_hospital ?? '',
        ]);
    }

    /**
     * Guarda un nuevo historial para la cita.
     */
    public function store(Request $request, CitaPaciente $citaPaciente)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        if (! $this->medicoConfigurado($medico)) {
            return back()->withErrors([
                'configuracion' => 'Debes configurar tu firma, sello y datos de hospital antes de crear un historial.',
            ]);
        }

        $validated = $request->validate([
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'conclusiones' => 'nullable|string',
            'examen_fisico' => 'nullable|string',
            'examen_funcional' => 'nullable|string',
            'examen_paraclinico' => 'nullable|string',
        ]);

        $historial = HistorialPaciente::create([
            'id_paciente' => $citaPaciente->id_paciente,
            'id_cita_paciente' => $citaPaciente->id,
            'id_cita' => null,
            'diagnostico' => $validated['diagnostico'],
            'tratamiento' => $validated['tratamiento'],
            'conclusiones' => $validated['conclusiones'] ?? null,
            'examen_fisico' => $validated['examen_fisico'] ?? null,
            'examen_funcional' => $validated['examen_funcional'] ?? null,
            'examen_paraclinico' => $validated['examen_paraclinico'] ?? null,
        ]);

        $firmaData = $this->obtenerFirmaDataMedico($medico);

        Firma::create(array_merge([
            'id_historial' => $historial->id,
            'id_medico' => $medico->id,
            'id_paciente' => $citaPaciente->id_paciente,
        ], $firmaData));

        return back()->with('success', 'Historial clínico creado correctamente.');
    }

    /**
     * Actualiza un historial existente.
     */
    public function update(Request $request, HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        if (! $this->medicoConfigurado($medico)) {
            return back()->withErrors([
                'configuracion' => 'Debes configurar tu firma, sello y datos de hospital antes de actualizar un historial.',
            ]);
        }

        $validated = $request->validate([
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'conclusiones' => 'nullable|string',
            'examen_fisico' => 'nullable|string',
            'examen_funcional' => 'nullable|string',
            'examen_paraclinico' => 'nullable|string',
        ]);

        $historial->update([
            'diagnostico' => $validated['diagnostico'],
            'tratamiento' => $validated['tratamiento'],
            'conclusiones' => $validated['conclusiones'] ?? null,
            'examen_fisico' => $validated['examen_fisico'] ?? null,
            'examen_funcional' => $validated['examen_funcional'] ?? null,
            'examen_paraclinico' => $validated['examen_paraclinico'] ?? null,
        ]);

        $historial->load('firma');

        $firmaData = $this->obtenerFirmaDataMedico($medico);

        if ($historial->firma) {
            $historial->firma->update($firmaData);
        } else {
            Firma::create(array_merge([
                'id_historial' => $historial->id,
                'id_medico' => $medico->id,
                'id_paciente' => $historial->id_paciente,
            ], $firmaData));
        }

        return back()->with('success', 'Historial clínico actualizado correctamente.');
    }

    /**
     * Elimina un historial existente.
     */
    public function destroy(HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        $historial->delete();

        if (request()->expectsJson()) {
            return response()->json(['success' => true]);
        }

        return back()->with('success', 'Historial clínico eliminado.');
    }

    public function toggleCompartir(HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        $historial->compartido = ! $historial->compartido;
        $historial->save();

        if ($historial->compartido && $historial->paciente) {
            $historial->load('paciente', 'citaPaciente.medico');

            $historial->paciente->notify(new HistorialCompartidoPaciente($historial));
        }

        return response()->json([
            'compartido' => $historial->compartido,
        ]);
    }

    /**
     * Genera un PDF del historial médico.
     */
    public function pdfSingle(HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        $historial->load(
            'citaPaciente.paciente',
            'citaPaciente.medico.ciudad',
            'citaPaciente.medico.estado',
            'citaPaciente.medico.pais',
            'citaPaciente.medico.especialidad',
            'firma'
        );

        $pdf = Pdf::loadView('historial.hitorial', $this->buildPdfData($historial));

        return $pdf->stream("historial_{$historial->id}.pdf");
    }

    /**
     * Envía por correo electrónico el PDF del historial al paciente.
     */
    public function enviarEmail(Request $request, HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        $historial->load(
            'citaPaciente.paciente',
            'citaPaciente.medico.ciudad',
            'citaPaciente.medico.estado',
            'citaPaciente.medico.pais',
            'citaPaciente.medico.especialidad',
            'firma'
        );

        $paciente = $historial->citaPaciente->paciente;

        if (! $paciente || ! $paciente->email_paciente) {
            return response()->json([
                'success' => false,
                'message' => 'El paciente no tiene un correo electrónico registrado.',
            ], 422);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $pdfData = $this->buildPdfData($historial);

        $medicoNombre = trim(($medico->nombre ?? '').' '.($medico->second_name ?? '').' '.($medico->apellido ?? '').' '.($medico->last_name ?? ''));

        Mail::to($validated['email'])->send(new HistorialMedicoMail(
            $historial,
            $pdfData,
            $paciente->nombre_paciente,
            $medicoNombre,
        ));

        return response()->json([
            'success' => true,
            'email' => $validated['email'],
        ]);
    }

    /**
     * Construye el arreglo de datos para renderizar la vista PDF del historial.
     *
     * @return array<string, mixed>
     */
    protected function buildPdfData(HistorialPaciente $historial): array
    {
        $firmaModel = $historial->firma;
        if ($firmaModel) {
            $firmaModel->decryptAttributes();
        }

        $toDataUri = static function (?string $value): ?string {
            if (! $value) {
                return null;
            }
            if (str_starts_with($value, 'data:image')) {
                return $value;
            }

            return 'data:image/png;base64,'.$value;
        };

        return [
            'historial' => $historial,
            'logoBase64' => $firmaModel ? $toDataUri($firmaModel->logo_medico) : null,
            'firmaBase64' => $firmaModel ? $toDataUri($firmaModel->firma_medico) : null,
            'selloBase64' => $firmaModel ? $toDataUri($firmaModel->sello_medico) : null,
            'selloHospitalBase64' => $firmaModel ? $toDataUri($firmaModel->sello_hospital) : null,
            'nombreHospital' => $firmaModel ? $firmaModel->nombre_hospital : null,
            'direccionHospital' => $firmaModel ? $firmaModel->direccion_hospital : null,
            'usaCitaPaciente' => true,
        ];
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }

    protected function medicoConfigurado(Medico $medico): bool
    {
        $medico->decryptAttributes();

        return ! empty($medico->firma_medico)
            && ! empty($medico->sello_medico)
            && ! empty($medico->logo)
            && ! empty($medico->nombre_hospital);
    }

    /**
     * @return array<string, mixed>
     */
    protected function obtenerFirmaDataMedico(Medico $medico): array
    {
        $medico->decryptAttributes();

        return [
            'firma_medico' => $medico->firma_medico,
            'sello_medico' => $medico->sello_medico,
            'logo_medico' => $medico->logo,
            'sello_hospital' => $medico->sello_hospital,
            'nombre_hospital' => $medico->nombre_hospital,
            'direccion_hospital' => $medico->direccion_hospital,
        ];
    }
}
