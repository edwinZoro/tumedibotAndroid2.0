<?php

namespace App\Http\Controllers\Billings;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Factura;
use Inertia\Response;
use App\Models\User;
use Inertia\Inertia;

class BillingController extends Controller
{
  // Mostrar formulario de edición
      public function show(Request $request, int $userId): Response
      {
          // Verificar que el usuario autenticado sea el dueño
          if ($userId !== Auth::id()) {
              abort(403, 'No autorizado');
          }

          // Obtener la factura del usuario (asumiendo que solo hay una)
          $factura = Factura::where('user_id', $userId)
              ->with(['pais', 'estado', 'ciudad']) // Cargar relaciones para tener los IDs
              ->first();

          // Si no existe factura, redirigir a creación o manejar error
          if (!$factura) {
              return redirect()->route('billing.create', ['userId' => $userId])
                  ->with('error', 'No tienes factura registrada. Por favor crea una.');
          }

          // Obtener el usuario (opcional, por si se necesita)
          $user = User::find($userId);

          return Inertia::render('billing/billing-edit', [
              'user' => $user,
              'factura' => $factura, // Aquí llega el objeto con relaciones
          ]);
      }

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
            'celular' => 'required|numeric|digits_between:10,15',
            'ci_rif' => 'required|string|min:7|max:20',
            'pais_id' => 'required|string',
            'estado_id' => 'required|string',
            'ciudad_id' => 'required|string',
            'direccion' => 'required|string|min:10',
            'codigo_postal' => 'required|numeric|digits_between:4,7',
        ]);

        $validated['user_id'] = $userId;

        $factura = Factura::create($validated);
        $user = User::find(Auth::id());
        $user->assignRole('medico');
        return redirect()->route('dashboard')->with('success', 'Factura guardada correctamente.');
    }

    // Actualizar factura
      public function actualizarFactura(Request $request, int $userId, int $id)
      {
          if ($userId !== Auth::id()) {
              return response()->json(['error' => 'No autorizado'], 403);
          }

          $factura = Factura::where('id', $id)->where('user_id', $userId)->first();

          if (!$factura) {
              return response()->json(['error' => 'Factura no encontrada'], 404);
          }

          $validated = $request->validate([
              'plan' => 'sometimes|string|in:andromeda,fenix,pegasus',
              'nombre' => 'sometimes|string|min:2|max:255',
              'apellido' => 'sometimes|string|min:2|max:255',
              'celular' => 'sometimes|numeric|digits_between:10,15',
              'ci_rif' => 'sometimes|string|digits_between:7,20',
              'pais_id' => 'sometimes|integer|exists:paises,id',
              'estado_id' => 'sometimes|integer|exists:states,id',
              'ciudad_id' => 'sometimes|integer|exists:ciudades,id',
              'direccion' => 'sometimes|string|min:10',
              'codigo_postal' => 'sometimes|numeric|digits_between:4,7',
          ]);

          $factura->update($validated);

          // Asignar permiso si no lo tiene
          $user = User::find($userId);
          if (!$user->hasPermissionTo('tiene_factura')) {
              $user->givePermissionTo('tiene_factura');
          }

          return redirect()->route('medicos.area')->with('success', 'Factura actualizada correctamente.');
      }


}
