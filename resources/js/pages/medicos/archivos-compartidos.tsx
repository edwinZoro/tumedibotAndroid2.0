import { Head } from '@inertiajs/react';
import {
    Download,
    Eye,
    File,
    FileCheck2,
    FileText,
    FlaskConical,
    FolderLock,
    Pill,
    ScanLine,
    ShieldCheck,
    Sparkles,
    Stethoscope,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    descargar as descargarRoute,
    ver as verRoute,
} from '@/routes/archivos';

// ─── Tipos ───────────────────────────────────────────────────────────────────
type TipoArchivo =
    | 'EXAMEN'
    | 'RADIOLOGÍA'
    | 'RECETA'
    | 'LABORATORIO'
    | 'RECOMENDACION'
    | 'OTRO';

interface ArchivoProp {
    id: number;
    nombre_archivo: string;
    extension: string;
    tipo: TipoArchivo;
}

interface PacienteProp {
    id: number;
    nombre: string;
}

interface GrupoProp {
    paciente: PacienteProp;
    archivos: ArchivoProp[];
}

interface Props {
    grupos: GrupoProp[];
}

const TIPOS: Record<
    TipoArchivo,
    {
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        badge: string;
    }
> = {
    EXAMEN: {
        label: 'Examen',
        icon: FileText,
        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
    RADIOLOGÍA: {
        label: 'Radiología',
        icon: ScanLine,
        badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    },
    RECETA: {
        label: 'Receta',
        icon: Pill,
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    LABORATORIO: {
        label: 'Laboratorio',
        icon: FlaskConical,
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
    RECOMENDACION: {
        label: 'Recomendación',
        icon: FileCheck2,
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    },
    OTRO: {
        label: 'Otro',
        icon: File,
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    },
};

// ─── Página principal ────────────────────────────────────────────────────────
export default function ArchivosCompartidos({ grupos }: Props) {
    return (
        <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Archivos Compartidos · TuMediBot" />

            {/* ══ HERO ═══════════════════════════════════════════════════════ */}
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
                                    Archivos Compartidos
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Documentos
                                    que tus pacientes compartieron contigo
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Solo ves lo que el paciente autorizó
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CONTENIDO ═════════════════════════════════════════════════ */}
            <main className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
                {grupos.length === 0 ? (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <FolderLock className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                No tienes archivos compartidos
                            </h3>
                            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                                Cuando un paciente comparta contigo un documento
                                desde su bóveda, aparecerá aquí automáticamente.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        {grupos.map((grupo) => (
                            <Card
                                key={grupo.paciente.id}
                                className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50"
                            >
                                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                                <CardHeader className="border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600">
                                            <span className="text-sm font-extrabold text-white">
                                                {grupo.paciente.nombre
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </span>
                                        {grupo.paciente.nombre}
                                    </CardTitle>
                                    <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                        {grupo.archivos.length}{' '}
                                        {grupo.archivos.length === 1
                                            ? 'documento compartido'
                                            : 'documentos compartidos'}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="p-0">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                                            <TableRow className="hover:bg-transparent">
                                                <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                    Archivo
                                                </TableHead>
                                                <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:table-cell dark:text-slate-400">
                                                    Tipo
                                                </TableHead>
                                                <TableHead className="pr-6 text-right text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                    Acciones
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {grupo.archivos.map((archivo) => {
                                                const tipo =
                                                    TIPOS[archivo.tipo];
                                                const Icono = tipo.icon;

                                                return (
                                                    <TableRow key={archivo.id}>
                                                        <TableCell className="pl-6">
                                                            <span className="flex items-center gap-3">
                                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                                                                    <Icono className="h-5 w-5 text-white" />
                                                                </span>
                                                                <span className="min-w-0">
                                                                    <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                                        {
                                                                            archivo.nombre_archivo
                                                                        }
                                                                    </span>
                                                                    <span className="block text-[11px] font-medium text-slate-400 uppercase">
                                                                        .
                                                                        {
                                                                            archivo.extension
                                                                        }
                                                                    </span>
                                                                </span>
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="hidden sm:table-cell">
                                                            <Badge
                                                                className={`border-transparent text-[10px] font-bold uppercase ${tipo.badge}`}
                                                            >
                                                                {tipo.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="pr-6">
                                                            <span className="flex items-center justify-end gap-1">
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            descargarRoute.url(
                                                                                {
                                                                                    archivo:
                                                                                        archivo.id,
                                                                                },
                                                                            ),
                                                                            '_blank',
                                                                        )
                                                                    }
                                                                    title="Descargar"
                                                                >
                                                                    <Download className="h-3.5 w-3.5" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="ghost"
                                                                    className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                                                    onClick={() =>
                                                                        window.open(
                                                                            verRoute.url(
                                                                                {
                                                                                    archivo:
                                                                                        archivo.id,
                                                                                },
                                                                            ),
                                                                            '_blank',
                                                                        )
                                                                    }
                                                                    title="Ver"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5" />
                                                                </Button>
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
