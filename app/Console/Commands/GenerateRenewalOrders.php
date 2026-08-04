<?php

namespace App\Console\Commands;

use App\Mail\PedidoGeneradoMail;
use App\Models\Pedido;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class GenerateRenewalOrders extends Command
{
    protected $signature = 'pedidos:generar-renovaciones';

    protected $description = 'Genera pedidos de renovación "No Pagado" cuando el pedido anterior está "Pagado" y su ciclo de facturación se cumplió';

    public function handle()
    {
        $hoy = Carbon::now()->startOfDay();

        Pedido::chunk(100, function ($pedidos) use ($hoy) {
            foreach ($pedidos as $pedido) {
                if ($pedido->estado !== 'Pagado') {
                    continue;
                }

                $factura = $pedido->factura;
                if (! $factura) {
                    continue;
                }

                $ultimoPedido = Pedido::where('factura_id', $factura->id)
                    ->orderBy('id', 'desc')
                    ->first();
                if (! $ultimoPedido || $ultimoPedido->id !== $pedido->id) {
                    continue;
                }

                $pendiente = Pedido::where('factura_id', $factura->id)
                    ->where('estado', 'No Pagado')
                    ->exists();
                if ($pendiente) {
                    continue;
                }

                $fechaBase = Carbon::parse($pedido->fecha_aprobacion ?? $pedido->fecha_pedido)->startOfDay();
                $diasDuracion = $pedido->dias_duracion ?: 30;

                if ($hoy->lt($fechaBase->copy()->addDays($diasDuracion))) {
                    continue;
                }

                $this->crearPedidoRenovacion($pedido);
                $this->info("Renovación generada para factura #{$factura->id} (pedido anterior #{$pedido->id}) - Plan: {$pedido->plan}");
            }
        });

        $this->info('Verificación de renovaciones completada.');
    }

    private function crearPedidoRenovacion(Pedido $pedidoAnterior)
    {
        $nuevaFechaVencimiento = Carbon::now()->startOfDay()->copy()->addDays(7);

        $pedido = Pedido::create([
            'transaccion_id' => strtoupper(Str::random(5)),
            'total' => $pedidoAnterior->total,
            'sub_total' => $pedidoAnterior->sub_total,
            'iva' => $pedidoAnterior->iva,
            'factura_id' => $pedidoAnterior->factura_id,
            'plan' => $pedidoAnterior->plan,
            'ticket' => mt_rand(220000, 500000),
            'fecha_pedido' => Carbon::now()->toDateString(),
            'fecha_vence_pedido' => $nuevaFechaVencimiento->toDateString(),
            'dias_duracion' => $pedidoAnterior->dias_duracion,
            'estado' => 'No Pagado',
        ]);

        $this->enviarCorreo($pedido);
    }

    private function enviarCorreo(Pedido $pedido)
    {
        $email = $pedido->factura?->user?->email;
        if (! $email) {
            return;
        }

        try {
            Mail::to($email)->send(new PedidoGeneradoMail($pedido));
        } catch (\Throwable $e) {
            $this->error("No se pudo enviar el correo del pedido #{$pedido->id}: {$e->getMessage()}");
        }
    }
}
