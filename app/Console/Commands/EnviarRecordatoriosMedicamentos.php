<?php

namespace App\Console\Commands;

use App\Models\RecordatorioMedicamento;
use App\Models\RecordatorioMedicamentoLog;
use App\Notifications\RecordatorioMedicamentoNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class EnviarRecordatoriosMedicamentos extends Command
{
    protected $signature = 'medicamentos:enviar-recordatorios';

    protected $description = 'Envía recordatorios de medicamentos programados por email y notificación in-app';

    public function handle(): void
    {
        $now = Carbon::now();
        $hoyDate = $now->toDateString();
        $diaSemanaActual = mb_strtolower($now->locale('es')->isoFormat('dddd')); // e.g. "lunes", "martes"...

        $recordatorios = RecordatorioMedicamento::where('activo', true)
            ->where('fecha_inicio', '<=', $hoyDate)
            ->where(function ($q) use ($hoyDate) {
                $q->whereNull('fecha_fin')
                  ->orWhere('fecha_fin', '>=', $hoyDate);
            })
            ->with(['paciente', 'medicamento'])
            ->get();

        $enviados = 0;

        foreach ($recordatorios as $rec) {
            $paciente = $rec->paciente;
            if (! $paciente) {
                continue;
            }

            // Filtrar por día de la semana si aplica
            if (! empty($rec->dias_semana) && is_array($rec->dias_semana)) {
                $diasNormalizados = array_map('mb_strtolower', $rec->dias_semana);
                if (! in_array($diaSemanaActual, $diasNormalizados, true)) {
                    continue;
                }
            }

            // Calcular horas de dosis del día
            $intervalo = (int) $rec->intervalo_horas;
            if ($intervalo <= 0) {
                $intervalo = 24;
            }

            $horaInicioCarbon = Carbon::createFromTimeString($rec->hora_inicio);
            $horasDosis = [];

            // Generar horas de dosis en un ciclo de 24 horas a partir de hora_inicio
            for ($h = 0; $h < 24; $h += $intervalo) {
                $timeDosis = $horaInicioCarbon->copy()->addHours($h);
                $horasDosis[] = $timeDosis->format('H:i');
            }

            // Buscar si alguna hora de dosis coincide con la hora actual (dentro de una ventana de ±35 minutos)
            $horaActual = $now->format('H:i');
            $minutosActuales = (int)$now->format('H') * 60 + (int)$now->format('i');

            foreach ($horasDosis as $hd) {
                $partesHd = explode(':', $hd);
                $minutosHd = (int)$partesHd[0] * 60 + (int)$partesHd[1];

                // Coincidencia dentro del rango de tolerancias (ej: -5 min a +30 min)
                $diferencia = $minutosActuales - $minutosHd;

                if ($diferencia >= -5 && $diferencia <= 35) {
                    // Verificar si ya se envió log para esta dosis en la ventana de tiempo de hoy
                    $logExiste = RecordatorioMedicamentoLog::where('recordatorio_id', $rec->id)
                        ->where('hora_dosis', $hd)
                        ->whereDate('enviado_en', $hoyDate)
                        ->exists();

                    if (! $logExiste) {
                        // Formatear hora dosis am/pm para el mensaje
                        $horaFormateada = Carbon::createFromTimeString($hd)->format('g:i A');

                        // Enviar notificación (email + database)
                        $paciente->notify(new RecordatorioMedicamentoNotification($rec, $horaFormateada));

                        // Crear log
                        RecordatorioMedicamentoLog::create([
                            'recordatorio_id' => $rec->id,
                            'enviado_en' => $now,
                            'email_enviado' => (bool)$rec->email_recordatorio,
                            'notif_interna' => true,
                            'hora_dosis' => $hd,
                        ]);

                        $enviados++;
                        $this->line("  Recordatorio enviado: {$rec->nombre_medicamento} para {$paciente->nombre_paciente} (Dosis {$horaFormateada})");
                    }
                }
            }
        }

        $this->info("Proceso completado. Recordatorios de medicamentos enviados: {$enviados}");
    }
}
