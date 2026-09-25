import React, { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';
import PaymentOverview from './report_payment';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    Mail,
    ShieldCheck,
    Clock,
    ArrowRight,
    ExternalLink,
    Sparkles,
} from 'lucide-react';

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
    plan?: string;
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

interface TransactionDetails {
    subscriptionId: string;
    plan: string;
    monto: string;
    fecha: string;
    email: string;
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
    transactionDetails: TransactionDetails;
}

export default function PayPalSuccess(props: Props) {
    const [open, setOpen] = useState(true);
    const [secondsLeft, setSecondsLeft] = useState(4);

    const handleRedirect = () => {
        setOpen(false);
        router.visit('/medicos/report-payment', {
            replace: true,
            preserveScroll: true,
        });
    };

    useEffect(() => {
        if (secondsLeft <= 0) {
            handleRedirect();
            return;
        }

        const timer = setInterval(() => {
            setSecondsLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [secondsLeft]);

    const progressPercentage = ((4 - secondsLeft) / 4) * 100;

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Vista del Panel de Reportes en Segundo Plano */}
            <PaymentOverview
                userId={props.userId}
                factura={props.factura}
                pedi={props.pedi}
                reporte={props.reporte}
                reporte_b={props.reporte_b}
                plan_precio={props.plan_precio}
                titulo_plan={props.titulo_plan}
                ruta_pagar={props.ruta_pagar}
                cryptoPayRoute="/pagar-crypto"
                reportPaymentRoute="/medicos/reporte-pago"
                medicalBalanceRoute="/medicos/report-payment"
            />

            {/* Modal Dialog Automático de Confirmación de PayPal */}
            <Dialog open={open} onOpenChange={(val) => !val && handleRedirect()}>
                <DialogContent className="sm:max-w-md overflow-hidden rounded-3xl border border-emerald-200/80 bg-white/95 p-0 shadow-2xl backdrop-blur-xl dark:border-emerald-900/60 dark:bg-slate-900/95">
                    {/* Barra Superior con Gradiente Animado */}
                    <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 p-6 text-white text-center relative overflow-hidden">
                        <div className="absolute -right-4 -top-4 opacity-20 pointer-events-none">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-4 ring-white/30 shadow-inner mb-3">
                            <CheckCircle2 className="h-10 w-10 text-white" />
                        </div>
                        <DialogTitle className="text-2xl font-black tracking-tight text-white">
                            ¡Pago Realizado con Éxito!
                        </DialogTitle>
                        <DialogDescription className="text-emerald-50 text-xs font-medium mt-1">
                            Tu transacción en TuMedibot 2.0 se ha completado correctamente
                        </DialogDescription>
                    </div>

                    <div className="p-6 space-y-5">
                        {/* Cumplimiento Estricto de los Requisitos de PayPal */}
                        <div className="space-y-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4 dark:border-emerald-900/30 dark:bg-emerald-950/30 text-xs text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-2.5">
                                <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                                <div>
                                    <strong className="text-emerald-900 dark:text-emerald-200">
                                        Transacción completada:
                                    </strong>{' '}
                                    Gracias por su pago. Su suscripción ha sido confirmada y activada exitosamente en la plataforma.
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 border-t border-emerald-200/50 pt-2.5 dark:border-emerald-900/40">
                                <Mail className="h-4 w-4 shrink-0 text-sky-600 dark:text-sky-400 mt-0.5" />
                                <div>
                                    <strong className="text-slate-900 dark:text-slate-200">
                                        Recibo digital:
                                    </strong>{' '}
                                    Le enviamos un recibo detallado de su compra a su correo electrónico{' '}
                                    <span className="font-semibold text-sky-600 dark:text-sky-400">
                                        {props.transactionDetails?.email}
                                    </span>.
                                </div>
                            </div>

                            <div className="flex items-start gap-2.5 border-t border-emerald-200/50 pt-2.5 dark:border-emerald-900/40">
                                <ExternalLink className="h-4 w-4 shrink-0 text-indigo-600 dark:text-indigo-400 mt-0.5" />
                                <div>
                                    <strong className="text-slate-900 dark:text-slate-200">
                                        Detalles en PayPal:
                                    </strong>{' '}
                                    Para consultar el historial detallado de esta transacción o administrar su método de pago, inicie sesión en su cuenta de PayPal.
                                </div>
                            </div>
                        </div>

                        {/* Ficha Resumen de Transacción */}
                        <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-3.5 backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50 text-xs space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-medium">N° Transacción / ID:</span>
                                <Badge variant="outline" className="font-mono bg-white dark:bg-slate-900 font-semibold text-slate-800 dark:text-slate-200">
                                    {props.transactionDetails?.subscriptionId}
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-medium">Plan Suscrito:</span>
                                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    {props.transactionDetails?.plan}
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-muted-foreground font-medium">Monto Total:</span>
                                <span className="font-bold text-slate-900 dark:text-white">
                                    ${props.transactionDetails?.monto} USD
                                </span>
                            </div>
                        </div>

                        {/* Temporizador de Cierre Automático (3-4 Segundos) */}
                        <div className="space-y-1.5 text-center">
                            <div className="flex items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                                <Clock className="h-3.5 w-3.5 animate-spin text-emerald-500" />
                                <span>
                                    Redireccionando a tu panel de pagos en{' '}
                                    <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{secondsLeft}s</strong>...
                                </span>
                            </div>

                            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-emerald-500 transition-all duration-1000 ease-linear rounded-full"
                                    style={{ width: `${progressPercentage}%` }}
                                />
                            </div>
                        </div>

                        {/* Botón de Acción Manual */}
                        <Button
                            onClick={handleRedirect}
                            className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.01]"
                        >
                            Ir a Mis Pagos Ahora <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
