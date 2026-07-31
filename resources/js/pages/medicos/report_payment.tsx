import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
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
import {
    Wallet,
    TrendingUp,
    Activity,
    Info,
    Award,
    Calendar,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    ShoppingCart,
    CreditCard,
} from 'lucide-react';

// ─── Interfaces ──────────────────────────────────────────────────────────────
interface Factura {
    id: number;
    nombre: string;
    apellido: string;
    ci_rif: string;
    celular: string;
    direccion: string;
    ciudad: string;
    estado: string;
    codigo_postal: string;
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

interface Balance {
    ingreso?: string;
    egreso?: string;
    credito?: string;
}

interface Props {
    userId: number;
    factura: Factura[];
    pedi: {
        data: Pedido[];
        current_page: number;
        last_page: number;
    };
    reporte: {
        data: Reporte[];
        current_page: number;
        last_page: number;
    };
    reporte_b: Balance | null;
    plan_precio: number;
    titulo_plan: string;
    ruta_pagar: string;
    cryptoPayRoute: string;
    reportPaymentRoute: string;
    medicalBalanceRoute: string;
}

// ─── Helper ──────────────────────────────────────────────────────────────────
const capitalize = (str: string | undefined) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Dentro del componente o en un helper externo
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

// ─── Componente ─────────────────────────────────────────────────────────────
export default function PaymentOverview({
    userId,
    factura,
    pedi,
    reporte,
    reporte_b,
    plan_precio,
    titulo_plan,
    ruta_pagar,
    cryptoPayRoute,
    reportPaymentRoute,
    medicalBalanceRoute,
}: Props) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerarPago = () => {
    setIsGenerating(true);
    router.visit(ruta_pagar, {
        method: 'get',
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
            setIsGenerating(false);
            // Recargar solo los datos necesarios
            router.reload({ only: ['pedi', 'reporte', 'reporte_b'] });
        },
        onError: () => {
            setIsGenerating(false);
        },
    });
};
    // ── Paginación ──
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
        <div className="flex flex-col gap-6 p-4 md:p-6">
            {/* ══ 1. PANEL DE SALDOS (Billetera) ══ */}
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
                <CardContent className="space-y-5 pt-2">
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

            {/* ══ 2. MI PLAN ACTUAL ══ */}
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
                <CardContent className="relative z-10 space-y-6 pt-2">
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
                                {factura.map((f) => (
                                    <TableRow key={f.id} className="border-slate-100 dark:border-slate-800">
                                        <TableCell className="font-medium text-slate-700 dark:text-slate-300">
                                            {capitalize(f.nombre)} {capitalize(f.apellido)}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400 font-bold">
                                                {f.plan || 'Plan Base'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-bold text-slate-800 dark:text-slate-200">
                                            ${f.plan === 'andromeda' ? 25 : f.plan === 'fenix' ? 135 : f.plan === 'pegasus' ? 270 : 0} <span className="text-[10px] text-muted-foreground font-normal">+ IVA</span>
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

            {/* ══ 3. MIS PEDIDOS (siempre visible) ══ */}
            <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5 text-indigo-500" />
                        Mis Pedidos
                    </CardTitle>
                    <Button asChild variant="link" className="text-xs h-auto p-0 text-sky-600 dark:text-sky-400">
                        <a href={'/pagar-crypto'} className="flex items-center gap-1">
                            <Wallet className="h-3.5 w-3.5" /> Pagar con Crypto
                        </a>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
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
                                {pedi?.data && pedi.data.length > 0 ? (
                                    pedi.data.map((p) => {
                                        const isPaid = p.estado?.toLowerCase() !== 'no pagado';
                                        return (
                                            <TableRow key={p.id} className="border-slate-100 dark:border-slate-800">
                                                <TableCell className="font-mono text-xs font-semibold text-slate-700 dark:text-slate-300">
                                                    {p.ticket}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1 text-xs">
                                                        <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                                                            <Calendar className="h-3 w-3" /> {formatDate(p.fecha_pedido)}
                                                        </span>
                                                        <span className="flex items-center gap-1 text-rose-500 dark:text-rose-400 font-medium">
                                                            <Clock className="h-3 w-3" /> Vence: {formatDate(p.fecha_vence_pedido)}
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
                                                        <a href={`/medicos/pagando_perfil_medico/${userId}/${p.id}`} target="_blank" rel="noopener noreferrer">
                                                            {isPaid ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <XCircle className="mr-1.5 h-3.5 w-3.5" />}
                                                            {p.estado}
                                                        </a>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center text-muted-foreground italic py-6">
                                            No tienes pedidos generados.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Paginación (si hay más de una página) */}
                    {pedi?.last_page && pedi.last_page > 1 && (
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

            {/* ══ 4. HISTORIAL DE TRANSACCIONES ══ */}
            <Card className="rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        <Activity className="h-5 w-5 text-emerald-500" />
                        Historial de Transacciones
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-2">
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
    );
}
