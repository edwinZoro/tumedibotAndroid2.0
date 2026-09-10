<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a TuMediBot Noticias</title>
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
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #2563eb;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 15px;
            border-bottom: 1px dashed #e2e8f0;
        }
        .info-row:last-child {
            border-bottom: none;
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
        .button-wrapper {
            text-align: center;
            margin: 30px 0;
        }
        .btn {
            background: #2563eb;
            color: #ffffff;
            text-decoration: none;
            padding: 14px 28px;
            border-radius: 8px;
            font-weight: 600;
            display: inline-block;
        }
        .divider {
            border: none;
            border-top: 1px solid #e2e8f0;
            margin: 22px 0;
        }
        .note {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 14px;
            padding: 16px 20px;
            margin: 18px 0;
            font-size: 13px;
            color: #1e40af;
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
            ¡Hola, {{ $nombre }}!
        </div>

        <p class="paragraph">
            Como médico registrado en TuMediBot, hemos creado automáticamente tu perfil de <strong>Autor</strong> para que puedas publicar artículos, noticias y novedades médicas en nuestra sección de Noticias.
        </p>

        <div class="info-card">
            <div class="info-row">
                <span class="label">Usuario:</span>
                <span class="value">{{ $username }}</span>
            </div>
            <div class="info-row">
                <span class="label">Contraseña temporal:</span>
                <span class="value">{{ $password }}</span>
            </div>
        </div>

        <div class="button-wrapper">
            <a href="{{ $loginUrl }}" class="btn">Ir a mi panel de autor</a>
        </div>

        <div class="note">
            💡 <strong>Recomendación:</strong> Por motivos de seguridad, te sugerimos cambiar tu contraseña una vez que hayas iniciado sesión en el panel de Noticias.
        </div>

        <hr class="divider">
    </div>

    <div class="email-footer">
        TuMediBot &bull; Todos los derechos reservados.<br>
        Este es un mensaje automático, por favor no respondas a este correo.
    </div>
</div>

</body>
</html>
