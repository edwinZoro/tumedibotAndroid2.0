import { router, Head } from '@inertiajs/react';
import {
    PlusCircle,
    Eye,
    Pencil,
    Trash2,
    Calendar,
    Users,
    User as UserIcon,
    RefreshCw,
    Stethoscope,
    ShieldCheck,
    CreditCard as CardIcon,
    FileText,
    Sparkles,
    LayoutDashboard,
    MapPin,
    FilePen,
    FileSignature,
} from 'lucide-react';
import { React, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { ConfiguracionFirmaSheet } from '@/components/medicos/configuracion-firma-sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { Separator } from '@/components/ui/separator';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface User {
    id: number;
    name?: string;
    email?: string;
}

interface Medico {
    id: number;
    nombre?: string;
    apellido?: string;
    foto?: string;
}

interface Factura {
    id: number;
    nombre: string;
    apellido: string;
    ci_rif: string;
    estado: string;
    ciudad: string;
    pais: string;
    direccion: string;
    codigo_postal: string;
    celular: string;
}

// Props que se reciben desde el controlador
interface Props {
    user?: User;
    medico?: Medico | null;
    medicalProfileRoute?: string;
    personalProfileRoute?: string;
    medicalEditRoute?: string;
    EditMedicalBilling?: string;
    factura?: Factura[];
    ruta_actualizar?: string;
    // Las siguientes props ya no se usan, pero se mantienen para no romper la inyección
    pedi?: any;
    reporte?: any;
    reporte_b?: any;
    plan_precio?: number;
    ruta_pagar?: string;
    titulo_plan?: string;
    cryptoPayRoute?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
const capitalize = (str: string | undefined) => {
    if (!str) {
        return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
};

// ─── Componente principal ───────────────────────────────────────────────────
export default function AreaMedica({
    user = {} as User,
    medico = null,
    medicalProfileRoute = '#',
    personalProfileRoute = '#',
    medicalEditRoute = '#',
    EditMedicalBilling = '#',
    factura = [],
    ruta_actualizar = '#',
}: Props) {
    const medicoExists = !!medico;

    // Rutas calculadas
    const citasRoute = `/api/calendario/medico/${medico?.id || ''}/${user?.id || ''}`;
    const pacientesRoute = `/pacientes/${medico?.id || ''}/${user?.id || ''}`;

    const doctorImage = medico?.foto
        ? `/imagen/${medico.foto}`
        : '/images/doctor-default.jpg';
    const initials = medico
        ? `${medico.nombre?.charAt(0) ?? ''}${medico.apellido?.charAt(0) ?? ''}`.toUpperCase()
        : 'DR';

    // Eliminación del perfil
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [configFirmaOpen, setConfigFirmaOpen] = useState(false);
    const [firmaConfigurada, setFirmaConfigurada] = useState<boolean | null>(
        null,
    );

    useEffect(() => {
        fetch('/medico/configuracion-firma')
            .then((res) => (res.ok ? res.json() : null))
            .then((data) => {
                if (data) {
                    setFirmaConfigurada(data.configurado ?? false);
                }
            })
            .catch(() => {});
    }, []);

    const handleDeleteProfile = () => {
        router.delete(`/delete_medico_perfil/${medico?.id}`, {
            onSuccess: () => {
                toast.success('Perfil médico eliminado correctamente.');
                // Opcional: redirigir o recargar
                setIsDeleteDialogOpen(false);
                // Si deseas recargar la página para reflejar cambios
                // router.reload();
            },
            onError: (errors) => {
                toast.error('Error al eliminar el perfil. Inténtalo de nuevo.');
                setIsDeleteDialogOpen(false);
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Área Médica · TuMediBot" />

            {/* ══ HERO SECTION ════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                {/* Fondos decorativos */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        {/* Título */}
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <LayoutDashboard className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Panel Médico
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Gestión
                                    Integral TuMediBot
                                </p>
                            </div>
                        </div>

                        {/* Badge del médico */}
                        {medicoExists && (
                            <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 p-1.5 pr-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-800">
                                    <AvatarImage
                                        src={doctorImage}
                                        alt="Doctor"
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-sky-100 font-bold text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm leading-none font-bold">
                                        {medico.nombre} {medico.apellido}
                                    </span>
                                    <span className="mt-1 flex items-center gap-1 text-[10px] font-bold tracking-widest text-emerald-600 uppercase dark:text-emerald-400">
                                        <ShieldCheck className="h-3 w-3" />{' '}
                                        Verificado
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══ DASHBOARD (solo dos tarjetas) ══════════════════════════════ */}
            <main className="relative z-20 mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8">
                <div className="space-y-6">
                    {/* ── Perfil Médico ── */}
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardHeader className="pt-6 pb-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                <Stethoscope className="h-5 w-5 text-blue-500" />
                                Mi Perfil Profesional
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!medicoExists ? (
                                <div className="rounded-2xl border border-dashed border-sky-200 bg-sky-50 p-6 text-center dark:border-sky-800/50 dark:bg-sky-900/10">
                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 dark:bg-sky-800/40">
                                        <UserIcon className="h-6 w-6 text-sky-600 dark:text-sky-400" />
                                    </div>
                                    <h3 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">
                                        Aún no tienes perfil
                                    </h3>
                                    <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">
                                        Crea tu perfil médico para empezar a
                                        recibir pacientes y agendar citas.
                                    </p>
                                    <Button
                                        asChild
                                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                                    >
                                        <a href={medicalProfileRoute}>
                                            <PlusCircle className="mr-2 h-4 w-4" />{' '}
                                            Crear Perfil
                                        </a>
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-auto flex-col gap-2 rounded-2xl border-slate-200 py-4 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                        >
                                            <a href={personalProfileRoute}>
                                                <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                                    <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                </div>
                                                <span className="text-xs font-semibold">
                                                    Ver Perfil Médico
                                                </span>
                                            </a>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-auto flex-col gap-2 rounded-2xl border-slate-200 py-4 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                        >
                                            <a href={medicalEditRoute}>
                                                <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                                                    <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                </div>
                                                <span className="text-xs font-semibold">
                                                    Editar Perfil
                                                </span>
                                            </a>
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-auto flex-col gap-2 rounded-2xl border-slate-200 py-4 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                        >
                                            <a href={citasRoute}>
                                                <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                                                    <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                </div>
                                                <span className="text-xs font-semibold">
                                                    Citas
                                                </span>
                                            </a>
                                        </Button>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="h-auto flex-col gap-2 rounded-2xl border-slate-200 py-4 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                        >
                                            <a href={pacientesRoute}>
                                                <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                                                    <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                </div>
                                                <span className="text-xs font-semibold">
                                                    Pacientes
                                                </span>
                                            </a>
                                        </Button>
                                    </div>

                                    <Button
                                        onClick={() => setConfigFirmaOpen(true)}
                                        variant="outline"
                                        className="h-auto w-full flex-col gap-2 rounded-2xl border-slate-200 py-4 transition-all hover:scale-[1.02] hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50"
                                    >
                                        <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/30">
                                            <FileSignature className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold">
                                                Configurar Firma y
                                                Hospital/Clínica
                                            </span>
                                            {firmaConfigurada === true && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                    <ShieldCheck className="h-3 w-3" />
                                                    Configurado
                                                </span>
                                            )}
                                            {firmaConfigurada === false && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                    Pendiente
                                                </span>
                                            )}
                                        </div>
                                    </Button>

                                    <Separator className="my-2 dark:bg-slate-800" />

                                    <Dialog
                                        open={isDeleteDialogOpen}
                                        onOpenChange={setIsDeleteDialogOpen}
                                    >
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />{' '}
                                                Eliminar Perfil Médico
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>
                                                    ¿Estás seguro?
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Esta acción eliminará
                                                    permanentemente tu perfil
                                                    médico y todos los datos
                                                    asociados. No podrás
                                                    recuperarlos después.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <DialogFooter className="gap-2 sm:gap-0">
                                                <Button
                                                    variant="outline"
                                                    onClick={() =>
                                                        setIsDeleteDialogOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    onClick={
                                                        handleDeleteProfile
                                                    }
                                                >
                                                    Sí, eliminar
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* ── Datos de Facturación ── */}
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <CardHeader className="border-b border-slate-100 bg-slate-50 pb-3 dark:border-slate-800 dark:bg-slate-800/30">
                            <CardTitle className="flex items-center justify-between text-base font-bold">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-sky-500" />
                                    Datos de Facturación
                                </div>
                                <Button
                                    asChild
                                    size="icon"
                                    variant="ghost"
                                    className="h-8 w-8 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/50"
                                >
                                    <a
                                        href={ruta_actualizar}
                                        title="Actualizar Datos"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </a>
                                </Button>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-4">
                            {!factura || factura.length === 0 ? (
                                <p className="py-4 text-center text-sm text-muted-foreground italic">
                                    No hay datos de facturación registrados.
                                </p>
                            ) : (
                                Array.isArray(factura) &&
                                factura.map((f) => (
                                    <div
                                        key={f.id}
                                        className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    >
                                        {console.log(factura)}
                                        <div className="mb-2 flex items-center justify-between">
                                            <p className="flex items-center gap-2">
                                                <UserIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                <span>
                                                    {capitalize(f.nombre)}{' '}
                                                    {capitalize(f.apellido)}
                                                </span>
                                            </p>
                                            <Badge
                                                variant="outline"
                                                className="bg-slate-50 text-[10px] dark:bg-slate-800"
                                            >
                                                ID Personal: {f.ci_rif}
                                            </Badge>
                                        </div>
                                        <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                            <p className="flex items-start gap-2">
                                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-sky-500" />
                                                <span>
                                                    {f.direccion}, {f.ciudad},{' '}
                                                    {f.estado}, {f.pais}. CP{' '}
                                                    {f.codigo_postal}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <CardIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                <span>TLF: {f.celular}</span>
                                            </p>
                                        </div>
                                        <div className="my-2">
                                            <Button
                                                asChild
                                                className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                                            >
                                                <a href={EditMedicalBilling}>
                                                    <FilePen className="mr-2 h-4 w-4" />{' '}
                                                    Editar Factura
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>

            <ConfiguracionFirmaSheet
                open={configFirmaOpen}
                onClose={() => setConfigFirmaOpen(false)}
                onSaved={() => {
                    fetch('/medico/configuracion-firma')
                        .then((res) => (res.ok ? res.json() : null))
                        .then((data) => {
                            if (data) {
                                setFirmaConfigurada(data.configurado ?? false);
                            }
                        })
                        .catch(() => {});
                }}
            />
        </div>
    );
}
