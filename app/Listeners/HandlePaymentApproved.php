<?php

namespace App\Listeners;

use App\Events\PaymentApproved;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class HandlePaymentApproved
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
     public function handle(PaymentApproved $event)
     {
         $reporte = $event->reportePago;
         $pedido = Pedido::find($reporte->pedidos_id);
         if (!$pedido) return;

         $pedido->estado = 'Pagado';
         $pedido->fecha_aprobacion = Carbon::now()->toDateString();
         $pedido->save();

         $diasRestantes = Carbon::parse($pedido->fecha_vence_pedido)->diffInDays(now());
         if ($diasRestantes <= 7) {
             $this->crearPedidoRenovacion($pedido);
         }
     }

     private function crearPedidoRenovacion(Pedido $pedidoAnterior)
     {
         // Misma lógica que en el comando
         $fechaBase = Carbon::parse($pedidoAnterior->fecha_aprobacion);
         $nuevaFechaVencimiento = $fechaBase->copy()->addDays($pedidoAnterior->dias_duracion);

         Pedido::create([
             'transaccion_id'    => strtoupper(Str::random(5)),
             'total'             => $pedidoAnterior->total,
             'sub_total'         => $pedidoAnterior->sub_total,
             'iva'               => $pedidoAnterior->iva,
             'factura_id'        => $pedidoAnterior->factura_id,
             'plan'              => $pedidoAnterior->plan,
             'ticket'            => mt_rand(220000, 500000),
             'fecha_pedido'      => Carbon::now()->toDateString(),
             'fecha_vence_pedido'=> $nuevaFechaVencimiento->toDateString(),
             'dias_duracion'     => $pedidoAnterior->dias_duracion,
             'estado'            => 'No Pagado',
         ]);
     }
}
