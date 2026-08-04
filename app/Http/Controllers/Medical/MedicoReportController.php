<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medicos\StoreMedicalReportRequest;
use App\Mail\PedidoGeneradoMail;
use App\Models\Factura;
use App\Models\Pedido;
use App\Models\Plan;
use App\Models\ReportePago;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

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
            // 'cryptoPayRoute' => route('crypto'), // ajusta si existe
            // 'reportPaymentRoute' => route('reporte.pago', $user), // ajusta
            // 'medicalBalanceRoute' => route('medical.balance', $user), // ajusta
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
            'transaccion_id' => strtoupper(Str::random(5)),
            'total' => $planData->precio * 1.16, // con IVA
            'sub_total' => $planData->precio,
            'iva' => $planData->precio * 0.16,
            'factura_id' => $factura->id,
            'plan' => $planData->nombre,
            'ticket' => mt_rand(220000, 500000),
            'fecha_pedido' => $fechaPedido->toDateString(),
            'fecha_vence_pedido' => $fechaVence->toDateString(),
            'dias_duracion' => $planData->dias,
            'estado' => 'No Pagado',
        ]);

        // Enviar correo con el PDF del pedido al usuario
        if ($factura->user?->email) {
            Mail::to($factura->user->email)->send(new PedidoGeneradoMail($pedido));
        }

        return redirect()->route('medicos.report')
            ->with('success', 'Pedido generado. Realiza el pago y repórtalo.');
    }

    // Muestra el formulario (desde Inertia)
    public function create()
    {
        $user = Auth::user();
        $factura = Factura::where('user_id', $user->id)->firstOrFail();
        $pedido = Pedido::where('factura_id', $factura->id)
            ->where('estado', 'No Pagado')
            ->first();

        return Inertia::render('medicos/medical-report', [
            'userId' => $user->id,
            'pedidoId' => $pedido ? $pedido->id : 0,
            'facturaId' => $factura->id,
            'plan' => $factura->plan,
        ]);
    }

    // Procesa el reporte (endpoint POST)
    public function store(StoreMedicalReportRequest $request)
    {
        $data = $request->validated();
        $user = Auth::user();

        // Obtener factura y plan
        $factura = Factura::findOrFail($data['factura_id']);
        $plan = $factura->plan;

        // Calcular totales (según tu lógica original)
        $planValues = [
            'andromeda' => 10,
            'fenix' => 55,
            'pegasus' => 100,
        ];
        $base = $planValues[$plan] ?? 0;
        $iva = 16;
        $total = $base + ($base * $iva / 100);
        $subtotal = $base;
        $ingreso = $data['monto_pagado'];
        $egreso = $total;
        $credito = $ingreso - $egreso;

        // Generar datos de transacción
        $now = Carbon::now();
        $transaccion_id = strtoupper(Str::random(5));

        $reporte = ReportePago::create([
            'transaccion_id' => $transaccion_id,
            'banco_emisor' => $data['banco_emisor'],
            'banco_receptor' => $data['banco_receptor'],
            'nmro_referencia' => $data['nmro_referencia'],
            'monto_pagado' => $data['monto_pagado'],
            'metodo_transaccion' => $data['metodo_transaccion'],
            'total' => $total,
            'ingreso' => $ingreso,
            'egreso' => $egreso,
            'credito' => $credito,
            'fecha_transaccion' => $now->toDateString(),
            'fecha_vence_transaccion' => $now->addDays(31)->toDateString(),
            'pedidos_id' => $data['pedido_id'] ?? null,
            'estado' => 'procesando',
            'factura_id' => $data['factura_id'],
        ]);

        // (Opcional) Actualizar estado del pedido a "Pagado" si se desea automático
        // if ($data['pedido_id']) {
        //     Pedido::where('id', $data['pedido_id'])->update(['estado' => 'Pagado']);
        // }

        return response()->json([
            'message' => 'Reporte de pago registrado exitosamente.',
            'redirect' => route('medicos.report', $user->id),
        ]);
    }
}
