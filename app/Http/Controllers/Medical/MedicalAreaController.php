<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class MedicalAreaController extends Controller
{
    public function show(Request $request): Response
    {
        $user = auth()->user()->load('medico.especialidad');

        $facturas = Factura::with(['pais', 'estado', 'ciudad'])
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($factura) {
                return [
                    'id' => $factura->id,
                    'nombre' => $factura->nombre,
                    'apellido' => $factura->apellido,
                    'ci_rif' => $factura->ci_rif,
                    'celular' => $factura->celular,
                    'direccion' => $factura->direccion,
                    'codigo_postal' => $factura->codigo_postal,
                    // Reemplazamos los IDs por los nombres de las relaciones
                    'pais' => $factura->pais?->nombre_paises ?? '',
                    'estado' => $factura->estado?->name ?? '',
                    'ciudad' => $factura->ciudad?->name ?? '',
                    // También puedes añadir el plan si lo necesitas
                    'plan' => $factura->plan,
                ];
            });

        return Inertia::render('medicos/medical-area', [
            'user' => $user,
            'medico' => $user->medico,
            'medicalProfileRoute' => $user ? route('medical-form', ['id' => $user->id]) : '#',
            'personalProfileRoute' => $user && $user->medico
                ? route('perfil_medico', [
                    'id' => $user->medico->id,
                    'nombre' => $user->medico->nombre,
                    'apellido' => $user->medico->apellido,
                    'especialidad' => $user->medico->especialidad?->nombre_especialidad ?? '',
                ])
                : '#',
            'medicalEditRoute' => $user && $user->medico
                ? route('medical.edit', ['id' => $user->medico->id])
                : '#',
            'EditMedicalBilling' => $user ? route('billing.edit', ['userId' => $user->id]) : '#',
            'factura' => $facturas,
        ]);
    }
}
