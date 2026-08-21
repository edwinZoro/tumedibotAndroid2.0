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

        /* Doctor card */
        .doctor-card {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
            display: flex;
            align-items: center;
            gap: 16px;
        }
        .doctor-avatar {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            background: linear-gradient(135deg, #2563eb, #0ea5e9);
            color: #ffffff;
            font-size: 22px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
        }
        .doctor-info { flex: 1; }
        .doctor-info .d-name {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
        }
        .doctor-info .d-spec {
            font-size: 13px;
            color: #0369a1;
            margin-top: 2px;
        }
        .doctor-info .d-hospital {
            font-size: 12px;
            color: #64748b;
            margin-top: 4px;
            line-height: 1.5;
        }

        /* Info card */
        .info-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #2563eb;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .info-card-title {
            font-size: 13px;
            font-weight: 700;
            color: #2563eb;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 12px;
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

        /* Medications list */
        .med-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-left: 5px solid #0ea5e9;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .med-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .med-item {
            padding: 10px 0;
            border-bottom: 1px solid #e2e8f0;
        }
        .med-item:last-child { border-bottom: none; }
        .med-name {
            font-size: 14px;
            font-weight: 700;
            color: #0f172a;
        }
        .med-detail {
            font-size: 12px;
            color: #64748b;
            margin-top: 2px;
            line-height: 1.5;
        }
        .med-badge {
            display: inline-block;
            background: #e0f2fe;
            color: #0369a1;
            border-radius: 100px;
            padding: 2px 10px;
            font-size: 11px;
            font-weight: 600;
            margin-right: 6px;
        }

        /* Indications */
        .ind-card {
            background: #eff6ff;
            border: 1px solid #bfdbfe;
            border-radius: 16px;
            padding: 20px 24px;
            margin: 22px 0;
        }
        .ind-list {
            list-style: none;
            padding: 0;
            margin: 0;
        }
        .ind-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 8px 0;
            font-size: 14px;
            line-height: 1.6;
            color: #1e3a8a;
        }
        .ind-num {
            flex-shrink: 0;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #2563eb;
            color: #ffffff;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-top: 1px;
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
            ¡Hola, {{ $pacienteNombre }}!
        </div>

        <p class="paragraph">
            Tu médico <strong>{{ $medicoNombre }}</strong> te ha enviado tu
            <strong>receta médica</strong> adjunta a este correo.
        </p>

        @if($medicoEspecialidad || $nombreHospital)
        <div class="doctor-card">
            <div class="doctor-avatar">
                {{ strtoupper(mb_substr($medicoNombre, 0, 1)) }}
            </div>
            <div class="doctor-info">
                <div class="d-name">{{ $medicoNombre }}</div>
                @if($medicoEspecialidad)
                <div class="d-spec">{{ $medicoEspecialidad }}</div>
                @endif
                @if($nombreHospital)
                <div class="d-hospital">
                    {{ $nombreHospital }}
                    @if($direccionHospital)<br>{{ $direccionHospital }}@endif
                </div>
                @endif
            </div>
        </div>
        @endif

        <div class="info-card">
            <div class="info-card-title">Resumen de la receta</div>
            <div class="info-row">
                <span class="label">Receta N°</span>
                <span class="value">#{{ $recetaId }}</span>
            </div>
            @if(!empty($diagnostico))
            <div class="info-row">
                <span class="label">Diagnóstico</span>
                <span class="value">{{ $diagnostico }}</span>
            </div>
            @endif
            <div class="info-row">
                <span class="label">Enviada por</span>
                <span class="value">{{ $medicoNombre }}</span>
            </div>
        </div>

        @if(!empty($medicamentos))
        <div class="med-card">
            <div class="info-card-title">Medicamentos recetados</div>
            <ul class="med-list">
                @foreach($medicamentos as $med)
                <li class="med-item">
                    <div class="med-name">{{ $med['nombre'] ?? '—' }}</div>
                    <div class="med-detail">
                        @if(!empty($med['presentacion']))<span class="med-badge">{{ $med['presentacion'] }}</span>@endif
                        @if(!empty($med['dosis']))<span class="med-badge">Dosis: {{ $med['dosis'] }}</span>@endif
                        @if(!empty($med['frecuencia']))<span class="med-badge">{{ $med['frecuencia'] }}</span>@endif
                        @if(!empty($med['duracion']))<span class="med-badge">{{ $med['duracion'] }}</span>@endif
                        @if(!empty($med['cantidad']))<span class="med-badge">Cant: {{ $med['cantidad'] }}</span>@endif
                    </div>
                </li>
                @endforeach
            </ul>
        </div>
        @endif

        @if(!empty($indicaciones))
        <div class="ind-card">
            <div class="info-card-title">Indicaciones</div>
            <ul class="ind-list">
                @foreach($indicaciones as $ind)
                <li class="ind-item">
                    <span class="ind-num">{{ $loop->iteration }}</span>
                    <span>{{ $ind }}</span>
                </li>
                @endforeach
            </ul>
        </div>
        @endif

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
