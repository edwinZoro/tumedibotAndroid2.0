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
    medico: {
        id: number;
        nombre: string | null;
        apellido: string | null;
        second_name: string | null;
        last_name: string | null;
        sexo: string | null;
        telefono: string | null;
        whatsapp: string | null;
        correo: string | null;
        revendedor: string | null;
        pagos: string | null;
        especialidad_id: number | null;
    };
    especialidades: { id: number; nombre_especialidad: string }[];
    actionUrl: string;
    backUrl: string;
};

const selectClass =
    'border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm';

export default function EditMedico({
    medico,
    especialidades,
    actionUrl,
    backUrl,
}: Props) {
    return (
        <>
            <Head title={`Editar médico #${medico.id}`} />

            <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-4">
                <Button asChild variant="outline" className="w-fit">
                    <Link href={backUrl}>
                        <ArrowLeft className="size-4" /> Volver
                    </Link>
                </Button>

                <Card>
                    <CardHeader>
                        <CardTitle>Editar médico #{medico.id}</CardTitle>
                        <CardDescription>
                            Actualiza los datos del profesional de salud.
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
                                                    medico.nombre ?? ''
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
                                                    medico.apellido ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.apellido}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="second_name">
                                                Segundo nombre
                                            </Label>
                                            <Input
                                                id="second_name"
                                                name="second_name"
                                                defaultValue={
                                                    medico.second_name ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.second_name}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="last_name">
                                                Segundo apellido
                                            </Label>
                                            <Input
                                                id="last_name"
                                                name="last_name"
                                                defaultValue={
                                                    medico.last_name ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.last_name}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="sexo">Sexo</Label>
                                            <select
                                                id="sexo"
                                                name="sexo"
                                                defaultValue={
                                                    medico.sexo ?? 'MASCULINO'
                                                }
                                                className={cn(
                                                    selectClass,
                                                    'bg-transparent',
                                                )}
                                            >
                                                <option value="MASCULINO">
                                                    Masculino
                                                </option>
                                                <option value="FEMENINO">
                                                    Femenino
                                                </option>
                                            </select>
                                            <InputError message={errors.sexo} />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="especialidad_id">
                                                Especialidad
                                            </Label>
                                            <select
                                                id="especialidad_id"
                                                name="especialidad_id"
                                                defaultValue={
                                                    medico.especialidad_id ?? ''
                                                }
                                                className={cn(
                                                    selectClass,
                                                    'bg-transparent',
                                                )}
                                            >
                                                <option value="" disabled>
                                                    Selecciona una especialidad
                                                </option>
                                                {especialidades.map((esp) => (
                                                    <option
                                                        key={esp.id}
                                                        value={esp.id}
                                                    >
                                                        {
                                                            esp.nombre_especialidad
                                                        }
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError
                                                message={errors.especialidad_id}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="telefono">
                                                Teléfono
                                            </Label>
                                            <Input
                                                id="telefono"
                                                name="telefono"
                                                defaultValue={
                                                    medico.telefono ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.telefono}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="whatsapp">
                                                WhatsApp
                                            </Label>
                                            <Input
                                                id="whatsapp"
                                                name="whatsapp"
                                                defaultValue={
                                                    medico.whatsapp ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.whatsapp}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="grid gap-2">
                                            <Label htmlFor="correo">
                                                Correo
                                            </Label>
                                            <Input
                                                id="correo"
                                                name="correo"
                                                type="email"
                                                defaultValue={
                                                    medico.correo ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.correo}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="revendedor">
                                                Revendedor
                                            </Label>
                                            <Input
                                                id="revendedor"
                                                name="revendedor"
                                                defaultValue={
                                                    medico.revendedor ?? ''
                                                }
                                            />
                                            <InputError
                                                message={errors.revendedor}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="pagos">Pagos</Label>
                                        <Input
                                            id="pagos"
                                            name="pagos"
                                            defaultValue={medico.pagos ?? ''}
                                        />
                                        <InputError message={errors.pagos} />
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

EditMedico.layout = {
    breadcrumbs: [
        {
            title: 'Administración',
            href: '/admin',
        },
        {
            title: 'Editar médico',
            href: '/admin/medicos',
        },
    ],
};
