<?php

namespace App\Console\Commands;

use App\Models\Pedido;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SendRenewalReminders extends Command
{
    protected $signature = 'pedidos:enviar-recordatorios';

    protected $description = 'Envía recordatorios de pago 7, 3 y 1 día antes del vencimiento';

    public function handle()
    {
        $this->enviarRecordatorios(7, 'reminder_7d_sent');
        $this->enviarRecordatorios(3, 'reminder_3d_sent');
        $this->enviarRecordatorios(1, 'reminder_1d_sent');
        $this->info('Recordatorios enviados correctamente.');
    }

    private function enviarRecordatorios($dias, $flag)
    {
        $fechaLimite = Carbon::now()->addDays($dias)->startOfDay();

        Pedido::where('estado', 'No Pagado')
            ->whereDate('fecha_vence_pedido', $fechaLimite->toDateString())
            ->where($flag, false)
            ->chunk(100, function ($pedidos) use ($flag) {
                foreach ($pedidos as $pedido) {
                    // Aquí enviarías el correo con \Mail::to(...)->send(new RecordatorioPago($pedido));
                    $pedido->$flag = true;
                    $pedido->save();
                    $this->line("Recordatorio enviado para pedido #{$pedido->id}");
                }
            });
    }
}
