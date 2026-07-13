<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class MedicalFormController extends Controller
{
  public function show(Request $request, $id): Response
  {

    return Inertia::render('medicos/medical-form',[
      'userId' => $id, // Opcional: pasarlo al frontend
  ]);
  }
}
