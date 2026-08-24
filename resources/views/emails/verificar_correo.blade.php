<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verifica tu correo - TuMediBot</title>
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
            text-align: right;
            padding-left: 16px;
        }
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
    </style>
</head>
<body>

<div class="email-wrapper">
    <div class="email-header">
        <div class="brand">TuMedi<span>Bot</span></div>
    </div>

    <div class="email-body">
        <div class="greeting">
            ¡Hola, {{ $user->name }}!
        </div>

        <p class="paragraph">
            Gracias por registrarte en <strong>TuMediBot</strong>. Para activar tu cuenta,
            confirma que este es tu correo electrónico haciendo clic en el botón de abajo.
        </p>

        <div class="order-card">
            <div class="order-row">
                <span class="label">Cuenta</span>
                <span class="value">{{ $user->email }}</span>
            </div>
            <div class="order-row">
                <span class="label">Validez del enlace</span>
                <span class="value">60 minutos</span>
            </div>
        </div>

        <hr class="divider">

        <div class="cta">
            <a href="{{ $url }}">
                Verificar mi correo
            </a>
        </div>

        <p class="paragraph">
            Si no creaste una cuenta, puedes ignorar este mensaje y no se realizará ningún cambio.
        </p>
    </div>

    <div class="email-footer">
        TuMediBot &bull; Todos los derechos reservados.<br>
        Este es un correo automático, por favor no respondas a este mensaje.
    </div>
</div>

</body>
</html>
