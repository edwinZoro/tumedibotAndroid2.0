import { Head, Link, router } from '@inertiajs/react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Bell,
    Calendar,
    Clock,
    CheckCheck,
    Stethoscope,
    UserRound,
    Video,
    Building2,
    AlarmClock,
    Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface NotificacionData {
    cita_id?: number;
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

function formatearHora(hora?: string | null): string {
    if (!hora) return '—';
    const partes = hora.split(':');
    if (partes.length < 2 || !Number(partes[0])) return hora;
    const h = Number(partes[0]);
    const m = partes[1];
    const periodo = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    return `${h12}:${m} ${periodo}`;
}

function formatearFecha(fecha?: string | null): string {
    if (!fecha) return 'Pendiente';
    const d = new Date(fecha + 'T00:00:00');
    if (isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function obtenerTitulo(n: Notificacion): string {
    if (n.type.includes('RecordatorioCita')) {
        const r = n.data.recordatorio;
        if (r === '3d') return 'Recordatorio: cita en 3 días';
        if (r === '1d') return 'Recordatorio: cita mañana';
        if (r === '3h') return 'Recordatorio: cita en 3 horas';
        return 'Recordatorio de cita';
    }
    if (n.type.includes('NuevaCitaMedico')) return 'Nueva solicitud de cita';
    if (n.type.includes('CitaAgendadaPaciente')) return 'Cita agendada';
    if (n.type.includes('NuevaCitaPaciente')) return 'Nueva solicitud de cita';
    return 'Notificación';
}

export default function NotificacionesIndex({ notificaciones }: Props) {
    const items = notificaciones.data;
    const noLeidas = items.filter((n) => !n.read_at);

    const marcarComoLeida = (n: Notificacion) => {
        if (n.read_at) return;
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
        if (noLeidas.length === 0) return;
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
        if (notificaciones.total === 0) return;
        if (
            !confirm(
                '¿Eliminar todas las notificaciones? Esta acción no se puede deshacer.',
            )
        )
            return;
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

            <div className="flex flex-col items-center px-4 py-6">
                <div className="w-full max-w-3xl space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600/10">
                                <Bell className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">
                                    Notificaciones
                                </h1>
                                <p className="text-sm text-slate-500">
                                    {notificaciones.total > 0
                                        ? `${notificaciones.total} ${notificaciones.total === 1 ? 'notificación en total' : 'notificaciones en total'}`
                                        : 'No tienes notificaciones'}
                                </p>
                            </div>
                        </div>
                        {notificaciones.total > 0 && (
                            <div className="flex items-center gap-2">
                                {noLeidas.length > 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={marcarTodas}
                                        className="gap-2"
                                    >
                                        <CheckCheck className="h-4 w-4" />
                                        Marcar todas
                                    </Button>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={eliminarTodas}
                                    className="gap-2 text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Eliminar
                                </Button>
                            </div>
                        )}
                    </div>

                    {items.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center gap-4 py-16">
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                                    <Bell className="h-8 w-8 text-slate-400" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-slate-700">
                                        No tienes notificaciones
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Las notificaciones de citas aparecerán
                                        aquí
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
                                    const esRecordatorio =
                                        n.type.includes('RecordatorioCita');
                                    const esCitaMedico =
                                        n.type.includes('NuevaCitaMedico') ||
                                        n.type.includes('NuevaCitaPaciente');
                                    const nombrePersona = esCitaMedico
                                        ? data.paciente_nombre
                                        : data.medico_nombre;

                                    const iconoBg = esRecordatorio
                                        ? 'bg-amber-600/10'
                                        : esCitaMedico
                                          ? 'bg-blue-600/10'
                                          : 'bg-emerald-600/10';
                                    const iconoColor = esRecordatorio
                                        ? 'text-amber-600'
                                        : esCitaMedico
                                          ? 'text-blue-600'
                                          : 'text-emerald-600';

                                    return (
                                        <Card
                                            key={n.id}
                                            className={cn(
                                                'cursor-pointer transition-all hover:shadow-md',
                                                !leida &&
                                                    (esRecordatorio
                                                        ? 'border-amber-600/30 bg-amber-50/40'
                                                        : 'border-blue-600/30 bg-blue-50/40'),
                                            )}
                                            onClick={() => marcarComoLeida(n)}
                                        >
                                            <CardHeader className="pb-3">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={cn(
                                                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                                                                iconoBg,
                                                            )}
                                                        >
                                                            {esRecordatorio ? (
                                                                <AlarmClock
                                                                    className={cn(
                                                                        'h-5 w-5',
                                                                        iconoColor,
                                                                    )}
                                                                />
                                                            ) : esCitaMedico ? (
                                                                <Stethoscope
                                                                    className={cn(
                                                                        'h-5 w-5',
                                                                        iconoColor,
                                                                    )}
                                                                />
                                                            ) : (
                                                                <Calendar
                                                                    className={cn(
                                                                        'h-5 w-5',
                                                                        iconoColor,
                                                                    )}
                                                                />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <CardTitle className="text-base font-semibold text-slate-900">
                                                                {obtenerTitulo(
                                                                    n,
                                                                )}
                                                            </CardTitle>
                                                            <p className="text-xs text-slate-500">
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
                                                    {!leida && (
                                                        <Badge
                                                            variant="destructive"
                                                            className="h-2 w-2 rounded-full p-0"
                                                        />
                                                    )}
                                                </div>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                {data.mensaje && (
                                                    <p className="text-sm text-slate-700">
                                                        {data.mensaje}
                                                    </p>
                                                )}

                                                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        {nombrePersona && (
                                                            <div className="flex items-center gap-2">
                                                                <UserRound className="h-4 w-4 shrink-0 text-slate-400" />
                                                                <span className="text-slate-500">
                                                                    {esCitaMedico
                                                                        ? 'Paciente'
                                                                        : 'Médico'}
                                                                    :
                                                                </span>
                                                                <span className="font-medium text-slate-900">
                                                                    {
                                                                        nombrePersona
                                                                    }
                                                                </span>
                                                            </div>
                                                        )}
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 shrink-0 text-slate-400" />
                                                            <span className="text-slate-500">
                                                                Fecha:
                                                            </span>
                                                            <span className="font-medium text-slate-900">
                                                                {formatearFecha(
                                                                    data.fecha,
                                                                )}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                                                            <span className="text-slate-500">
                                                                Hora:
                                                            </span>
                                                            <span className="font-medium text-slate-900">
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
                                                                    <Video className="h-4 w-4 shrink-0 text-slate-400" />
                                                                ) : (
                                                                    <Building2 className="h-4 w-4 shrink-0 text-slate-400" />
                                                                )}
                                                                <span className="text-slate-500">
                                                                    Tipo:
                                                                </span>
                                                                <span className="font-medium text-slate-900">
                                                                    {data.tipo ===
                                                                    'VIDEOLLAMADA'
                                                                        ? 'Videollamada'
                                                                        : 'Consultorio'}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    {data.motivo && (
                                                        <div className="mt-2 flex items-center gap-2 border-t border-slate-200 pt-2 text-sm">
                                                            <span className="text-slate-500">
                                                                Motivo:
                                                            </span>
                                                            <span className="font-medium text-slate-900">
                                                                {data.motivo}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
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
