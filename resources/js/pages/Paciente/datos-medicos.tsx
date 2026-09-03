import { Head, useForm } from '@inertiajs/react';
import {
    Activity,
    HeartPulse,
    Loader2,
    Lock,
    Mail,
    Phone,
    Ruler,
    ShieldCheck,
    Sparkles,
    User as UserIcon,
    Weight,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import Footer from '@/components/footer';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import datosMedicosRoutes from '@/routes/pacientes/datos-medicos';

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface PacienteProp {
    id: number;
    nombre_paciente: string;
    tlf_paciente: string;
    email_paciente: string;
    edad: number | null;
    peso: number | null;
    estatura: string | null;
}

interface Props {
    paciente: PacienteProp | null;
}

interface FormValues {
    nombre_paciente: string;
    tlf_paciente: string;
    email_paciente: string;
    edad: string;
    peso: string;
    estatura: string;
}

const emptyValues: FormValues = {
    nombre_paciente: '',
    tlf_paciente: '',
    email_paciente: '',
    edad: '',
    peso: '',
    estatura: '',
};

// ─── Campo reutilizable ──────────────────────────────────────────────────────
function Field({
    id,
    label,
    icon,
    error,
    children,
    className = '',
}: {
    id: string;
    label: string;
    icon: React.ReactNode;
    error?: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label
                htmlFor={id}
                className="flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
                {icon}
                {label}
            </Label>
            {children}
            {error && (
                <p className="animate-in px-1 text-xs font-bold text-red-500 fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}

const inputClass =
    'h-12 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 focus-visible:border-sky-500 focus-visible:ring-sky-500/50 dark:border-slate-800 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700';

// ─── Formulario de Datos Médicos ─────────────────────────────────────────────
function FormDatos({
    form,
    isEditing = false,
}: {
    form: ReturnType<typeof useForm<FormValues>>;
    isEditing?: boolean;
}) {
    const { data, setData, errors, processing } = form;

    return (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
                id="nombre_paciente"
                label="Nombre Completo"
                icon={<UserIcon className="h-3.5 w-3.5 text-sky-500" />}
                error={errors.nombre_paciente}
            >
                <Input
                    id="nombre_paciente"
                    value={data.nombre_paciente}
                    onChange={(e) => setData('nombre_paciente', e.target.value)}
                    placeholder="Ej: María Pérez"
                    className={inputClass}
                />
            </Field>

            <Field
                id="tlf_paciente"
                label="Teléfono"
                icon={<Phone className="h-3.5 w-3.5 text-emerald-500" />}
                error={errors.tlf_paciente}
            >
                <Input
                    id="tlf_paciente"
                    value={data.tlf_paciente}
                    onChange={(e) => setData('tlf_paciente', e.target.value)}
                    placeholder="+58 412 1234567"
                    inputMode="tel"
                    className={inputClass}
                />
            </Field>

            <Field
                id="email_paciente"
                label="Correo Electrónico"
                icon={<Mail className="h-3.5 w-3.5 text-sky-500" />}
                error={errors.email_paciente}
            >
                <Input
                    id="email_paciente"
                    type="email"
                    value={data.email_paciente}
                    onChange={(e) => setData('email_paciente', e.target.value)}
                    placeholder="paciente@correo.com"
                    className={inputClass}
                />
            </Field>

            <Field
                id="edad"
                label="Edad"
                icon={<Activity className="h-3.5 w-3.5 text-violet-500" />}
                error={errors.edad}
            >
                <Input
                    id="edad"
                    type="number"
                    min={1}
                    max={120}
                    value={data.edad}
                    onChange={(e) => setData('edad', e.target.value)}
                    placeholder="30"
                    inputMode="numeric"
                    className={inputClass}
                />
            </Field>

            <Field
                id="peso"
                label="Peso (kg)"
                icon={<Weight className="h-3.5 w-3.5 text-amber-500" />}
                error={errors.peso}
            >
                <Input
                    id="peso"
                    type="number"
                    min={1}
                    max={255}
                    value={data.peso}
                    onChange={(e) => setData('peso', e.target.value)}
                    placeholder="70"
                    inputMode="numeric"
                    className={inputClass}
                />
            </Field>

            <Field
                id="estatura"
                label="Estatura"
                icon={<Ruler className="h-3.5 w-3.5 text-rose-500" />}
                error={errors.estatura}
            >
                <Input
                    id="estatura"
                    value={data.estatura}
                    onChange={(e) => setData('estatura', e.target.value)}
                    placeholder="1.70 m"
                    className={inputClass}
                />
            </Field>

            <Button
                type="submit"
                disabled={processing}
                className="relative h-12 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 text-sm font-extrabold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.01] hover:shadow-emerald-500/40 disabled:opacity-60 md:col-span-2"
            >
                {processing ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Guardando...
                    </>
                ) : isEditing ? (
                    'Guardar Cambios'
                ) : (
                    'Guardar Datos Médicos'
                )}
            </Button>
        </div>
    );
}

// ─── Diálogo de edición ──────────────────────────────────────────────────────
function EditarDatosDialog({ paciente }: { paciente: PacienteProp }) {
    const [open, setOpen] = useState(false);

    const form = useForm<FormValues>(
        'put',
        datosMedicosRoutes.update.url({ paciente: paciente.id }),
        {
            nombre_paciente: paciente.nombre_paciente ?? '',
            tlf_paciente: paciente.tlf_paciente ?? '',
            email_paciente: paciente.email_paciente ?? '',
            edad: paciente.edad?.toString() ?? '',
            peso: paciente.peso?.toString() ?? '',
            estatura: paciente.estatura ?? '',
        },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.put(datosMedicosRoutes.update.url({ paciente: paciente.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success('Datos médicos actualizados correctamente.');
            },
            onError: () => toast.error('Revisa los campos marcados en rojo.'),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                >
                    <span className="mr-1">✎</span> Editar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-sky-500" />
                        Editar Datos Médicos
                    </DialogTitle>
                    <DialogDescription>
                        Actualiza tu información personal y médica. Los datos se
                        guardan cifrados.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2">
                    <FormDatos form={form} isEditing />
                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing}
                            className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Tabla de datos ──────────────────────────────────────────────────────────
function TablaDatos({ paciente }: { paciente: PacienteProp }) {
    const filas = [
        {
            etiqueta: 'Nombre Completo',
            valor: paciente.nombre_paciente,
            icono: <UserIcon className="h-4 w-4 text-sky-500" />,
        },
        {
            etiqueta: 'Teléfono',
            valor: paciente.tlf_paciente,
            icono: <Phone className="h-4 w-4 text-emerald-500" />,
        },
        {
            etiqueta: 'Correo Electrónico',
            valor: paciente.email_paciente,
            icono: <Mail className="h-4 w-4 text-violet-500" />,
        },
        {
            etiqueta: 'Edad',
            valor: paciente.edad != null ? `${paciente.edad} años` : '—',
            icono: <Activity className="h-4 w-4 text-rose-500" />,
        },
        {
            etiqueta: 'Peso',
            valor: paciente.peso != null ? `${paciente.peso} kg` : '—',
            icono: <Weight className="h-4 w-4 text-amber-500" />,
        },
        {
            etiqueta: 'Estatura',
            valor: paciente.estatura || '—',
            icono: <Ruler className="h-4 w-4 text-indigo-500" />,
        },
    ];

    return (
        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div>
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <HeartPulse className="h-5 w-5 text-sky-500" />
                        Mis Datos Médicos
                    </CardTitle>
                    <p className="mt-1 flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Lock className="h-3 w-3 text-emerald-500" />
                        Teléfono y correo cifrados en la base de datos
                    </p>
                </div>
                <EditarDatosDialog paciente={paciente} />
            </CardHeader>

            <CardContent className="p-0">
                <Table>
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Campo
                            </TableHead>
                            <TableHead className="h-12 pr-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Valor
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filas.map((fila) => (
                            <TableRow key={fila.etiqueta}>
                                <TableCell className="pl-6">
                                    <span className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                        {fila.icono}
                                        {fila.etiqueta}
                                    </span>
                                </TableCell>
                                <TableCell className="pr-6">
                                    <Badge
                                        variant="outline"
                                        className="bg-slate-50 text-[11px] font-medium text-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
                                    >
                                        {fila.valor}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function DatosMedicos({ paciente }: Props) {
    const form = useForm<FormValues>(
        'post',
        datosMedicosRoutes.store.url(),
        emptyValues,
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(datosMedicosRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () =>
                toast.success('Datos médicos guardados correctamente.'),
            onError: () => toast.error('Revisa los campos marcados en rojo.'),
        });
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Datos Médicos · TuMediBot" />

            {/* ══ HERO ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <HeartPulse className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Datos Médicos
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Tu
                                    información personal y médica en un solo
                                    lugar
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Datos cifrados de extremo a extremo
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CONTENIDO ═════════════════════════════════════════════════ */}
            <main className="relative z-20 mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
                {paciente ? (
                    <TablaDatos paciente={paciente} />
                ) : (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardHeader className="border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <UserIcon className="h-5 w-5 text-blue-500" />
                                Completa tus Datos por Primera Vez
                            </CardTitle>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                                Estos datos quedarán asociados a tu cuenta y se
                                almacenarán de forma cifrada.
                            </p>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <form onSubmit={handleSubmit} noValidate>
                                <FormDatos form={form} />
                            </form>
                        </CardContent>
                    </Card>
                )}
            </main>

            <Footer />
        </div>
    );
}
