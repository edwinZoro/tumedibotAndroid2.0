<?php

namespace App\Notifications;

use App\Models\Archivo;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArchivoCompartidoMedico extends Notification
{
    use Queueable;

    public function __construct(
        public Archivo $archivo
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
            'archivo_id' => $this->archivo->id,
            'nombre_archivo' => $this->archivo->nombre_archivo,
            'tipo_archivo' => $this->archivo->tipo,
            'paciente_nombre' => $this->archivo->paciente?->nombre_paciente,
            'mensaje' => 'Un paciente te compartió un archivo desde su bóveda personal.',
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Archivo compartido · TuMediBot')
            ->view('emails.archivo_compartido_medico', [
                'archivo' => $this->archivo,
                'medico_nombre' => trim(($notifiable->nombre ?? '').' '.($notifiable->apellido ?? '')),
                'paciente_nombre' => $this->archivo->paciente?->nombre_paciente ?? '—',
            ]);
    }
}
