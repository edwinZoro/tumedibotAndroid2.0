import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
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
            <Form
                {...store.form()}
                resetOnSuccess={['password', 'password_confirmation']}
                disableWhileProcessing
                className="flex flex-col gap-6"
            >
                {({ processing, errors }) => (
                    <>
                        <div className="grid gap-6">
                            <div className="grid gap-2">
                                <Label
                                    htmlFor="name"
                                    className="text-[#cbd5e1]"
                                >
                                    Nombre completo
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    required
                                    autoFocus
                                    tabIndex={1}
                                    autoComplete="name"
                                    name="name"
                                    placeholder="Nombre completo"
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

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
                                    required
                                    tabIndex={2}
                                    autoComplete="email"
                                    name="email"
                                    placeholder="correo@ejemplo.com"
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError message={errors.email} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password"
                                    className="text-[#cbd5e1]"
                                >
                                    Contraseña
                                </Label>
                                <PasswordInput
                                    id="password"
                                    required
                                    tabIndex={3}
                                    autoComplete="new-password"
                                    name="password"
                                    placeholder="Contraseña"
                                    passwordrules={passwordRules}
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="text-[#cbd5e1]"
                                >
                                    Confirmar contraseña
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    required
                                    tabIndex={4}
                                    autoComplete="new-password"
                                    name="password_confirmation"
                                    placeholder="Confirmar contraseña"
                                    passwordrules={passwordRules}
                                    className="border-[#1e293b] bg-[#1e293b] text-white placeholder:text-[#64748b] focus:border-[#60a5fa] focus:ring-[#60a5fa]/30"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="mt-2 w-full bg-gradient-to-r from-[#2563eb] to-[#0ea5e9] text-white shadow-lg shadow-blue-500/20 hover:from-[#1d4ed8] hover:to-[#0284c7] hover:shadow-blue-500/30 disabled:opacity-50"
                                tabIndex={5}
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
                    </>
                )}
            </Form>
        </>
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
