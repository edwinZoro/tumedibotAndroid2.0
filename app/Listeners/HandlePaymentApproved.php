<?php

namespace App\Listeners;

use App\Events\PaymentApproved;
use App\Mail\PedidoGeneradoMail;
use App\Models\Pedido;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class HandlePaymentApproved
{
    public function __construct()
    {
        //
    }

    public function handle(PaymentApproved $event)
    {
        $reporte = $event->reportePago;
        $pedido = Pedido::find($reporte->pedidos_id);
        if (! $pedido) {
            return;
        }

        $pedido->estado = 'Pagado';
        $pedido->fecha_aprobacion = Carbon::now()->toDateString();
        $pedido->save();

        $pendiente = Pedido::where('factura_id', $pedido->factura_id)
            ->where('estado', 'No Pagado')
            ->exists();
        if ($pendiente) {
            return;
        }

        $this->crearPedidoRenovacion($pedido);
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

        $email = $pedido->factura?->user?->email;
        if ($email) {
            Mail::to($email)->send(new PedidoGeneradoMail($pedido));
        }
    }
}
