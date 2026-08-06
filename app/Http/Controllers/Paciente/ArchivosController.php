<?php

namespace App\Http\Controllers\Paciente;

use App\Http\Controllers\Controller;
use App\Models\Archivo;
use App\Models\Paciente;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ArchivosController extends Controller
{
    /**
     * Muestra la "Bóveda" de archivos del paciente autenticado.
     *
     * El paciente ve TODOS sus archivos y los médicos a los que puede
     * otorgarles (o quitarles) acceso mediante la tabla archivo_medico_acceso.
     */
    public function index(): Response
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        if (! $paciente) {
            return Inertia::render('Paciente/mis-archivos', [
                'tienePaciente' => false,
                'archivos' => [],
                'medicos' => [],
            ]);
        }

        $archivos = $paciente->archivos()
            ->with(['accesos.medico', 'subidoPor'])
            ->orderByDesc('id')
            ->get()
            ->map(fn (Archivo $archivo) => [
                'id' => $archivo->id,
                'nombre_archivo' => $archivo->nombre_archivo,
                'extension' => $archivo->extension,
                'tipo' => $archivo->tipo,
                'tamanio' => $this->tamanio($archivo),
                'compartido_con' => $archivo->accesos->map(fn ($acceso) => [
                    'medico_id' => $acceso->medico_id,
                    'nombre' => trim(($acceso->medico->nombre ?? '').' '.($acceso->medico->apellido ?? '')),
                    'otorgado_en' => $acceso->otorgado_en,
                ])->values(),
            ]);

        $medicos = $paciente->medicos()
            ->get(['medicos.id', 'medicos.nombre', 'medicos.apellido'])
            ->map(fn ($medico) => [
                'id' => $medico->id,
                'nombre' => trim(($medico->nombre ?? '').' '.($medico->apellido ?? '')),
            ]);

        return Inertia::render('Paciente/mis-archivos', [
            'tienePaciente' => true,
            'archivos' => $archivos,
            'medicos' => $medicos,
        ]);
    }

    /**
     * Sube un archivo a la bóveda del paciente autenticado.
     */
    public function store(Request $request): RedirectResponse
    {
        $paciente = Paciente::where('user_id', Auth::id())->first();

        abort_unless($paciente, 422, 'Primero completa tus datos médicos.');

        $validated = $request->validate([
            'archivo' => [
                'required',
                'file',
                'max:20480',
                'mimes:pdf,jpeg,jpg,png,doc,docx,xls,xlsx,txt',
            ],
            'tipo' => ['required', 'string', 'in:EXAMEN,RADIOLOGÍA,RECETA,LABORATORIO,RECOMENDACION,OTRO'],
        ]);

        /** @var UploadedFile $archivoSubido */
        $archivoSubido = $validated['archivo'];
        $extension = strtolower($archivoSubido->getClientOriginalExtension());

        $ruta = $archivoSubido->storeAs(
            'archivos',
            Str::uuid()->toString().'.'.$extension,
            'local',
        );

        abort_unless($ruta, 500, 'No se pudo almacenar el archivo.');

        Archivo::create([
            'paciente_id' => $paciente->id,
            'subido_por_user_id' => Auth::id(),
            'nombre_archivo' => $archivoSubido->getClientOriginalName(),
            'ruta_archivo' => $ruta,
            'extension' => $extension,
            'tipo' => $validated['tipo'],
        ]);

        return back()->with('success', 'Archivo subido correctamente.');
    }

    /**
     * Otorga o revoca el acceso de los médicos a un archivo.
     *
     * Recibe la lista completa de médico_ids que deben tener acceso; cualquier
     * acceso existente que no esté en la lista se elimina.
     */
    public function compartir(Request $request, Archivo $archivo): RedirectResponse
    {
        $this->authorizeDueño($archivo);

        $paciente = $archivo->paciente;

        $medicoIdsPermitidos = $paciente->medicos()->pluck('medicos.id');

        $validated = $request->validate([
            'medico_ids' => ['present', 'array'],
            'medico_ids.*' => ['integer', 'distinct', 'in:'.$medicoIdsPermitidos->implode(',')],
        ]);

        $archivo->medicos()->sync($validated['medico_ids']);

        return back()->with('success', 'Accesos actualizados correctamente.');
    }

    /**
     * Elimina el archivo de la bóveda y también de disco.
     */
    public function destroy(Archivo $archivo): RedirectResponse
    {
        $this->authorizeDueño($archivo);

        Storage::disk('local')->delete($archivo->ruta_archivo);
        $archivo->delete();

        return back()->with('success', 'Archivo eliminado correctamente.');
    }

    /**
     * Descarga el archivo. Solo el dueño o un médico con acceso explícito.
     */
    public function descargar(Archivo $archivo): BinaryFileResponse|StreamedResponse
    {
        $this->authorizeAcceso($archivo);

        return Storage::disk('local')->download($archivo->ruta_archivo, $archivo->nombre_archivo);
    }

    /**
     * Muestra el archivo en línea (imágenes y PDF). Solo dueño o médico con acceso.
     */
    public function ver(Archivo $archivo): BinaryFileResponse|StreamedResponse
    {
        $this->authorizeAcceso($archivo);

        return Storage::disk('local')->response($archivo->ruta_archivo, $archivo->nombre_archivo);
    }

    /**
     * Aborta si el usuario autenticado no es el dueño del archivo.
     */
    protected function authorizeDueño(Archivo $archivo): void
    {
        abort_unless($archivo->paciente->user_id === Auth::id(), 403, 'No autorizado');
    }

    /**
     * Aborta si el usuario no es el dueño ni un médico con acceso otorgado.
     */
    protected function authorizeAcceso(Archivo $archivo): void
    {
        if ($archivo->paciente->user_id === Auth::id()) {
            return;
        }

        $medico = Auth::user()->medico;

        abort_unless(
            $medico && $archivo->accesos()->where('medico_id', $medico->id)->exists(),
            403,
            'No autorizado',
        );
    }

    /**
     * Retorna el tamaño del archivo en bytes (o null si no existe).
     */
    protected function tamanio(Archivo $archivo): ?int
    {
        $disk = Storage::disk('local');

        return $disk->exists($archivo->ruta_archivo) ? $disk->size($archivo->ruta_archivo) : null;
    }
}
