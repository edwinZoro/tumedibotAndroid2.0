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
    reporte: {
        id: number;
        transaccion_id: string | null;
        banco_emisor: string | null;
        banco_receptor: string | null;
        nmro_referencia: string | null;
        monto_pagado: string | null;
        metodo_transaccion: string | null;
        estado: string | null;
    };
    actionUrl: string;
    backUrl: string;
};

const selectClass =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function EditReporte({ reporte, actionUrl, backUrl }: Props) {
    return (
        <>
            <Head title={`Editar reporte #${reporte.id}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
                <Button asChild variant="outline" className="w-fit">
                    <Link href={backUrl}>
                        <ArrowLeft className="size-4" /> Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Editar reporte de pago #{reporte.id}
                        </CardTitle>
                        <CardDescription>
                            Actualiza los datos del reporte de pago.
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
                                        <Label htmlFor="transaccion_id">
                                            ID de transacción
                                        </Label>
                                        <Input
                                            id="transaccion_id"
                                            name="transaccion_id"
                                            defaultValue={
                                                reporte.transaccion_id ?? ''
                                            }
                                        />
                                        <InputError
                                            message={errors.transaccion_id}
                                        />
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="banco_emisor">
                                                Banco emisor
                                            </Label>
                                            <Input
                                                id="banco_emisor"
                                                name="banco_emisor"
                                                defaultValue={
                                                    reporte.banco_emisor ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.banco_emisor}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="banco_receptor">
                                                Banco receptor
                                            </Label>
                                            <Input
                                                id="banco_receptor"
                                                name="banco_receptor"
                                                defaultValue={
                                                    reporte.banco_receptor ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.banco_receptor}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="nmro_referencia">
                                                Número de referencia
                                            </Label>
                                            <Input
                                                id="nmro_referencia"
                                                name="nmro_referencia"
                                                defaultValue={
                                                    reporte.nmro_referencia ??
                                                    ''
                                                }
                                            />
                                            <InputError
                                                message={errors.nmro_referencia}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="monto_pagado">
                                                Monto pagado ($)
                                            </Label>
                                            <Input
                                                id="monto_pagado"
                                                name="monto_pagado"
                                                type="number"
                                                step="0.01"
                                                defaultValue={
                                                    reporte.monto_pagado ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.monto_pagado}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="metodo_transaccion">
                                                Método de transacción
                                            </Label>
                                            <Input
                                                id="metodo_transaccion"
                                                name="metodo_transaccion"
                                                defaultValue={
                                                    reporte.metodo_transaccion ??
                                                    ''
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors.metodo_transaccion
                                                }
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="estado">
                                                Estado
                                            </Label>
                                            <select
                                                id="estado"
                                                name="estado"
                                                defaultValue={
                                                    reporte.estado ??
                                                    'procesando'
                                                }
                                                className={cn(
                                                    selectClass,
                                                    'bg-transparent',
                                                )}
                                            >
                                                <option value="procesando">
                                                    Procesando
                                                </option>
                                                <option value="procesado">
                                                    Procesado
                                                </option>
                                            </select>
                                            <InputError
                                                message={errors.estado}
                                            />
                                        </div>
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

EditReporte.layout = {
    breadcrumbs: [
        {
            title: 'Administración',
            href: '/admin',
        },
        {
            title: 'Editar reporte',
            href: '/admin/reportes',
        },
    ],
};
