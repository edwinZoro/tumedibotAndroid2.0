<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medico;
use Inertia\Response;
use Inertia\Inertia;

class ProfileMedical extends Controller
{
    /**
     * Render the doctor profile view.
     */
    public function show(Request $request, $id): Response
    {
        $medico = Medico::with(['especialidad', 'pais', 'estado', 'ciudad'])->findOrFail($id);
        $user = auth()->id() ?? 0;

        return Inertia::render('medicos/profile-medical', [
            'medico' => $medico,
            'user' => $user,
        ]);
    }
}
