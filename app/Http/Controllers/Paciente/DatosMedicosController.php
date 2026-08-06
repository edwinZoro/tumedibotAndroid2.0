<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\Paciente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DatosMedicosController extends Controller
{
    /**
     * Muestra la vista de Datos Médicos del paciente autenticado.
     *
     * Si el paciente todavía no tiene registros, se muestra el formulario
     * de primera vez; en caso contrario, se muestra la tabla con sus datos
     * (el teléfono y el email llegan desencriptados gracias al trait).
     */
    public function show(): Response
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        return Inertia::render('Paciente/datos-medicos', [
            'paciente' => $paciente,
        ]);
    }

    /**
     * Guarda por primera vez los datos médicos del paciente.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validar($request);

        Paciente::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return redirect()
            ->route('pacientes.datos-medicos')
            ->with('success', 'Datos médicos guardados correctamente.');
    }

    /**
     * Actualiza los datos médicos del paciente.
     */
    public function update(Request $request, Paciente $paciente): RedirectResponse
    {
        abort_unless($paciente->user_id === Auth::id(), 403, 'No autorizado');

        $paciente->update($this->validar($request));

        return redirect()
            ->route('pacientes.datos-medicos')
            ->with('success', 'Datos médicos actualizados correctamente.');
    }

    /**
     * Reglas de validación compartidas por store y update.
     *
     * @return array<string, mixed>
     */
    protected function validar(Request $request): array
    {
        return $request->validate([
            'nombre_paciente' => 'required|string|min:2|max:20',
            'tlf_paciente' => ['required', 'string', 'max:20', 'regex:/^[+]?[\d\s-]+$/'],
            'email_paciente' => 'required|email|max:255',
            'edad' => 'required|integer|min:1|max:120',
            'peso' => 'required|integer|min:1|max:255',
            'estatura' => 'required|string|max:20',
        ]);
    }
}
