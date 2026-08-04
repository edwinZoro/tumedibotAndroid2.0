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
import { cn } from '@/lib/utils';

type Props = {
    factura: {
        id: number;
        nombre: string | null;
        apellido: string | null;
        celular: string | null;
        ci_rif: string | null;
        direccion: string | null;
        codigo_postal: number | null;
        plan: string | null;
    };
    actionUrl: string;
    backUrl: string;
};

const selectClass =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function EditFactura({ factura, actionUrl, backUrl }: Props) {
    return (
        <>
            <Head title={`Editar factura #${factura.id}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
                <Button asChild variant="outline" className="w-fit">
                    <Link href={backUrl}>
                        <ArrowLeft className="size-4" /> Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar factura #{factura.id}</CardTitle>
                        <CardDescription>
                            Actualiza los datos de la factura del cliente.
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
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nombre">
                                                Nombre
                                            </Label>
                                            <Input
                                                id="nombre"
                                                name="nombre"
                                                defaultValue={
                                                    factura.nombre ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.nombre}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="apellido">
                                                Apellido
                                            </Label>
                                            <Input
                                                id="apellido"
                                                name="apellido"
                                                defaultValue={
                                                    factura.apellido ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.apellido}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="celular">
                                                Celular
                                            </Label>
                                            <Input
                                                id="celular"
                                                name="celular"
                                                defaultValue={
                                                    factura.celular ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.celular}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="ci_rif">
                                                Cédula / RIF
                                            </Label>
                                            <Input
                                                id="ci_rif"
                                                name="ci_rif"
                                                defaultValue={
                                                    factura.ci_rif ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.ci_rif}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="direccion">
                                                Dirección
                                            </Label>
                                            <Input
                                                id="direccion"
                                                name="direccion"
                                                defaultValue={
                                                    factura.direccion ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.direccion}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="codigo_postal">
                                                Código postal
                                            </Label>
                                            <Input
                                                id="codigo_postal"
                                                name="codigo_postal"
                                                type="number"
                                                defaultValue={
                                                    factura.codigo_postal ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.codigo_postal}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="plan">Plan</Label>
                                        <select
                                            id="plan"
                                            name="plan"
                                            defaultValue={factura.plan ?? ''}
                                            className={cn(
                                                selectClass,
                                                'bg-transparent',
                                            )}
                                        >
                                            <option value="" disabled>
                                                Selecciona un plan
                                            </option>
                                            <option value="andromeda">
                                                Andrómeda
                                            </option>
                                            <option value="fenix">Fénix</option>
                                            <option value="pegasus">
                                                Pegaso
                                            </option>
                                        </select>
                                        <InputError message={errors.plan} />
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

EditFactura.layout = {
    breadcrumbs: [
        {
            title: 'Administración',
            href: '/admin',
        },
        {
            title: 'Editar factura',
            href: '/admin/facturas',
        },
    ],
};
