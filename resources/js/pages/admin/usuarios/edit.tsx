import { Form, Head, Link } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Props = {
    usuario: {
        id: number;
        name: string;
        email: string;
        pagos: string | null;
        privacy: string | null;
    };
    actionUrl: string;
    backUrl: string;
};

export default function EditUsuario({ usuario, actionUrl, backUrl }: Props) {
    return (
        <>
            <Head title={`Editar usuario #${usuario.id}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
                <Button asChild variant="outline" className="w-fit">
                    <Link href={backUrl}>
                        <ArrowLeft className="size-4" /> Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar usuario #{usuario.id}</CardTitle>
                        <CardDescription>
                            Actualiza los datos del usuario.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form
                            action={actionUrl}
                            method="put"
                            options={{ preserveScroll: true }}
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Nombre</Label>
                                        <Input
                                            id="name"
                                            name="name"
                                            defaultValue={usuario.name}
                                        />
                                        <InputError message={errors.name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            defaultValue={usuario.email}
                                        />
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="pagos">Pagos</Label>
                                        <Input
                                            id="pagos"
                                            name="pagos"
                                            defaultValue={usuario.pagos ?? ''}
                                        />
                                        <InputError message={errors.pagos} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="privacy">
                                            Privacidad
                                        </Label>
                                        <Input
                                            id="privacy"
                                            name="privacy"
                                            defaultValue={usuario.privacy ?? ''}
                                        />
                                        <InputError message={errors.privacy} />
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="bg-blue-600 text-white hover:bg-blue-500"
                                        >
                                            <Save className="size-4" /> Guardar
                                            cambios
                                        </Button>
                                    </div>
                                </>
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

EditUsuario.layout = {
    breadcrumbs: [
        {
            title: 'Administración',
            href: '/admin',
        },
        {
            title: 'Editar usuario',
            href: '/admin/usuarios',
        },
    ],
};
