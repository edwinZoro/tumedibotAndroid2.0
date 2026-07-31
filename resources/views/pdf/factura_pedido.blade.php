<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Factura - TuMediBot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f1f5f9;
            padding: 30px 20px;
            color: #0f172a;
        }
        .invoice-wrapper {
            max-width: 820px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 28px;
            box-shadow: 0 25px 60px rgba(0,0,0,0.10);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }

        /* ─── HEADER con degradado azul moderno ─── */
        .invoice-header {
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            padding: 24px 32px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 12px 20px;
            border-bottom: 3px solid #60a5fa;
        }
        .header-left {
            display: flex;
            align-items: center;
        }
        .logo-svg {
            width: 44px;
            height: 44px;
            filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
        }
        .brand-text {
            font-size: 24px;
            font-weight: 800;
            color: black;
            letter-spacing: -0.5px;
            text-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }
        .brand-text span {
            color: #60a5fa;
        }

        .header-center {
            text-align: center;
            background: rgba(255,255,255,0.18);
            backdrop-filter: blur(6px);
            padding: 8px 24px;
            border-radius: 100px;
            border: 1px solid rgba(255,255,255,0.30);
            box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }
        .estado-badge {
            font-weight: 700;
            font-size: 16px;
            letter-spacing: 0.5px;
            padding: 5px 15px;
            border-radius: 20px;
            text-transform: uppercase;
            color: black;
        }
        .estado-badge.pagado { color: #6ee7b7; }
        .estado-badge.no-pagado { color: #fca5a5; }

        .header-right {
            text-align: right;
            color: rgba(255,255,255,0.85);
            font-size: 14px;
            line-height: 1.5;
        }
        .ticket-number {
            font-size: 17px;
            font-weight: 700;
            color: black;
            letter-spacing: 0.5px;
        }
        .fecha-emision {
            margin-top: 2px;
            font-size: 13px;
            opacity: 0.9;
        }

        /* ─── CUERPO ─── */
        .invoice-body {
            padding: 32px 35px 28px;
        }

        /* Sección cliente */
        .client-section {
            background: #f8fafc;
            border-radius: 18px;
            padding: 20px 24px;
            margin-bottom: 28px;
            border-left: 5px solid #60a5fa;
            box-shadow: inset 0 1px 4px rgba(0,0,0,0.02);
        }
        .client-section .label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .client-name {
            font-size: 20px;
            font-weight: 700;
            color: #0f172a;
        }
        .client-detail {
            font-size: 14px;
            color: #334155;
            margin-top: 4px;
        }
        .client-detail strong {
            color: #0f172a;
        }
        .plan-tag {
            display: inline-block;
            margin-top: 10px;
            background: linear-gradient(135deg, #3b82f6, #0ea5e9);
            color: #64748b;
            font-weight: 700;
            font-size: 13px;
            padding: 4px 18px;
            border-radius: 100px;
            letter-spacing: 0.4px;
            box-shadow: 0 4px 10px rgba(59,130,246,0.25);
        }

        /* Tabla de productos */
        .section-title {
            font-size: 17px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 14px;
        }
        .products-table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0,0,0,0.04);
        }
        .products-table th {
            background: #f1f5f9;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.6px;
            color: #475569;
            padding: 12px 18px;
            text-align: left;
            border-bottom: 2px solid #e2e8f0;
        }
        .products-table td {
            padding: 14px 18px;
            border-bottom: 1px solid #eef2f6;
            font-size: 14px;
            background: white;
        }
        .products-table tr:last-child td {
            border-bottom: none;
        }
        .product-desc {
            font-weight: 500;
            color: #0f172a;
        }
        .product-desc small {
            display: block;
            font-weight: 400;
            color: #64748b;
            font-size: 12px;
            margin-top: 4px;
            line-height: 1.4;
        }
        .product-price {
            font-weight: 700;
            color: #0f172a;
            text-align: right;
        }

        /* Totales */
        .totals-box {
            margin-top: 22px;
            background: #f8fafc;
            border-radius: 18px;
            padding: 18px 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 2px 6px rgba(0,0,0,0.02);
        }
        .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 14px;
            color: #334155;
        }
        .totals-row.total {
            border-top: 2px solid #cbd5e1;
            margin-top: 8px;
            padding-top: 14px;
            font-size: 19px;
            font-weight: 800;
            color: #0f172a;
        }
        .totals-row .label { font-weight: 500; }
        .totals-row .value { font-weight: 600; }
        .totals-row.total .value { color: #2563eb; }

        .tax-note {
            margin-top: 10px;
            font-size: 12px;
            color: #94a3b8;
        }

        /* Información de pago */
        .payment-info {
            margin-top: 28px;
            border: 1px solid #e2e8f0;
            border-radius: 18px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.02);
        }
        .payment-info .title {
            background: #f1f5f9;
            padding: 12px 22px;
            font-weight: 700;
            font-size: 14px;
            color: #0f172a;
            border-bottom: 1px solid #e2e8f0;
        }
        .payment-info table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        .payment-info table th {
            background: #fafcff;
            padding: 10px 18px;
            text-align: left;
            font-weight: 600;
            color: #475569;
            border-bottom: 1px solid #e2e8f0;
        }
        .payment-info table td {
            padding: 10px 18px;
            border-bottom: 1px solid #f1f5f9;
            color: #1e293b;
        }
        .payment-info table tr:last-child td {
            border-bottom: none;
        }

        /* Footer */
        .invoice-footer {
            margin-top: 32px;
            padding-top: 18px;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
        }
        .invoice-footer strong {
            color: #2563eb;
        }

        /* ─── Responsive ─── */
        @media (max-width: 600px) {
            .invoice-header {
                flex-direction: column;
                align-items: stretch;
                text-align: center;
            }
            .header-left { justify-content: center; }
            .header-right { text-align: center; }
            .client-section { padding: 16px; }
            .products-table th, .products-table td { padding: 10px 12px; }
        }
    </style>
</head>
<body>

<div class="invoice-wrapper">

    <!-- ═══ HEADER ═══ -->
    <div class="invoice-header">
        <div class="header-left">
            <!-- SVG del logo (corazón) -->
            <svg class="logo-svg" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="black">
                <path d="M228.3 469.1L47.6 300.4c-4.2-3.9-8.2-8.1-11.9-12.4h87c22.6 0 43-13.6 51.7-34.5l10.5-25.2 49.3 109.5c3.8 8.5 12.1 14 21.4 14.1s17.8-5 22-13.3L320 253.7l1.7 3.4c9.5 19 28.9 31 50.1 31H476.3c-3.7 4.3-7.7 8.5-11.9 12.4L283.7 469.1c-7.5 7-17.4 10.9-27.7 10.9s-20.2-3.9-27.7-10.9zM503.7 240h-132c-3 0-5.8-1.7-7.2-4.4l-23.2-46.3c-4.1-8.1-12.4-13.3-21.5-13.3s-17.4 5.1-21.5 13.3l-41.4 82.8L205.9 158.2c-3.9-8.7-12.7-14.3-22.2-14.1s-18.1 5.9-21.8 14.8l-31.8 76.3c-1.2 3-4.2 4.9-7.4 4.9H16c-2.6 0-5 .4-7.3 1.1C3 225.2 0 208.2 0 190.9v-5.8c0-69.9 50.5-129.5 119.4-141C165 36.5 211.4 51.4 244 84l12 12 12-12c32.6-32.6 79-47.5 124.6-39.9C461.5 55.6 512 115.2 512 185.1v5.8c0 16.9-2.8 33.5-8.3 49.1z"/>
            </svg>
            <div class="brand-text">TuMedi<span>Bot</span></div>
        </div>

        <div class="header-center">
            <span class="estado-badge {{ $pedido->estado === 'No Pagado' ? 'no-pagado' : 'pagado' }}">
                {{ $pedido->estado }}
            </span>
        </div>

        <div class="header-right">
            <div class="ticket-number">Ticket Nº {{ $pedido->ticket }}</div>
            <div class="fecha-emision">{{ now()->format('d/m/Y') }}</div>
        </div>
    </div>

    <!-- ═══ BODY ═══ -->
    <div class="invoice-body">

        <!-- Cliente -->
        @if($factura)
        <div class="client-section">
            <div class="label">Facturado a</div>
            <div class="client-name">{{ ucfirst($factura->nombre) }} {{ ucfirst($factura->apellido) }}</div>
            <div class="client-detail">
                {{ $factura->direccion }},
                {{ $factura->ciudad->name ?? $factura->ciudad }},
                {{ $factura->estado->name ?? $factura->estado }},
                {{ $factura->codigo_postal }}
            </div>
            <div class="client-detail">
                <strong>Identificación:</strong> {{ $factura->ci_rif }} &nbsp;|&nbsp;
                <strong>Teléfono:</strong> {{ $factura->celular }}
            </div>
            <div class="plan-tag">Plan {{ strtoupper($factura->plan) }}</div>
        </div>
        @endif

        <!-- Detalle de productos -->
        <div class="section-title">Detalle de la transacción</div>
        <table class="products-table">
            <thead>
                <tr>
                    <th>Descripción</th>
                    <th style="text-align:right;">Importe</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td class="product-desc">
                        Plan {{ ucfirst($pedido->plan) }}
                        <small>
                            @php
                                $descripciones = [
                                    'andromeda' => 'Ideal para empezar: incluye perfil médico, listado en búsquedas, calendario de citas y soporte básico.',
                                    'fenix' => 'Para profesionales consolidados: todas las herramientas de Andromeda más prioridad en listados y soporte prioritario.',
                                    'pegasus' => 'Máxima visibilidad: incluye todas las características, promoción destacada y soporte VIP.'
                                ];
                                $planKey = strtolower($pedido->plan);
                                echo $descripciones[$planKey] ?? 'Acceso completo a todas las herramientas para médicos.';
                            @endphp
                        </small>
                    </td>
                    <td class="product-price">${{ number_format($pedido->total, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <!-- Totales -->
        <div class="totals-box">
            <div class="totals-row">
                <span class="label">Sub Total</span>
                <span class="value">${{ number_format($pedido->sub_total, 2) }}</span>
            </div>
            <div class="totals-row">
                <span class="label">16.00% IVA</span>
                <span class="value">${{ number_format($pedido->iva, 2) }}</span>
            </div>
            <div class="totals-row total">
                <span class="label">Total</span>
                <span class="value">${{ number_format($pedido->total, 2) }}</span>
            </div>
        </div>

        <div class="tax-note">* Producto/Servicio sujeto a impuesto</div>

        <!-- Información de pago -->
        @if(isset($reporte) && $reporte)
        <div class="payment-info">
            <div class="title">Información del pago</div>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Método</th>
                    <th>ID Transacción</th>
                    <th>Monto</th>
                </tr>
                <tr>
                    <td>{{ \Carbon\Carbon::parse($reporte->fecha_transaccion)->format('d/m/Y') ?? 'N/A' }}</td>
                    <td>{{ $reporte->metodo_transaccion ?? 'N/A' }}</td>
                    <td>{{ $reporte->transaccion_id ?? 'N/A' }}</td>
                    <td><strong>${{ number_format($reporte->monto_pagado ?? 0, 2) }}</strong></td>
                </tr>
            </table>
        </div>
        @endif

        <!-- Footer -->
        <div class="invoice-footer">
            Factura generada el {{ now()->format('d/m/Y \a \l\a\s H:i') }} &bull;
            <strong>TuMediBot</strong> &bull; Todos los derechos reservados.
        </div>

    </div>
</div>

</body>
</html>
