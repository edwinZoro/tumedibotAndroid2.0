<?php

namespace App\Notifications;

use App\Models\HistorialPaciente;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class HistorialCompartidoPaciente extends Notification
{
    use Queueable;

    public function __construct(
        public HistorialPaciente $historial
    ) {}

    /**
     * @return array<string>
     */
    public function via(object $notifiable): array
    {
        return $notifiable->email_paciente ? ['database', 'mail'] : ['database'];
    }

    /**
     * Almacena la notificación en la app (tabla notifications).
     *
     * @return array<string, mixed>
     */
    public function toDatabase(object $notifiable): array
    {
        return [
            'historial_id' => $this->historial->id,
            'diagnostico' => $this->historial->diagnostico,
            'medico_nombre' => $this->nombreMedico(),
            'mensaje' => 'Tu médico te compartió tu historial clínico de la consulta. Ya puedes ver el informe.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Historial clínico compartido · TuMediBot')
            ->view('emails.historial_compartido_paciente', [
                'historial' => $this->historial,
                'paciente_nombre' => $notifiable->nombre_paciente ?? '',
                'medico_nombre' => $this->nombreMedico() ?? 'tu médico',
            ]);
    }

    protected function nombreMedico(): ?string
    {
        $medico = $this->historial->citaPaciente?->medico;

        return $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : null;
    }
}
