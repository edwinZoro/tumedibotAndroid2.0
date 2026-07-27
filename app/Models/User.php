<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Notifications\UserResetPassword;
use App\Notifications\VerifyCorreo;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\Contracts\PasskeyUser;
use Laravel\Fortify\PasskeyAuthenticatable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use Spatie\Permission\Traits\HasRoles;

#[Fillable(['name', 'email', 'password', 'pagos', 'pagos_clinica', 'privacy', 'confirmacion_codigo'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable implements PasskeyUser
{
    /** @use HasFactory<UserFactory> */
    use HasRoles, HasFactory, Notifiable, PasskeyAuthenticatable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }

    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new UserResetPassword($token));
    }

    /**
     * Envía la notificación de verificación de correo electrónico.
     */
    public function sendEmailVerificationNotification(): void
    {
        $this->notify(new VerifyCorreo);
    }

    /**
     * =========================================================================
     * RELACIONES
     * =========================================================================
     */

    /**
     * Obtiene el perfil de médico asociado al usuario (si aplica).
     */
    public function medico(): HasOne
    {
        return $this->hasOne(Medico::class, 'user_id');
    }

    /**
     * Obtiene el perfil de paciente asociado al usuario (si aplica).
     */
    public function paciente(): HasOne
    {
        // Nota: Si Paciente hereda directamente de User por relaciones de negocio,
        // mantén la clave foránea 'user_id' en la tabla 'pacientes'.
        return $this->hasOne(Paciente::class, 'user_id');
    }

    /**
     * Obtiene los datos de facturación (Factura) asociados al usuario.
     */
    public function factura(): HasOne
    {
        return $this->hasOne(Factura::class, 'user_id');
    }

}
