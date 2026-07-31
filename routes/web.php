<?php

use App\Http\Controllers\Billings\BillingController;
use App\Http\Controllers\Billings\InvoiceController;
use App\Http\Controllers\Medical\MedicalAreaController;
use App\Http\Controllers\Medical\MedicalFormController;
use App\Http\Controllers\Medical\MedicoReportController;
use App\Http\Controllers\Medical\MedicoSearchController;
use App\Http\Controllers\Medical\ProfileMedical;
use App\Models\Especialidades;
use App\Models\Pais;
use App\Models\State;
use Illuminate\Support\Facades\Route;



Route::inertia('/', 'welcome')->name('home');

Route::prefix('medicos')->group(function () {
    Route::get('area-medico', [MedicalAreaController::class, 'show'])->name('medicos.area');
    Route::get('search', [MedicoSearchController::class, 'index'])->name('medicos.search');
    Route::get('report_payment', [MedicoReportController::class, 'index'])->name('medicos.report');
    // generar pedidos
    Route::get('/generar-pedido/{user}/{plan}', [MedicoReportController::class, 'generarPedido'])->name('generar.pedido');
    Route::get('perfil/{id}/{nombre?}/{apellido?}/{especialidad?}', [ProfileMedical::class, 'show'])->name('perfil_medico');
    Route::get('calendar/{id}/{userId?}', function () {
        return 'Calendario';
    })->name('calendar_view');
    Route::get('/medicoLLenarPerfil/{id}', [MedicalFormController::class, 'show'])->name('medical-form');
    Route::get('editar/{id}', [MedicalFormController::class, 'edit'])->name('medical.edit');

    Route::get('/pagando_perfil_medico/{user}/{pedido}', [InvoiceController::class, 'download'])
    ->name('pagando_perfil_medico');
});

Route::prefix('api')->group(function () {
    Route::get('/paises', fn () => Pais::all(['id', 'nombre_paises']));
    Route::get('/paises/{pais}/estados', fn (Pais $pais) => State::where('pais_id', $pais->id)->get(['id', 'name']));
    Route::get('/estados/{state}/ciudades', fn (State $state) => $state->ciudades()->get(['id', 'name']));
    Route::get('/especialidades', function () {
        return Especialidades::all(['id', 'nombre_especialidad']);
    });
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ListadoDeMedicosDeLatinoamericaTumedibot', [MedicoSearchController::class, 'index'])->name('dashboard');

    // Rutas protegidas para que los médicos NO puedan entrar escribiendo la URL
    Route::middleware(['not.medico'])->group(function () {
        Route::inertia('/soy-doctor', 'soydoctor')->name('soydoctor');

        Route::get('/billing-plan/{plan}', function (string $plan) {
            return inertia('billing/billing-plan', [
                'userId' => auth()->id(),
                'plan' => $plan,
            ]);
        })->name('billing.plan');
    });

    //delete perfil medico
    Route::delete('/delete_medico_perfil/{medico}', [MedicalFormController::class, 'destroy'])
    ->name('medicos.destroy');

    // edit Billing
    Route::get('/billing-plan-edit/{userId}', [BillingController::class, 'show'])->name('billing.edit');

    Route::get('/pagar-crypto', function () {
    return inertia('crypto');
    })->name('crypto.pay');

    Route::prefix('api')->group(function () {
        Route::get('/factura/usuario/{userId}', [BillingController::class, 'getFacturaByUser']);
        Route::post('/guardar-factura/{userId}', [BillingController::class, 'guardarFactura']);
        Route::put('/actualizar-factura/{userId}/{id}', [BillingController::class, 'actualizarFactura'])
            ->name('factura.update');

        // medicos
        Route::post('/medicos', [MedicalFormController::class, 'store'])
            ->middleware('auth')
            ->name('medical.store');
        Route::put('/medicos/{id}', [MedicalFormController::class, 'update'])
            ->middleware('auth')
            ->name('medical.update');
    });

});

require __DIR__.'/settings.php';
