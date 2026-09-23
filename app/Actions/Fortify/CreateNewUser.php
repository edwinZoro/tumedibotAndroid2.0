<?php

namespace App\Actions\Fortify;

use App\Concerns\PasswordValidationRules;
use App\Concerns\ProfileValidationRules;
use App\Models\ConsentLog;
use App\Models\User;
use App\Rules\Recaptcha;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules, ProfileValidationRules;

    public function __construct(protected Request $request) {}

    /**
     * Valida los datos y crea un nuevo usuario registrado.
     *
     * También registra el consentimiento legal en la tabla consent_logs
     * con la IP real, user-agent y versión de política vigente.
     *
     * @param  array<string, mixed>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            ...$this->profileRules(),
            'password' => $this->passwordRules(),
            'g-recaptcha-response' => ['required', 'string', new Recaptcha],
            'privacy_accepted' => ['required', 'accepted'],
        ], [
            'privacy_accepted.required' => 'Debes aceptar los Términos, Política de Privacidad y Política de Cookies.',
            'privacy_accepted.accepted' => 'Debes aceptar los Términos, Política de Privacidad y Política de Cookies.',
        ])->validate();

        // Timestamp ISO de la aceptación (también queda en la columna `privacy` del usuario)
        $acceptedAt = now();

        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $input['password'],
            'privacy' => $acceptedAt->toIso8601String(),
        ]);

        // Registrar consentimiento completo en la tabla de auditoría
        ConsentLog::record(
            userId: $user->id,
            request: $this->request,
            type: 'all',
            policyVersion: config('app.policy_version', 'v1.0'),
        );

        return $user;
    }
}
