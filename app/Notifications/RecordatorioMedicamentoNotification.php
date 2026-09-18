<?php

namespace App\Notifications;

use App\Models\RecordatorioMedicamento;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RecordatorioMedicamentoNotification extends Notification
{
    use Queueable;

    public function __construct(
        public RecordatorioMedicamento $recordatorio,
        public string $horaDosis
    ) {}

    public function via(object $notifiable): array
    {
        $channels = ['database'];

        if ($this->recordatorio->email_recordatorio) {
            $channels[] = 'mail';
        }

        return $channels;
    }

    public function toDatabase(object $notifiable): array
    {
        return [
            'recordatorio_id' => $this->recordatorio->id,
            'medicamento' => $this->recordatorio->nombre_medicamento,
            'presentacion' => $this->recordatorio->presentacion,
            'dosis' => $this->recordatorio->dosis,
            'hora_dosis' => $this->horaDosis,
            'notas' => $this->recordatorio->notas,
            'tipo' => 'medicamento',
            'mensaje' => "💊 Es hora de tomar tu medicamento: {$this->recordatorio->nombre_medicamento} ({$this->recordatorio->dosis}).",
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $nombreMedicamento = $this->recordatorio->nombre_medicamento;
        $dosis = $this->recordatorio->dosis;

        return (new MailMessage)
            ->subject("💊 Recordatorio: Toma tu medicamento {$nombreMedicamento} - TuMediBot")
            ->view('emails.recordatorio_medicamento', [
                'paciente_nombre' => $notifiable->nombre_paciente ?? 'Paciente',
                'recordatorio' => $this->recordatorio,
                'hora_dosis' => $this->horaDosis,
                'medicamento_nombre' => $nombreMedicamento,
                'dosis' => $dosis,
            ]);
    }
}
