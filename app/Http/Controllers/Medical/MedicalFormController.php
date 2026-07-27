<?php

namespace App\Http\Controllers\Medical;

use App\Http\Controllers\Controller;
use App\Http\Requests\Medicos\StoreMedicalRequest;
use App\Models\Medico;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Inertia\Inertia;
use HTMLPurifier;
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
     * Almacena los datos del formulario médico.
     *
     * @param  StoreMedicalRequest  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(StoreMedicalRequest $request)
    {
        $data = $request->validated();

        // 🔒 Seguridad: verificar que el usuario autenticado coincide con el enviado
        $user_id = Auth::id();
        if (!$user_id) {
            return response()->json(['message' => 'No autenticado'], 401);
        }

        // ─── 📸 Manejo de la foto profesional ──────────────────────────────
        $foto = $request->file('foto');
        $imagen_hashName = $foto->hashName();

        // Guardar en public_html/imagen (y copiar a public_html/images)
        $destino_public_imagen = base_path('public/imagen');
        if (!File::isDirectory($destino_public_imagen)) {
            File::makeDirectory($destino_public_imagen, 0777, true, true);
        }
        $foto->move($destino_public_imagen, $imagen_hashName);

        $destino_public_images = base_path('public/images');
        if (!File::isDirectory($destino_public_images)) {
            File::makeDirectory($destino_public_images, 0777, true, true);
        }
        File::copy(
            $destino_public_imagen . '/' . $imagen_hashName,
            $destino_public_images . '/' . $imagen_hashName
        );

        // ─── 📄 Manejo del título profesional ──────────────────────────────
        $titulo = $request->file('titulo_file');
        $name_original = $titulo->getClientOriginalName();
        $name_temp = $titulo->hashName();
        $titulo->storeAs('public/medicos/titulos', $name_temp);
        $url = Storage::url('medicos/titulos');

        // ─── 🧹 Sanitizar HTML (perfil_med y tratamientos) ──────────────────
        $purifier = new \HTMLPurifier(config('purifier.config'));
        $perfilMedico = $purifier->purify($data['perfil_med']);
        $tratamientos = $purifier->purify($data['tratamientos']);

        // ─── 💾 Guardar en la base de datos ──────────────────────────────────
        $medico = Medico::create([
            'nombre'            => $data['nombre'],
            'apellido'          => $data['apellido'],
            'second_name'       => $data['second_name'] ?? null,
            'last_name'         => $data['last_name'] ?? null,
            'sexo'              => $data['sexo'],
            'telefono'          => $data['telefono'],
            'whatsapp'          => $data['whatsapp'] ?? null,
            'correo'            => $data['email_dr'],
            'pais_id'           => $data['pais'],
            'estado_id'         => $data['estado'],
            'ciudad_id'         => $data['ciudad'],
            'direccion'         => $data['direccion_completa'],
            'especialidad_id'   => $data['especialidad_id'],
            'consultorio_costo' => $data['costo_consulta'],
            'horario'           => $data['horario'],
            'experiencia'       => $data['experiencia'],
            'usted_es'          => $data['leyenda_dr'],
            'foto'              => $imagen_hashName,
            'perfil_medico'     => $perfilMedico,
            'tratamientos'      => $tratamientos,
            'facebook'          => $data['facebook'] ?? null,
            'twitter'           => $data['twitter'] ?? null,
            'linkedin'          => $data['linkedin'] ?? null,
            'instagram'         => $data['instagram'] ?? null,
            'pagos'             => 'positive',
            'route'             => $url,
            'name_original'     => $name_original,
            'name_temp'         => $name_temp,
            'user_id'           => Auth::id(),
        ]);

        // ─── 👤 Actualizar el usuario con pagos = 'positive' ──────────────
        $user = User::find(Auth::id());
        if ($user) {
            $user->pagos = 'positive';
            $user->save();
        }

        // ─── ✅ Respuesta JSON (coincide con lo que espera el frontend) ────
        return response()->json([
            'success'  => true,
            'redirect' => route('dashboard'),
        ]);
    }
}
