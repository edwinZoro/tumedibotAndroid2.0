<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Receta médica - TuMediBot</title>
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
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            padding: 28px 32px;
            text-align: center;
        }
        .brand {
            font-size: 26px;
            font-weight: 800;
            color: #ffffff;
            letter-spacing: -0.5px;
        }
        .brand span { color: #c7d2fe; }
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
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #6366f1;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 6px 0;
            font-size: 15px;
        }
        .info-row .label {
            color: #64748b;
            font-weight: 500;
        }
        .info-row .value {
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
        .note {
            background: #eef2ff;
            border: 1px solid #c7d2fe;
            border-radius: 14px;
            padding: 16px 20px;
            margin: 18px 0;
            font-size: 13px;
            color: #3730a3;
            line-height: 1.6;
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
        .email-footer strong { color: #6366f1; }
    </style>
</head>
<body>

<div class="email-wrapper">
    <div class="email-header">
        <div class="brand">TuMedi<span>Bot</span></div>
    </div>

    <div class="email-body">
        <div class="greeting">
            ¡Hola, {{ $pacienteNombre }}!
        </div>

        <p class="paragraph">
            Tu médico <strong>{{ $medicoNombre }}</strong> te ha enviado tu
            <strong>receta médica</strong> adjunta a este correo.
        </p>

        <div class="info-card">
            <div class="info-row">
                <span class="label">Receta</span>
                <span class="value">#{{ $recetaId }}</span>
            </div>
            <div class="info-row">
                <span class="label">Enviada por</span>
                <span class="value">{{ $medicoNombre }}</span>
            </div>
        </div>

        <div class="note">
            Puedes encontrar el documento PDF con el detalle de tu receta
            médica como archivo adjunto de este mensaje. Guárdalo para tus
            registros o consúltalo en la farmacia al momento de adquirir tus
            medicamentos.
        </div>

        <hr class="divider">

        <p class="paragraph">
            Si tienes alguna duda sobre la receta, no dudes en contactar
            directamente a tu médico.
        </p>
    </div>

    <div class="email-footer">
        TuMediBot &bull; Todos los derechos reservados.<br>
        Este es un correo automático, por favor no respondas a este mensaje.
    </div>
</div>

</body>
</html>
