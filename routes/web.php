<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Billings\BillingController;
use App\Http\Controllers\Billings\InvoiceController;
use App\Http\Controllers\Medical\MedicalAreaController;
use App\Http\Controllers\Medical\MedicalFormController;
use App\Http\Controllers\Medical\MedicoArchivosController;
use App\Http\Controllers\Medical\MedicoCitasController;
use App\Http\Controllers\Medical\MedicoPacientesController;
use App\Http\Controllers\Medical\MedicoReportController;
use App\Http\Controllers\Medical\MedicoSearchController;
use App\Http\Controllers\Medical\ProfileMedical;
use App\Http\Controllers\Paciente\ArchivosController;
use App\Http\Controllers\Paciente\CitasController;
use App\Http\Controllers\Paciente\DatosMedicosController;
use App\Http\Controllers\VideoCallController;
use App\Models\Especialidades;
use App\Models\Pais;
use App\Models\State;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::prefix('medicos')->group(function () {
    Route::get('area-medico', [MedicalAreaController::class, 'show'])->name('medicos.area');
    Route::get('search', [MedicoSearchController::class, 'index'])->name('medicos.search');
    Route::get('report-payment', [MedicoReportController::class, 'index'])->name('medicos.report');
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

    // reporte pago de medico
    Route::get('/reporte-pago', [MedicoReportController::class, 'create'])
        ->name('reporte.pago');
});

Route::prefix('api')->group(function () {
    Route::get('/paises', fn () => Pais::all(['id', 'nombre_paises']));
    Route::get('/paises/{pais}/estados', fn (Pais $pais) => State::where('pais_id', $pais->id)->get(['id', 'name']));
    Route::get('/estados/{state}/ciudades', fn (State $state) => $state->ciudades()->get(['id', 'name']));
    Route::get('/especialidades', function () {
        return Especialidades::all(['id', 'nombre_especialidad']);
    });

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

    Route::post('/reporte-pago', [MedicoReportController::class, 'store']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/ListadoDeMedicosDeLatinoamericaTumedibot', [MedicoSearchController::class, 'index'])->name('dashboard');

    // Datos médicos del paciente (primera vez + edición)
    Route::get('/paciente/datos-medicos', [DatosMedicosController::class, 'show'])->name('pacientes.datos-medicos');
    Route::post('/paciente/datos-medicos', [DatosMedicosController::class, 'store'])->name('pacientes.datos-medicos.store');
    Route::put('/paciente/datos-medicos/{paciente}', [DatosMedicosController::class, 'update'])->name('pacientes.datos-medicos.update');

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

    // Bóveda de archivos del paciente (acceso por id propio, no por rol)
    Route::get('/paciente/mis-archivos', [ArchivosController::class, 'index'])
        ->name('pacientes.archivos');
    Route::post('/paciente/mis-archivos', [ArchivosController::class, 'store'])
        ->name('pacientes.archivos.store');
    Route::put('/paciente/mis-archivos/{archivo}/compartir', [ArchivosController::class, 'compartir'])
        ->name('pacientes.archivos.compartir');
    Route::delete('/paciente/mis-archivos/{archivo}', [ArchivosController::class, 'destroy'])
        ->name('pacientes.archivos.destroy');

    // Citas del paciente (calendario + agendar con médico)
    Route::get('/paciente/mis-citas', [CitasController::class, 'index'])
        ->name('pacientes.citas');
    Route::post('/paciente/mis-citas', [CitasController::class, 'store'])
        ->name('pacientes.citas.store');
    Route::delete('/paciente/mis-citas/{cita}', [CitasController::class, 'destroy'])
        ->name('pacientes.citas.destroy');

    // Descarga y vista en línea (dueño del archivo o médico con acceso otorgado)
    Route::get('/archivos/{archivo}/descargar', [ArchivosController::class, 'descargar'])
        ->name('archivos.descargar');
    Route::get('/archivos/{archivo}/ver', [ArchivosController::class, 'ver'])
        ->name('archivos.ver');

    // Archivos compartidos con el médico (solo lectura)
    Route::get('/medico/archivos-compartidos', [MedicoArchivosController::class, 'index'])
        ->name('medicos.archivos-compartidos');

    // Agenda de citas del médico
    Route::get('/medico/citas-agenda', [MedicoCitasController::class, 'index'])
        ->name('medicos.citas');
    Route::put('/medico/citas-agenda/{cita}/fecha', [MedicoCitasController::class, 'asignarFecha'])
        ->name('medicos.citas.asignar-fecha');

    // Videollamada (Jitsi Meet) - acceso por cita, desde ambos paneles
    Route::get('/medico/videollamada/{cita}', [VideoCallController::class, 'unirseMedico'])
        ->name('medicos.videollamada');
    Route::get('/paciente/videollamada/{cita}', [VideoCallController::class, 'unirsePaciente'])
        ->name('pacientes.videollamada');

    // Pacientes del médico (consultorio)
    Route::get('/medico/mis-pacientes', [MedicoPacientesController::class, 'index'])
        ->name('medicos.pacientes');
    Route::post('/medico/mis-pacientes/paciente', [MedicoPacientesController::class, 'storePaciente'])
        ->name('medicos.pacientes.store');

    // delete perfil medico
    Route::delete('/delete_medico_perfil/{medico}', [MedicalFormController::class, 'destroy'])
        ->name('medicos.destroy');

    // edit Billing
    Route::get('/billing-plan-edit/{userId}', [BillingController::class, 'show'])->name('billing.edit');

    Route::get('/pagar-crypto', function () {
        return inertia('crypto');
    })->name('crypto.pay');

    // Área de administración (solo usuarios con permiso 'administration')
    Route::prefix('admin')->middleware('can:administration')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.index');

        Route::get('/usuarios/{user}/editar', [AdminController::class, 'editUser'])->name('admin.users.edit');
        Route::put('/usuarios/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');

        Route::get('/medicos/{medico}/editar', [AdminController::class, 'editMedico'])->name('admin.medicos.edit');
        Route::put('/medicos/{medico}', [AdminController::class, 'updateMedico'])->name('admin.medicos.update');

        Route::get('/facturas/{factura}/editar', [AdminController::class, 'editFactura'])->name('admin.facturas.edit');
        Route::put('/facturas/{factura}', [AdminController::class, 'updateFactura'])->name('admin.facturas.update');

        Route::get('/reportes/{reporte}/editar', [AdminController::class, 'editReporte'])->name('admin.reportes.edit');
        Route::put('/reportes/{reporte}', [AdminController::class, 'updateReporte'])->name('admin.reportes.update');
    });

});

require __DIR__.'/settings.php';
