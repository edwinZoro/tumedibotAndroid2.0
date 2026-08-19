<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Medico;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ConfiguracionFirmaController extends Controller
{
    public function show(): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico, 403);

        $medico->decryptAttributes();

        return response()->json([
            'logo' => $medico->logo,
            'firma_medico' => $medico->firma_medico,
            'sello_medico' => $medico->sello_medico,
            'sello_hospital' => $medico->sello_hospital,
            'nombre_hospital' => $medico->nombre_hospital,
            'direccion_hospital' => $medico->direccion_hospital,
            'configurado' => $this->estaConfigurado($medico),
        ]);
    }

    public function update(Request $request): JsonResponse
    {
        $medico = $this->medicoAutenticado();
        abort_unless($medico, 403);

        $validated = $request->validate([
            'firma_medico' => 'nullable|string',
            'sello_medico' => 'nullable|string',
            'logo' => 'nullable|string',
            'sello_hospital' => 'nullable|string',
            'nombre_hospital' => 'nullable|string|max:255',
            'direccion_hospital' => 'nullable|string|max:500',
        ]);

        $medico->update([
            'firma_medico' => $validated['firma_medico'] ?? null,
            'sello_medico' => $validated['sello_medico'] ?? null,
            'logo' => $validated['logo'] ?? null,
            'sello_hospital' => $validated['sello_hospital'] ?? null,
            'nombre_hospital' => $validated['nombre_hospital'] ?? null,
            'direccion_hospital' => $validated['direccion_hospital'] ?? null,
        ]);

        $medico->decryptAttributes();

        return response()->json([
            'success' => true,
            'configurado' => $this->estaConfigurado($medico),
            'logo' => $medico->logo,
            'firma_medico' => $medico->firma_medico,
            'sello_medico' => $medico->sello_medico,
            'sello_hospital' => $medico->sello_hospital,
            'nombre_hospital' => $medico->nombre_hospital,
            'direccion_hospital' => $medico->direccion_hospital,
        ]);
    }

    protected function estaConfigurado(Medico $medico): bool
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
