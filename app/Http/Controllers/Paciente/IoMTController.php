<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\IoMTData;
use App\Models\Paciente;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class IoMTController extends Controller
{
    /**
     * Muestra la vista de monitorización (sala de monitoreo).
     */
    public function index()
    {
        $user = Auth::user();
        $paciente = Paciente::where('user_id', $user->id)->firstOrFail();

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

        // Agrupar los datos por tipo de dispositivo para facilitar los gráficos en el front
        $groupedData = $iomtData->groupBy('device_type');

        // Obtener médicos asignados y los que tienen acceso
        $medicos = $paciente->medicos()
            ->get(['medicos.id', 'medicos.nombre', 'medicos.apellido'])
            ->map(fn ($medico) => [
                'id' => $medico->id,
                'nombre' => trim(($medico->nombre ?? '').' '.($medico->apellido ?? '')),
            ]);

        $compartidoCon = $paciente->medicosIoMT()->pluck('medicos.id')->toArray();

        return Inertia::render('Paciente/iomt', [
            'iomtData' => $groupedData,
            'medicos' => $medicos,
            'compartidoCon' => $compartidoCon,
        ]);
    }

    /**
     * Guarda la data de un dispositivo (simulando que proviene de bluetooth/internet).
     */
    public function store(Request $request)
    {
        $request->validate([
            'device_type' => 'required|string',
            'data' => 'required|array',
            'recorded_at' => 'required|date',
        ]);

        $user = Auth::user();
        $paciente = Paciente::where('user_id', $user->id)->firstOrFail();

        $iomt = new IoMTData();
        $iomt->paciente_id = $paciente->id;
        $iomt->device_type = $request->device_type;
        $iomt->encrypted_data = $request->data; // El mutator encriptará automáticamente el array JSON
        $iomt->recorded_at = $request->recorded_at;
        $iomt->save();

        return redirect()->back()->with('success', 'Datos del dispositivo registrados exitosamente.');
    }

    /**
     * Otorga o revoca el acceso de los médicos a los datos IoMT.
     */
    public function compartir(Request $request)
    {
        $user = Auth::user();
        $paciente = Paciente::where('user_id', $user->id)->firstOrFail();

        $medicoIdsPermitidos = $paciente->medicos()->pluck('medicos.id');

        $validated = $request->validate([
            'medico_ids' => ['present', 'array'],
            'medico_ids.*' => ['integer', 'distinct', 'in:'.$medicoIdsPermitidos->implode(',')],
        ]);

        $idsNuevos = collect($validated['medico_ids']);

        $paciente->medicosIoMT()->sync($idsNuevos);

        return redirect()->back()->with('success', 'Accesos de monitoreo IoMT actualizados correctamente.');
    }
}
