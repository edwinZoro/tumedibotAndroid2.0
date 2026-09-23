import { Head, router, useForm } from '@inertiajs/react';
import {
    Download,
    Eye,
    File,
    FileCheck2,
    FileText,
    FlaskConical,
    FolderLock,
    Loader2,
    Lock,
    Pill,
    ScanLine,
    Share2,
    ShieldCheck,
    Sparkles,
    Trash2,
    Upload,
    UserRound,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

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
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
import {
    descargar as descargarRoute,
    ver as verRoute,
} from '@/routes/archivos';
import { datosMedicos } from '@/routes/pacientes';
import archivosRoutes from '@/routes/pacientes/archivos';

// ─── Tipos ───────────────────────────────────────────────────────────────────
type TipoArchivo =
    | 'EXAMEN'
    | 'RADIOLOGÍA'
    | 'RECETA'
    | 'LABORATORIO'
    | 'RECOMENDACION'
    | 'OTRO';

interface MedicoProp {
    id: number;
    nombre: string;
}

interface AccesoProp {
    medico_id: number;
    nombre: string;
}

interface ArchivoProp {
    id: number;
    nombre_archivo: string;
    extension: string;
    tipo: TipoArchivo;
    tamanio: number | null;
    compartido_con: AccesoProp[];
}

interface Props {
    tienePaciente: boolean;
    archivos: ArchivoProp[];
    medicos: MedicoProp[];
}

// ─── Constantes ──────────────────────────────────────────────────────────────
const TIPOS: {
    value: TipoArchivo;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge: string;
}[] = [
    {
        value: 'EXAMEN',
        label: 'Examen',
        icon: FileText,
        badge: 'bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300',
    },
    {
        value: 'RADIOLOGÍA',
        label: 'Radiología',
        icon: ScanLine,
        badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    },
    {
        value: 'RECETA',
        label: 'Receta',
        icon: Pill,
        badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    },
    {
        value: 'LABORATORIO',
        label: 'Laboratorio',
        icon: FlaskConical,
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    },
    {
        value: 'RECOMENDACION',
        label: 'Recomendación',
        icon: FileCheck2,
        badge: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    },
    {
        value: 'OTRO',
        label: 'Otro',
        icon: File,
        badge: 'bg-slate-100 text-slate-700 dark:bg-slate-500/15 dark:text-slate-300',
    },
];

const tipoInfo = (tipo: TipoArchivo) =>
    TIPOS.find((t) => t.value === tipo) ?? TIPOS[5];

function formatBytes(bytes: number | null): string {
    if (bytes === null) {
return '—';
}

    if (bytes < 1024) {
return `${bytes} B`;
}

    if (bytes < 1024 * 1024) {
return `${(bytes / 1024).toFixed(1)} KB`;
}

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Diálogo para subir archivo ──────────────────────────────────────────────
function SubirArchivoDialog() {
    const [open, setOpen] = useState(false);
    const form = useForm<{ archivo: File | null; tipo: TipoArchivo | '' }>(
        'post',
        archivosRoutes.store.url(),
        { archivo: null, tipo: '' },
    );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(archivosRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                form.reset();
                toast.success('Archivo subido correctamente.');
            },
            onError: () =>
                toast.error('Revisa el archivo y el tipo seleccionado.'),
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="h-11 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-500 hover:to-sky-400">
                    <Upload className="mr-2 h-4 w-4" />
                    Subir Archivo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FolderLock className="h-5 w-5 text-sky-500" />
                        Subir a mi Bóveda
                    </DialogTitle>
                    <DialogDescription>
                        El archivo queda almacenado de forma privada. Solo tú lo
                        ves hasta que decidas compartirlo con un médico.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="mt-2 space-y-5">
                    <div className="space-y-2">
                        <Label
                            htmlFor="archivo"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Archivo
                        </Label>
                        <Input
                            id="archivo"
                            type="file"
                            className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                            onChange={(e) =>
                                form.setData(
                                    'archivo',
                                    e.target.files?.[0] ?? null,
                                )
                            }
                        />
                        {form.errors.archivo && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.archivo}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Tipo de documento
                        </Label>
                        <Select
                            value={form.data.tipo}
                            onValueChange={(v) =>
                                form.setData('tipo', v as TipoArchivo)
                            }
                        >
                            <SelectTrigger className="h-11 rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                                <SelectValue placeholder="Selecciona el tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {TIPOS.map((tipo) => (
                                    <SelectItem
                                        key={tipo.value}
                                        value={tipo.value}
                                    >
                                        {tipo.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {form.errors.tipo && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.tipo}
                            </p>
                        )}
                    </div>

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
                            disabled={
                                form.processing ||
                                !form.data.archivo ||
                                !form.data.tipo
                            }
                            className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Subiendo...
                                </>
                            ) : (
                                'Subir'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// ─── Diálogo para compartir ──────────────────────────────────────────────────
function CompartirDialog({
    archivo,
    medicos,
}: {
    archivo: ArchivoProp;
    medicos: MedicoProp[];
}) {
    const [open, setOpen] = useState(false);
    const [seleccionados, setSeleccionados] = useState<number[]>([]);
    const [enviando, setEnviando] = useState(false);

    const abrir = () => {
        setSeleccionados(
            archivo.compartido_con.map((acceso) => acceso.medico_id),
        );
        setOpen(true);
    };

    const toggle = (medicoId: number, checked: boolean) => {
        setSeleccionados((prev) =>
            checked
                ? [...prev, medicoId]
                : prev.filter((id) => id !== medicoId),
        );
    };

    const guardar = () => {
        setEnviando(true);
        router.put(
            archivosRoutes.compartir.url({ archivo: archivo.id }),
            { medico_ids: seleccionados },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setOpen(false);
                    toast.success('Accesos actualizados correctamente.');
                },
                onError: () =>
                    toast.error('No se pudieron actualizar los accesos.'),
                onFinish: () => setEnviando(false),
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="rounded-xl border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950"
                    onClick={abrir}
                >
                    <Share2 className="mr-1.5 h-3.5 w-3.5" />
                    Compartir
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-sky-500" />
                        Compartir con médicos
                    </DialogTitle>
                    <DialogDescription className="line-clamp-2">
                        {archivo.nombre_archivo} — selecciona qué médicos podrán
                        verlo. Solo ellos tendrán acceso.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
                    {medicos.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                            Aún no tienes médicos asignados para compartir
                            archivos.
                        </p>
                    ) : (
                        medicos.map((medico) => {
                            const activo = seleccionados.includes(medico.id);

                            return (
                                <label
                                    key={medico.id}
                                    className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-3 transition-all ${
                                        activo
                                            ? 'border-sky-300 bg-sky-50 dark:border-sky-700 dark:bg-sky-950/40'
                                            : 'border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700'
                                    }`}
                                >
                                    <Checkbox
                                        checked={activo}
                                        onCheckedChange={(checked) =>
                                            toggle(medico.id, checked === true)
                                        }
                                        className="border-slate-300"
                                    />
                                    <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        <UserRound className="h-4 w-4 text-sky-500" />
                                        {medico.nombre}
                                    </span>
                                </label>
                            );
                        })
                    )}
                </div>

                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => setOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        disabled={enviando}
                        onClick={guardar}
                        className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                    >
                        {enviando ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Guardando...
                            </>
                        ) : (
                            'Guardar accesos'
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

// ─── Confirmación de eliminación ─────────────────────────────────────────────
function EliminarArchivo({ archivo }: { archivo: ArchivoProp }) {
    const [enviando, setEnviando] = useState(false);

    const eliminar = () => {
        setEnviando(true);
        router.delete(archivosRoutes.destroy.url({ archivo: archivo.id }), {
            preserveScroll: true,
            onSuccess: () => toast.success('Archivo eliminado correctamente.'),
            onError: () => toast.error('No se pudo eliminar el archivo.'),
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
                    <Trash2 className="h-3.5 w-3.5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Eliminar este archivo?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Se eliminará <strong>{archivo.nombre_archivo}</strong>{' '}
                        de tu bóveda, del almacenamiento y se revocará el acceso
                        a los médicos con los que lo compartiste. Esta acción no
                        se puede deshacer.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={eliminar}
                        disabled={enviando}
                        className="bg-red-600 text-white hover:bg-red-700"
                    >
                        {enviando ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Eliminando...
                            </>
                        ) : (
                            'Sí, eliminar'
                        )}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

// ─── Tabla de archivos ───────────────────────────────────────────────────────
function TablaArchivos({
    archivos,
    medicos,
}: {
    archivos: ArchivoProp[];
    medicos: MedicoProp[];
}) {
    if (archivos.length === 0) {
        return (
            <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                        <FolderLock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        Tu bóveda está vacía
                    </h3>
                    <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
                        Sube exámenes, radiologías, recetas o resultados de
                        laboratorio. Solo tú puedes verlos hasta que decidas
                        compartirlos con un médico.
                    </p>
                    <div className="mt-2">
                        <SubirArchivoDialog />
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 bg-slate-50 pt-6 pb-4 dark:border-slate-800 dark:bg-slate-800/30">
                <div className="min-w-0 flex-1">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <FolderLock className="h-5 w-5 shrink-0 text-sky-500" />
                        <span className="truncate">Mi Bóveda</span>
                    </CardTitle>
                    <CardDescription className="mt-1 flex items-start gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        <Lock className="mt-0.5 h-3 w-3 shrink-0 text-emerald-500" />
                        <span className="whitespace-normal text-balance">Almacenamiento privado · el médico solo ve lo que compartes</span>
                    </CardDescription>
                </div>
                <SubirArchivoDialog />
            </CardHeader>

            <CardContent className="p-0 w-full overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Archivo
                            </TableHead>
                            <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:table-cell dark:text-slate-400">
                                Tipo
                            </TableHead>
                            <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase lg:table-cell dark:text-slate-400">
                                Compartido con
                            </TableHead>
                            <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase md:table-cell dark:text-slate-400">
                                Tamaño
                            </TableHead>
                            <TableHead className="pr-6 text-right text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                Acciones
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {archivos.map((archivo) => {
                            const tipo = tipoInfo(archivo.tipo);
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
                                                    {archivo.nombre_archivo}
                                                </span>
                                                <span className="block text-[11px] font-medium text-slate-400 uppercase">
                                                    .{archivo.extension}
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
                                    <TableCell className="hidden lg:table-cell">
                                        {archivo.compartido_con.length === 0 ? (
                                            <span className="text-xs font-medium text-slate-400">
                                                Privado
                                            </span>
                                        ) : (
                                            <span className="flex flex-wrap gap-1">
                                                {archivo.compartido_con.map(
                                                    (acceso) => (
                                                        <Badge
                                                            key={
                                                                acceso.medico_id
                                                            }
                                                            variant="outline"
                                                            className="border-emerald-200 bg-emerald-50 text-[10px] font-semibold text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                                        >
                                                            {acceso.nombre}
                                                        </Badge>
                                                    ),
                                                )}
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="hidden text-xs font-medium text-slate-500 md:table-cell dark:text-slate-400">
                                        {formatBytes(archivo.tamanio)}
                                    </TableCell>
                                    <TableCell className="pr-6">
                                        <span className="flex items-center justify-end gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                                onClick={() =>
                                                    window.open(
                                                        verRoute.url({
                                                            archivo: archivo.id,
                                                        }),
                                                        '_blank',
                                                    )
                                                }
                                                title="Ver"
                                            >
                                                <Eye className="h-3.5 w-3.5" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                                                onClick={() =>
                                                    window.open(
                                                        descargarRoute.url({
                                                            archivo: archivo.id,
                                                        }),
                                                        '_blank',
                                                    )
                                                }
                                                title="Descargar"
                                            >
                                                <Download className="h-3.5 w-3.5" />
                                            </Button>
                                            <CompartirDialog
                                                archivo={archivo}
                                                medicos={medicos}
                                            />
                                            <EliminarArchivo
                                                archivo={archivo}
                                            />
                                        </span>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

// ─── Página principal ────────────────────────────────────────────────────────
export default function MisArchivos({
    tienePaciente,
    archivos,
    medicos,
}: Props) {
    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Mis Archivos · TuMediBot" />

            {/* ══ HERO ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <FolderLock className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Mis Archivos
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Tu bóveda
                                    personal de documentos médicos
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Acceso privado · compartes solo lo que tú decides
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CONTENIDO ═════════════════════════════════════════════════ */}
            <main className="relative z-20 mx-auto -mt-8 max-w-6xl w-full px-4 sm:px-6 lg:px-8">
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
                                Para usar tu bóveda de archivos necesitas
                                registrar primero tus datos médicos.
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
                    <TablaArchivos archivos={archivos} medicos={medicos} />
                )}
            </main>

            <Footer />
        </div>
    );
}
