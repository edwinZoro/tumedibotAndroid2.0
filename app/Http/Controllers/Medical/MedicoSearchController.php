<?php

namespace App\Http\Controllers\Medical;

use App\Models\Ciudad;
use App\Models\Especialidades;
use App\Models\Medico;
use App\Models\Pais;
use App\Models\State;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Controllers\Controller;

class MedicoSearchController extends Controller
{
    /**
     * Renderiza la vista de búsqueda de médicos con filtros dinámicos.
     */
    public function index(Request $request): Response
    {
        // 1. Obtener opciones iniciales para los Selects
        $especialidades = Especialidades::all();
        $paises = Pais::all();

        // 2. Obtener Estados y Ciudades condicionales según la selección
        $estados = $request->input('estado')
            ? State::where('pais_id', $request->input('estado'))->get()
            : collect([]);

        $ciudades = $request->input('municipio')
            ? Ciudad::where('state_id', $request->input('municipio'))->get()
            : collect([]);

        // 3. Construir la consulta de Médicos con Eager Loading optimizado
        $query = Medico::with(['especialidad', 'pais', 'estado', 'ciudad'])
            ->where('pagos', 'positive')
            ->orderBy('id', 'DESC');

        // 4. Aplicar filtros dinámicos si están presentes en la Request
        if ($request->filled('nombre')) {
            $query->where('nombre', 'LIKE', '%'.$request->input('nombre').'%');
        }
        if ($request->filled('apellido')) {
            $query->where('apellido', 'LIKE', '%'.$request->input('apellido').'%');
        }
        if ($request->filled('precio')) {
            $query->where('consultorio_costo', 'LIKE', '%'.$request->input('precio').'%');
        }
        if ($request->filled('especialidad')) {
            $query->where('especialidad_id', $request->input('especialidad'));
        }
        if ($request->filled('estado')) { // Nota: en tu lógica original 'estado' es el pais_id
            $query->where('pais_id', $request->input('estado'));
        }
        if ($request->filled('municipio')) { // Nota: 'municipio' es el estado_id
            $query->where('estado_id', $request->input('municipio'));
        }
        if ($request->filled('ciudad')) { // Nota: 'ciudad' es el ciudad_id
            $query->where('ciudad_id', $request->input('ciudad'));
        }

        // 5. Paginación preservando los parámetros de búsqueda en la URL
        $listaMedico = $query->paginate(12)->withQueryString();

        // 6. Retornar render de Inertia
        return Inertia::render('medicos/search', [
            'listaMedico' => $listaMedico,
            'especialidades' => $especialidades,
            'paises' => $paises,
            'estados' => $estados,
            'ciudades' => $ciudades,
            'filters' => $request->only(['nombre', 'apellido', 'precio', 'especialidad', 'estado', 'municipio', 'ciudad']),
        ]);
    }
}
