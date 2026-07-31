import { Head, useForm } from '@inertiajs/react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { useState } from 'react';

// ── Componente interno que usa el hook de reCAPTCHA ──
const LoginForm = ({ status, canResetPassword }: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
        'g-recaptcha-response': '', // token que enviaremos al backend
    });

    const { executeRecaptcha } = useGoogleReCaptcha();
    const [recaptchaError, setRecaptchaError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!executeRecaptcha) {
            setRecaptchaError('reCAPTCHA no está disponible');
            return;
        }

        try {
            const token = await executeRecaptcha('login');
            setData('g-recaptcha-response', token);
            setRecaptchaError(null);

            // Enviar el formulario
            post('/login', {
                onError: (err) => {
                    if (err['g-recaptcha-response']) {
                        setRecaptchaError(err['g-recaptcha-response']);
                    }
                },
            });
        } catch (error) {
            setRecaptchaError('Error al ejecutar reCAPTCHA');
        }
    };

    return (
        <>
            <Head title="Iniciar sesión" />
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    {/* Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-[#cbd5e1]">
                            Correo electrónico
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.email} />
                    </div>

                    {/* Password */}
                    <div className="grid gap-2">
                        <div className="flex items-center">
                            <Label htmlFor="password" className="text-[#cbd5e1]">
                                Contraseña
                            </Label>
                            {canResetPassword && (
                                <TextLink
                                    href={request()}
                                    className="ml-auto text-sm text-[#60a5fa] hover:text-[#93c5fd]"
                                    tabIndex={5}
                                >
                                    ¿Olvidaste tu contraseña?
                                </TextLink>
                            )}
                        </div>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={2}
                            autoComplete="current-password"
                            placeholder="Contraseña"
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.password} />
                    </div>

                    {/* Recordarme */}
                    <div className="flex items-center space-x-3">
                        <Checkbox
                            id="remember"
                            checked={data.remember}
                            onCheckedChange={(checked) => setData('remember', !!checked)}
                            tabIndex={3}
                            className="border-[#475569] data-[state=checked]:border-[#2563eb] data-[state=checked]:bg-[#2563eb]"
                        />
                        <Label htmlFor="remember" className="text-[#cbd5e1]">
                            Recordarme
                        </Label>
                    </div>

                    {/* Errores de reCAPTCHA */}
                    {recaptchaError && (
                        <div className="text-sm text-red-400">{recaptchaError}</div>
                    )}
                    {errors['g-recaptcha-response'] && (
                        <div className="text-sm text-red-400">{errors['g-recaptcha-response']}</div>
                    )}


                    <Button
                        type="submit"
                        className="mt-4 w-full bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white shadow-lg shadow-blue-500/20 hover:from-[#1d4ed8] hover:to-[#0284c7] hover:shadow-blue-500/30 disabled:opacity-50"
                        tabIndex={4}
                        disabled={processing}
                        data-test="login-button"
                    >
                        {processing && <Spinner />}
                        Iniciar sesión
                    </Button>
                </div>

                <div className="text-center text-sm text-[#94a3b8]">
                    ¿No tienes cuenta?{' '}
                    <TextLink
                        href={register()}
                        tabIndex={5}
                        className="text-[#60a5fa] hover:text-[#93c5fd]"
                    >
                        Regístrate
                    </TextLink>
                </div>
                <div
                  id="recaptcha-container"
                  className="flex justify-center my-2"
                />
                {status && (
                    <div className="text-center text-sm font-medium text-green-400">
                        {status}
                    </div>
                )}
            </form>
        </>
    );
};

// ── Componente principal que envuelve con el Provider ──
type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (

      <GoogleReCaptchaProvider
        reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
        badge="inline"                       // ← modo inline
        container={{
          element: 'recaptcha-container',    // ← id del contenedor
          parameters: { badge: 'inline' },   // redundante, pero se recomienda
        }}
      >
        <LoginForm status={status} canResetPassword={canResetPassword} />
      </GoogleReCaptchaProvider>
    );
}

// Mantenemos el layout original
Login.layout = {
    title: (
        <>
            Iniciar sesión en TuMedi<span className="text-[#60a5fa]">Bot</span>
        </>
    ),
    description: 'Ingresa tu correo y contraseña para acceder a tu cuenta',
};
