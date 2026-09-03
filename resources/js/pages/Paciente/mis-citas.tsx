import { Head, Link, router } from '@inertiajs/react';
import { format, formatDistanceToNow, isSameDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Building2,
    Calendar as CalendarIcon,
    CheckCircle2,
    ChevronDown,
    Clock,
    Hourglass,
    Loader2,
    NotebookPen,
    Pill,
    Plus,
    Search,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    UserRound,
    Video,
    X,
    FileText,
} from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { toast } from 'sonner';

import AgendarCitaDialog, {
    type MedicoAgendar,
} from '@/components/agendar-cita-dialog';
import Footer from '@/components/footer';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { citas, datosMedicos, videollamada } from '@/routes/pacientes';
import citasRoutes from '@/routes/pacientes/citas';

interface MedicoCita {
    id: number;
    nombre: string;
    especialidad?: string | null;
    consultorio_costo?: string | null;
    foto?: string | null;
}

interface NotaCompartida {
    id: number;
    contenido: string;
    creado: string | null;
}

interface CitaProp {
    id: number;
    fecha: string | null;
    hora: string | null;
    motivo_consulta?: string | null;
    sintomas?: string | null;
    estado_cita?: string | null;
    tipo?: string | null;
    historial_compartido?: number | null;
    receta_compartida?: number | null;
    notas_compartidas?: NotaCompartida[];
    medico?: MedicoCita | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedMedicos {
    data: MedicoAgendar[];
    links: PaginationLink[];
}

interface Props {
    tienePaciente: boolean;
    citas: CitaProp[];
    medicos: PaginatedMedicos;
    filters?: { q?: string };
}

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

function FotoMedico({
    foto,
    nombre,
}: {
    foto?: string | null;
    nombre: string;
}) {
    if (foto) {
        return (
            <img
                src={`/imagen/${foto}`}
                alt={nombre}
                className="h-10 w-10 shrink-0 rounded-xl object-cover shadow-sm"
            />
        );
    }

    return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
            <UserRound className="h-5 w-5 text-white" />
        </span>
    );
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

function CancelarCita({ cita }: { cita: CitaProp }) {
    const [enviando, setEnviando] = useState(false);

    const cancelar = () => {
        setEnviando(true);
        router.delete(citasRoutes.destroy.url({ cita: cita.id }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Cita cancelada correctamente.'),
            onError: () => toast.error('No se pudo cancelar la cita.'),
            onFinish: () => setEnviando(false),
        });
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    size="sm"
                    variant="ghost"
                    className="rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 dark:text-red-400 dark:hover:bg-red-950"
                >
                    <X className="h-4 w-4" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Cancelar esta cita?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se cancelará la solicitud con{' '}
                        {cita.medico?.nombre ?? 'el médico'}
                        {cita.fecha
                            ? ` del ${format(parseISO(cita.fecha), 'dd/MM/yyyy', { locale: es })} a las ${hora12(cita.hora)}`
                            : ' (pendiente de agenda)'}
                        . Esta acción no se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>No, conservar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={cancelar}
                        disabled={enviando}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {enviando ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Cancelando...
                            </>
                        ) : (
                            'Sí, cancelar'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

function TarjetaCita({ cita }: { cita: CitaProp }) {
    const [notasAbiertas, setNotasAbiertas] = useState(false);
    const sinAgenda = !cita.fecha;
    const notas = cita.notas_compartidas ?? [];
    const tieneDocumentos =
        cita.historial_compartido || cita.receta_compartida || notas.length > 0;

    return (
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-sm">
                        {cita.tipo === 'VIDEOLLAMADA' ? (
                            <Video className="h-5 w-5 text-white" />
                        ) : (
                            <Building2 className="h-5 w-5 text-white" />
                        )}
                    </div>
                    <div>
                        <p className="flex flex-wrap items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
                            {sinAgenda ? (
                                <>
                                    <Hourglass className="h-3.5 w-3.5 text-amber-500" />
                                    Pendiente de agenda
                                </>
                            ) : (
                                <>
                                    <Clock className="h-3.5 w-3.5 text-sky-500" />
                                    {hora12(cita.hora)}
                                </>
                            )}
                            <Badge
                                className={cn(
                                    'border-transparent text-[10px] font-bold uppercase',
                                    cita.estado_cita === 'CONFIRMADA'
                                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300'
                                        : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
                                )}
                            >
                                {cita.estado_cita ?? 'PENDIENTE'}
                            </Badge>
                        </p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-700 dark:text-slate-200">
                            <Stethoscope className="h-3.5 w-3.5 text-blue-500" />
                            {cita.medico?.nombre ?? 'Médico'}
                            {cita.medico?.especialidad ? (
                                <span className="font-medium text-slate-400">
                                    · {cita.medico.especialidad}
                                </span>
                            ) : null}
                        </p>
                        {cita.motivo_consulta && (
                            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                {cita.motivo_consulta}
                            </p>
                        )}
                    </div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-2">
                    {cita.tipo === 'VIDEOLLAMADA' &&
                        cita.estado_cita === 'CONFIRMADA' && (
                            <Button
                                size="sm"
                                asChild
                                className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 font-semibold shadow-md hover:from-blue-500 hover:to-sky-400"
                            >
                                <Link
                                    href={
                                        videollamada({
                                            cita: cita.id,
                                        }).url
                                    }
                                >
                                    <Video className="mr-1.5 h-4 w-4" />
                                    Entrar a videollamada
                                </Link>
                            </Button>
                        )}
                    <CancelarCita cita={cita} />
                </div>
            </div>

            {tieneDocumentos && (
                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-200/80 pt-3 dark:border-slate-700/60">
                    <span className="mr-1 hidden text-[10px] font-bold tracking-widest text-slate-400 uppercase sm:inline dark:text-slate-500">
                        Compartido:
                    </span>

                    {cita.historial_compartido && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/40"
                            onClick={() =>
                                window.open(
                                    `/paciente/historial/${cita.historial_compartido}/pdf`,
                                    '_blank',
                                )
                            }
                        >
                            <FileText className="h-4 w-4" />
                            Informe médico
                        </Button>
                    )}

                    {cita.receta_compartida && (
                        <Button
                            size="sm"
                            variant="outline"
                            className="gap-1.5 rounded-xl border-violet-200 text-violet-600 hover:bg-violet-50 dark:border-violet-800 dark:text-violet-400 dark:hover:bg-violet-950/40"
                            onClick={() =>
                                window.open(
                                    `/paciente/receta/${cita.receta_compartida}/pdf`,
                                    '_blank',
                                )
                            }
                        >
                            <Pill className="h-4 w-4" />
                            Receta médica
                        </Button>
                    )}

                    {notas.length > 0 && (
                        <Button
                            size="sm"
                            variant="outline"
                            className={cn(
                                'gap-1.5 rounded-xl border-teal-200 text-teal-600 hover:bg-teal-50 dark:border-teal-800 dark:text-teal-400 dark:hover:bg-teal-950/40',
                                notasAbiertas &&
                                    'bg-teal-50 dark:bg-teal-950/40',
                            )}
                            onClick={() => setNotasAbiertas((v) => !v)}
                        >
                            <NotebookPen className="h-4 w-4" />
                            {notas.length === 1
                                ? 'Nota'
                                : `Notas (${notas.length})`}
                            <ChevronDown
                                className={cn(
                                    'h-3.5 w-3.5 transition-transform',
                                    notasAbiertas && 'rotate-180',
                                )}
                            />
                        </Button>
                    )}
                </div>
            )}

            {notasAbiertas && notas.length > 0 && (
                <div className="mt-3 space-y-2">
                    {notas.map((nota) => (
                        <div
                            key={nota.id}
                            className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40"
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                {nota.contenido}
                            </p>
                            {nota.creado && (
                                <p className="mt-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                                    {formatDistanceToNow(
                                        new Date(nota.creado),
                                        { addSuffix: true, locale: es },
                                    )}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
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
                <p className="max-w-xs text-xs text-slate-500 dark:text-slate-400">
                    Usa el buscador de médicos para solicitar una nueva cita.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {[...citas]
                .sort((a, b) => (a.hora ?? '').localeCompare(b.hora ?? ''))
                .map((cita) => (
                    <TarjetaCita key={cita.id} cita={cita} />
                ))}
        </div>
    );
}

function BuscadorMedicos({
    medicos,
    filters,
    onAgendar,
}: {
    medicos: PaginatedMedicos;
    filters?: { q?: string };
    onAgendar: (medico: MedicoAgendar) => void;
}) {
    const [busqueda, setBusqueda] = useState(filters?.q ?? '');

    const buscar = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            citas.url({ query: { q: busqueda.trim() || undefined } }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    return (
        <div className="space-y-4">
            <form onSubmit={buscar} className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    className="h-11 rounded-2xl border-slate-200 bg-white pr-24 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                    placeholder="Buscar por nombre o especialidad..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
                <Button
                    type="submit"
                    size="sm"
                    className="absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 text-xs font-semibold"
                >
                    Buscar
                </Button>
            </form>

            {medicos.data.length === 0 ? (
                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
                    <Stethoscope className="h-8 w-8 text-slate-300" />
                    <p className="text-sm font-semibold text-slate-500">
                        No se encontraron médicos
                    </p>
                    <p className="text-xs text-slate-400">
                        Prueba con otro nombre o especialidad.
                    </p>
                </div>
            ) : (
                <>
                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <Table>
                            <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Médico
                                    </TableHead>
                                    <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:table-cell dark:text-slate-400">
                                        Especialidad
                                    </TableHead>
                                    <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase md:table-cell dark:text-slate-400">
                                        Costo
                                    </TableHead>
                                    <TableHead className="pr-6 text-right text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Acción
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {medicos.data.map((medico) => (
                                    <TableRow key={medico.id}>
                                        <TableCell className="pl-6">
                                            <span className="flex items-center gap-3">
                                                <FotoMedico
                                                    foto={medico.foto}
                                                    nombre={medico.nombre}
                                                />
                                                <span className="block text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                    {medico.nombre}
                                                </span>
                                            </span>
                                        </TableCell>
                                        <TableCell className="hidden sm:table-cell">
                                            <Badge
                                                variant="outline"
                                                className="border-sky-200 bg-sky-50 text-[10px] font-semibold text-sky-700 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-300"
                                            >
                                                {medico.especialidad ??
                                                    'General'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="hidden text-xs font-medium text-slate-500 md:table-cell dark:text-slate-400">
                                            {medico.consultorio_costo
                                                ? `$${medico.consultorio_costo}`
                                                : 'Consultar'}
                                        </TableCell>
                                        <TableCell className="pr-6 text-right">
                                            <Button
                                                size="sm"
                                                className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 font-semibold shadow-md hover:from-blue-500 hover:to-sky-400"
                                                onClick={() =>
                                                    onAgendar(medico)
                                                }
                                            >
                                                <Plus className="mr-1.5 h-3.5 w-3.5" />
                                                Agendar cita
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    {medicos.links.length > 3 && (
                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                            {medicos.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
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
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default function MisCitas({
    tienePaciente,
    citas: listaCitas,
    medicos,
    filters,
}: Props) {
    const [fechaSeleccionada, setFechaSeleccionada] = useState<Date>(
        () => new Date(),
    );
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [medicoSeleccionado, setMedicoSeleccionado] =
        useState<MedicoAgendar | null>(null);

    const fechasConCitas = useMemo(
        () =>
            listaCitas
                .map((c) => c.fecha)
                .filter((f): f is string => Boolean(f))
                .map((f) => parseISO(f)),
        [listaCitas],
    );

    const citasDelDia = useMemo(
        () =>
            listaCitas.filter(
                (c) =>
                    c.fecha && isSameDay(parseISO(c.fecha), fechaSeleccionada),
            ),
        [listaCitas, fechaSeleccionada],
    );

    const citasPendientes = useMemo(
        () => listaCitas.filter((c) => !c.fecha),
        [listaCitas],
    );

    const agendar = (medico: MedicoAgendar) => {
        setMedicoSeleccionado(medico);
        setDialogoAbierto(true);
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Mis Citas · TuMediBot" />

            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <CalendarIcon className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Mis Citas
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Agenda y
                                    consulta tus citas médicas
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Cada cita es visible solo para ti y tu médico
                        </div>
                    </div>
                </div>
            </section>

            <main className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
                {!tienePaciente ? (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <UserRound className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Completa tus datos médicos primero
                            </h3>
                            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                                Para agendar citas necesitas registrar primero
                                tus datos médicos.
                            </p>
                            <Button
                                asChild
                                className="mt-2 h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-sky-400"
                            >
                                <a href={datosMedicos().url}>
                                    Ir a Datos Médicos
                                </a>
                            </Button>
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
                                        Los días con cita aparecen marcados
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
                        </div>

                        <div className="space-y-6 lg:col-span-3">
                            <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                                <CardHeader className="border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <Plus className="h-5 w-5 text-sky-500" />
                                        Solicitar nueva cita
                                    </CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        Busca un médico; él te asignará fecha y
                                        hora
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    <BuscadorMedicos
                                        medicos={medicos}
                                        filters={filters}
                                        onAgendar={agendar}
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                )}

                {tienePaciente && citasPendientes.length > 0 && (
                    <section className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                                <Hourglass className="h-5 w-5 text-amber-500" />
                                Pendientes de agenda
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase">
                                {citasPendientes.length}{' '}
                                {citasPendientes.length === 1
                                    ? 'solicitud'
                                    : 'solicitudes'}
                            </span>
                        </div>
                        <div className="space-y-3">
                            {citasPendientes.map((cita) => (
                                <TarjetaCita key={cita.id} cita={cita} />
                            ))}
                        </div>
                    </section>
                )}

                {tienePaciente && (
                    <section className="mt-6">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                Citas del{' '}
                                {format(
                                    fechaSeleccionada,
                                    "EEEE, d 'de' MMMM",
                                    {
                                        locale: es,
                                    },
                                )}
                            </h2>
                            <span className="text-xs font-bold text-slate-400 uppercase">
                                {citasDelDia.length}{' '}
                                {citasDelDia.length === 1 ? 'cita' : 'citas'}
                            </span>
                        </div>
                        <CitasDelDia
                            citas={citasDelDia}
                            fecha={fechaSeleccionada}
                        />
                    </section>
                )}
            </main>

            <AgendarCitaDialog
                key={`${medicoSeleccionado?.id ?? 'sin-medico'}-${String(dialogoAbierto)}`}
                medico={medicoSeleccionado}
                open={dialogoAbierto}
                onOpenChange={setDialogoAbierto}
            />

            <Footer />
        </div>
    );
}
