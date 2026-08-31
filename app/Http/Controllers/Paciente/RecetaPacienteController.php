<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use App\Models\Receta;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class RecetaPacienteController extends Controller
{
    /**
     * Genera el PDF de una receta médica compartida por el médico,
     * siempre que pertenezca al paciente autenticado.
     */
    public function pdfSingle(Receta $receta)
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();
        abort_unless($paciente && $receta->id_paciente === $paciente->id, 403);
        abort_unless($receta->compartido, 403);

        $receta->load('citaPaciente', 'paciente', 'medico.ciudad', 'medico.estado', 'medico.pais', 'medico.especialidad');

        $pdf = Pdf::loadView('receta.receta', $this->buildPdfData($receta));

        return $pdf->stream("receta_{$receta->id}.pdf");
    }

    /**
     * Construye el arreglo de datos para renderizar la vista PDF de la receta.
     *
     * @return array<string, mixed>
     */
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
}
