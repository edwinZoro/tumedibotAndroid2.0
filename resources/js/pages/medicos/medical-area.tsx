import React from 'react';
import { router, Link, Head } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
    PlusCircle,
    Eye,
    Pencil,
    Trash2,
    Calendar,
    Users,
    User as UserIcon,
    RefreshCw,
    CreditCard,
    DollarSign,
    Info,
    Activity,
    Stethoscope,
    ShieldCheck,
    CreditCard as CardIcon,
    ArrowRight,
    TrendingUp,
    FileText,
    CheckCircle2,
    XCircle,
    Clock,
    Sparkles,
    LayoutDashboard,
    Wallet,
    Award
} from 'lucide-react';

// ─── Interfaces ────────────────────────────────────────────────────────────────
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
    direccion: string;
    codigo_postal: string;
    celular: string;
}
interface Pedido {
    id: number;
    ticket: string;
    fecha_pedido: string;
    fecha_vence_pedido: string;
    total: string;
    estado: string;
}
interface Reporte {
    id: number;
    transaccion_id: string;
    fecha_transaccion: string;
    fecha_vence_transaccion: string;
    monto_pagado: string;
    estado: string;
}

interface Props {
    user?: User;
    medico?: Medico | null;
    medicalProfileRoute?: string;
    factura?: Factura[];
    pedi?: {
        data: Pedido[];
        current_page: number;
        last_page: number;
    };
    reporte?: {
        data: Reporte[];
        current_page: number;
        last_page: number;
    };
    reporte_b?: {
        ingreso?: string;
        egreso?: string;
        credito?: string;
    } | null;
    plan_precio?: number;
    ruta_actualizar?: string;
    ruta_pagar?: string;
    titulo_plan?: string;
    mejoras?: string;
    cryptoPayRoute?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
const capitalize = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// ─── Main Component ────────────────────────────────────────────────────────────
export default function AreaMedica({
    user = {} as User,
    medico = null,
    medicalProfileRoute = '#',
    factura = [],
    pedi = { data: [], current_page: 1, last_page: 1 },
    reporte = { data: [], current_page: 1, last_page: 1 },
    reporte_b = null,
    plan_precio = 0,
    ruta_actualizar = '#',
    ruta_pagar = '#',
    titulo_plan = '',
    mejoras = '',
    cryptoPayRoute = '#',
}: Props) {
    const medicoExists = !!medico;
    const primerFactura = (Array.isArray(factura) && factura[0]) ? factura[0] : ({} as Factura);
    // Rutas calculadas
  //  const medicalProfileRoute = `/medicos/medicoLLenarPerfil/${user?.id || ''}`;
    const personalProfileRoute = `/PerfilMedicoComponent/${medico?.id || ''}`;
    const medicalProfileEditRoute = `/api/medicalProfileEditForm/Edit/${user?.id || ''}`;
    const citasRoute = `/api/calendario/medico/${medico?.id || ''}/${user?.id || ''}`;
    const pacientesRoute = `/pacientes/${medico?.id || ''}/${user?.id || ''}`;
    const reportPaymentRoute = `/reporte_pago_component/${user?.id || ''}`;
    const medicalBalanceRoute = '/medico/saldo';

    const doctorImage = medico?.foto ? `/imagen/${medico.foto}` : '/images/doctor-default.jpg';
    const initials = medico ? `${medico.nombre?.charAt(0) ?? ''}${medico.apellido?.charAt(0) ?? ''}`.toUpperCase() : 'DR';

    // Manejo de eliminación del perfil
    const handleDeleteProfile = (e: React.FormEvent) => {
        e.preventDefault();
        if (confirm('¿Está seguro de que desea eliminar su perfil médico?')) {
            router.delete(`/delete_medico_perfil/${medico?.id || ''}`);
        }
    };

    const changePediPage = (page: number) => {
        if (pedi?.data) {
            router.visit(`/api/pedidos?page=${page}`, { only: ['pedi'], preserveScroll: true });
        }
    };

    const changeReportePage = (page: number) => {
        if (reporte?.data) {
            router.visit(`/api/reportes-pago?page=${page}`, { only: ['reporte'], preserveScroll: true });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100 pb-12">
            <Head title="Área Médica · TuMediBot" />

            {/* ══ HERO SECTION ══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-blue-50/50 dark:bg-[#0b1121] pt-12 pb-16 lg:pt-16 lg:pb-20">
                {/* Background Decorativo */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[120px]" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 dark:bg-sky-500/15 blur-[100px]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        {/* Header Title */}
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <LayoutDashboard className="h-8 w-8 text-white" />
                                <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                                    Panel Médico
                                </h1>
                                <p className="text-sm font-medium text-sky-600 dark:text-sky-400 mt-1 flex items-center justify-center md:justify-start gap-1">
                                    <Sparkles className="h-4 w-4" /> Gestión Integral TuMediBot
                                </p>
                            </div>
                        </div>

                        {/* Profile Summary Badge */}
                        {medicoExists && (
                            <div className="flex items-center gap-3 rounded-full border border-white/40 bg-white/60 p-1.5 pr-5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5">
                                <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-800">
                                    <AvatarImage src={doctorImage} alt="Doctor" className="object-cover" />
                                    <AvatarFallback className="bg-sky-100 text-sky-700 font-bold dark:bg-sky-900 dark:text-sky-300">{initials}</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold leading-none">{medico.nombre} {medico.apellido}</span>
                                    <span className="text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mt-1 flex items-center gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Verificado
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══ DASHBOARD GRID ════════════════════════════════════════════════ */}
            <main className="mx-auto -mt-8 max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-12 xl:gap-8">

                    {/* ── COLUMNA IZQUIERDA (Widgets Rápidos) ── */}
                    <div className="space-y-6 xl:col-span-4">

                        {/* Perfil Médico Card */}
                        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                            <CardHeader className="pb-4 pt-6">
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
                                        <h3 className="mb-1 text-sm font-bold text-slate-800 dark:text-slate-200">Aún no tienes perfil</h3>
                                        <p className="mb-4 text-xs text-slate-500 dark:text-slate-400">Crea tu perfil médico para empezar a recibir pacientes y agendar citas.</p>
                                        <Button asChild className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-md">
                                            <a href={medicalProfileRoute}>
                                                <PlusCircle className="mr-2 h-4 w-4" /> Crear Perfil
                                            </a>
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.02]">
                                                <a href={personalProfileRoute}>
                                                    <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
                                                        <Eye className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                                    </div>
                                                    <span className="text-xs font-semibold">Ver Público</span>
                                                </a>
                                            </Button>
                                            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.02]">
                                                <a href={medicalProfileEditRoute}>
                                                    <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900/30">
                                                        <Pencil className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <span className="text-xs font-semibold">Editar Perfil</span>
                                                </a>
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.02]">
                                                <a href={citasRoute}>
                                                    <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/30">
                                                        <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                                    </div>
                                                    <span className="text-xs font-semibold">Citas</span>
                                                </a>
                                            </Button>
                                            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-2xl py-4 border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/50 transition-all hover:scale-[1.02]">
                                                <a href={pacientesRoute}>
                                                    <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                                                        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                                    </div>
                                                    <span className="text-xs font-semibold">Pacientes</span>
                                                </a>
                                            </Button>
                                        </div>

                                        <Separator className="my-2 dark:bg-slate-800" />

                                        <form onSubmit={handleDeleteProfile}>
                                            <Button variant="ghost" type="submit" className="w-full text-xs text-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-400">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Perfil Médico
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        {/* Panel de Saldos */}
                        <Card className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md dark:border-slate-800 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-800 dark:shadow-xl dark:text-white">
                            <CardHeader className="pb-2">
                                <CardTitle className="flex items-center justify-between text-base font-bold text-slate-800 dark:text-white">
                                    <div className="flex items-center gap-2">
                                        <Wallet className="h-5 w-5 text-sky-500 dark:text-sky-400" /> Billetera
                                    </div>
                                    <Badge
                                        variant="outline"
                                        className="border-slate-300 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/20 dark:bg-white/10 dark:text-white dark:hover:bg-white/20"
                                    >
                                        USD
                                    </Badge>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-5">
                                <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 dark:text-slate-400">
                                        Balance de Planes
                                    </p>
                                    <h2 className="text-4xl font-extrabold tracking-tight flex items-baseline gap-1 text-slate-900 dark:text-white">
                                        <span className="text-sky-500 dark:text-sky-400">$</span>
                                        {reporte_b?.credito || '0.00'}
                                    </h2>
                                </div>

                                <div className="grid grid-cols-2 gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-200 backdrop-blur-sm dark:bg-white/5 dark:border-white/10">
                                    <div>
                                        <p className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
                                            <TrendingUp className="h-3 w-3" /> Ingresos
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-slate-800 dark:text-white">
                                            ${reporte_b?.ingreso || '0.00'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="flex items-center gap-1 text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400">
                                            <Activity className="h-3 w-3" /> Egresos
                                        </p>
                                        <p className="mt-1 text-lg font-bold text-slate-800 dark:text-white">
                                            ${reporte_b?.egreso || '0.00'}
                                        </p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Button
                                        asChild
                                        variant="secondary"
                                        className="rounded-xl h-11 font-bold bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100"
                                    >
                                        <a href={reportPaymentRoute}>
                                            <CreditCard className="mr-2 h-4 w-4" /> Reportar Pago
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="rounded-xl h-11 font-bold border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-white/20 dark:text-white dark:hover:bg-white/10"
                                    >
                                        <a href={medicalBalanceRoute}>
                                            Saldo Citas
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Datos de Factura */}
                        <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50 overflow-hidden">
                            <CardHeader className="pb-3 bg-slate-50 dark:bg-slate-800/30 border-b border-slate-100 dark:border-slate-800">
                                <CardTitle className="flex items-center justify-between text-base font-bold">
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-sky-500" />
                                        Datos de Facturación
                                    </div>
                                    <Button asChild size="icon" variant="ghost" className="h-8 w-8 rounded-full hover:bg-sky-100 hover:text-sky-600 dark:hover:bg-sky-900/50">
                                        <a href={ruta_actualizar} title="Actualizar Datos">
                                            <RefreshCw className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                {!factura || factura.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic text-center py-4">No hay datos de facturación registrados.</p>
                                ) : (
                                    Array.isArray(factura) && factura.map((f) => (
                                        <div key={f.id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                                            <div className="mb-2 flex items-center justify-between">
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200">
                                                    {capitalize(f.nombre)} {capitalize(f.apellido)}
                                                </h4>
                                                <Badge variant="outline" className="text-[10px] bg-slate-50 dark:bg-slate-800">
                                                    {f.ci_rif}
                                                </Badge>
                                            </div>
                                            <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
                                                <p className="flex items-start gap-2">
                                                    <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5 text-sky-500" />
                                                    <span>{f.direccion}, {f.ciudad}, {f.estado}. CP {f.codigo_postal}</span>
                                                </p>
                                                <p className="flex items-center gap-2">
                                                    <CardIcon className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                                    <span>TLF: {f.celular}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* ── COLUMNA DERECHA (Tablas y Gestión) ── */}
                    <div className="space-y-6 xl:col-span-8">

                        {/* Mi Plan Actual */}
                        <Card className="overflow-hidden rounded-3xl border-sky-200 bg-gradient-to-br from-white to-sky-50/50 shadow-lg dark:border-sky-900/50 dark:from-[#0b162c] dark:to-[#081020]">
                            <div className="absolute top-0 right-0 p-6 pointer-events-none opacity-10">
                                <Award className="h-32 w-32" />
                            </div>
                            <CardHeader className="relative z-10 pb-2">
                                <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-800 dark:text-slate-100">
                                    <Award className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    Mi Plan de Suscripción
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="relative z-10 space-y-6">
                                {/* Alerta Informativa */}
                                <div className="flex items-start gap-3 rounded-2xl bg-blue-100/50 p-4 border border-blue-200/50 text-sm text-blue-800 dark:bg-blue-900/20 dark:border-blue-800/30 dark:text-blue-300">
                                    <Info className="h-5 w-5 shrink-0 mt-0.5 text-blue-500" />
                                    <div className="space-y-1">
                                        <p><strong>Aviso Importante:</strong> Presione el botón <b>Pagar</b> para generar su pedido de suscripción.</p>
                                        <p className="text-xs opacity-90">Si desea cambiar de plan, contáctenos por el chat de soporte antes de generar el pago.</p>
                                    </div>
                                </div>

                                <div className="rounded-2xl border border-slate-200/60 bg-white/80 p-1 overflow-hidden shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-900/80">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-950/50">
                                            <TableRow className="border-slate-200 dark:border-slate-800 hover:bg-transparent">
                                                <TableHead className="font-semibold">Titular</TableHead>
                                                <TableHead className="font-semibold">Plan</TableHead>
                                                <TableHead className="font-semibold">Costo</TableHead>
                                                <TableHead className="text-right font-semibold">Acción</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {Array.isArray(factura) && factura.map((f) => (
                                                <TableRow key={f.id} className="border-slate-100 dark:border-slate-800">
                                                    <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                                                        {capitalize(f.nombre)} {capitalize(f.apellido)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 font-bold">
                                                            {titulo_plan || 'Plan Base'}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-bold text-slate-800 dark:text-slate-200">
                                                        ${plan_precio} <span className="text-[10px] text-muted-foreground font-normal">+ IVA</span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button asChild size="sm" className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-500 hover:to-sky-400 shadow-md text-white">
                                                            <a href={ruta_pagar}>
                                                                Generar Pago <ArrowRight className="ml-1 h-3 w-3" />
                                                            </a>
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pedidos Generados */}
                        {pedi && Array.isArray(pedi.data) && pedi.data.length > 0 && (
                            <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5 text-indigo-500" />
                                        Mis Pedidos
                                    </CardTitle>
                                    <Button asChild variant="link" className="text-xs h-auto p-0 text-sky-600 dark:text-sky-400">
                                        <a href={cryptoPayRoute} className="flex items-center gap-1">
                                            <Wallet className="h-3.5 w-3.5" /> Pagar con Crypto
                                        </a>
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="rounded-2xl border border-slate-200/60 bg-white/50 overflow-hidden dark:border-slate-800/60 dark:bg-slate-950/30">
                                        <Table>
                                            <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                                                <TableRow className="border-slate-200 dark:border-slate-800">
                                                    <TableHead className="text-[11px] uppercase tracking-wider">Ticket N°</TableHead>
                                                    <TableHead className="text-[11px] uppercase tracking-wider">Fechas</TableHead>
                                                    <TableHead className="text-[11px] uppercase tracking-wider">Monto</TableHead>
                                                    <TableHead className="text-[11px] uppercase tracking-wider text-right">Estado PDF</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pedi.data.map((p) => {
                                                    const isPaid = p.estado?.toLowerCase() !== 'no pagado';
                                                    return (
                                                        <TableRow key={p.id} className="border-slate-100 dark:border-slate-800">
                                                            <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                                {p.ticket}
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-col gap-1 text-xs">
                                                                    <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                                        <Calendar className="h-3 w-3" /> {p.fecha_pedido}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-medium">
                                                                        <Clock className="h-3 w-3" /> Vence: {p.fecha_vence_pedido}
                                                                    </span>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell className="font-bold text-slate-800 dark:text-slate-200">
                                                                ${p.total}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <Button
                                                                    asChild
                                                                    size="sm"
                                                                    variant={isPaid ? "default" : "destructive"}
                                                                    className={`rounded-xl h-8 px-3 text-xs font-bold shadow-sm ${isPaid ? 'bg-emerald-500 hover:bg-emerald-600 text-white' : ''}`}
                                                                >
                                                                    <a href={`/pagando_perfil_medico/${user?.id || ''}/${p.id}`} target="_blank" rel="noopener noreferrer">
                                                                        {isPaid ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <XCircle className="mr-1.5 h-3.5 w-3.5" />}
                                                                        {p.estado}
                                                                    </a>
                                                                </Button>
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {pedi.last_page > 1 && (
                                        <div className="flex justify-center gap-2 pt-2">
                                            {Array.from({ length: pedi.last_page }, (_, i) => i + 1).map((page) => (
                                                <Button
                                                    key={page}
                                                    size="icon"
                                                    variant={pedi.current_page === page ? 'default' : 'outline'}
                                                    className={`h-8 w-8 rounded-lg text-xs font-bold ${pedi.current_page === page ? 'bg-blue-600 text-white' : ''}`}
                                                    onClick={() => changePediPage(page)}
                                                >
                                                    {page}
                                                </Button>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Pagos Realizados */}
                        <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-bold flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-emerald-500" />
                                    Historial de Transacciones
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="rounded-2xl border border-slate-200/60 bg-white/50 overflow-hidden dark:border-slate-800/60 dark:bg-slate-950/30">
                                    <Table>
                                        <TableHeader className="bg-slate-50/80 dark:bg-slate-900/80">
                                            <TableRow className="border-slate-200 dark:border-slate-800">
                                                <TableHead className="text-[11px] uppercase tracking-wider">ID Transacción</TableHead>
                                                <TableHead className="text-[11px] uppercase tracking-wider">Fechas</TableHead>
                                                <TableHead className="text-[11px] uppercase tracking-wider">Monto</TableHead>
                                                <TableHead className="text-[11px] uppercase tracking-wider text-right">Estado</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {!reporte || !Array.isArray(reporte.data) || reporte.data.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-muted-foreground italic py-6">
                                                        No se han registrado pagos recientes.
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                reporte.data.map((r) => (
                                                    <TableRow key={r.id} className="border-slate-100 dark:border-slate-800">
                                                        <TableCell className="font-mono text-[11px] font-medium text-slate-500 dark:text-slate-400">
                                                            {r.transaccion_id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-col gap-0.5 text-xs">
                                                                <span className="text-slate-700 dark:text-slate-300">Ingresado: {r.fecha_transaccion}</span>
                                                                <span className="text-slate-500 dark:text-slate-500">Vence: {r.fecha_vence_transaccion}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="font-bold text-slate-800 dark:text-slate-200">
                                                            ${r.monto_pagado}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Badge
                                                                variant="outline"
                                                                className={`font-bold border-2 ${r.estado?.toLowerCase() === 'procesando' ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400' : 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400'}`}
                                                            >
                                                                {r.estado?.toUpperCase() || ''}
                                                            </Badge>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {reporte && reporte.last_page > 1 && (
                                    <div className="flex justify-center gap-2 pt-2">
                                        {Array.from({ length: reporte.last_page }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                size="icon"
                                                variant={reporte.current_page === page ? 'default' : 'outline'}
                                                className={`h-8 w-8 rounded-lg text-xs font-bold ${reporte.current_page === page ? 'bg-blue-600 text-white' : ''}`}
                                                onClick={() => changeReportePage(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}

// ─── Missing Icon Fallback ───────────────────────────────────────────────────
function ShoppingCart(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="8" cy="21" r="1" />
            <circle cx="19" cy="21" r="1" />
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
    );
}
