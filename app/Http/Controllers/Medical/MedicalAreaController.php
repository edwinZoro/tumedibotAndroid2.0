<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Response;
use Inertia\Inertia;

class MedicalAreaController extends Controller
{
    public function show(Request $request): Response
       {
           $user = auth()->id();

           return Inertia::render('medicos/medical-area', [
               'user' => $user ,
               'medicalProfileRoute' => $user ? route('medical-form', ['id' => $user]) : '#',
           ]);
       }
}
