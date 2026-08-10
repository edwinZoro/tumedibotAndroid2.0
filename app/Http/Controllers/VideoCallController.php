<?php

namespace App\Http\Controllers;

use App\Models\CitaPaciente;
use App\Models\Medico;
use App\Models\Paciente;
use App\Models\VideoCall;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class VideoCallController extends Controller
{
    /**
     * Acceso a la videollamada desde el panel del médico.
     */
    public function unirseMedico(CitaPaciente $cita): Response
    {
        $medico = Medico::where('user_id', Auth::id())->first();

        abort_unless($medico && $cita->id_medico === $medico->id, 403, 'No autorizado');

        return $this->renderizarSala($cita, 'medico', $medico->nombre ?? 'Médico');
    }

    /**
     * Acceso a la videollamada desde el panel del paciente.
     */
    public function unirsePaciente(CitaPaciente $cita): Response
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        abort_unless($paciente && $cita->id_paciente === $paciente->id, 403, 'No autorizado');

        return $this->renderizarSala($cita, 'paciente', $paciente->nombre_paciente ?? 'Paciente');
    }

    /**
     * Crea (o recupera) la sala de Jitsi Meet de la cita y renderiza la
     * videollamada. Ambos roles comparten la misma sala.
     */
    protected function renderizarSala(CitaPaciente $cita, string $rol, string $nombreUsuario): Response
    {
        abort_unless($cita->tipo === 'VIDEOLLAMADA', 422, 'Esta cita no es de videollamada.');
        abort_unless($cita->fecha && $cita->estado_cita === 'CONFIRMADA', 422, 'La cita aún no está confirmada.');

        $videoCall = VideoCall::firstOrCreate(
            ['cita_id' => $cita->id],
            [
                'room_name' => 'tumedibot-cita-'.$cita->id.'-'.Str::lower(Str::random(6)),
            ],
        );

        if (! $videoCall->started_at) {
            $videoCall->update(['started_at' => now()]);
        }

        $enlace = 'https://meet.jit.si/'.$videoCall->room_name;

        if ($rol === 'medico') {
            $videoCall->update(['enlace_medico' => $enlace]);
        } else {
            $videoCall->update(['enlace_paciente' => $enlace]);
        }

        return Inertia::render('videollamada', [
            'rol' => $rol,
            'roomName' => $videoCall->room_name,
            'nombreUsuario' => $nombreUsuario,
            'cita' => [
                'id' => $cita->id,
                'fecha' => $cita->fecha?->toDateString(),
                'hora' => $cita->hora,
                'motivo' => $cita->motivo_consulta,
            ],
        ]);
    }
}
