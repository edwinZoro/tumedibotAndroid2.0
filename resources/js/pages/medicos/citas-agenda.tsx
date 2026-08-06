import { Head, Link, router, useForm } from '@inertiajs/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Building2,
    Calendar as CalendarIcon,
    CheckCircle2,
    Clock,
    Hourglass,
    Loader2,
    Mail,
    Phone,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    UserPlus,
    UserRound,
    Video,
    X,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDayButton } from '@/components/ui/calendar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { citas as citasMedico } from '@/routes/medicos';
import citasRoutes from '@/routes/medicos/citas';

interface PacienteProp {
    id: number;
    nombre: string;
    email?: string | null;
    telefono?: string | null;
}

interface CitaProp {
    id: number;
    fecha: string | null;
    hora: string | null;
    motivo_consulta?: string | null;
    sintomas?: string | null;
    estado_cita?: string | null;
    tipo?: string | null;
    paciente?: PacienteProp | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedCitas {
    data: CitaProp[];
    links: PaginationLink[];
}

interface Props {
    tieneMedico: boolean;
    citas: PaginatedCitas;
    agenda: CitaProp[];
    filters?: { q?: string };
}

const HORARIOS = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '12:30',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00',
    '18:30',
    '19:00',
    '19:30',
];

function hora12(hora: string | null | undefined): string {
    if (!hora) {
        return '—';
    }

    const [h, m] = hora.split(':').map(Number);

    if (Number.isNaN(h) || Number.isNaN(m)) {
        return hora;
    }

    const periodo = h >= 12 ? 'PM' : 'AM';
    const hora12h = h % 12 === 0 ? 12 : h % 12;

    return `${hora12h}:${String(m).padStart(2, '0')} ${periodo}`;
}

function DiaConCita({
    modifiers,
    children,
    ...props
}: React.ComponentProps<typeof CalendarDayButton>) {
    return (
        <CalendarDayButton modifiers={modifiers} {...props}>
            {children}
            {modifiers.conCita && (
                <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-sky-500 shadow-sm" />
            )}
        </CalendarDayButton>
    );
}

function AsignarFechaDialog({
    cita,
    open,
    onOpenChange,
}: {
    cita: CitaProp | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const form = useForm({
        fecha: cita?.fecha ?? '',
        hora: cita?.hora ? String(cita.hora).slice(0, 5) : '',
    });

    React.useEffect(() => {
        if (open && cita) {
            form.setData({
                fecha: cita.fecha ?? '',
                hora: cita.hora ? String(cita.hora).slice(0, 5) : '',
            });
            form.clearErrors();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, cita]);

    const fechaHoy = new Date();
    fechaHoy.setHours(0, 0, 0, 0);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!cita) {
            return;
        }

        form.put(citasRoutes.asignarFecha.url({ cita: cita.id }), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                toast.success('Fecha asignada. El paciente fue notificado.');
            },
            onError: (errors) => {
                const mensaje = Object.values(errors)[0];
                toast.error(
                    typeof mensaje === 'string'
                        ? mensaje
                        : 'Revisa fecha y hora.',
                );
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-sky-500" />
                        Asignar fecha y hora
                    </DialogTitle>
                    <DialogDescription>
                        {cita?.paciente ? (
                            <>
                                Cita de <strong>{cita.paciente.nombre}</strong>
                                {cita.motivo_consulta
                                    ? ` · ${cita.motivo_consulta}`
                                    : ''}
                                . El paciente recibirá notificación interna y
                                por correo.
                            </>
                        ) : (
                            'Define cuándo atenderás esta cita.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-5">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Fecha
                        </Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        'h-11 w-full justify-start rounded-2xl border-slate-200 bg-white font-normal shadow-sm dark:border-slate-800 dark:bg-slate-950/50',
                                        !form.data.fecha &&
                                            'text-muted-foreground',
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.data.fecha
                                        ? format(
                                              parseISO(form.data.fecha),
                                              "EEEE, d 'de' MMMM yyyy",
                                              { locale: es },
                                          )
                                        : 'Selecciona una fecha'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className="w-auto p-0"
                                align="start"
                            >
                                <Calendar
                                    mode="single"
                                    selected={
                                        form.data.fecha
                                            ? parseISO(form.data.fecha)
                                            : undefined
                                    }
                                    onSelect={(date) =>
                                        form.setData(
                                            'fecha',
                                            date
                                                ? format(date, 'yyyy-MM-dd')
                                                : '',
                                        )
                                    }
                                    disabled={(date) => date < fechaHoy}
                                    autoFocus
                                />
                            </PopoverContent>
                        </Popover>
                        {form.errors.fecha && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.fecha}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Hora
                        </Label>
                        <Select
                            value={form.data.hora}
                            onValueChange={(v) => form.setData('hora', v)}
                        >
                            <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                                <SelectValue placeholder="Elige una hora" />
                            </SelectTrigger>
                            <SelectContent>
                                {HORARIOS.map((h) => (
                                    <SelectItem key={h} value={h}>
                                        {hora12(h)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.hora && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.hora}
                            </p>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                form.processing ||
                                !form.data.fecha ||
                                !form.data.hora
                            }
                            className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar y notificar'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function AgregarPacienteDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [motivoInput, setMotivoInput] = useState('');
    const [motivos, setMotivos] = useState<string[]>([]);
    const [enviando, setEnviando] = useState(false);
    const form = useForm({
        nombre_paciente: '',
        email_paciente: '',
        tlf_paciente: '',
        tipo: 'CONSULTA',
    });

    const resetDialogo = () => {
        form.reset();
        form.setData('tipo', 'CONSULTA');
        form.clearErrors();
        setMotivoInput('');
        setMotivos([]);
        setEnviando(false);
    };

    const agregarMotivo = () => {
        const valor = motivoInput.trim();

        if (!valor) {
            return;
        }

        const existe = motivos.some(
            (m) => m.toLowerCase() === valor.toLowerCase(),
        );

        if (existe) {
            toast.error('Ese motivo ya está en la lista.');

            return;
        }

        if (motivos.length >= 20) {
            toast.error('Máximo 20 motivos.');

            return;
        }

        setMotivos((prev) => [...prev, valor]);
        setMotivoInput('');
    };

    const quitarMotivo = (index: number) => {
        setMotivos((prev) => prev.filter((_, i) => i !== index));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Si quedó texto en el input sin pulsar +, lo incluimos
        let lista = motivos;
        const pendiente = motivoInput.trim();

        if (
            pendiente &&
            !lista.some((m) => m.toLowerCase() === pendiente.toLowerCase())
        ) {
            lista = [...lista, pendiente];
            setMotivos(lista);
            setMotivoInput('');
        }

        setEnviando(true);
        router.post(
            citasRoutes.storePaciente.url(),
            {
                ...form.data,
                motivos: lista,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    resetDialogo();
                    toast.success(
                        'Paciente añadido. Ahora puedes asignarle fecha y hora.',
                    );
                },
                onError: (errors) => {
                    const mensaje = Object.values(errors)[0];
                    toast.error(
                        typeof mensaje === 'string'
                            ? mensaje
                            : 'Revisa los datos del paciente.',
                    );
                },
                onFinish: () => setEnviando(false),
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    resetDialogo();
                }

                onOpenChange(next);
            }}
        >
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-sky-500" />
                        Agregar paciente
                    </DialogTitle>
                    <DialogDescription>
                        Registra un paciente de tu consultorio. Luego asigna
                        fecha y hora desde la tabla.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="nombre_paciente"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Nombre
                        </Label>
                        <Input
                            id="nombre_paciente"
                            maxLength={20}
                            className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                            value={form.data.nombre_paciente}
                            onChange={(e) =>
                                form.setData('nombre_paciente', e.target.value)
                            }
                        />
                        {form.errors.nombre_paciente && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.nombre_paciente}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email_paciente"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Correo
                            </Label>
                            <Input
                                id="email_paciente"
                                type="email"
                                className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                value={form.data.email_paciente}
                                onChange={(e) =>
                                    form.setData(
                                        'email_paciente',
                                        e.target.value,
                                    )
                                }
                            />
                            {form.errors.email_paciente && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.email_paciente}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="tlf_paciente"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Teléfono
                            </Label>
                            <Input
                                id="tlf_paciente"
                                className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                value={form.data.tlf_paciente}
                                onChange={(e) =>
                                    form.setData('tlf_paciente', e.target.value)
                                }
                            />
                            {form.errors.tlf_paciente && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.tlf_paciente}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Tipo de cita
                        </Label>
                        <Select
                            value={form.data.tipo}
                            onValueChange={(v) => form.setData('tipo', v)}
                        >
                            <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONSULTA">
                                    Consulta en consultorio
                                </SelectItem>
                                <SelectItem value="VIDEOLLAMADA">
                                    Videollamada
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.tipo && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.tipo}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="motivo_input"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Motivos{' '}
                            <span className="font-medium text-slate-400 normal-case">
                                (opcional · varios)
                            </span>
                        </Label>
                        <div className="flex gap-2">
                            <Input
                                id="motivo_input"
                                className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                placeholder="Ej: Fiebre, diarrea, vómito..."
                                value={motivoInput}
                                onChange={(e) => setMotivoInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        agregarMotivo();
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                size="icon"
                                onClick={agregarMotivo}
                                disabled={!motivoInput.trim()}
                                className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                                title="Añadir motivo"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>

                        {motivos.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {motivos.map((motivo, index) => (
                                    <li key={`${motivo}-${index}`}>
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 rounded-full border-sky-200 bg-sky-50 py-1.5 pr-1.5 pl-3 text-xs font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
                                        >
                                            {motivo}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    quitarMotivo(index)
                                                }
                                                className="flex h-5 w-5 items-center justify-center rounded-full text-sky-600 transition hover:bg-sky-200/80 dark:text-sky-300 dark:hover:bg-sky-900"
                                                aria-label={`Quitar ${motivo}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                enviando ||
                                !form.data.nombre_paciente ||
                                !form.data.email_paciente ||
                                !form.data.tlf_paciente
                            }
                            className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {enviando ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Agregar paciente'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CitasDelDia({ citas, fecha }: { citas: CitaProp[]; fecha: Date }) {
    if (citas.length === 0) {
        return (
            <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-slate-300 bg-white/60 px-6 py-12 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                    <CalendarIcon className="h-7 w-7 text-slate-400" />
                </div>
                <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
                    Sin citas para el{' '}
                    {format(fecha, "EEEE, d 'de' MMMM", { locale: es })}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {[...citas]
                .sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? ''))
                .map((cita) => (
                    <div
                        key={cita.id}
                        className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50"
                    >
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm">
                            {cita.tipo === 'VIDEOLLAMADA' ? (
                                <Video className="h-5 w-5 text-white" />
                            ) : (
                                <Building2 className="h-5 w-5 text-white" />
                            )}
                        </div>
                        <div>
                            <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                                <Clock className="h-3.5 w-3.5 text-sky-500" />
                                {hora12(cita.hora)}
                                <Badge className="border-transparent bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase dark:bg-emerald-500/15 dark:text-emerald-300">
                                    {cita.estado_cita ?? 'CONFIRMADA'}
                                </Badge>
                            </p>
                            <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                {cita.paciente?.nombre ?? 'Paciente'}
                            </p>
                            {cita.motivo_consulta && (
                                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    {cita.motivo_consulta}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
        </div>
    );
}

export default function CitasAgenda({
    tieneMedico,
    citas,
    agenda,
    filters,
}: Props) {
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(
        () => new Date(),
    );
    const [busqueda, setBusqueda] = useState(filters?.q ?? '');
    const [fechaDialogo, setFechaDialogo] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState<CitaProp | null>(
        null,
    );
    const [pacienteDialogo, setPacienteDialogo] = useState(false);

    const fechasConCitas = useMemo(
        () =>
            agenda
                .map((c) => c.fecha)
                .filter((f): f is string => Boolean(f))
                .map((f) => parseISO(f)),
        [agenda],
    );

    const citasDelDia = useMemo(
        () =>
            agenda.filter(
                (c) =>
                    c.fecha && isSameDay(parseISO(c.fecha), fechaSeleccionada),
            ),
        [agenda, fechaSeleccionada],
    );

    const buscar = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            citasMedico.url({
                query: { q: busqueda.trim() || undefined },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const abrirFecha = (cita: CitaProp) => {
        setCitaSeleccionada(cita);
        setFechaDialogo(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Citas (Agenda) · TuMediBot" />

            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <Stethoscope className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Citas (Agenda)
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Solo ves
                                    las citas que te agendaron a ti
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Privado · cada cita solo tuya y del paciente
                        </div>
                    </div>
                </div>
            </section>

            <main className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
                {!tieneMedico ? (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <UserRound className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Completa tu perfil de médico
                            </h3>
                            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                                Necesitas un perfil médico activo para gestionar
                                tu agenda de citas.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                        <div className="space-y-6 lg:col-span-2">
                            <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                                <CardHeader className="border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <CalendarIcon className="h-5 w-5 text-sky-500" />
                                        Calendario
                                    </CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        Días con cita agendada marcados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex flex-col items-center gap-3 p-4">
                                    <Calendar
                                        mode="single"
                                        selected={fechaSeleccionada}
                                        onSelect={(date) =>
                                            date && setFechaSeleccionada(date)
                                        }
                                        modifiers={{ conCita: fechasConCitas }}
                                        components={{
                                            DayButton: DiaConCita,
                                        }}
                                        className="mx-auto scale-105"
                                    />
                                    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-2 text-[11px] font-semibold text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-sky-500" />
                                            Con cita
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <span className="h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                            Sin cita
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>

                            <section>
                                <div className="mb-3 flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        {format(
                                            fechaSeleccionada,
                                            "EEEE, d 'de' MMMM",
                                            { locale: es },
                                        )}
                                    </h2>
                                    <span className="text-xs font-bold text-slate-400 uppercase">
                                        {citasDelDia.length}
                                    </span>
                                </div>
                                <CitasDelDia
                                    citas={citasDelDia}
                                    fecha={fechaSeleccionada}
                                />
                            </section>
                        </div>

                        <div className="space-y-6 lg:col-span-3">
                            <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                                <CardHeader className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 pt-6 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/30">
                                    <div>
                                        <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                            <UserRound className="h-5 w-5 text-sky-500" />
                                            Pacientes / solicitudes
                                        </CardTitle>
                                        <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                            Nombre, correo y teléfono · asigna
                                            fecha cuando estés listo
                                        </CardDescription>
                                    </div>
                                    <Button
                                        className="h-11 shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-sky-400"
                                        onClick={() => setPacienteDialogo(true)}
                                    >
                                        <UserPlus className="mr-2 h-4 w-4" />
                                        Agregar Paciente
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4 p-4">
                                    <form
                                        onSubmit={buscar}
                                        className="relative"
                                    >
                                        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            className="h-11 rounded-2xl border-slate-200 bg-white pr-24 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                            placeholder="Buscar por nombre..."
                                            value={busqueda}
                                            onChange={(e) =>
                                                setBusqueda(e.target.value)
                                            }
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            className="absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 text-xs font-semibold"
                                        >
                                            Buscar
                                        </Button>
                                    </form>

                                    {citas.data.length === 0 ? (
                                        <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
                                            <Hourglass className="h-8 w-8 text-slate-300" />
                                            <p className="text-sm font-semibold text-slate-500">
                                                Aún no tienes citas
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                Agrega un paciente de
                                                consultorio o espera
                                                solicitudes.
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                                                        <TableRow className="hover:bg-transparent">
                                                            <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                                Paciente
                                                            </TableHead>
                                                            <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase md:table-cell dark:text-slate-400">
                                                                Contacto
                                                            </TableHead>
                                                            <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:table-cell dark:text-slate-400">
                                                                Estado
                                                            </TableHead>
                                                            <TableHead className="pr-6 text-right text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                                Acción
                                                            </TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {citas.data.map(
                                                            (cita) => (
                                                                <TableRow
                                                                    key={
                                                                        cita.id
                                                                    }
                                                                >
                                                                    <TableCell className="pl-6">
                                                                        <span className="flex items-center gap-3">
                                                                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                                                                                <UserRound className="h-5 w-5 text-white" />
                                                                            </span>
                                                                            <span className="min-w-0">
                                                                                <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                                                    {cita
                                                                                        .paciente
                                                                                        ?.nombre ??
                                                                                        '—'}
                                                                                </span>
                                                                                {cita.motivo_consulta && (
                                                                                    <span className="block truncate text-[11px] text-slate-400">
                                                                                        {
                                                                                            cita.motivo_consulta
                                                                                        }
                                                                                    </span>
                                                                                )}
                                                                            </span>
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="hidden md:table-cell">
                                                                        <span className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                                            <span className="flex items-center gap-1.5">
                                                                                <Mail className="h-3 w-3 text-sky-500" />
                                                                                {cita
                                                                                    .paciente
                                                                                    ?.email ??
                                                                                    '—'}
                                                                            </span>
                                                                            <span className="flex items-center gap-1.5">
                                                                                <Phone className="h-3 w-3 text-sky-500" />
                                                                                {cita
                                                                                    .paciente
                                                                                    ?.telefono ??
                                                                                    '—'}
                                                                            </span>
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell className="hidden sm:table-cell">
                                                                        {cita.fecha ? (
                                                                            <div className="space-y-1">
                                                                                <Badge className="border-transparent bg-emerald-100 text-[10px] font-bold text-emerald-700 uppercase dark:bg-emerald-500/15 dark:text-emerald-300">
                                                                                    {cita.estado_cita ??
                                                                                        'CONFIRMADA'}
                                                                                </Badge>
                                                                                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                                                    {format(
                                                                                        parseISO(
                                                                                            cita.fecha,
                                                                                        ),
                                                                                        'dd/MM/yyyy',
                                                                                    )}{' '}
                                                                                    ·{' '}
                                                                                    {hora12(
                                                                                        cita.hora,
                                                                                    )}
                                                                                </p>
                                                                            </div>
                                                                        ) : (
                                                                            <Badge className="border-transparent bg-amber-100 text-[10px] font-bold text-amber-700 uppercase dark:bg-amber-500/15 dark:text-amber-300">
                                                                                <Hourglass className="mr-1 h-3 w-3" />
                                                                                Sin
                                                                                fecha
                                                                            </Badge>
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell className="pr-6 text-right">
                                                                        <Button
                                                                            size="sm"
                                                                            variant={
                                                                                cita.fecha
                                                                                    ? 'outline'
                                                                                    : 'default'
                                                                            }
                                                                            className={cn(
                                                                                'rounded-xl font-semibold',
                                                                                !cita.fecha &&
                                                                                    'bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400',
                                                                            )}
                                                                            onClick={() =>
                                                                                abrirFecha(
                                                                                    cita,
                                                                                )
                                                                            }
                                                                        >
                                                                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                                                                            {cita.fecha
                                                                                ? 'Cambiar fecha'
                                                                                : 'Añadir fecha'}
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ),
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>

                                            {citas.links.length > 3 && (
                                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                                    {citas.links.map(
                                                        (link, index) => (
                                                            <Link
                                                                key={index}
                                                                href={
                                                                    link.url ||
                                                                    '#'
                                                                }
                                                                dangerouslySetInnerHTML={{
                                                                    __html: link.label,
                                                                }}
                                                                className={cn(
                                                                    'rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 select-none',
                                                                    link.active
                                                                        ? 'border-blue-600 bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30'
                                                                        : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white',
                                                                    !link.url &&
                                                                        'pointer-events-none cursor-not-allowed opacity-40',
                                                                )}
                                                                preserveState
                                                                preserveScroll
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}
            </main>

            <AsignarFechaDialog
                key={citaSeleccionada?.id ?? 'sin-cita'}
                cita={citaSeleccionada}
                open={fechaDialogo}
                onOpenChange={setFechaDialogo}
            />
            <AgregarPacienteDialog
                open={pacienteDialogo}
                onOpenChange={setPacienteDialogo}
            />
        </div>
    );
}
