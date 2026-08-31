<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Especialidades;
use App\Models\Factura;
use App\Models\Medico;
use App\Models\ReportePago;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    /**
     * Panel de administración con las 4 tablas y búsqueda en tiempo real.
     */
    public function index(Request $request): Response
    {
        $tab = $request->input('tab', 'users');
        $search = trim((string) $request->input('search', ''));

        $users = $this->queryUsers($tab === 'users' ? $search : '')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $medicos = $this->queryMedicos($tab === 'medicos' ? $search : '')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $medicos->getCollection()->transform(function (Medico $m) {
            $m->setAttribute('titulo_disponible', $this->rutaTitulo($m) !== null);

            return $m;
        });

        $facturas = $this->queryFacturas($tab === 'facturas' ? $search : '')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        $reportes = $this->queryReportes($tab === 'reportes' ? $search : '')
            ->orderByDesc('id')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('admin/index', [
            'adminName' => auth()->user()->name,
            'tab' => in_array($tab, ['users', 'medicos', 'facturas', 'reportes'], true) ? $tab : 'users',
            'search' => $search,
            'users' => $users,
            'medicos' => $medicos,
            'facturas' => $facturas,
            'reportes' => $reportes,
        ]);
    }

    /**
     * =========================================================================
     * Búsquedas por tabla
     * =========================================================================
     */
    private function queryUsers(string $search): Builder
    {
        return User::query()->when($search !== '', function ($query) use ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('id', $search)
                    ->orWhere('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        });
    }

    private function queryMedicos(string $search): Builder
    {
        return Medico::query()
            ->with(['especialidad', 'user'])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('id', $search)
                        ->orWhere('user_id', $search)
                        ->orWhere('nombre', 'like', "%{$search}%")
                        ->orWhere('apellido', 'like', "%{$search}%")
                        ->orWhere('correo', 'like', "%{$search}%");
                });
            });
    }

    private function queryFacturas(string $search): Builder
    {
        return Factura::query()
            ->with(['user', 'pedido' => fn ($query) => $query->orderByDesc('id')])
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('id', $search)
                        ->orWhere('user_id', $search)
                        ->orWhere('ci_rif', 'like', "%{$search}%")
                        ->orWhere('nombre', 'like', "%{$search}%")
                        ->orWhere('apellido', 'like', "%{$search}%")
                        ->orWhere('plan', 'like', "%{$search}%")
                        ->orWhereHas('pedido', function ($query) use ($search) {
                            $query->where('ticket', $search)
                                ->orWhere('transaccion_id', 'like', "%{$search}%");
                        });
                });
            });
    }

    private function queryReportes(string $search): Builder
    {
        return ReportePago::query()
            ->with('factura')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($query) use ($search) {
                    $query->where('id', $search)
                        ->orWhere('factura_id', $search)
                        ->orWhere('pedidos_id', $search)
                        ->orWhere('transaccion_id', 'like', "%{$search}%")
                        ->orWhere('nmro_referencia', 'like', "%{$search}%")
                        ->orWhere('banco_emisor', 'like', "%{$search}%")
                        ->orWhere('banco_receptor', 'like', "%{$search}%")
                        ->orWhere('estado', 'like', "%{$search}%");
                });
            });
    }

    /**
     * =========================================================================
     * Edición de Usuarios
     * =========================================================================
     */
    public function editUser(User $user): Response
    {
        return Inertia::render('admin/usuarios/edit', [
            'usuario' => $user->only(['id', 'name', 'email', 'pagos', 'privacy']),
            'actionUrl' => route('admin.users.update', $user->id),
            'backUrl' => route('admin.index', ['tab' => 'users']),
        ]);
    }

    public function updateUser(Request $request, User $user): RedirectResponse
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'pagos' => ['nullable', 'string', 'max:25'],
            'privacy' => ['nullable', 'string', 'max:25'],
        ]);

        $user->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Usuario actualizado correctamente.']);

        return redirect()->route('admin.index', ['tab' => 'users']);
    }

    /**
     * =========================================================================
     * Edición de Médicos
     * =========================================================================
     */
    public function editMedico(Medico $medico): Response
    {
        return Inertia::render('admin/medicos/edit', [
            'medico' => $medico->load('especialidad'),
            'especialidades' => Especialidades::orderBy('nombre_especialidad')->get(['id', 'nombre_especialidad']),
            'actionUrl' => route('admin.medicos.update', $medico->id),
            'backUrl' => route('admin.index', ['tab' => 'medicos']),
        ]);
    }

    public function updateMedico(Request $request, Medico $medico): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'apellido' => ['required', 'string', 'max:100'],
            'second_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['nullable', 'string', 'max:100'],
            'sexo' => ['required', 'string', 'in:MASCULINO,FEMENINO'],
            'telefono' => ['nullable', 'string'],
            'whatsapp' => ['nullable', 'string'],
            'correo' => ['required', 'email', 'max:100'],
            'revendedor' => ['nullable', 'string', 'max:255'],
            'pagos' => ['nullable', 'string', 'max:100'],
            'especialidad_id' => ['required', 'integer', 'exists:especialidad,id'],
        ]);

        $medico->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Médico actualizado correctamente.']);

        return redirect()->route('admin.index', ['tab' => 'medicos']);
    }

    /**
     * Descarga el archivo del título profesional cargado por el médico.
     *
     * Los títulos se guardaron en distintas rutas a lo largo del tiempo
     * (el flujo actual usa el disco local: storage/app/private/public/
     * medicos/titulos), por lo que se buscan en todas las ubicaciones
     * conocidas antes de responder.
     */
    public function descargarTitulo(Medico $medico)
    {
        $ruta = $this->rutaTitulo($medico);

        abort_unless($ruta, 404, 'El archivo del título no se encontró en este servidor (fue cargado en otra instalación).');

        return response()->download($ruta, $medico->name_original ?? basename($medico->name_temp));
    }

    /**
     * Busca el archivo del título del médico en las rutas históricas
     * de almacenamiento y devuelve la primera coincidencia.
     */
    private function rutaTitulo(Medico $medico): ?string
    {
        if (! $medico->name_temp) {
            return null;
        }

        $archivo = basename($medico->name_temp);

        return collect([
            storage_path('app/private/public/medicos/titulos/'.$archivo),
            storage_path('app/public/medicos/titulos/'.$archivo),
            public_path('imagen/'.$archivo),
            public_path('images/'.$archivo),
            public_path('medicos/titulos/'.$archivo),
        ])->first(fn ($r) => is_file($r));
    }

    /**
     * =========================================================================
     * Edición de Facturas
     * =========================================================================
     */
    public function editFactura(Factura $factura): Response
    {
        return Inertia::render('admin/facturas/edit', [
            'factura' => $factura,
            'actionUrl' => route('admin.facturas.update', $factura->id),
            'backUrl' => route('admin.index', ['tab' => 'facturas']),
        ]);
    }

    public function updateFactura(Request $request, Factura $factura): RedirectResponse
    {
        $data = $request->validate([
            'nombre' => ['required', 'string', 'max:100'],
            'apellido' => ['required', 'string', 'max:100'],
            'celular' => ['required', 'numeric'],
            'ci_rif' => ['required', 'string', 'max:20'],
            'direccion' => ['nullable', 'string', 'max:100'],
            'codigo_postal' => ['nullable', 'integer'],
            'plan' => ['required', 'string', 'in:andromeda,fenix,pegasus'],
        ]);

        $factura->update($data);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Factura actualizada correctamente.']);

        return redirect()->route('admin.index', ['tab' => 'facturas']);
    }

    /**
     * =========================================================================
     * Edición de Reportes de Pago
     * =========================================================================
     */
    public function editReporte(ReportePago $reporte): Response
    {
        return Inertia::render('admin/reportes/edit', [
            'reporte' => $reporte,
            'actionUrl' => route('admin.reportes.update', $reporte->id),
            'backUrl' => route('admin.index', ['tab' => 'reportes']),
        ]);
    }

    public function updateReporte(Request $request, ReportePago $reporte): RedirectResponse
    {
        $data = $request->validate([
            'banco_emisor' => ['required', 'string', 'max:100'],
            'banco_receptor' => ['required', 'string', 'max:100'],
            'nmro_referencia' => ['required', 'string', 'max:100'],
            'monto_pagado' => ['required', 'numeric'],
            'metodo_transaccion' => ['required', 'string', 'max:100'],
            'estado' => ['required', 'string', 'max:20'],
        ]);

        $reporte->update([
            'banco_emisor' => $data['banco_emisor'],
            'banco_receptor' => $data['banco_receptor'],
            'nmro_referencia' => $data['nmro_referencia'],
            'monto_pagado' => $data['monto_pagado'],
            'metodo_transaccion' => $data['metodo_transaccion'],
            'estado' => $data['estado'],
        ]);

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Reporte de pago actualizado correctamente.']);

        return redirect()->route('admin.index', ['tab' => 'reportes']);
    }
}
