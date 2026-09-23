<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Billings\BillingController;
use App\Http\Controllers\Billings\InvoiceController;
use App\Http\Controllers\Medical\ConfiguracionFirmaController;
use App\Http\Controllers\Medical\HistorialController;
use App\Http\Controllers\Medical\MedicalAreaController;
use App\Http\Controllers\Medical\MedicalFormController;
use App\Http\Controllers\Medical\MedicamentoController;
use App\Http\Controllers\Medical\MedicoArchivosController;
use App\Http\Controllers\Medical\MedicoCitasController;
use App\Http\Controllers\Medical\MedicoIoMTController;
use App\Http\Controllers\Medical\MedicoPacientesController;
use App\Http\Controllers\Medical\MedicoReportController;
use App\Http\Controllers\Medical\MedicoSearchController;
use App\Http\Controllers\Medical\NotaController;
use App\Http\Controllers\Medical\ProfileMedical;
use App\Http\Controllers\Medical\RecetaController;
use App\Http\Controllers\NotificacionController;
use App\Http\Controllers\Paciente\ArchivosController;
use App\Http\Controllers\Paciente\CitasController;
use App\Http\Controllers\Paciente\DatosMedicosController;
use App\Http\Controllers\Paciente\HistorialPacienteController;
use App\Http\Controllers\Paciente\IoMTController;
use App\Http\Controllers\Paciente\RecetaPacienteController;
use App\Http\Controllers\Paciente\RecordatorioMedicamentoController;
use App\Http\Controllers\VideoCallController;
use App\Models\Especialidades;
use App\Models\Factura;
use App\Models\Pais;
use App\Models\State;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::inertia('/', 'welcome')->name('home');
Route::post('/enviar_correo', [ProfileMedical::class, 'enviarMensajeDoctor'])->name('enviar_correo');
// Ruta pública accesible para cualquier visitante
Route::get('/terminos-de-servicio', function () {
    return Inertia::render('policys/terms');
})->name('terms');

Route::get('/politica-de-privacidad', function () {
    return Inertia::render('policys/privacy');
})->name('privacy');

Route::get('/politica-de-cookies', function () {
    return Inertia::render('policys/cookies');
})->name('cookies');

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

Route::get('/medicalfoo/mispacientes', function () {
    return inertia('medicalfoo/mispacientes');
})->name('medicalfoo.mispacientes');

Route::get('/medicalfoo/miagenda', function () {
    return inertia('medicalfoo/miagenda');
})->name('medicalfoo.miagenda');

Route::get('/medicalfoo/archivos', function () {
    return inertia('medicalfoo/archivos');
})->name('medicalfoo.archivos');

Route::get('/medicalfoo/video', function () {
    return inertia('medicalfoo/video');
})->name('medicalfoo.video');

Route::get('/patientfoo/video', function () {
    return inertia('patientfoo/video');
})->name('patientfoo.video');

Route::get('/patientfoo/iomt-info', function () {
    return inertia('patientfoo/iomt-info');
})->name('patientfoo.iomt-info');

Route::get('/medicalfoo/iomt-info', function () {
    return inertia('medicalfoo/iomt-info');
})->name('medicalfoo.iomt-info');

Route::get('/patientfoo/medicaldata', function () {
    return inertia('patientfoo/medicaldata');
})->name('patientfoo.medicaldata');

Route::get('/patientfoo/myfiles', function () {
    return inertia('patientfoo/myfiles');
})->name('patientfoo.myfiles');

Route::get('/patientfoo/myappoinments', function () {
    return inertia('patientfoo/myappoinments');
})->name('patientfoo.myappoinments');

Route::get('/patientfoo/mymedicines', function () {
    return inertia('patientfoo/mymedicines');
})->name('patientfoo.mymedicines');

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

    // Notificaciones internas
    Route::get('/notificaciones', [NotificacionController::class, 'index'])
        ->name('notificaciones.index');
    Route::patch('/notificaciones/{id}/leer', [NotificacionController::class, 'markAsRead'])
        ->name('notificaciones.leer');
    Route::post('/notificaciones/leer-todas', [NotificacionController::class, 'markAllRead'])
        ->name('notificaciones.leer-todas');
    Route::delete('/notificaciones/eliminar-todas', [NotificacionController::class, 'destroyAll'])
        ->name('notificaciones.eliminar-todas');

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

    // Recordatorios de medicamentos del paciente
    Route::get('/paciente/mis-medicamentos', [RecordatorioMedicamentoController::class, 'index'])
        ->name('pacientes.medicamentos');
    Route::get('/api/medicamentos/buscar', [RecordatorioMedicamentoController::class, 'searchMedicamentos'])
        ->name('pacientes.medicamentos.buscar');
    Route::post('/paciente/mis-medicamentos', [RecordatorioMedicamentoController::class, 'store'])
        ->name('pacientes.medicamentos.store');
    Route::patch('/paciente/mis-medicamentos/{recordatorio}/toggle', [RecordatorioMedicamentoController::class, 'toggle'])
        ->name('pacientes.medicamentos.toggle');
    Route::delete('/paciente/mis-medicamentos/{recordatorio}', [RecordatorioMedicamentoController::class, 'destroy'])
        ->name('pacientes.medicamentos.destroy');

    // Monitoreo IoMT del Paciente
    Route::get('/paciente/monitoreo-iomt', [IoMTController::class, 'index'])
        ->name('pacientes.iomt');
    Route::post('/paciente/monitoreo-iomt', [IoMTController::class, 'store'])
        ->name('pacientes.iomt.store');
    Route::put('/paciente/monitoreo-iomt/{iomt}', [IoMTController::class, 'update'])
        ->name('pacientes.iomt.update');
    Route::delete('/paciente/monitoreo-iomt/{iomt}', [IoMTController::class, 'destroy'])
        ->name('pacientes.iomt.destroy');
    Route::patch('/paciente/monitoreo-iomt/compartir', [IoMTController::class, 'compartir'])
        ->name('pacientes.iomt.compartir');

    // PDF del historial clínico compartido por el médico
    Route::get('/paciente/historial/{historial}/pdf', [HistorialPacienteController::class, 'pdfSingle'])
        ->name('pacientes.historial.pdf');

    // PDF de la receta médica compartida por el médico
    Route::get('/paciente/receta/{receta}/pdf', [RecetaPacienteController::class, 'pdfSingle'])
        ->name('pacientes.receta.pdf');

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

    // Monitorización IoMT de Pacientes Compartidos
    Route::get('/medico/monitorizacion-iomt', [MedicoIoMTController::class, 'index'])
        ->name('medicos.iomt.index');
    Route::get('/medico/monitorizacion-iomt/{paciente}', [MedicoIoMTController::class, 'show'])
        ->name('medicos.iomt.show');

    // Crear nueva cita completa para un paciente del consultorio (desde Mis Pacientes)
    Route::post('/medico/mis-pacientes/{paciente}/cita', [MedicoPacientesController::class, 'storeCita'])
        ->name('medicos.pacientes.cita.store');

    // Asignar / actualizar fecha de una cita existente (desde Mis Pacientes)
    Route::put('/medico/mis-pacientes/cita/{cita}/fecha', [MedicoPacientesController::class, 'asignarFechaCita'])
        ->name('medicos.pacientes.cita.fecha');

    // Historial Clínico
    Route::get('/medico/historial/{citaPaciente}', [HistorialController::class, 'index'])->name('medicos.historial.index');
    Route::post('/medico/historial/{citaPaciente}', [HistorialController::class, 'store'])->name('medicos.historial.store');
    Route::put('/medico/historial/{historial}', [HistorialController::class, 'update'])->name('medicos.historial.update');
    Route::delete('/medico/historial/{historial}', [HistorialController::class, 'destroy'])->name('medicos.historial.destroy');
    Route::get('/medico/historial/{historial}/pdf', [HistorialController::class, 'pdfSingle'])->name('medicos.historial.pdf');
    Route::post('/medico/historial/{historial}/enviar-email', [HistorialController::class, 'enviarEmail'])->name('medicos.historial.enviar-email');
    Route::patch('/medico/historial/{historial}/compartir', [HistorialController::class, 'toggleCompartir'])->name('medicos.historial.compartir');

    // Configuración de firma, sello, logo y hospital del médico (global, reutilizable)
    Route::get('/medico/configuracion-firma', [ConfiguracionFirmaController::class, 'show'])->name('medicos.configuracion-firma.show');
    Route::put('/medico/configuracion-firma', [ConfiguracionFirmaController::class, 'update'])->name('medicos.configuracion-firma.update');

    // Recetas médicas
    Route::get('/medico/receta/{citaPaciente}', [RecetaController::class, 'index'])->name('medicos.receta.index');
    Route::post('/medico/receta/{citaPaciente}', [RecetaController::class, 'store'])->name('medicos.receta.store');
    Route::put('/medico/receta/{receta}', [RecetaController::class, 'update'])->name('medicos.receta.update');
    Route::delete('/medico/receta/{receta}', [RecetaController::class, 'destroy'])->name('medicos.receta.destroy');
    Route::patch('/medico/receta/{receta}/compartir', [RecetaController::class, 'toggleCompartir'])->name('medicos.receta.compartir');
    Route::get('/medico/receta/{receta}/pdf', [RecetaController::class, 'pdfSingle'])->name('medicos.receta.pdf');
    Route::post('/medico/receta/{receta}/enviar-email', [RecetaController::class, 'enviarEmail'])->name('medicos.receta.enviar-email');

    // Notas médicas
    Route::get('/medico/nota/{citaPaciente}', [NotaController::class, 'index'])->name('medicos.nota.index');
    Route::post('/medico/nota/{citaPaciente}', [NotaController::class, 'store'])->name('medicos.nota.store');
    Route::put('/medico/nota/{nota}', [NotaController::class, 'update'])->name('medicos.nota.update');
    Route::delete('/medico/nota/{nota}', [NotaController::class, 'destroy'])->name('medicos.nota.destroy');
    Route::patch('/medico/nota/{nota}/compartir', [NotaController::class, 'toggleCompartir'])->name('medicos.nota.compartir');

    // Búsqueda de medicamentos (autocompletado)
    Route::get('/medico/medicamentos/search', [MedicamentoController::class, 'search'])->name('medicos.medicamentos.search');

    // delete perfil medico
    Route::delete('/delete_medico_perfil/{medico}', [MedicalFormController::class, 'destroy'])
        ->name('medicos.destroy');

    // edit Billing
    Route::get('/billing-plan-edit/{userId}', [BillingController::class, 'show'])->name('billing.edit');

    Route::get('/pagar-crypto', function () {
        $factura = Factura::where('user_id', auth()->id())->first();
        $planPrecio = 0;
        $tituloPlan = '';
        if ($factura) {
            $planPrecio = $factura->plan === 'andromeda' ? 25 : ($factura->plan === 'fenix' ? 135 : 270);
            $tituloPlan = ucfirst($factura->plan);
        }

        return inertia('crypto', [
            'planPrecio' => $planPrecio,
            'tituloPlan' => $tituloPlan,
        ]);
    })->name('crypto.pay');

    // Área de administración (solo usuarios con permiso 'administration')
    Route::prefix('admin')->middleware('can:administration')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('admin.index');

        Route::get('/usuarios/{user}/editar', [AdminController::class, 'editUser'])->name('admin.users.edit');
        Route::put('/usuarios/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');

        Route::get('/medicos/{medico}/editar', [AdminController::class, 'editMedico'])->name('admin.medicos.edit');
        Route::put('/medicos/{medico}', [AdminController::class, 'updateMedico'])->name('admin.medicos.update');
        Route::get('/medicos/{medico}/titulo/descargar', [AdminController::class, 'descargarTitulo'])->name('admin.medicos.titulo.descargar');

        Route::get('/facturas/{factura}/editar', [AdminController::class, 'editFactura'])->name('admin.facturas.edit');
        Route::put('/facturas/{factura}', [AdminController::class, 'updateFactura'])->name('admin.facturas.update');

        Route::get('/reportes/{reporte}/editar', [AdminController::class, 'editReporte'])->name('admin.reportes.edit');
        Route::put('/reportes/{reporte}', [AdminController::class, 'updateReporte'])->name('admin.reportes.update');
    });

});

require __DIR__.'/settings.php';
