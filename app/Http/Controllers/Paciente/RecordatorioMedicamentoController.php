<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\Medicamento;
use App\Models\Paciente;
use App\Models\RecordatorioMedicamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class RecordatorioMedicamentoController extends Controller
{
    /**
     * Muestra la lista de recordatorios de medicamentos del paciente.
     */
    public function index(Request $request): Response
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        if (! $paciente) {
            return Inertia::render('Paciente/mis-medicamentos', [
                'tienePaciente' => false,
                'recordatorios' => [],
            ]);
        }

        $recordatorios = RecordatorioMedicamento::where('paciente_id', $paciente->id)
            ->with('medicamento')
            ->orderByDesc('id')
            ->get()
            ->map(function ($rec) {
                return [
                    'id' => $rec->id,
                    'medicamento_id' => $rec->medicamento_id,
                    'nombre_medicamento' => $rec->nombre_medicamento,
                    'presentacion' => $rec->presentacion,
                    'dosis' => $rec->dosis,
                    'intervalo_horas' => $rec->intervalo_horas,
                    'hora_inicio' => $rec->hora_inicio,
                    'dias_semana' => $rec->dias_semana,
                    'fecha_inicio' => $rec->fecha_inicio?->format('Y-m-d'),
                    'fecha_fin' => $rec->fecha_fin?->format('Y-m-d'),
                    'email_recordatorio' => $rec->email_recordatorio,
                    'notas' => $rec->notas,
                    'activo' => $rec->activo,
                    'created_at' => $rec->created_at?->format('Y-m-d H:i'),
                ];
            });

        return Inertia::render('Paciente/mis-medicamentos', [
            'tienePaciente' => true,
            'recordatorios' => $recordatorios,
        ]);
    }

    /**
     * Búsqueda en vivo del catálogo de medicamentos (776 ítems)
     */
    public function searchMedicamentos(Request $request): JsonResponse
    {
        $q = trim($request->query('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $medicamentos = Medicamento::where('nombre_comercial', 'LIKE', "%{$q}%")
            ->orWhere('principio_activo', 'LIKE', "%{$q}%")
            ->orWhere('categoria', 'LIKE', "%{$q}%")
            ->limit(20)
            ->get();

        return response()->json($medicamentos);
    }

    /**
     * Guarda un nuevo recordatorio de medicamento.
     */
    public function store(Request $request): RedirectResponse
    {
        $paciente = Paciente::where('user_id', Auth::id())->firstOrFail();

        $validated = $request->validate([
            'medicamento_id' => 'nullable|exists:medicamentos,id',
            'nombre_libre' => 'required_if:medicamento_id,null|nullable|string|max:255',
            'presentacion' => 'nullable|string|max:255',
            'dosis' => 'required|string|max:255',
            'intervalo_horas' => 'required|integer|min:1|max:168',
            'hora_inicio' => 'required|string',
            'dias_semana' => 'nullable|array',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'email_recordatorio' => 'boolean',
            'notas' => 'nullable|string|max:1000',
        ]);

        RecordatorioMedicamento::create([
            'paciente_id' => $paciente->id,
            'medicamento_id' => $validated['medicamento_id'] ?? null,
            'nombre_libre' => $validated['nombre_libre'] ?? null,
            'presentacion' => $validated['presentacion'] ?? null,
            'dosis' => $validated['dosis'],
            'intervalo_horas' => $validated['intervalo_horas'],
            'hora_inicio' => $validated['hora_inicio'],
            'dias_semana' => $validated['dias_semana'] ?? null,
            'fecha_inicio' => $validated['fecha_inicio'],
            'fecha_fin' => $validated['fecha_fin'] ?? null,
            'email_recordatorio' => $validated['email_recordatorio'] ?? true,
            'notas' => $validated['notas'] ?? null,
            'activo' => true,
        ]);

        return back()->with('success', 'Recordatorio de medicamento creado exitosamente.');
    }

    /**
     * Activa o pausa un recordatorio.
     */
    public function toggle(RecordatorioMedicamento $recordatorio): RedirectResponse
    {
        $paciente = Paciente::where('user_id', Auth::id())->firstOrFail();

        if ($recordatorio->paciente_id !== $paciente->id) {
            abort(403);
        }

        $recordatorio->update([
            'activo' => ! $recordatorio->activo,
        ]);

        $estado = $recordatorio->activo ? 'activado' : 'pausado';

        return back()->with('success', "Recordatorio {$estado}.");
    }

    /**
     * Elimina un recordatorio.
     */
    public function destroy(RecordatorioMedicamento $recordatorio): RedirectResponse
    {
        $paciente = Paciente::where('user_id', Auth::id())->firstOrFail();

        if ($recordatorio->paciente_id !== $paciente->id) {
            abort(403);
        }

        $recordatorio->delete();

        return back()->with('success', 'Recordatorio eliminado.');
    }
}
