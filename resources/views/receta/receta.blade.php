<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Receta médica</title>
    <style type="text/css">
        body {
            font-size: 13px;
            line-height: 1.5;
            font-family: Arial, sans-serif;
            margin: 25px 30px;
        }
        hr {
            border: none;
            border-top: 1px solid #000000;
            margin: 6px 0;
        }
        h1 { font-size: 18px; margin: 6px 0; }
        h2 { font-size: 14px; }
        h3 { font-size: 12px; }
        table { width: 100%; border-collapse: collapse; }
        .hospital-name {
            font-family: 'Georgia', 'Times New Roman', serif;
            font-size: 15px;
            font-weight: bold;
            font-style: italic;
            color: #000000;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin: 2px 0;
        }
        .rx-symbol {
            font-size: 28px;
            font-weight: bold;
            font-family: 'Georgia', 'Times New Roman', serif;
            padding: 4px 0 8px;
        }
        .med-item {
            padding: 6px 0;
            border-bottom: 1px dashed #ccc;
        }
        .med-item:last-child {
            border-bottom: none;
        }
        .med-name {
            font-weight: bold;
            font-size: 14px;
        }
        .med-detail {
            color: #444;
            font-size: 12px;
            padding-left: 16px;
        }
    </style>
</head>

<body>
    @php
        $c = $receta->citaPaciente;
        $medico = $receta->medico;
        $paciente = $receta->paciente;
        $fecha = $c ? $c->fecha . ' ' . $c->hora : $receta->created_at->format('Y-m-d H:i');
        $medicamentos = json_decode($receta->medicamentos, true) ?: [];
    @endphp

    <table>
        <tr>
            @if(isset($logoBase64) && $logoBase64)
            <td style="width: 80px; vertical-align: middle;">
                <img src="{{ $logoBase64 }}" alt="Logo"
                    style="width: 80px; height: 80px; object-fit: cover;">
            </td>
            @endif
            <td style="vertical-align: middle; padding-left: 12px;">
                @if(isset($nombreHospital) && $nombreHospital)
                <div class="hospital-name">{{ strtoupper($nombreHospital) }}</div>
                @endif
                @if(isset($direccionHospital) && $direccionHospital)
                <h3 style="margin: 2px 0;">{{ $direccionHospital }}</h3>
                @endif
                <h3 style="margin: 2px 0;">{{ $medico->ciudad->name ?? '' }}, {{ $medico->estado->name ?? '' }}, {{ $medico->pais->nombre_paises ?? '' }}</h3>
                <h3 style="margin: 2px 0;">Telf: {{ $medico->telefono }}</h3>
            </td>
            @if(isset($selloHospitalBase64) && $selloHospitalBase64)
            <td style="width: 110px; vertical-align: middle; text-align: right;">
                <img src="{{ $selloHospitalBase64 }}" alt="Sello del Hospital/Clínica"
                    style="max-width: 100px; max-height: 100px; object-fit: contain;">
            </td>
            @endif
        </tr>
    </table>
    <hr>
    <h1 style="text-align: center">Receta Médica</h1>

    <b>Datos del Paciente</b>
    <hr>
    <table style="margin-bottom: 8px;">
        <tr>
            <td style="width: 50%; vertical-align: top; padding-right: 10px;">
                <strong>Receta N°:</strong> {{ $receta->id }}<br>
                <strong>Nombre:</strong> {{ $paciente->nombre_paciente }}<br>
                <strong>Teléfono:</strong> {{ $paciente->tlf_paciente }}<br>
                <strong>Email:</strong> {{ $paciente->email_paciente }}<br>
            </td>
            <td style="width: 50%; vertical-align: top; padding-left: 10px;">
                <strong>Edad:</strong> {{ $paciente->edad }} años<br>
                <strong>Peso:</strong> {{ $paciente->peso }}kg<br>
                <strong>Estatura:</strong> {{ $paciente->estatura }}m<br>
                <strong>Fecha:</strong> {{ $fecha }}<br>
            </td>
        </tr>
    </table>

    @if($receta->diagnostico)
    <b>Diagnóstico</b>
    <hr>
    <p style="margin-bottom: 8px;">{{ $receta->diagnostico }}</p>
    @endif

    <div class="rx-symbol">℞</div>

    <b>Medicamentos</b>
    <hr>
    @if(count($medicamentos) > 0)
    <table style="margin-bottom: 8px;">
        @foreach($medicamentos as $med)
        <tr class="med-item">
            <td style="padding: 6px 0;">
                <div class="med-name">{{ $med['nombre'] }}</div>
                <div class="med-detail">
                    @if(!empty($med['presentacion']))<strong>Presentación:</strong> {{ $med['presentacion'] }} &nbsp; @endif
                    @if(!empty($med['dosis']))<strong>Dosis:</strong> {{ $med['dosis'] }} &nbsp; @endif
                    @if(!empty($med['frecuencia']))<strong>Frecuencia:</strong> {{ $med['frecuencia'] }} &nbsp; @endif
                    @if(!empty($med['duracion']))<strong>Duración:</strong> {{ $med['duracion'] }} &nbsp; @endif
                    @if(!empty($med['cantidad']))<strong>Cantidad:</strong> {{ $med['cantidad'] }} @endif
                </div>
            </td>
        </tr>
        @endforeach
    </table>
    @else
    <p style="margin-bottom: 8px;">No hay medicamentos registrados.</p>
    @endif

    @if($receta->indicaciones)
    <b>Indicaciones</b>
    <hr>
    <p style="margin-bottom: 8px;">{{ $receta->indicaciones }}</p>
    @endif

    @if($receta->proxima_cita)
    <p style="margin-top: 8px;"><strong>Próxima cita:</strong> {{ $receta->proxima_cita->format('d/m/Y') }}</p>
    @endif

    <table style="margin-top: 25px;">
        <tr>
            <td style="width: 50%; vertical-align: bottom; text-align: center; padding: 0 15px 0 0;">
                <div style="height: 60px;"></div>
                <div style="border-top: 1px solid black; width: 85%; margin: 0 auto 4px;"></div>
                <p>Firma del paciente</p>
            </td>
            <td style="width: 50%; vertical-align: bottom; text-align: center; padding: 0 0 0 15px;">
                <div style="display: inline-flex; align-items: flex-end; justify-content: center; gap: 4px; height: 60px;">
                    @if(isset($firmaBase64) && $firmaBase64)
                        <img src="{{ $firmaBase64 }}" alt="Firma del Médico" style="max-height: 60px; display: block;">
                    @endif
                    @if(isset($selloBase64) && $selloBase64)
                        <img src="{{ $selloBase64 }}" alt="Sello Médico" style="max-height: 60px; display: block;">
                    @endif
                </div>
                <div style="border-top: 1px solid black; width: 85%; margin: 0 auto 4px;"></div>
                <p>Firma del médico</p>
                <p style="margin: 2px 0;"><i>{{ $medico->nombre }} {{ $medico->second_name ?? "" }} {{ $medico->apellido }} {{ $medico->last_name ?? "" }}</i></p>
                <p style="margin: 2px 0;">{{ $medico->especialidad->nombre_especialidad }}</p>
            </td>
        </tr>
    </table>
</body>

</html>
