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
            ->greeting('¡Hola, '.($notifiable->nombre_paciente ?? '').'!')
            ->line('Tu médico ha asignado fecha y hora a tu cita.')
            ->line('Médico: '.$nombreMedico)
            ->line('Fecha: '.($this->cita->fecha?->format('d/m/Y') ?? '—'))
            ->line('Hora: '.($this->cita->hora ?? '—'))
            ->line('Motivo: '.($this->cita->motivo_consulta ?? '—'))
            ->line('Tipo: '.($this->cita->tipo ?? '—'))
            ->action('Ver mis citas', url('/paciente/mis-citas'))
            ->line('Si no puedes asistir, cancela o reprograma desde la app.');
    }
}
