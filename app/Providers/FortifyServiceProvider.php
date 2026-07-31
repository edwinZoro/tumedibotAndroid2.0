<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log; // ← importa

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {

    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();

        Fortify::authenticateUsing(function ($request) {
        // 1. Si ya verificamos reCAPTCHA en esta sesión, saltamos la comprobación
        if (!session()->has('recaptcha_verified')) {
            $token = $request->input('g-recaptcha-response');

            if (!$token) {
                throw ValidationException::withMessages([
                    'g-recaptcha-response' => 'Falta el token de reCAPTCHA.',
                ]);
            }

            $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
                'secret' => config('recaptcha.secret_key'),
                'response' => $token,
            ]);

            $body = $response->json();

            Log::info('reCAPTCHA response', $body);

            // Si la verificación falla
            if (!$body['success']) {
                $errorCodes = $body['error-codes'] ?? [];

                // Si es timeout-or-duplicate, significa que el token ya se usó,
                // pero como estamos en el primer intento, podría ser un doble envío.
                // En ese caso, forzamos una nueva verificación (pero mejor lo manejamos)
                if (in_array('timeout-or-duplicate', $errorCodes)) {
                    // Podemos reintentar una vez con un nuevo token? No, el token ya expiró.
                    // Lanzamos error pidiendo que recargue la página.
                    throw ValidationException::withMessages([
                        'g-recaptcha-response' => 'El token de seguridad ha expirado. Recarga la página e intenta de nuevo.',
                    ]);
                }

                // Otros errores
                throw ValidationException::withMessages([
                    'g-recaptcha-response' => 'Verificación de reCAPTCHA fallida. Inténtalo de nuevo.',
                ]);
            }

            // Verificación exitosa: guardamos el flag en la sesión
            session()->put('recaptcha_verified', true);
        }

        // 2. Ahora autenticamos al usuario
        $user = \App\Models\User::where('email', $request->email)->first();

        if ($user && \Illuminate\Support\Facades\Hash::check($request->password, $user->password)) {
            return $user;
        }

        return null;
    });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn (Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn (Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::requestPasswordResetLinkView(fn (Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn (Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::registerView(fn () => Inertia::render('auth/register', [
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]));

        Fortify::twoFactorChallengeView(fn () => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn () => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())).'|'.$request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('passkeys', function (Request $request) {
            return Limit::perMinute(10)->by(
                ($request->input('credential.id') ?: $request->session()->getId()).'|'.$request->ip(),
            );
        });
    }
}
