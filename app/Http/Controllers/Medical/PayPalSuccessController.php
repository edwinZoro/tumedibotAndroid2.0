<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Models\Pedido;
use App\Models\ReportePago;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PayPalSuccessController extends Controller
{
    /**
     * Maneja la redirección exitosa desde PayPal.
     * Esta ruta está fuertemente protegida para permitir acceso solo
     * a transacciones y usuarios autenticados válidos.
     */
    public function handleSuccess(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('login');
        }

        // Obtener la factura médica del usuario
        $factura = Factura::where('user_id', $user->id)->first();

        // Extraer parámetros enviados por PayPal en la URL de retorno
        $subscriptionId = $request->query('subscription_id')
            ?? $request->query('ba_token')
            ?? $request->query('token')
            ?? $request->query('tx')
            ?? $request->query('paymentId');

        $isExplicitSuccess = $request->has('success')
            || $request->has('subscription_id')
            || $request->has('token')
            || $request->has('tx')
            || $request->has('paymentId');

        // SEGURIDAD REFORZADA:
        // Si no existe factura para el usuario o no se recibe ningún parámetro de transacción de PayPal, se rechaza el acceso.
        if (! $factura || ! $isExplicitSuccess) {
            return redirect()->route('medicos.report')
                ->with('error', 'Acceso no autorizado: No se detectó ninguna transacción activa de PayPal.');
        }

        // Identificador único de transacción
        $transactionId = $subscriptionId ? strtoupper($subscriptionId) : 'PAYPAL-'.strtoupper(Str::random(8));

        // Actualizar el estado del pedido "No Pagado" más reciente a "Pagado"
        $pedido = Pedido::where('factura_id', $factura->id)
            ->where('estado', 'No Pagado')
            ->orderBy('id', 'desc')
            ->first();

        if ($pedido) {
            $pedido->update([
                'estado' => 'Pagado',
                'transaccion_id' => $transactionId,
            ]);
        }

        // Registrar automáticamente la transacción en ReportePago si no se ha registrado aún
        $reporteExistente = ReportePago::where('transaccion_id', $transactionId)->first();
        if (! $reporteExistente && $factura) {
            $planPrices = [
                'andromeda' => 25,
                'fenix' => 135,
                'pegasus' => 270,
            ];
            $base = $planPrices[$factura->plan] ?? 25;
            $total = $base * 1.16;

            ReportePago::create([
                'transaccion_id' => $transactionId,
                'banco_emisor' => 'PayPal Auto-Return',
                'banco_receptor' => 'PayPal Business',
                'nmro_referencia' => $transactionId,
                'monto_pagado' => (string) number_format($total, 2, '.', ''),
                'metodo_transaccion' => 'paypal',
                'total' => $total,
                'ingreso' => $total,
                'egreso' => 0,
                'credito' => $total,
                'fecha_transaccion' => Carbon::now()->toDateString(),
                'fecha_vence_transaccion' => Carbon::now()->addDays(30)->toDateString(),
                'pedidos_id' => $pedido?->id,
                'estado' => 'aprobado',
                'factura_id' => $factura->id,
            ]);
        }

        // Cargar datos actualizados para renderizar en la vista principal
        $pedidos = Pedido::where('factura_id', $factura->id)
            ->orderBy('id', 'desc')
            ->paginate(12, ['*'], 'pagination_pedidos');

        $reportes = ReportePago::where('factura_id', $factura->id)
            ->orderBy('id', 'desc')
            ->paginate(12, ['*'], 'pagination_reporte_pago');

        $reporte_b = ReportePago::where('factura_id', $factura->id)
            ->orderBy('id', 'desc')
            ->first();

        return Inertia::render('medicos/paypal_success', [
            'userId' => $user->id,
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
            'ruta_pagar' => route('generar.pedido', ['user' => $user->id, 'plan' => $factura->plan]),
            'transactionDetails' => [
                'subscriptionId' => $transactionId,
                'plan' => ucfirst($factura->plan),
                'monto' => $factura->plan === 'andromeda' ? '25.00' : ($factura->plan === 'fenix' ? '135.00' : '270.00'),
                'fecha' => Carbon::now()->format('d/m/Y H:i'),
                'email' => $user->email,
            ],
        ]);
    }
}
