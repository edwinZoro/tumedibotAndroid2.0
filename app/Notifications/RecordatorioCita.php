<?php

namespace App\Notifications;

use App\Models\CitaPaciente;
use App\Services\WhatsAppService;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class RecordatorioCita extends Notification
{
    use Queueable;

    public function __construct(
        public CitaPaciente $cita,
        public string $tipo
    ) {}

    public function via(object $notifiable): array
    {
        return ['database', 'mail'];
    }

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
            'recordatorio' => $this->tipo,
            'mensaje' => $this->getMensaje(),
        ];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $medico = $this->cita->medico;
        $nombreMedico = $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : 'tu médico';

        $horario = $this->getHorarioTexto();

        return (new MailMessage)
            ->subject($this->getSubject())
            ->view('emails.recordatorio_cita', [
                'paciente_nombre' => $notifiable->nombre_paciente ?? '',
                'medico_nombre' => $nombreMedico,
                'cita' => $this->cita,
                'horario' => $horario,
                'tipo_recordatorio' => $this->tipo,
                'mensaje' => $this->getMensaje(),
            ]);
    }

    public function toWhatsApp(WhatsAppService $whatsapp, string $telefono): array
    {
        $medico = $this->cita->medico;
        $nombreMedico = $medico
            ? trim(($medico->nombre ?? '').' '.($medico->apellido ?? ''))
            : 'tu médico';

        $fecha = $this->cita->fecha?->format('d/m/Y') ?? '—';
        $hora = $this->formatearHora($this->cita->hora);
        $tipo = $this->cita->tipo === 'VIDEOLLAMADA' ? 'Videollamada' : 'Consultorio';

        $mensaje = "TuMediBot - Recordatorio de cita\n\n";
        $mensaje .= "Hola, te recordamos tu cita medica.\n\n";
        $mensaje .= "Medico: {$nombreMedico}\n";
        $mensaje .= "Fecha: {$fecha}\n";
        $mensaje .= "Hora: {$hora}\n";
        $mensaje .= "Tipo: {$tipo}\n";
        if ($this->cita->motivo_consulta) {
            $mensaje .= "Motivo: {$this->cita->motivo_consulta}\n";
        }
        $mensaje .= "\n{$this->getMensaje()}";

        return $whatsapp->sendTextMessage($telefono, $mensaje);
    }

    private function getMensaje(): string
    {
        return match ($this->tipo) {
            '3d' => 'Tu cita es en 3 dias. No te olvides!',
            '1d' => 'Tu cita es manana. Te esperamos.',
            '3h' => 'Tu cita es en 3 horas. Preparate!',
            default => 'Recordatorio de cita medica.',
        };
    }

    private function getSubject(): string
    {
        return match ($this->tipo) {
            '3d' => 'Recordatorio: tu cita es en 3 dias - TuMediBot',
            '1d' => 'Recordatorio: tu cita es manana - TuMediBot',
            '3h' => 'Recordatorio: tu cita es en 3 horas - TuMediBot',
            default => 'Recordatorio de cita - TuMediBot',
        };
    }

    private function getHorarioTexto(): string
    {
        return match ($this->tipo) {
            '3d' => 'en 3 dias',
            '1d' => 'manana',
            '3h' => 'en 3 horas',
            default => 'proximamente',
        };
    }

    private function formatearHora(?string $hora): string
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
