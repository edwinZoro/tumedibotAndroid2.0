<?php

namespace App\Http\Controllers\Billings;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BillingController extends Controller
{
    public function getFacturaByUser(int $userId)
    {
        $factura = Factura::where('user_id', $userId)->first();

        if (! $factura) {
            return response()->json(['error' => 'No se encontró factura'], 404);
        }

        return response()->json($factura);
    }

    public function guardarFactura(Request $request, int $userId)
    {
        if ($userId !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'plan' => 'required|string|in:andromeda,fenix,pegasus',
            'nombre' => 'required|string|min:2|max:255',
            'apellido' => 'required|string|min:2|max:255',
            'celular' => 'required|numeric|digits_between:10,14',
            'ci_rif' => 'required|numeric|digits_between:7,18',
            'pais' => 'required|string',
            'estado' => 'required|string',
            'ciudad' => 'required|string',
            'direccion' => 'required|string|min:10',
            'codigo_postal' => 'required|numeric|digits_between:4,7',
        ]);

        $validated['user_id'] = $userId;

        $factura = Factura::create($validated);

        return response()->json($factura, 201);
    }

    public function actualizarFactura(Request $request, int $userId, int $id)
    {
        if ($userId !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $factura = Factura::where('id', $id)->where('user_id', $userId)->first();

        if (! $factura) {
            return response()->json(['error' => 'Factura no encontrada'], 404);
        }

        $validated = $request->validate([
            'plan' => 'sometimes|string|in:andromeda,fenix,pegasus',
            'nombre' => 'sometimes|string|min:2|max:255',
            'apellido' => 'sometimes|string|min:2|max:255',
            'celular' => 'sometimes|numeric|digits_between:10,14',
            'ci_rif' => 'sometimes|numeric|digits_between:7,10',
            'pais' => 'sometimes|string',
            'estado' => 'sometimes|string',
            'ciudad' => 'sometimes|string',
            'direccion' => 'sometimes|string|min:10',
            'codigo_postal' => 'sometimes|numeric|digits_between:4,7',
        ]);

        $factura->update($validated);

        return response()->json($factura);
    }
}
