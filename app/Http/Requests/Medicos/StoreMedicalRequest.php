<?php

namespace App\Http\Requests\Medicos;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreMedicalRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Permite el acceso
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            // Datos personales
            'nombre' => 'required|alpha|max:100',
            'apellido' => 'required|alpha|max:100',
            'second_name' => 'nullable|alpha|max:100',
            'last_name' => 'nullable|alpha|max:100',
            'sexo' => 'required|string|max:50',
            'telefono' => 'required|string|max:255',
            'whatsapp' => 'nullable|string|max:255',
            'email_dr' => 'required|email|max:255|unique:medicos,correo',

            // Dirección
            'pais' => 'required|max:100',
            'estado' => 'required|max:100',
            'ciudad' => 'required|max:100',
            'direccion_completa' => 'required|max:500',

            // Redes sociales (opcionales)
            'facebook' => 'nullable|max:150',
            'twitter' => 'nullable|max:150',
            'linkedin' => 'nullable|max:150',
            'instagram' => 'nullable|max:150',

            // Información profesional
            'especialidad_id' => 'required|max:191',
            'experiencia' => 'required|numeric|max:100',
            'costo_consulta' => 'required|numeric|max:10000',
            'horario' => 'required|max:300',
            'leyenda_dr' => 'required|max:100',
            'perfil_med' => 'required|max:1500',
            'tratamientos' => 'required|max:1500',
            'codigo' => 'nullable|string|max:50', // Opcional, según tu frontend

            // Archivos
            'foto' => 'required|file|image|max:10240', // 10 MB
            'titulo_file' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240',

            // Relación con usuario
            'user_id' => 'required|unique:medicos,user_id',
        ];
    }

    /**
     * Mensajes de error personalizados.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            // Nombres
            'nombre.required' => 'El campo nombre es requerido',
            'nombre.alpha' => 'El nombre solo debe contener letras (sin espacios)',
            'nombre.max' => 'El nombre no debe superar los 100 caracteres',
            'apellido.required' => 'El campo apellido es requerido',
            'apellido.alpha' => 'El apellido solo debe contener letras (sin espacios)',
            'apellido.max' => 'El apellido no debe superar los 100 caracteres',
            'second_name.alpha' => 'El segundo nombre solo debe contener letras',
            'second_name.max' => 'El segundo nombre no debe superar los 100 caracteres',
            'last_name.alpha' => 'El segundo apellido solo debe contener letras',
            'last_name.max' => 'El segundo apellido no debe superar los 100 caracteres',

            // Sexo
            'sexo.required' => 'El campo sexo es requerido',

            // Teléfono / WhatsApp
            'telefono.required' => 'El campo teléfono es requerido',
            'telefono.max' => 'El teléfono no debe superar los 255 caracteres',
            'whatsapp.max' => 'El WhatsApp no debe superar los 255 caracteres',

            // Email
            'email_dr.required' => 'El correo electrónico es requerido',
            'email_dr.email' => 'Debe ser un correo electrónico válido',
            'email_dr.unique' => 'Este correo ya está registrado en la base de datos',

            // Dirección
            'pais.required' => 'El país es requerido',
            'pais.max' => 'El país no debe superar los 100 caracteres',
            'estado.required' => 'El estado es requerido',
            'estado.max' => 'El estado no debe superar los 100 caracteres',
            'ciudad.required' => 'La ciudad es requerida',
            'ciudad.max' => 'La ciudad no debe superar los 100 caracteres',
            'direccion_completa.required' => 'La dirección completa es requerida',
            'direccion_completa.max' => 'La dirección no debe superar los 500 caracteres',

            // Redes sociales
            'facebook.max' => 'El enlace de Facebook no debe superar los 150 caracteres',
            'twitter.max' => 'El enlace de Twitter no debe superar los 150 caracteres',
            'linkedin.max' => 'El enlace de LinkedIn no debe superar los 150 caracteres',
            'instagram.max' => 'El enlace de Instagram no debe superar los 150 caracteres',

            // Especialidad y experiencia
            'especialidad_id.required' => 'La especialidad es requerida',
            'especialidad_id.max' => 'El ID de especialidad no debe superar los 191 caracteres',
            'experiencia.required' => 'Los años de experiencia son requeridos',
            'experiencia.numeric' => 'La experiencia debe ser un número',
            'experiencia.max' => 'La experiencia no debe superar los 100 años',

            // Costo
            'costo_consulta.required' => 'El costo de la consulta es requerido',
            'costo_consulta.numeric' => 'El costo debe ser un número',
            'costo_consulta.max' => 'El costo no debe superar los 10000 dólares',

            // Horario y leyenda
            'horario.required' => 'El horario de atención es requerido',
            'horario.max' => 'El horario no debe superar los 300 caracteres',
            'leyenda_dr.required' => 'El campo "Usted es" es requerido',
            'leyenda_dr.max' => 'La leyenda no debe superar los 100 caracteres',

            // Perfil y tratamientos
            'perfil_med.required' => 'El perfil médico es requerido',
            'perfil_med.max' => 'El perfil médico no debe superar los 1500 caracteres',
            'tratamientos.required' => 'Los tratamientos son requeridos',
            'tratamientos.max' => 'Los tratamientos no deben superar los 1500 caracteres',

            // Archivos
            'foto.required' => 'La foto profesional es requerida',
            'foto.file' => 'Debe ser un archivo de imagen',
            'foto.image' => 'Debe ser una imagen (jpg, jpeg, png, etc.)',
            'foto.max' => 'El tamaño de la foto no debe superar los 10 MB',
            'titulo_file.required' => 'El archivo del título es requerido',
            'titulo_file.file' => 'Debe ser un archivo',
            'titulo_file.mimes' => 'Solo se permiten archivos PDF, JPG, JPEG o PNG',
            'titulo_file.max' => 'El archivo del título no debe superar los 10 MB',

            // User ID
            'user_id.required' => 'El ID de usuario es requerido',
            'user_id.unique' => 'Solo puedes crear un perfil médico por usuario',
        ];
    }
}
