<?php

namespace App\Http\Controllers\Billings;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\Factura;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class InvoiceController extends Controller
{
    public function download(User $user, Pedido $pedido)
    {
        $f = Factura::where('user_id', $user->id)->first();

        // Verificar que el pedido pertenece al usuario autenticado
        if ($f->id !== $pedido->factura_id || $user->id !== Auth::id()) {
            abort(403, 'No autorizado.');
        }

        // Obtener la factura asociada al pedido (asumo que existe relación)
        $factura = Factura::where('user_id', $user->id)->with(['pais','estado','ciudad'])->first();

        // Cargar la vista PDF con los datos necesarios
        $pdf = Pdf::loadView('pdf.factura_pedido', [
            'pedido' => $pedido,
            'factura' => $factura,
            'user' => $user,
        ]);

        return $pdf->stream("factura_{$pedido->ticket}.pdf");
    }

}
