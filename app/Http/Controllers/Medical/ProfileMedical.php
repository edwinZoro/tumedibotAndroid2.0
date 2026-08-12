<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Medico;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
