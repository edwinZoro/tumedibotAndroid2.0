<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Models\Medicamento;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MedicamentoController extends Controller
{
    public function search(Request $request): JsonResponse
    {
        $q = trim($request->get('q', ''));

        if (mb_strlen($q) < 2) {
            return response()->json([]);
        }

        $results = Medicamento::where('nombre_comercial', 'LIKE', "%{$q}%")
            ->orWhere('principio_activo', 'LIKE', "%{$q}%")
            ->orWhere('indicaciones', 'LIKE', "%{$q}%")
            ->limit(20)
            ->get();

        return response()->json($results);
    }
}
