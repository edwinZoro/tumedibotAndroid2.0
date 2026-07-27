<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Factura;
use Inertia\Response;
use Inertia\Inertia;

class MedicoReportController extends Controller
{
  public function index(Request $request): Response
     {
         $user = auth()->id();
         $factura = Factura::where('user_id',$user)->get();
         return Inertia::render('medicos/report_payment', [
             'user' => $user ,
             'factura' => $factura
         ]);
     }
}
