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
        $fecha = $this->cita->fecha?->format('d/m/Y') ?? 'Pendiente de agenda por ti';
        $hora = $this->cita->hora ?? 'Pendiente de agenda por ti';

        return (new MailMessage)
            ->subject('Nueva solicitud de cita · TuMediBot')
            ->greeting('¡Hola, Dr. '.($notifiable->nombre ?? '').'!')
            ->line('Un paciente ha solicitado una cita contigo.')
            ->line('Paciente: '.($paciente->nombre_paciente ?? '—'))
            ->line('Fecha: '.$fecha)
            ->line('Hora: '.$hora)
            ->line('Motivo: '.($this->cita->motivo_consulta ?? '—'))
            ->line('Tipo: '.($this->cita->tipo ?? '—'))
            ->action('Ir a TuMediBot', url('/ListadoDeMedicosDeLatinoamericaTumedibot'))
            ->line('Entra a tu agenda de citas para asignar fecha y hora.');
    }
}
