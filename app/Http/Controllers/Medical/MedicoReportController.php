<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\ReportePago;
use App\Models\Factura;
use App\Models\Pedido;
use Inertia\Response;
use Inertia\Inertia;
use App\Models\Plan;
use Carbon\Carbon;


class MedicoReportController extends Controller
{
  public function index(Request $request): Response
  {
      $user = auth()->id();
      $factura = Factura::where('user_id', $user)->firstOrFail();
      $plan = $factura->plan;

      // Obtener pedidos de esta factura
      $pedidos = Pedido::where('factura_id', $factura->id)
                       ->orderBy('id', 'desc')
                       ->paginate(12, ['*'], 'pagination_pedidos');

      $reportes = ReportePago::where('factura_id', $factura->id)
                             ->orderBy('id', 'desc')
                             ->paginate(12, ['*'], 'pagination_reporte_pago');

      $reporte_b = ReportePago::where('factura_id', $factura->id)
                              ->orderBy('id', 'desc')
                              ->first();

      return Inertia::render('medicos/report_payment', [
          'userId' => $user,
          'factura' => [$factura],
          'pedi' => [
              'data' => $pedidos->items(),
              'current_page' => $pedidos->currentPage(),
              'last_page' => $pedidos->lastPage(),
          ],
          'reporte' => [
              'data' => $reportes->items(),
              'current_page' => $reportes->currentPage(),
              'last_page' => $reportes->lastPage(),
          ],
          'reporte_b' => $reporte_b,
          'plan_precio' => $factura->plan === 'andromeda' ? 25 : ($factura->plan === 'fenix' ? 135 : 270),
          'titulo_plan' => ucfirst($factura->plan),
          'ruta_pagar' => route('generar.pedido', ['user' => $user, 'plan' => $plan]),
          //'cryptoPayRoute' => route('crypto'), // ajusta si existe
          //'reportPaymentRoute' => route('reporte.pago', $user), // ajusta
          //'medicalBalanceRoute' => route('medical.balance', $user), // ajusta
      ]);
  }

     public function generarPedido($user, $plan)
     {
         // Validar que el plan exista
         $planData = Plan::where('nombre', $plan)->firstOrFail();

         // Obtener la factura del usuario
         $factura = Factura::where('user_id', $user)->firstOrFail();

         // Verificar si ya existe un pedido "No Pagado" para esta factura
         $pedidoExistente = Pedido::where('factura_id', $factura->id)
                                   ->where('estado', 'No Pagado')
                                   ->first();
         if ($pedidoExistente) {
             return back()->with('mensaje', 'Ya tienes un pedido pendiente de pago.');
         }

         // Generar nuevo pedido
         $fechaPedido = Carbon::now();
         $fechaVence = $fechaPedido->copy()->addDays(7); // 7 días para pagar

         $pedido = Pedido::create([
             'transaccion_id'    => strtoupper(Str::random(5)),
             'total'             => $planData->precio * 1.16, // con IVA
             'sub_total'         => $planData->precio,
             'iva'               => $planData->precio * 0.16,
             'factura_id'        => $factura->id,
             'plan'              => $planData->nombre,
             'ticket'            => mt_rand(220000, 500000),
             'fecha_pedido'      => $fechaPedido->toDateString(),
             'fecha_vence_pedido'=> $fechaVence->toDateString(),
             'dias_duracion'     => $planData->dias,
             'estado'            => 'No Pagado',
         ]);

         // (Opcional) Enviar correo de confirmación del pedido
         // event(new PedidoCreado($pedido));

         return redirect()->route('medicos.report')
                          ->with('success', 'Pedido generado. Realiza el pago y repórtalo.');
     }
}
