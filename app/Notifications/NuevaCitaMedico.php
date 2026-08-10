<?php

namespace App\Notifications;

use App\Models\CitaPaciente;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NuevaCitaMedico extends Notification
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
     * Almacena la notificación en la app (tabla notifications).
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'cita_id' => $this->cita->id,
            'tipo' => $this->cita->tipo,
            'fecha' => $this->cita->fecha?->toDateString(),
            'hora' => $this->cita->hora,
            'motivo' => $this->cita->motivo_consulta,
            'paciente_nombre' => $this->cita->paciente?->nombre_paciente,
            'mensaje' => 'Un paciente solicitó una cita. Asigna fecha y hora en tu agenda.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $paciente = $this->cita->paciente;

        return (new MailMessage)
            ->subject('Nueva solicitud de cita · TuMediBot')
            ->view('emails.nueva_cita_medico', [
                'cita' => $this->cita,
                'medico_nombre' => trim(($notifiable->nombre ?? '').' '.($notifiable->apellido ?? '')),
                'paciente_nombre' => $paciente?->nombre_paciente ?? '—',
                'hora' => $this->cita->hora
                    ? $this->formatearHora($this->cita->hora)
                    : 'Pendiente de agenda por ti',
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
