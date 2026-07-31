import { Head, useForm } from '@inertiajs/react';
import { GoogleReCaptchaProvider, useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';
import { useState } from 'react';

type Props = {
    passwordRules: string;
};

// Componente interno que usa reCAPTCHA
const RegisterForm = ({ passwordRules }: Props) => {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        'g-recaptcha-response': '',
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
            const token = await executeRecaptcha('register');
            setData('g-recaptcha-response', token);
            setRecaptchaError(null);

            post('/register', {
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
            <Head title="Registrarse">
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
            </Head>
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="text-[#cbd5e1]">
                            Nombre completo
                        </Label>
                        <Input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                            tabIndex={1}
                            autoComplete="name"
                            placeholder="Nombre completo"
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

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
                            tabIndex={2}
                            autoComplete="email"
                            placeholder="correo@ejemplo.com"
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.email} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password" className="text-[#cbd5e1]">
                            Contraseña
                        </Label>
                        <PasswordInput
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            tabIndex={3}
                            autoComplete="new-password"
                            placeholder="Contraseña"
                            passwordrules={passwordRules}
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.password} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="password_confirmation" className="text-[#cbd5e1]">
                            Confirmar contraseña
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                            tabIndex={4}
                            autoComplete="new-password"
                            placeholder="Confirmar contraseña"
                            passwordrules={passwordRules}
                            className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                        />
                        <InputError message={errors.password_confirmation} />
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
                        className="mt-2 w-full bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white shadow-lg shadow-blue-500/20 hover:from-[#1d4ed8] hover:to-[#0284c7] hover:shadow-blue-500/30 disabled:opacity-50"
                        tabIndex={5}
                        disabled={processing}
                        data-test="register-user-button"
                    >
                        {processing && <Spinner />}
                        Crear cuenta
                    </Button>
                </div>

                <div className="text-center text-sm text-[#94a3b8]">
                    ¿Ya tienes cuenta?{' '}
                    <TextLink
                        href={login()}
                        tabIndex={6}
                        className="text-[#60a5fa] hover:text-[#93c5fd]"
                    >
                        Inicia sesión
                    </TextLink>
                </div>
                <div
                    id="recaptcha-container"
                    className="flex justify-center my-2"
                />
            </form>
        </>
    );
};

// Componente principal que envuelve con el Provider
export default function Register({ passwordRules }: Props) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
            badge="inline"
            container={{
                element: 'recaptcha-container',
                parameters: { badge: 'inline' },
            }}
        >
            <RegisterForm passwordRules={passwordRules} />
        </GoogleReCaptchaProvider>
    );
}

Register.layout = {
    title: (
        <>
            Crear cuenta en TuMedi<span className="text-[#60a5fa]">Bot</span>
        </>
    ),
    description: 'Ingresa tus datos para crear tu cuenta',
};
