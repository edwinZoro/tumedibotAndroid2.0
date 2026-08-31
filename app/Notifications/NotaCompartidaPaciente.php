<?php

namespace App\Notifications;

use App\Models\Nota;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NotaCompartidaPaciente extends Notification
{
    use Queueable;

    public function __construct(
        public Nota $nota
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
            'nota_id' => $this->nota->id,
            'medico_nombre' => $this->nombreMedico(),
            'mensaje' => 'Tu médico te compartió una nota de tu consulta.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Nota de consulta compartida · TuMediBot')
            ->view('emails.nota_compartida_paciente', [
                'nota' => $this->nota,
                'paciente_nombre' => $notifiable->nombre_paciente ?? '',
                'medico_nombre' => $this->nombreMedico() ?? 'tu médico',
            ]);
    }

    protected function nombreMedico(): ?string
    {
        $medico = $this->nota->medico;

        return $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : null;
    }
}
