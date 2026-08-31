import { Head, Link, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    AlarmClock,
    Bell,
    Building2,
    Calendar,
    CheckCheck,
    ClipboardList,
    Clock,
    FileText,
    NotebookPen,
    Pill,
    Stethoscope,
    Trash2,
    UserRound,
    Video,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NotificacionData {
    cita_id?: number;
    archivo_id?: number;
    receta_id?: number;
    historial_id?: number;
    nota_id?: number;
    nombre_archivo?: string | null;
    tipo_archivo?: string | null;
    diagnostico?: string | null;
    tipo?: string | null;
    fecha?: string | null;
    hora?: string | null;
    motivo?: string | null;
    paciente_nombre?: string | null;
    medico_nombre?: string | null;
    mensaje?: string | null;
    recordatorio?: string | null;
}

interface Notificacion {
    id: string;
    type: string;
    data: NotificacionData;
    read_at: string | null;
    created_at: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedNotificaciones {
    data: Notificacion[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
}

interface Props {
    notificaciones: PaginatedNotificaciones;
}

interface TemaNotificacion {
    icono: LucideIcon;
    iconoBg: string;
    iconoColor: string;
    tarjetaLeida: string;
    tarjetaNueva: string;
}

/**
 * Paletas de color por tipo de notificación, con variantes para modo
 * claro y oscuro. Cada paleta define el tinte del icono y los estilos
 * de la tarjeta según esté leída o sin leer.
 */
const PALETAS = {
    amber: {
        iconoBg: 'bg-amber-500/10 dark:bg-amber-500/15',
        iconoColor: 'text-amber-600 dark:text-amber-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-amber-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-amber-500/30',
        tarjetaNueva:
            'border-amber-500/30 bg-amber-50/50 hover:border-amber-500/50 dark:border-amber-500/25 dark:bg-amber-500/10 dark:hover:border-amber-500/40',
    },
    blue: {
        iconoBg: 'bg-blue-600/10 dark:bg-blue-500/15',
        iconoColor: 'text-blue-600 dark:text-blue-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-blue-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-blue-500/30',
        tarjetaNueva:
            'border-blue-500/30 bg-blue-50/50 hover:border-blue-500/50 dark:border-blue-500/25 dark:bg-blue-500/10 dark:hover:border-blue-500/40',
    },
    emerald: {
        iconoBg: 'bg-emerald-600/10 dark:bg-emerald-500/15',
        iconoColor: 'text-emerald-600 dark:text-emerald-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-emerald-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-emerald-500/30',
        tarjetaNueva:
            'border-emerald-500/30 bg-emerald-50/50 hover:border-emerald-500/50 dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:hover:border-emerald-500/40',
    },
    violet: {
        iconoBg: 'bg-violet-600/10 dark:bg-violet-500/15',
        iconoColor: 'text-violet-600 dark:text-violet-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-violet-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-violet-500/30',
        tarjetaNueva:
            'border-violet-500/30 bg-violet-50/50 hover:border-violet-500/50 dark:border-violet-500/25 dark:bg-violet-500/10 dark:hover:border-violet-500/40',
    },
    indigo: {
        iconoBg: 'bg-indigo-600/10 dark:bg-indigo-500/15',
        iconoColor: 'text-indigo-600 dark:text-indigo-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-indigo-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-indigo-500/30',
        tarjetaNueva:
            'border-indigo-500/30 bg-indigo-50/50 hover:border-indigo-500/50 dark:border-indigo-500/25 dark:bg-indigo-500/10 dark:hover:border-indigo-500/40',
    },
    teal: {
        iconoBg: 'bg-teal-600/10 dark:bg-teal-500/15',
        iconoColor: 'text-teal-600 dark:text-teal-400',
        tarjetaLeida:
            'border-slate-200/80 bg-white/80 hover:border-teal-500/40 dark:border-slate-800/60 dark:bg-slate-900/50 dark:hover:border-teal-500/30',
        tarjetaNueva:
            'border-teal-500/30 bg-teal-50/50 hover:border-teal-500/50 dark:border-teal-500/25 dark:bg-teal-500/10 dark:hover:border-teal-500/40',
    },
} as const;

function formatearHora(hora?: string | null): string {
    if (!hora) {
        return '—';
    }

    const partes = hora.split(':');

    if (partes.length < 2 || !Number(partes[0])) {
        return hora;
    }

    const h = Number(partes[0]);
    const m = partes[1];
    const periodo = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;

    return `${h12}:${m} ${periodo}`;
}

function formatearFecha(fecha?: string | null): string {
    if (!fecha) {
        return 'Pendiente';
    }

    const d = new Date(fecha + 'T00:00:00');

    if (isNaN(d.getTime())) {
        return fecha;
    }

    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function formatearTipoArchivo(tipo?: string | null): string {
    if (!tipo) {
        return '—';
    }

    const mapa: Record<string, string> = {
        EXAMEN: 'Examen',
        RADIOLOGÍA: 'Radiología',
        RECETA: 'Receta',
        LABORATORIO: 'Laboratorio',
        RECOMENDACION: 'Recomendación',
        OTRO: 'Otro',
    };

    return mapa[tipo] ?? tipo;
}

function obtenerTitulo(n: Notificacion): string {
    if (n.type.includes('RecordatorioCita')) {
        const r = n.data.recordatorio;

        if (r === '3d') {
            return 'Recordatorio: cita en 3 días';
        }

        if (r === '1d') {
            return 'Recordatorio: cita mañana';
        }

        if (r === '3h') {
            return 'Recordatorio: cita en 3 horas';
        }

        return 'Recordatorio de cita';
    }

    if (n.type.includes('NuevaCitaMedico')) {
        return 'Nueva solicitud de cita';
    }

    if (n.type.includes('CitaAgendadaPaciente')) {
        return 'Cita agendada';
    }

    if (n.type.includes('NuevaCitaPaciente')) {
        return 'Nueva solicitud de cita';
    }

    if (n.type.includes('ArchivoCompartidoMedico')) {
        return 'Archivo compartido contigo';
    }

    if (n.type.includes('RecetaCompartidaPaciente')) {
        return 'Receta médica compartida';
    }

    if (n.type.includes('HistorialCompartidoPaciente')) {
        return 'Historial clínico compartido';
    }

    if (n.type.includes('NotaCompartidaPaciente')) {
        return 'Nota de consulta compartida';
    }

    return 'Notificación';
}

function esCitaMedico(n: Notificacion): boolean {
    return (
        n.type.includes('NuevaCitaMedico') ||
        n.type.includes('NuevaCitaPaciente')
    );
}

function esArchivoCompartido(n: Notificacion): boolean {
    return n.type.includes('ArchivoCompartidoMedico');
}

function esRecetaCompartida(n: Notificacion): boolean {
    return n.type.includes('RecetaCompartidaPaciente');
}

function esHistorialCompartido(n: Notificacion): boolean {
    return n.type.includes('HistorialCompartidoPaciente');
}

function esNotaCompartida(n: Notificacion): boolean {
    return n.type.includes('NotaCompartidaPaciente');
}

function esDocumentoMedico(n: Notificacion): boolean {
    return (
        esRecetaCompartida(n) || esHistorialCompartido(n) || esNotaCompartida(n)
    );
}

function esRecordatorio(n: Notificacion): boolean {
    return n.type.includes('RecordatorioCita');
}

/**
 * Devuelve el tema visual (icono y colores) según el tipo de notificación.
 */
function temaNotificacion(n: Notificacion): TemaNotificacion {
    if (esRecordatorio(n)) {
        return { icono: AlarmClock, ...PALETAS.amber };
    }

    if (esArchivoCompartido(n)) {
        return { icono: FileText, ...PALETAS.emerald };
    }

    if (esRecetaCompartida(n)) {
        return { icono: Pill, ...PALETAS.violet };
    }

    if (esHistorialCompartido(n)) {
        return { icono: ClipboardList, ...PALETAS.indigo };
    }

    if (esNotaCompartida(n)) {
        return { icono: NotebookPen, ...PALETAS.teal };
    }

    if (esCitaMedico(n)) {
        return { icono: Stethoscope, ...PALETAS.blue };
    }

    return { icono: Calendar, ...PALETAS.emerald };
}

const claseEtiqueta = 'text-slate-500 dark:text-slate-400';
const claseValor = 'font-medium text-slate-800 dark:text-slate-100';
const claseIconoDetalle = 'h-4 w-4 shrink-0 text-slate-400 dark:text-slate-500';

export default function NotificacionesIndex({ notificaciones }: Props) {
    const items = notificaciones.data;
    const noLeidas = items.filter((n) => !n.read_at);

    const marcarComoLeida = (n: Notificacion) => {
        if (n.read_at) {
            return;
        }

        router.patch(
            `/notificaciones/${n.id}/leer`,
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success('Notificación marcada como leída');
                },
            },
        );
    };

    const marcarTodas = () => {
        if (noLeidas.length === 0) {
            return;
        }

        router.post(
            '/notificaciones/leer-todas',
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    toast.success(
                        'Todas las notificaciones fueron marcadas como leídas',
                    );
                },
            },
        );
    };

    const eliminarTodas = () => {
        if (notificaciones.total === 0) {
            return;
        }

        if (
            !confirm(
                '¿Eliminar todas las notificaciones? Esta acción no se puede deshacer.',
            )
        ) {
            return;
        }

        router.delete('/notificaciones/eliminar-todas', {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                toast.success('Todas las notificaciones fueron eliminadas');
            },
        });
    };

    return (
        <>
            <Head title="Notificaciones" />

            <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 antialiased transition-colors duration-300 sm:py-10 dark:bg-[#0b1121] dark:text-slate-100">
                <div className="mx-auto w-full max-w-3xl space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <Bell className="h-6 w-6 text-white" />
                                {noLeidas.length > 0 && (
                                    <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-md">
                                        {noLeidas.length}
                                    </span>
                                )}
                            </div>
                            <div>
                                <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                    Notificaciones
                                </h1>
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <p className="text-sm text-slate-500 dark:text-slate-400">
                                        {notificaciones.total > 0
                                            ? `${notificaciones.total} ${notificaciones.total === 1 ? 'notificación en total' : 'notificaciones en total'}`
                                            : 'No tienes notificaciones'}
                                    </p>
                                    {noLeidas.length > 0 && (
                                        <span className="rounded-full bg-blue-600/10 px-2.5 py-0.5 text-[11px] font-bold text-blue-600 dark:bg-blue-500/15 dark:text-blue-400">
                                            {noLeidas.length} sin leer
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {notificaciones.total > 0 && (
                            <div className="flex items-center gap-2">
                                {noLeidas.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={marcarTodas}
                                        className="gap-2 rounded-xl"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Marcar todas
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={eliminarTodas}
                                    className="gap-2 rounded-xl text-destructive hover:text-destructive dark:text-rose-400 dark:hover:text-rose-300"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar
                                </Button>
                            </div>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                            <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
                                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
                                    <Bell className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">
                                        No tienes notificaciones
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Las notificaciones de citas y archivos
                                        aparecerán aquí
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {items.map((n) => {
                                    const leida = !!n.read_at;
                                    const data = n.data;
                                    const tema = temaNotificacion(n);
                                    const IconoTema = tema.icono;
                                    const nombrePersona = esCitaMedico(n)
                                        ? data.paciente_nombre
                                        : data.medico_nombre;
                                    const fechaTitulo = n.created_at
                                        ? new Date(n.created_at).toLocaleString(
                                              'es-ES',
                                              {
                                                  dateStyle: 'long',
                                                  timeStyle: 'short',
                                              },
                                          )
                                        : '';

                                    return (
                                        <Card
                                            key={n.id}
                                            className={cn(
                                                'cursor-pointer gap-4 overflow-hidden rounded-2xl py-5 shadow-sm transition-all duration-200 hover:shadow-lg',
                                                leida
                                                    ? tema.tarjetaLeida
                                                    : tema.tarjetaNueva,
                                            )}
                                            onClick={() => marcarComoLeida(n)}
                                        >
                                            <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className={cn(
                                                            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                                                            tema.iconoBg,
                                                        )}
                                                    >
                                                        <IconoTema
                                                            className={cn(
                                                                'h-5 w-5',
                                                                tema.iconoColor,
                                                            )}
                                                        />
                                                    </div>
                                                    <div>
                                                        <CardTitle
                                                            className={cn(
                                                                'text-[15px] leading-snug font-semibold',
                                                                leida
                                                                    ? 'text-slate-700 dark:text-slate-300'
                                                                    : 'text-slate-900 dark:text-white',
                                                            )}
                                                        >
                                                            {obtenerTitulo(n)}
                                                        </CardTitle>
                                                        <p
                                                            className={cn(
                                                                'mt-0.5 text-xs',
                                                                claseEtiqueta,
                                                            )}
                                                            title={fechaTitulo}
                                                        >
                                                            {n.created_at
                                                                ? formatDistanceToNow(
                                                                      new Date(
                                                                          n.created_at,
                                                                      ),
                                                                      {
                                                                          addSuffix: true,
                                                                          locale: es,
                                                                      },
                                                                  )
                                                                : ''}
                                                        </p>
                                                    </div>
                                                </div>

                                                {leida ? (
                                                    <CheckCheck
                                                        className={cn(
                                                            'h-4 w-4 shrink-0',
                                                            'text-slate-300 dark:text-slate-600',
                                                        )}
                                                    />
                                                ) : (
                                                    <span
                                                        className={cn(
                                                            'inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wide uppercase',
                                                            tema.iconoBg,
                                                            tema.iconoColor,
                                                        )}
                                                    >
                                                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                                                        Nuevo
                                                    </span>
                                                )}
                                            </CardHeader>

                                            <CardContent className="space-y-3">
                                                {data.mensaje && (
                                                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                                                        {data.mensaje}
                                                    </p>
                                                )}

                                                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                                    {esArchivoCompartido(n) ? (
                                                        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                                            {data.paciente_nombre && (
                                                                <div className="flex items-center gap-2">
                                                                    <UserRound
                                                                        className={
                                                                            claseIconoDetalle
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Paciente:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            claseValor
                                                                        }
                                                                    >
                                                                        {
                                                                            data.paciente_nombre
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {data.nombre_archivo && (
                                                                <div className="flex min-w-0 items-center gap-2">
                                                                    <FileText
                                                                        className={
                                                                            claseIconoDetalle
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Archivo:
                                                                    </span>
                                                                    <span
                                                                        className={cn(
                                                                            'truncate',
                                                                            claseValor,
                                                                        )}
                                                                    >
                                                                        {
                                                                            data.nombre_archivo
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {data.tipo_archivo && (
                                                                <div className="flex items-center gap-2">
                                                                    <FileText
                                                                        className={
                                                                            claseIconoDetalle
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Tipo:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            claseValor
                                                                        }
                                                                    >
                                                                        {formatearTipoArchivo(
                                                                            data.tipo_archivo,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : esDocumentoMedico(n) ? (
                                                        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                                            {data.medico_nombre && (
                                                                <div className="flex items-center gap-2">
                                                                    <Stethoscope
                                                                        className={
                                                                            claseIconoDetalle
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Médico:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            claseValor
                                                                        }
                                                                    >
                                                                        Dr.{' '}
                                                                        {
                                                                            data.medico_nombre
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            {data.diagnostico && (
                                                                <div className="flex min-w-0 items-start gap-2">
                                                                    <ClipboardList
                                                                        className={cn(
                                                                            claseIconoDetalle,
                                                                            'mt-0.5',
                                                                        )}
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Diagnóstico:
                                                                    </span>
                                                                    <span
                                                                        className={cn(
                                                                            'min-w-0',
                                                                            claseValor,
                                                                        )}
                                                                    >
                                                                        {
                                                                            data.diagnostico
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                                                            {nombrePersona && (
                                                                <div className="flex items-center gap-2">
                                                                    <UserRound
                                                                        className={
                                                                            claseIconoDetalle
                                                                        }
                                                                    />
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        {esCitaMedico(
                                                                            n,
                                                                        )
                                                                            ? 'Paciente'
                                                                            : 'Médico'}
                                                                        :
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            claseValor
                                                                        }
                                                                    >
                                                                        {
                                                                            nombrePersona
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-2">
                                                                <Calendar
                                                                    className={
                                                                        claseIconoDetalle
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        claseEtiqueta
                                                                    }
                                                                >
                                                                    Fecha:
                                                                </span>
                                                                <span
                                                                    className={
                                                                        claseValor
                                                                    }
                                                                >
                                                                    {formatearFecha(
                                                                        data.fecha,
                                                                    )}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <Clock
                                                                    className={
                                                                        claseIconoDetalle
                                                                    }
                                                                />
                                                                <span
                                                                    className={
                                                                        claseEtiqueta
                                                                    }
                                                                >
                                                                    Hora:
                                                                </span>
                                                                <span
                                                                    className={
                                                                        claseValor
                                                                    }
                                                                >
                                                                    {data.hora
                                                                        ? formatearHora(
                                                                              data.hora,
                                                                          )
                                                                        : 'Pendiente'}
                                                                </span>
                                                            </div>
                                                            {data.tipo && (
                                                                <div className="flex items-center gap-2">
                                                                    {data.tipo ===
                                                                    'VIDEOLLAMADA' ? (
                                                                        <Video
                                                                            className={
                                                                                claseIconoDetalle
                                                                            }
                                                                        />
                                                                    ) : (
                                                                        <Building2
                                                                            className={
                                                                                claseIconoDetalle
                                                                            }
                                                                        />
                                                                    )}
                                                                    <span
                                                                        className={
                                                                            claseEtiqueta
                                                                        }
                                                                    >
                                                                        Tipo:
                                                                    </span>
                                                                    <span
                                                                        className={
                                                                            claseValor
                                                                        }
                                                                    >
                                                                        {data.tipo ===
                                                                        'VIDEOLLAMADA'
                                                                            ? 'Videollamada'
                                                                            : 'Consultorio'}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    {data.motivo && (
                                                        <div className="mt-2 flex items-start gap-2 border-t border-slate-200 pt-2 text-sm dark:border-slate-700/60">
                                                            <span
                                                                className={
                                                                    claseEtiqueta
                                                                }
                                                            >
                                                                Motivo:
                                                            </span>
                                                            <span
                                                                className={cn(
                                                                    'min-w-0',
                                                                    claseValor,
                                                                )}
                                                            >
                                                                {data.motivo}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {!leida && (
                                                    <p className="text-right text-[11px] text-slate-400 dark:text-slate-500">
                                                        Clic para marcar como
                                                        leída
                                                    </p>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>

                            {notificaciones.links.length > 3 && (
                                <div className="flex flex-wrap items-center justify-center gap-1.5">
                                    {notificaciones.links.map((link, index) => (
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
            </div>
        </>
    );
}
