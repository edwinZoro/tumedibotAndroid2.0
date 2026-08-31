<?php

namespace App\Notifications;

use App\Models\Receta;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RecetaCompartidaPaciente extends Notification
{
    use Queueable;

    public function __construct(
        public Receta $receta
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
            'receta_id' => $this->receta->id,
            'diagnostico' => $this->receta->diagnostico,
            'medico_nombre' => $this->nombreMedico(),
            'mensaje' => 'Tu médico te compartió una receta médica. Ya puedes consultarla desde tus citas.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Receta médica compartida · TuMediBot')
            ->view('emails.receta_compartida_paciente', [
                'receta' => $this->receta,
                'paciente_nombre' => $notifiable->nombre_paciente ?? '',
                'medico_nombre' => $this->nombreMedico() ?? 'tu médico',
            ]);
    }

    protected function nombreMedico(): ?string
    {
        $medico = $this->receta->medico;

        return $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : null;
    }
}
