<?php
namespace App\Console\Commands;

use App\Models\Pedido;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Str;

class GenerateRenewalOrders extends Command
{
    protected $signature = 'pedidos:generar-renovaciones';
    protected $description = 'Genera pedidos de renovación para suscripciones próximas a vencer';

    public function handle()
    {
        $hoy = Carbon::now()->startOfDay();
        $limite = $hoy->copy()->addDays(7);

        Pedido::where('estado', 'Pagado')
            ->whereNotNull('fecha_aprobacion')
            ->where('fecha_vence_pedido', '>=', $hoy->toDateString())
            ->where('fecha_vence_pedido', '<=', $limite->toDateString())
            ->whereDoesntHave('factura.pedidos', function ($query) {
                $query->where('fecha_pedido', '>', \DB::raw('pedidos.fecha_pedido'));
            })
            ->chunk(100, function ($pedidos) {
                foreach ($pedidos as $pedido) {
                    $this->crearPedidoRenovacion($pedido);
                }
            });

        $this->info('Renovaciones generadas correctamente.');
    }

    private function crearPedidoRenovacion(Pedido $pedidoAnterior)
    {
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
