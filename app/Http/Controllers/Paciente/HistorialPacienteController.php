<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\HistorialPaciente;
use App\Models\Paciente;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class HistorialPacienteController extends Controller
{
    public function pdfSingle(HistorialPaciente $historial)
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();
        abort_unless($paciente && $historial->id_paciente === $paciente->id, 403);
        abort_unless($historial->compartido, 403);

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
}
