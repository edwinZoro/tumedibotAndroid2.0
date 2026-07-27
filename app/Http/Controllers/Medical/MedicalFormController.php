<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medicos\StoreMedicalRequest;
use App\Models\Medico;
use App\Models\User;
use HTMLPurifier;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class MedicalFormController extends Controller
{
    /**
     * Muestra el formulario de registro médico (usado por Inertia).
     */
    public function show(Request $request, $id): Response
    {
        return Inertia::render('medicos/medical-form', [
            'userId' => $id,
        ]);
    }

    /**
     * Muestra el formulario de edición médica con datos precargados.
     */
    public function edit(Request $request, $id): Response
    {
        $medico = Medico::with(['especialidad', 'pais', 'estado', 'ciudad'])->findOrFail($id);

        if ($medico->user_id !== Auth::id()) {
            abort(403, 'No autorizado');
        }

        return Inertia::render('medicos/medical-edit-form', [
            'medico' => $medico,
            'userId' => Auth::id(),
        ]);
    }

    /**
     * Almacena los datos del formulario médico.
     *
     * @return JsonResponse
     */
    public function store(StoreMedicalRequest $request)
    {
        $data = $request->validated();

        // 🔒 Seguridad: verificar que el usuario autenticado coincide con el enviado
        $user_id = Auth::id();
        if (! $user_id) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // ─── 📸 Manejo de la foto profesional ──────────────────────────────
        $foto = $request->file('foto');
        $imagen_hashName = $foto->hashName();

        // Guardar en public_html/imagen (y copiar a public_html/images)
        $destino_public_imagen = base_path('public/imagen');
        if (! File::isDirectory($destino_public_imagen)) {
            File::makeDirectory($destino_public_imagen, 0777, true, true);
        }
        $foto->move($destino_public_imagen, $imagen_hashName);

        $destino_public_images = base_path('public/images');
        if (! File::isDirectory($destino_public_images)) {
            File::makeDirectory($destino_public_images, 0777, true, true);
        }
        File::copy(
            $destino_public_imagen.'/'.$imagen_hashName,
            $destino_public_images.'/'.$imagen_hashName
        );

        // ─── 📄 Manejo del título profesional ──────────────────────────────
        $titulo = $request->file('titulo_file');
        $name_original = $titulo->getClientOriginalName();
        $name_temp = $titulo->hashName();
        $titulo->storeAs('public/medicos/titulos', $name_temp);
        $url = Storage::url('medicos/titulos');

        // ─── 🧹 Sanitizar HTML (perfil_med y tratamientos) ──────────────────
        $purifier = new HTMLPurifier(config('purifier.config'));
        $perfilMedico = $purifier->purify($data['perfil_med']);
        $tratamientos = $purifier->purify($data['tratamientos']);

        // ─── 💾 Guardar en la base de datos ──────────────────────────────────
        $medico = Medico::create([
            'nombre' => $data['nombre'],
            'apellido' => $data['apellido'],
            'second_name' => $data['second_name'] ?? null,
            'last_name' => $data['last_name'] ?? null,
            'sexo' => $data['sexo'],
            'telefono' => $data['telefono'],
            'whatsapp' => $data['whatsapp'] ?? null,
            'correo' => $data['email_dr'],
            'pais_id' => $data['pais'],
            'estado_id' => $data['estado'],
            'ciudad_id' => $data['ciudad'],
            'direccion' => $data['direccion_completa'],
            'especialidad_id' => $data['especialidad_id'],
            'consultorio_costo' => $data['costo_consulta'],
            'horario' => $data['horario'],
            'experiencia' => $data['experiencia'],
            'usted_es' => $data['leyenda_dr'],
            'foto' => $imagen_hashName,
            'perfil_medico' => $perfilMedico,
            'tratamientos' => $tratamientos,
            'facebook' => $data['facebook'] ?? null,
            'twitter' => $data['twitter'] ?? null,
            'linkedin' => $data['linkedin'] ?? null,
            'instagram' => $data['instagram'] ?? null,
            'pagos' => 'positive',
            'route' => $url,
            'name_original' => $name_original,
            'name_temp' => $name_temp,
            'user_id' => Auth::id(),
        ]);

        // ─── 👤 Actualizar el usuario con pagos = 'positive' ──────────────
        $user = User::find(Auth::id());
        if ($user) {
            $user->pagos = 'positive';
            $user->save();
        }

        // ─── ✅ Respuesta JSON (coincide con lo que espera el frontend) ────
        return response()->json([
            'success' => true,
            'redirect' => route('dashboard'),
        ]);
    }

    /**
     * Actualiza los datos del médico existente.
     *
     * @param  int  $id
     * @return JsonResponse
     */
    public function update(Request $request, $id)
    {
        $medico = Medico::findOrFail($id);

        if ($medico->user_id !== Auth::id()) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|string|min:2|max:255',
            'apellido' => 'sometimes|string|min:2|max:255',
            'second_name' => 'sometimes|nullable|string|max:255',
            'last_name' => 'sometimes|nullable|string|max:255',
            'sexo' => 'sometimes|string|in:MASCULINO,FEMENINO',
            'telefono' => 'sometimes|string|max:20',
            'whatsapp' => 'sometimes|nullable|string|max:20',
            'email_dr' => 'sometimes|email|max:255',
            'pais' => 'sometimes|string',
            'estado' => 'sometimes|string',
            'ciudad' => 'sometimes|string',
            'direccion_completa' => 'sometimes|string|min:10',
            'especialidad_id' => 'sometimes|string',
            'experiencia' => 'sometimes|numeric|min:1|max:100',
            'costo_consulta' => 'sometimes|numeric|min:0',
            'horario' => 'sometimes|string',
            'leyenda_dr' => 'sometimes|string|min:2',
            'perfil_med' => 'sometimes|string|min:100',
            'tratamientos' => 'sometimes|string|min:100',
            'facebook' => 'sometimes|nullable|string',
            'twitter' => 'sometimes|nullable|string',
            'linkedin' => 'sometimes|nullable|string',
            'instagram' => 'sometimes|nullable|string',
            'foto' => 'sometimes|image|mimes:png,jpg,jpeg|max:5120',
            'titulo_file' => 'sometimes|file|mimes:pdf,png,jpg,jpeg|max:5120',
        ]);

        $data = $validated;

        // ─── 📸 Manejo de la foto profesional (si se subió una nueva) ─────
        if ($request->hasFile('foto')) {
            $foto = $request->file('foto');
            $imagen_hashName = $foto->hashName();

            $destino_public_imagen = base_path('public/imagen');
            if (! File::isDirectory($destino_public_imagen)) {
                File::makeDirectory($destino_public_imagen, 0777, true, true);
            }
            $foto->move($destino_public_imagen, $imagen_hashName);

            $destino_public_images = base_path('public/images');
            if (! File::isDirectory($destino_public_images)) {
                File::makeDirectory($destino_public_images, 0777, true, true);
            }
            File::copy(
                $destino_public_imagen.'/'.$imagen_hashName,
                $destino_public_images.'/'.$imagen_hashName
            );

            $data['foto'] = $imagen_hashName;
        }

        // ─── 📄 Manejo del título profesional (si se subió uno nuevo) ────
        if ($request->hasFile('titulo_file')) {
            $titulo = $request->file('titulo_file');
            $data['name_original'] = $titulo->getClientOriginalName();
            $data['name_temp'] = $titulo->hashName();
            $titulo->storeAs('public/medicos/titulos', $data['name_temp']);
            $data['route'] = Storage::url('medicos/titulos');
        }

        // ─── 🧹 Sanitizar HTML ─────────────────────────────────────────────
        if (isset($data['perfil_med'])) {
            $purifier = new HTMLPurifier(config('purifier.config'));
            $data['perfil_medico'] = $purifier->purify($data['perfil_med']);
            unset($data['perfil_med']);
        }
        if (isset($data['tratamientos'])) {
            if (! isset($purifier)) {
                $purifier = new HTMLPurifier(config('purifier.config'));
            }
            $data['tratamientos'] = $purifier->purify($data['tratamientos']);
        }

        // ─── Mapear campos del frontend a columnas de BD ────────────────────
        $updateData = [];
        if (isset($data['nombre'])) {
            $updateData['nombre'] = $data['nombre'];
        }
        if (isset($data['apellido'])) {
            $updateData['apellido'] = $data['apellido'];
        }
        if (array_key_exists('second_name', $data)) {
            $updateData['second_name'] = $data['second_name'];
        }
        if (array_key_exists('last_name', $data)) {
            $updateData['last_name'] = $data['last_name'];
        }
        if (isset($data['sexo'])) {
            $updateData['sexo'] = $data['sexo'];
        }
        if (isset($data['telefono'])) {
            $updateData['telefono'] = $data['telefono'];
        }
        if (array_key_exists('whatsapp', $data)) {
            $updateData['whatsapp'] = $data['whatsapp'];
        }
        if (isset($data['email_dr'])) {
            $updateData['correo'] = $data['email_dr'];
        }
        if (isset($data['pais'])) {
            $updateData['pais_id'] = $data['pais'];
        }
        if (isset($data['estado'])) {
            $updateData['estado_id'] = $data['estado'];
        }
        if (isset($data['ciudad'])) {
            $updateData['ciudad_id'] = $data['ciudad'];
        }
        if (isset($data['direccion_completa'])) {
            $updateData['direccion'] = $data['direccion_completa'];
        }
        if (isset($data['especialidad_id'])) {
            $updateData['especialidad_id'] = $data['especialidad_id'];
        }
        if (isset($data['costo_consulta'])) {
            $updateData['consultorio_costo'] = $data['costo_consulta'];
        }
        if (isset($data['horario'])) {
            $updateData['horario'] = $data['horario'];
        }
        if (isset($data['experiencia'])) {
            $updateData['experiencia'] = $data['experiencia'];
        }
        if (isset($data['leyenda_dr'])) {
            $updateData['usted_es'] = $data['leyenda_dr'];
        }
        if (isset($data['perfil_medico'])) {
            $updateData['perfil_medico'] = $data['perfil_medico'];
        }
        if (array_key_exists('facebook', $data)) {
            $updateData['facebook'] = $data['facebook'];
        }
        if (array_key_exists('twitter', $data)) {
            $updateData['twitter'] = $data['twitter'];
        }
        if (array_key_exists('linkedin', $data)) {
            $updateData['linkedin'] = $data['linkedin'];
        }
        if (array_key_exists('instagram', $data)) {
            $updateData['instagram'] = $data['instagram'];
        }
        if (isset($data['foto'])) {
            $updateData['foto'] = $data['foto'];
        }
        if (isset($data['route'])) {
            $updateData['route'] = $data['route'];
        }
        if (isset($data['name_original'])) {
            $updateData['name_original'] = $data['name_original'];
        }
        if (isset($data['name_temp'])) {
            $updateData['name_temp'] = $data['name_temp'];
        }

        $medico->update($updateData);

        return response()->json([
            'success' => true,
            'redirect' => route('medicos.area'),
        ]);
    }
}
