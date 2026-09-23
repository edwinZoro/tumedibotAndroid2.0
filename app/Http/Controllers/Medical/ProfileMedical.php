<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Mail\MensajeDoctorMail;
use App\Models\Medico;
use App\Models\Paciente;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
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

        // Verificamos si el usuario actual tiene sus datos médicos completos
        $hasMedicalData = false;
        if ($user) {
            $paciente = Paciente::where('user_id', $user)->first();
            if ($paciente && ! empty($paciente->nombre_paciente) && ! empty($paciente->tlf_paciente)) {
                $hasMedicalData = true;
            }
        }

        return Inertia::render('medicos/profile-medical', [
            'medico' => $medico,
            'user' => $user,
            'hasMedicalData' => $hasMedicalData, // <-- AGREGA ESTA LÍNEA
        ]);
    }

    /**
     * Envía un correo electrónico al médico con el mensaje del usuario/paciente.
     * No almacena en la base de datos.
     */
    public function enviarMensajeDoctor(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'phone' => 'required|string|max:30',
            'message' => 'required|string|max:200',
            'email_doctor' => 'required|email',
        ], [
            'name.required' => 'El nombre completo es obligatorio.',
            'name.max' => 'El nombre no puede exceder 100 caracteres.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'Proporcione un correo electrónico válido.',
            'phone.required' => 'El número de teléfono es obligatorio.',
            'phone.max' => 'El teléfono no puede exceder 30 caracteres.',
            'message.required' => 'El mensaje es obligatorio.',
            'message.max' => 'El mensaje no puede exceder los 200 caracteres.',
            'email_doctor.required' => 'El correo del médico no está especificado.',
            'email_doctor.email' => 'El correo del médico no es válido.',
        ]);

        $medico = Medico::where('correo', $validated['email_doctor'])->first();
        $medicoNombre = 'Doctor';
        if ($medico) {
            $prefix = $medico->sexo === 'MASCULINO' ? 'Dr.' : 'Dra.';
            $medicoNombre = "{$prefix} {$medico->nombre} {$medico->apellido}";
        }

        Mail::to($validated['email_doctor'])->send(new MensajeDoctorMail(
            nombre: $validated['name'],
            email: $validated['email'],
            phone: $validated['phone'],
            mensaje: $validated['message'],
            medicoNombre: $medicoNombre
        ));

        return response()->json([
            'success' => true,
            'message' => 'Tu mensaje ha sido enviado exitosamente al médico.',
        ]);
    }
}
