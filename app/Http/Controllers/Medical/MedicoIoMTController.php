<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\IoMTData;
use App\Models\Medico;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class MedicoIoMTController extends Controller
{
    /**
     * Lista de pacientes que comparten su IoMT
     */
    public function index()
    {
        $user = Auth::user();
        $medico = Medico::where('user_id', $user->id)->firstOrFail();

        // Buscar los pacientes que han dado acceso a este médico específicamente
        $pacientesCompartiendo = $medico->pacientesIoMT()->get();

        return Inertia::render('medicos/iomt-list', [
            'pacientes' => $pacientesCompartiendo
        ]);
    }

    /**
     * Vista de la sala de monitorización del paciente seleccionado
     */
    public function show(Paciente $paciente)
    {
        $user = Auth::user();
        $medico = Medico::where('user_id', $user->id)->firstOrFail();

        // Validar que el paciente haya compartido explícitamente su IoMT con este médico
        if (!$medico->pacientesIoMT()->where('pacientes.id', $paciente->id)->exists()) {
            return redirect()->route('medicos.iomt.index')->with('error', 'El paciente no está compartiendo sus datos o no tienes acceso.');
        }

        // Obtener datos históricos de IoMT del paciente
        $iomtDataRaw = IoMTData::where('paciente_id', $paciente->id)
            ->orderBy('recorded_at', 'desc')
            ->get();

        // Formatear y desencriptar los datos para el frontend
        $iomtData = $iomtDataRaw->map(function ($item) {
            return [
                'id' => $item->id,
                'device_type' => $item->device_type,
                'data' => $item->decrypted_data,
                'recorded_at' => $item->recorded_at->format('Y-m-d H:i:s'),
                'recorded_at_human' => $item->recorded_at->diffForHumans(),
            ];
        });

        // Agrupar los datos por tipo de dispositivo
        $groupedData = $iomtData->groupBy('device_type');

        return Inertia::render('Paciente/iomt', [ // Reutilizamos la vista del paciente, o podemos crear una nueva (medicos/iomt-view)
            'iomtData' => $groupedData,
            'isDoctorView' => true,
            'paciente' => $paciente
        ]);
    }
}
