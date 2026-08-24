<?php

namespace App\Console\Commands;

use App\Models\CitaPaciente;
use App\Notifications\RecordatorioCita;
use App\Services\WhatsAppService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarRecordatoriosCitas extends Command
{
    protected $signature = 'citas:enviar-recordatorios';

    protected $description = 'Envía recordatorios de citas por email, WhatsApp y notificación interna (3 días, 1 día y 3 horas antes)';

    public function handle(WhatsAppService $whatsapp): void
    {
        $this->enviarRecordatorios3Dias($whatsapp);
        $this->enviarRecordatorios1Dia($whatsapp);
        $this->enviarRecordatorios3Horas($whatsapp);
        $this->info('Recordatorios de citas procesados correctamente.');
    }

    private function enviarRecordatorios3Dias(WhatsAppService $whatsapp): void
    {
        $fechaLimite = Carbon::now()->addDays(3)->startOfDay();

        $citas = CitaPaciente::where('estado_cita', 'CONFIRMADA')
            ->whereNotNull('fecha')
            ->whereDate('fecha', $fechaLimite->toDateString())
            ->where('recordatorio_3d_enviado', false)
            ->with(['paciente', 'medico'])
            ->get();

        foreach ($citas as $cita) {
            $this->enviarRecordatorio($cita, '3d', $whatsapp);
            $cita->update(['recordatorio_3d_enviado' => true]);
        }

        if ($citas->isNotEmpty()) {
            $this->line("Recordatorios de 3 días enviados: {$citas->count()}");
        }
    }

    private function enviarRecordatorios1Dia(WhatsAppService $whatsapp): void
    {
        $fechaLimite = Carbon::now()->addDay()->startOfDay();

        $citas = CitaPaciente::where('estado_cita', 'CONFIRMADA')
            ->whereNotNull('fecha')
            ->whereDate('fecha', $fechaLimite->toDateString())
            ->where('recordatorio_1d_enviado', false)
            ->with(['paciente', 'medico'])
            ->get();

        foreach ($citas as $cita) {
            $this->enviarRecordatorio($cita, '1d', $whatsapp);
            $cita->update(['recordatorio_1d_enviado' => true]);
        }

        if ($citas->isNotEmpty()) {
            $this->line("Recordatorios de 1 día enviados: {$citas->count()}");
        }
    }

    private function enviarRecordatorios3Horas(WhatsAppService $whatsapp): void
    {
        $ahora = Carbon::now();
        $en3Horas = Carbon::now()->addHours(3);

        $citas = CitaPaciente::where('estado_cita', 'CONFIRMADA')
            ->whereNotNull('fecha')
            ->whereDate('fecha', $ahora->toDateString())
            ->whereNotNull('hora')
            ->where('recordatorio_3h_enviado', false)
            ->with(['paciente', 'medico'])
            ->get()
            ->filter(function (CitaPaciente $cita) use ($ahora, $en3Horas): bool {
                if (! $cita->hora) {
                    return false;
                }

                $fechaHoraCita = Carbon::createFromFormat(
                    'Y-m-d H:i',
                    $cita->fecha->format('Y-m-d').' '.$cita->hora
                );

                return $fechaHoraCita->between($ahora, $en3Horas);
            });

        foreach ($citas as $cita) {
            $this->enviarRecordatorio($cita, '3h', $whatsapp);
            $cita->update(['recordatorio_3h_enviado' => true]);
        }

        if ($citas->isNotEmpty()) {
            $this->line("Recordatorios de 3 horas enviados: {$citas->count()}");
        }
    }

    private function enviarRecordatorio(CitaPaciente $cita, string $tipo, WhatsAppService $whatsapp): void
    {
        $paciente = $cita->paciente;

        if (! $paciente) {
            Log::warning("Cita #{$cita->id}: sin paciente, recordatorio omitido.");

            return;
        }

        // Notificación interna (database) + email
        $paciente->notify(new RecordatorioCita($cita, $tipo));

        // WhatsApp
        $telefono = $paciente->tlf_paciente;

        if ($telefono) {
            $notificacion = new RecordatorioCita($cita, $tipo);
            $resultado = $notificacion->toWhatsApp($whatsapp, $telefono);

            if ($resultado['success'] ?? false) {
                $this->line("  WhatsApp enviado a paciente de cita #{$cita->id}");
            } else {
                $razon = $resultado['reason'] ?? ($resultado['error']['message'] ?? 'desconocido');
                $this->line("  WhatsApp no enviado (cita #{$cita->id}): {$razon}");
            }
        }

        $this->line("  Recordatorio {$tipo} enviado para cita #{$cita->id}");
    }
}
