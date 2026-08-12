<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\CitaPaciente;
use App\Models\Firma;
use App\Models\HistorialPaciente;
use App\Models\Medico;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

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

        return response()->json([
            'historial' => $historial,
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

        $validated = $request->validate([
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'conclusiones' => 'nullable|string',
            'examen_fisico' => 'nullable|string',
            'examen_funcional' => 'nullable|string',
            'examen_paraclinico' => 'nullable|string',
            'firma_medico' => 'nullable|string',
            'sello_medico' => 'nullable|string',
            'logo' => 'nullable|string',
            'sello_hospital' => 'nullable|string',
            'nombre_hospital' => 'nullable|string',
            'direccion_hospital' => 'nullable|string',
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

        Firma::create([
            'id_historial' => $historial->id,
            'id_medico' => $medico->id,
            'id_paciente' => $citaPaciente->id_paciente,
            'firma_medico' => $validated['firma_medico'] ?? null,
            'sello_medico' => $validated['sello_medico'] ?? null,
            'logo_medico' => $validated['logo'] ?? null,
            'sello_hospital' => $validated['sello_hospital'] ?? null,
            'nombre_hospital' => $validated['nombre_hospital'] ?? null,
            'direccion_hospital' => $validated['direccion_hospital'] ?? null,
        ]);

        return back()->with('success', 'Historial clínico creado correctamente.');
    }

    /**
     * Actualiza un historial existente.
     */
    public function update(Request $request, HistorialPaciente $historial)
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $historial->citaPaciente && $historial->citaPaciente->id_medico === $medico->id, 403);

        $validated = $request->validate([
            'diagnostico' => 'required|string',
            'tratamiento' => 'required|string',
            'conclusiones' => 'nullable|string',
            'examen_fisico' => 'nullable|string',
            'examen_funcional' => 'nullable|string',
            'examen_paraclinico' => 'nullable|string',
            'firma_medico' => 'nullable|string',
            'sello_medico' => 'nullable|string',
            'logo' => 'nullable|string',
            'sello_hospital' => 'nullable|string',
            'nombre_hospital' => 'nullable|string',
            'direccion_hospital' => 'nullable|string',
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

        if ($historial->firma) {
            $historial->firma->decryptAttributes();
        }

        $firmaData = [
            'firma_medico' => $validated['firma_medico'] ?? null,
            'sello_medico' => $validated['sello_medico'] ?? null,
            'logo_medico' => $validated['logo'] ?? null,
            'sello_hospital' => $validated['sello_hospital'] ?? null,
            'nombre_hospital' => $validated['nombre_hospital'] ?? null,
            'direccion_hospital' => $validated['direccion_hospital'] ?? null,
        ];

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
            'notas',
            'firma'
        );

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

        $pdf = Pdf::loadView('historial.hitorial', [
            'historial' => $historial,
            'logoBase64' => $firmaModel ? $toDataUri($firmaModel->logo_medico) : null,
            'firmaBase64' => $firmaModel ? $toDataUri($firmaModel->firma_medico) : null,
            'selloBase64' => $firmaModel ? $toDataUri($firmaModel->sello_medico) : null,
            'selloHospitalBase64' => $firmaModel ? $toDataUri($firmaModel->sello_hospital) : null,
            'nombreHospital' => $firmaModel ? $firmaModel->nombre_hospital : null,
            'direccionHospital' => $firmaModel ? $firmaModel->direccion_hospital : null,
            'usaCitaPaciente' => true,
        ]);

        return $pdf->stream("historial_{$historial->id}.pdf");
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }
}
