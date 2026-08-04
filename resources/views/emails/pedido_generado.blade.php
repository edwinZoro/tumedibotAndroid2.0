<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedido #{{ $pedido->ticket }} - TuMediBot</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Arial, sans-serif;
            background: #f1f5f9;
            padding: 30px 16px;
            color: #0f172a;
        }
        .email-wrapper {
            max-width: 620px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 24px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.08);
            overflow: hidden;
            border: 1px solid #e2e8f0;
        }
        .email-header {
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            padding: 28px 32px;
            text-align: center;
        }
        .brand {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        .brand span { color: #bae6fd; }
        .email-body { padding: 32px 36px; }
        .greeting {
            font-size: 18px;
            font-weight: 700;
            color: #0f172a;
            margin-bottom: 14px;
        }
        .paragraph {
            font-size: 15px;
            line-height: 1.7;
            color: #334155;
            margin-bottom: 18px;
        }
        .paragraph strong { color: #0f172a; }
        .order-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #2563eb;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .order-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 15px;
        }
        .order-row .label {
            color: #64748b;
            font-weight: 500;
        }
        .order-row .value {
            font-weight: 700;
            color: #0f172a;
        }
        .order-row .value.amount { color: #2563eb; font-size: 19px; }
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 22px 0;
        }
        .cta {
            text-align: center;
            margin-top: 26px;
        }
        .cta a {
            display: inline-block;
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: #ffffff;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            padding: 13px 32px;
            border-radius: 100px;
            box-shadow: 0 6px 16px rgba(37,99,235,0.30);
        }
        .email-footer {
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
            padding: 20px 32px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            line-height: 1.6;
        }
        .email-footer strong { color: #2563eb; }
        .btn-download {
            display: inline-block;
            margin-top: 16px;
            border: 1px solid #bfdbfe;
            background: #eff6ff;
            color: #2563eb;
            text-decoration: none;
            font-weight: 600;
            font-size: 13px;
            padding: 10px 24px;
            border-radius: 100px;
        }
    </style>
</head>
<body>

<div class="email-wrapper">
    <div class="email-header">
        <div class="brand">TuMedi<span>Bot</span></div>
    </div>

    <div class="email-body">
        <div class="greeting">
            Hola {{ ucfirst($factura->nombre) }} {{ ucfirst($factura->apellido) }},
        </div>

        <p class="paragraph">
            ¡Esperamos te encuentres muy bien!
        </p>

        <p class="paragraph">
            Ha sido creado el pedido <strong>#{{ $pedido->ticket }}</strong>,
            para el día <strong>{{ $pedido->created_at->format('l, jS F Y') }}</strong>.
        </p>

        <p class="paragraph">
            ¿Hay algo en lo que podemos ayudarte? ¿Tienes dudas al respecto?
            <a href="mailto:soporte@tumedibot.com" style="color: #2563eb; font-weight: 600;">Puedes contactarnos aquí.</a>
        </p>

        <div class="order-card">
            <div class="order-row">
                <span class="label">Pedido</span>
                <span class="value">#{{ $pedido->ticket }}</span>
            </div>
            <div class="order-row">
                <span class="label">Plan</span>
                <span class="value">{{ ucfirst($pedido->plan) }}</span>
            </div>
            <div class="order-row">
                <span class="label">Monto</span>
                <span class="value amount">${{ number_format($pedido->total, 2) }}</span>
            </div>
        </div>

        <hr class="divider">

        <div class="cta">
            <a href="{{ url('/medicos/pagando_perfil_medico/' . ($user->id ?? '') . '/' . $pedido->id) }}">
                Ver PDF de mi pedido
            </a>
        </div>
    </div>

    <div class="email-footer">
        TuMediBot &bull; Todos los derechos reservados.<br>
        Este es un correo automático, por favor no respondas a este mensaje.
    </div>
</div>

</body>
</html>
