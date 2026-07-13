import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
{
    /* import PasskeyVerify from '@/components/passkey-verify'; */
}
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

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Iniciar sesión">
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

            {/* <PasskeyVerify /> */}

            <Form
                {...store.form()}
                resetOnSuccess={['password']}
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="email"
                                    className="text-[#cbd5e1]"
                                >
                                    Correo electrónico
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="email"
                                    placeholder="correo@ejemplo.com"
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label
                                        htmlFor="password"
                                        className="text-[#cbd5e1]"
                                    >
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
                                    name="password"
                                    required
                                    tabIndex={2}
                                    autoComplete="current-password"
                                    placeholder="Contraseña"
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    tabIndex={3}
                                    className="border-[#475569] data-[state=checked]:border-[#2563eb] data-[state=checked]:bg-[#2563eb]"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-[#cbd5e1]"
                                >
                                    Recordarme
                                </Label>
                            </div>

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
                    </>
                )}
            </Form>

            {status && (
                <div className="mb-4 text-center text-sm font-medium text-green-400">
                    {status}
                </div>
            )}
        </>
    );
}

Login.layout = {
    title: (
        <>
            Iniciar sesión en TuMedi<span className="text-[#60a5fa]">Bot</span>
        </>
    ),
    description: 'Ingresa tu correo y contraseña para acceder a tu cuenta',
};
