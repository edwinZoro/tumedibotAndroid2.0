<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Models\Nota;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotaController extends Controller
{
    public function index(CitaPaciente $citaPaciente): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        $notas = Nota::where('id_cita_paciente', $citaPaciente->id)
            ->orderByDesc('id')
            ->get();

        $paciente = $citaPaciente->paciente;

        return response()->json([
            'notas' => $notas,
            'paciente_email' => $paciente?->email_paciente,
            'paciente_nombre' => $paciente?->nombre_paciente,
        ]);
    }

    public function store(Request $request, CitaPaciente $citaPaciente): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $citaPaciente->id_medico === $medico->id, 403);

        $validated = $request->validate([
            'contenido' => 'required|string|max:5000',
        ]);

        $nota = Nota::create([
            'id_cita_paciente' => $citaPaciente->id,
            'id_medico' => $medico->id,
            'id_paciente' => $citaPaciente->id_paciente,
            'contenido' => $validated['contenido'],
            'compartido' => false,
        ]);

        return response()->json([
            'success' => true,
            'nota' => $nota,
        ]);
    }

    public function update(Request $request, Nota $nota): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $nota->id_medico === $medico->id, 403);

        $validated = $request->validate([
            'contenido' => 'required|string|max:5000',
        ]);

        $nota->update(['contenido' => $validated['contenido']]);

        return response()->json([
            'success' => true,
            'nota' => $nota->fresh(),
        ]);
    }

    public function destroy(Nota $nota): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $nota->id_medico === $medico->id, 403);

        $nota->delete();

        return response()->json([
            'success' => true,
        ]);
    }

    public function toggleCompartir(Nota $nota): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico && $nota->id_medico === $medico->id, 403);

        $nota->compartido = ! $nota->compartido;
        $nota->save();

        return response()->json([
            'success' => true,
            'compartido' => $nota->compartido,
        ]);
    }

    protected function medicoAutenticado(): ?Medico
    {
        return Medico::where('user_id', Auth::id())->first();
    }
}
