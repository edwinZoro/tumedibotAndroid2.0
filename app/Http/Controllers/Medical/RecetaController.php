<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Mail\RecetaMedicaMail;
use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Models\Receta;
use App\Notifications\RecetaCompartidaPaciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;

class RecetaController extends Controller
{
    public function index(CitaPaciente $citaPaciente): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        $receta = Receta::where('id_cita_paciente', $citaPaciente->id)->latest('id')->first();
        $paciente = $citaPaciente->paciente;

        return response()->json([
            'receta' => $receta,
            'paciente_email' => $paciente?->email_paciente,
            'paciente_nombre' => $paciente?->nombre_paciente,
            'medico_configurado' => $this->medicoConfigurado($medico),
        ]);
    }

    public function store(Request $request, CitaPaciente $citaPaciente)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        if (! $this->medicoConfigurado($medico)) {
            return back()->withErrors([
                'configuracion' => 'Debes configurar tu firma, sello y datos de hospital antes de crear una receta.',
            ]);
        }

        $validated = $request->validate([
            'tipo_receta' => 'nullable|string|max:50',
            'medicamentos' => 'required|string',
            'indicaciones' => 'nullable|string',
            'diagnostico' => 'nullable|string',
            'proxima_cita' => 'nullable|date',
        ]);

        $receta = Receta::create([
            'id_paciente' => $citaPaciente->id_paciente,
            'id_medico' => $medico->id,
            'id_cita_paciente' => $citaPaciente->id,
            'tipo_receta' => $validated['tipo_receta'] ?? 'simple',
            'medicamentos' => $validated['medicamentos'],
            'indicaciones' => $validated['indicaciones'] ?? null,
            'diagnostico' => $validated['diagnostico'] ?? null,
            'proxima_cita' => $validated['proxima_cita'] ?? null,
        ]);

        return back()->with('success', 'Receta médica creada correctamente.');
    }

    public function update(Request $request, Receta $receta)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $receta->id_medico === $medico->id, 403);

        $validated = $request->validate([
            'tipo_receta' => 'nullable|string|max:50',
            'medicamentos' => 'required|string',
            'indicaciones' => 'nullable|string',
            'diagnostico' => 'nullable|string',
            'proxima_cita' => 'nullable|date',
        ]);

        $receta->update([
            'tipo_receta' => $validated['tipo_receta'] ?? 'simple',
            'medicamentos' => $validated['medicamentos'],
            'indicaciones' => $validated['indicaciones'] ?? null,
            'diagnostico' => $validated['diagnostico'] ?? null,
            'proxima_cita' => $validated['proxima_cita'] ?? null,
        ]);

        return back()->with('success', 'Receta médica actualizada correctamente.');
    }

    public function destroy(Receta $receta)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $receta->id_medico === $medico->id, 403);

        $receta->delete();

        return back()->with('success', 'Receta médica eliminada correctamente.');
    }

    public function toggleCompartir(Receta $receta): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $receta->id_medico === $medico->id, 403);

        $receta->compartido = ! $receta->compartido;
        $receta->save();

        if ($receta->compartido && $receta->paciente) {
            $receta->load('paciente', 'medico');

            $receta->paciente->notify(new RecetaCompartidaPaciente($receta));
        }

        return response()->json([
            'success' => true,
            'compartido' => $receta->compartido,
        ]);
    }

    public function pdfSingle(Receta $receta)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $receta->id_medico === $medico->id, 403);

        $receta->load('citaPaciente', 'paciente', 'medico.ciudad', 'medico.estado', 'medico.pais', 'medico.especialidad');

        $pdf = Pdf::loadView('receta.receta', $this->buildPdfData($receta));

        return $pdf->stream("receta_{$receta->id}.pdf");
    }

    public function enviarEmail(Request $request, Receta $receta): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $receta->id_medico === $medico->id, 403);

        $receta->load('citaPaciente', 'paciente', 'medico.ciudad', 'medico.estado', 'medico.pais', 'medico.especialidad');

        $paciente = $receta->paciente;

        if (! $paciente || ! $paciente->email_paciente) {
            return response()->json([
                'success' => false,
                'message' => 'El paciente no tiene un correo electrónico registrado.',
            ], 422);
        }

        $validated = $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        $pdfData = $this->buildPdfData($receta);

        $medico->decryptAttributes();

        $medicoNombre = mb_convert_case(trim(($medico->nombre ?? '').' '.($medico->second_name ?? '').' '.($medico->apellido ?? '').' '.($medico->last_name ?? '')), MB_CASE_TITLE, 'UTF-8');

        $medicoEspecialidad = $medico->especialidad?->nombre_especialidad ?? null;
        $nombreHospital = $medico->nombre_hospital ?? null;
        $direccionHospital = $medico->direccion_hospital ?? null;

        $medicamentos = json_decode($receta->medicamentos, true) ?: [];

        $indicaciones = [];
        if ($receta->indicaciones) {
            $decoded = json_decode($receta->indicaciones, true);
            if (is_array($decoded)) {
                $indicaciones = $decoded;
            } else {
                $indicaciones = [$receta->indicaciones];
            }
        }

        Mail::to($validated['email'])->send(new RecetaMedicaMail(
            $receta,
            $pdfData,
            $paciente->nombre_paciente,
            $medicoNombre,
            $medicoEspecialidad,
            $nombreHospital,
            $direccionHospital,
            $receta->diagnostico,
            $medicamentos,
            $indicaciones,
        ));

        return response()->json([
            'success' => true,
            'email' => $validated['email'],
        ]);
    }

    protected function buildPdfData(Receta $receta): array
    {
        $medico = $receta->medico;
        $medico->decryptAttributes();

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
            'receta' => $receta,
            'logoBase64' => $toDataUri($medico->logo),
            'firmaBase64' => $toDataUri($medico->firma_medico),
            'selloBase64' => $toDataUri($medico->sello_medico),
            'selloHospitalBase64' => $toDataUri($medico->sello_hospital),
            'nombreHospital' => $medico->nombre_hospital,
            'direccionHospital' => $medico->direccion_hospital,
        ];
    }

    protected function medicoConfigurado(Medico $medico): bool
    {
        $medico->decryptAttributes();

        return ! empty($medico->firma_medico)
            && ! empty($medico->sello_medico)
            && ! empty($medico->logo)
            && ! empty($medico->nombre_hospital);
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }
}
