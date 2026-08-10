<?php

namespace App\Notifications;

use App\Models\CitaPaciente;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class CitaAgendadaPaciente extends Notification
{
    use Queueable;

    public function __construct(
        public CitaPaciente $cita
    ) {}

    /**
     * @return array<string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

    /**
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        $medico = $this->cita->medico;

        return [
            'cita_id' => $this->cita->id,
            'tipo' => $this->cita->tipo,
            'fecha' => $this->cita->fecha?->toDateString(),
            'hora' => $this->cita->hora,
            'motivo' => $this->cita->motivo_consulta,
            'medico_nombre' => $medico
                ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
                : null,
            'mensaje' => 'Tu médico asignó fecha y hora a tu cita.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $medico = $this->cita->medico;
        $nombreMedico = $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : 'tu médico';

        return (new MailMessage)
            ->subject('Tu cita fue agendada · TuMediBot')
            ->view('emails.cita_agendada_paciente', [
                'cita' => $this->cita,
                'paciente_nombre' => $notifiable->nombre_paciente ?? '',
                'medico_nombre' => $nombreMedico,
                'hora' => $this->formatearHora($this->cita->hora),
                'tipo' => $this->cita->tipo === 'VIDEOLLAMADA' ? 'Videollamada' : 'Consulta en consultorio',
            ]);
    }

    /**
     * Convierte la hora "H:i" a formato 12 horas (ej: 02:30 PM).
     */
    protected function formatearHora(?string $hora): string
    {
        if (! $hora) {
            return '—';
        }

        $partes = explode(':', $hora);

        if (count($partes) < 2 || ! is_numeric($partes[0])) {
            return $hora;
        }

        $h = (int) $partes[0];
        $m = $partes[1];
        $periodo = $h >= 12 ? 'PM' : 'AM';
        $h12 = $h % 12 === 0 ? 12 : $h % 12;

        return $h12.':'.$m.' '.$periodo;
    }
}
