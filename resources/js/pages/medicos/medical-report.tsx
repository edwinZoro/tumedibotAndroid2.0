import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
    AlertCircle,
    Loader2,
    CheckCircle2,
    ShieldCheck,
    Send,
    ChevronRight,
    Wallet,
    CreditCard,
    DollarSign,
    Hash,
    User,
    Mail,
    Copy,
} from 'lucide-react';

interface Props {
    userId: number;
    pedidoId: number;   // puede ser 0 si no existe
    facturaId: number;
    plan: string;       // andromeda, fenix, pegasus
}

interface FormState {
    metodo: 'paypal' | 'binance';
    // PayPal
    correo_paypal: string;
    nombre_usuario: string;
    id_transaccion: string;
    // Binance (crypto)
    cartera_bitcoin: string;
    correo_usuario: string;
    hash: string;
    // Comunes
    monto_pagado: string;
}

export default function ReportePago({ userId, pedidoId, facturaId, plan }: Props) {
    const [step, setStep] = useState<number>(1);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [serverErrors, setServerErrors] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [form, setForm] = useState<FormState>({
        metodo: 'paypal',
        correo_paypal: '',
        nombre_usuario: '',
        id_transaccion: '',
        cartera_bitcoin: '',
        correo_usuario: '',
        hash: '',
        monto_pagado: '',
    });

    // Mapeo de planes (para mostrar)
    const planLabels: Record<string, string> = {
        andromeda: 'Andromeda',
        fenix: 'Fenix',
        pegasus: 'Pegasus',
    };
    const planLabel = planLabels[plan] || 'Desconocido';

    // Handlers
    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleMetodoChange = (value: 'paypal' | 'binance') => {
        setForm((prev) => ({ ...prev, metodo: value }));
        // Limpiar campos del otro método para evitar confusiones
        if (value === 'paypal') {
            setForm((prev) => ({ ...prev, cartera_bitcoin: '', correo_usuario: '', hash: '' }));
        } else {
            setForm((prev) => ({ ...prev, correo_paypal: '', nombre_usuario: '', id_transaccion: '' }));
        }
        setTouched({});
        setStep(1);
    };

    // Validación
    const getFieldErrors = () => {
        const e: Record<string, string> = {};
        const { metodo, monto_pagado } = form;

        if (!monto_pagado || isNaN(parseFloat(monto_pagado)) || parseFloat(monto_pagado) <= 0) {
            e.monto_pagado = 'Monto inválido (debe ser un número mayor a 0)';
        }

        if (metodo === 'paypal') {
            if (!form.correo_paypal || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo_paypal)) {
                e.correo_paypal = 'Correo PayPal inválido';
            }
            if (!form.nombre_usuario || form.nombre_usuario.length < 2) {
                e.nombre_usuario = 'Nombre de usuario requerido (mínimo 2 caracteres)';
            }
            if (!form.id_transaccion || form.id_transaccion.length < 4) {
                e.id_transaccion = 'ID de transacción requerido (mínimo 4 caracteres)';
            }
        } else { // binance
            if (!form.cartera_bitcoin || form.cartera_bitcoin.length < 10) {
                e.cartera_bitcoin = 'Dirección de cartera inválida (mínimo 10 caracteres)';
            }
            if (!form.correo_usuario || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo_usuario)) {
                e.correo_usuario = 'Correo de usuario inválido';
            }
            if (!form.hash || form.hash.length < 10) {
                e.hash = 'Hash de transacción inválido (mínimo 10 caracteres)';
            }
        }
        return e;
    };

    const fieldErrors = getFieldErrors();

    const validarPaso = (paso: number) => {
        const e = getFieldErrors();
        const currentTouched = { ...touched };
        const fieldsToCheck =
            paso === 1
                ? form.metodo === 'paypal'
                    ? ['correo_paypal', 'nombre_usuario', 'id_transaccion', 'monto_pagado']
                    : ['cartera_bitcoin', 'correo_usuario', 'hash', 'monto_pagado']
                : [];

        let hasErrors = false;
        fieldsToCheck.forEach((field) => {
            currentTouched[field] = true;
            if (e[field]) hasErrors = true;
        });

        setTouched(currentTouched);

        if (hasErrors) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return false;
        }
        setServerErrors([]);
        return true;
    };

    const manejarSiguientePaso = (pasoActual: number) => {
        if (validarPaso(pasoActual)) {
            setStep(pasoActual + 1);
        }
    };

    const resetearFormulario = () => {
        setForm({
            metodo: 'paypal',
            correo_paypal: '',
            nombre_usuario: '',
            id_transaccion: '',
            cartera_bitcoin: '',
            correo_usuario: '',
            hash: '',
            monto_pagado: '',
        });
        setTouched({});
        setServerErrors([]);
        setStep(1);
    };

    // Envío
    const enviarFormulario = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validarPaso(1)) return;

        // Construir payload según método
        const payload: any = {
            user_id: userId,
            pedido_id: pedidoId,
            factura_id: facturaId,
            metodo_transaccion: form.metodo,
            monto_pagado: form.monto_pagado,
            // Los campos específicos se mapean según el método
        };

        if (form.metodo === 'paypal') {
            payload.banco_emisor = form.correo_paypal;
            payload.banco_receptor = form.nombre_usuario;
            payload.nmro_referencia = form.id_transaccion;
        } else {
            payload.banco_emisor = form.cartera_bitcoin;
            payload.banco_receptor = form.correo_usuario;
            payload.nmro_referencia = form.hash;
        }

        setIsSubmitting(true);
        router.post('/api/reporte-pago', payload, {
            onError: (errs) => {
                toast.error('Ocurrió un error al procesar el reporte.');
                setServerErrors(Object.values(errs).flat() as string[]);
                setIsSubmitting(false);
            },
            onSuccess: () => {
                toast.success('Reporte de pago enviado correctamente. ¡Gracias!');
                resetearFormulario();
                // Redirigir al área médica (o dashboard) después de un breve delay
                setTimeout(() => {
                    router.visit('/area-medica'); // Ajusta la ruta según tu aplicación
                }, 2000);
            },
        });
    };

    // Renderizado
    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            {/* Fondos decorativos (igual que billing-plan) */}
            <div
                className="absolute inset-0 scale-105 bg-cover bg-center opacity-[0.03] blur-xl dark:opacity-[0.05]"
                style={{ backgroundImage: `url('/imagen/1674252818.jpg')` }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_70%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute -top-20 left-[15%] h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/10" />
            <div className="pointer-events-none absolute top-[40%] right-[5%] h-[300px] w-[300px] rounded-full bg-sky-300/20 blur-[100px] dark:bg-sky-500/10" />

            <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
                <main className="container mx-auto max-w-4xl px-4">
                    {serverErrors.length > 0 && (
                        <Alert
                            variant="destructive"
                            className="mb-6 rounded-2xl border-red-500/50 bg-red-500/10 backdrop-blur-md"
                        >
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle className="font-bold">
                                Ha ocurrido un error en el servidor
                            </AlertTitle>
                            <AlertDescription>
                                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-medium">
                                    {serverErrors.map((error, i) => (
                                        <li key={i}>{error}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white to-slate-50 p-[1px] shadow-2xl shadow-blue-500/10 backdrop-blur-xl dark:from-[#0f1e3d]/90 dark:to-[#0b1121]/90">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-blue-600/30 via-sky-500/10 to-transparent dark:from-blue-600/50 dark:via-sky-500/20 dark:to-transparent" />

                        <div className="relative rounded-[calc(2rem-1px)] bg-white/90 dark:bg-[#0b1426]/95">
                            <div className="relative h-1 w-full overflow-hidden rounded-t-[calc(2rem-1px)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                                <div className="absolute top-0 left-1/2 h-full w-32 -translate-x-1/2 animate-[pulse_2s_ease-in-out_infinite] bg-sky-400 shadow-[0_0_12px_3px_rgba(56,189,248,0.8)]" />
                            </div>

                            {/* Header */}
                            <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:px-10 md:pt-10 md:pb-6 md:text-left">
                                <div className="flex flex-col items-center gap-5 md:flex-row">
                                    <div className="group relative">
                                        <div className="absolute -inset-3 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-sky-400/40 dark:border-sky-400/20" />
                                        <div className="absolute -inset-1 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-blue-400/40 border-l-sky-500/80 dark:border-blue-500/30" />
                                        <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-md" />
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/30">
                                            <ShieldCheck className="h-7 w-7" />
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                            Reporte de Pago{' '}
                                            <br className="md:hidden" />
                                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-400">
                                                Plan {planLabel}
                                            </span>
                                        </h1>
                                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Confirma tu pago para activar tu suscripción.
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden flex-col items-end md:flex">
                                    <span className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Paso {step} de 2
                                    </span>
                                    <div className="flex gap-1">
                                        {[1, 2].map((s) => (
                                            <div
                                                key={s}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${
                                                    step >= s
                                                        ? 'w-8 bg-sky-500 shadow-[0_0_8px_rgba(56,189,248,0.8)]'
                                                        : 'w-2 bg-slate-200 dark:bg-slate-800'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-10 md:px-10">
                                {/* Stepper simplificado (2 pasos) */}
                                <div className="relative mb-12 px-2 pt-4 md:px-6">
                                    <div className="absolute top-1/2 right-[10%] left-[10%] z-0 h-0.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-700 ease-in-out"
                                            style={{
                                                width: step === 1 ? '0%' : '100%',
                                            }}
                                        />
                                    </div>

                                    <div className="relative z-10 flex w-full justify-between">
                                        {[
                                            { num: 1, label: 'Datos de Pago', icon: Wallet },
                                            { num: 2, label: 'Confirmar', icon: CheckCircle2 },
                                        ].map((s) => {
                                            const isActive = step === s.num;
                                            const isPast = step > s.num;
                                            return (
                                                <div key={s.num} className="flex flex-col items-center gap-3">
                                                    <div className="group relative">
                                                        {isActive && (
                                                            <>
                                                                <div className="absolute -inset-3 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-sky-400/30" />
                                                                <div className="absolute inset-0 animate-pulse rounded-full bg-sky-500/20 blur-md" />
                                                            </>
                                                        )}
                                                        <div
                                                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                                                isActive
                                                                    ? 'scale-110 border-sky-500 bg-white text-sky-500 shadow-[0_0_15px_rgba(56,189,248,0.4)] dark:bg-[#0f1a2e]'
                                                                    : isPast
                                                                      ? 'border-transparent bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md'
                                                                      : 'border-slate-200 bg-white text-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600'
                                                            }`}
                                                        >
                                                            <s.icon className={`h-5 w-5 ${isActive ? 'animate-bounce [animation-duration:2s]' : ''}`} />
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 md:text-[11px] ${
                                                            isActive
                                                                ? 'text-sky-600 dark:text-sky-400'
                                                                : isPast
                                                                  ? 'text-slate-700 dark:text-slate-300'
                                                                  : 'text-slate-400 dark:text-slate-600'
                                                        }`}
                                                    >
                                                        {s.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <form onSubmit={enviarFormulario} className="space-y-6">
                                    {/* PASO 1 */}
                                    {step === 1 && (
                                        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
                                            {/* Selector de método */}
                                            <div className="mb-8 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 dark:border-white/5 dark:bg-slate-900/20">
                                                <RadioGroup
                                                    value={form.metodo}
                                                    onValueChange={(val) => handleMetodoChange(val as 'paypal' | 'binance')}
                                                    className="flex flex-col gap-4 sm:flex-row sm:gap-8"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="paypal" id="paypal" />
                                                        <Label htmlFor="paypal" className="flex items-center gap-2 text-sm font-medium">
                                                            <CreditCard className="h-4 w-4 text-blue-600" />
                                                            PayPal
                                                        </Label>
                                                    </div>
                                                    <div className="flex items-center space-x-2">
                                                        <RadioGroupItem value="binance" id="binance" />
                                                        <Label htmlFor="binance" className="flex items-center gap-2 text-sm font-medium">
                                                            <DollarSign className="h-4 w-4 text-amber-500" />
                                                            Binance (Crypto)
                                                        </Label>
                                                    </div>
                                                </RadioGroup>
                                            </div>

                                            {/* Campos dinámicos */}
                                            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:grid-cols-2 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                                                {form.metodo === 'paypal' ? (
                                                    <>
                                                        <InputField
                                                            id="correo_paypal"
                                                            label="Correo PayPal"
                                                            placeholder="usuario@paypal.com"
                                                            value={form.correo_paypal}
                                                            onChange={(v) => handleChange('correo_paypal', v)}
                                                            error={touched.correo_paypal ? fieldErrors.correo_paypal : undefined}
                                                            icon={<Mail className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="nombre_usuario"
                                                            label="Nombre de Usuario"
                                                            placeholder="Juan Pérez"
                                                            value={form.nombre_usuario}
                                                            onChange={(v) => handleChange('nombre_usuario', v)}
                                                            error={touched.nombre_usuario ? fieldErrors.nombre_usuario : undefined}
                                                            icon={<User className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="id_transaccion"
                                                            label="ID de Transacción"
                                                            placeholder="Ej. 9XJ7K3F"
                                                            value={form.id_transaccion}
                                                            onChange={(v) => handleChange('id_transaccion', v)}
                                                            error={touched.id_transaccion ? fieldErrors.id_transaccion : undefined}
                                                            icon={<Hash className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="monto_pagado"
                                                            label="Monto Pagado (USD)"
                                                            placeholder="10.00"
                                                            value={form.monto_pagado}
                                                            onChange={(v) => handleChange('monto_pagado', v)}
                                                            error={touched.monto_pagado ? fieldErrors.monto_pagado : undefined}
                                                            icon={<DollarSign className="h-4 w-4" />}
                                                            inputMode="decimal"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <InputField
                                                            id="cartera_bitcoin"
                                                            label="Cartera / Dirección"
                                                            placeholder="0x... o dirección"
                                                            value={form.cartera_bitcoin}
                                                            onChange={(v) => handleChange('cartera_bitcoin', v)}
                                                            error={touched.cartera_bitcoin ? fieldErrors.cartera_bitcoin : undefined}
                                                            icon={<Wallet className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="correo_usuario"
                                                            label="Correo de Usuario (Binance)"
                                                            placeholder="usuario@binance.com"
                                                            value={form.correo_usuario}
                                                            onChange={(v) => handleChange('correo_usuario', v)}
                                                            error={touched.correo_usuario ? fieldErrors.correo_usuario : undefined}
                                                            icon={<Mail className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="hash"
                                                            label="Hash de Transacción"
                                                            placeholder="0x... (hash)"
                                                            value={form.hash}
                                                            onChange={(v) => handleChange('hash', v)}
                                                            error={touched.hash ? fieldErrors.hash : undefined}
                                                            icon={<Hash className="h-4 w-4" />}
                                                        />
                                                        <InputField
                                                            id="monto_pagado_binance"
                                                            label="Monto Pagado (USD)"
                                                            placeholder="10.00"
                                                            value={form.monto_pagado}
                                                            onChange={(v) => handleChange('monto_pagado', v)}
                                                            error={touched.monto_pagado ? fieldErrors.monto_pagado : undefined}
                                                            icon={<DollarSign className="h-4 w-4" />}
                                                            inputMode="decimal"
                                                        />
                                                    </>
                                                )}
                                            </div>

                                            <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row md:justify-end">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={resetearFormulario}
                                                    className="h-14 rounded-2xl px-8 font-bold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() => manejarSiguientePaso(1)}
                                                    className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-10 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                                    Siguiente Paso
                                                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2: Confirmación */}
                                    {step === 2 && (
                                        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
                                            <div className="relative overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-sky-50 p-8 shadow-inner dark:border-blue-900/50 dark:from-[#08132b] dark:to-[#0f1a2e]">
                                                <div className="absolute top-0 right-0 h-40 w-40 translate-x-1/3 -translate-y-1/2 rounded-full bg-blue-500/10 blur-2xl" />
                                                <div className="absolute bottom-0 left-0 h-40 w-40 -translate-x-1/3 translate-y-1/2 rounded-full bg-sky-500/10 blur-2xl" />

                                                <div className="relative z-10">
                                                    <div className="mb-8 flex items-center gap-5 border-b border-blue-200/50 pb-6 dark:border-blue-800/30">
                                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/20">
                                                            <CheckCircle2 className="h-8 w-8" />
                                                        </div>
                                                        <div>
                                                            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                                                                Revisa tus datos
                                                            </h3>
                                                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                                Verifica que toda la información sea correcta.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                                        <ConfirmItem
                                                            label="Método de pago"
                                                            value={form.metodo === 'paypal' ? 'PayPal' : 'Binance'}
                                                            highlight
                                                        />
                                                        <ConfirmItem
                                                            label="Monto Pagado"
                                                            value={`$${form.monto_pagado}`}
                                                            highlight
                                                        />
                                                        {form.metodo === 'paypal' ? (
                                                            <>
                                                                <ConfirmItem label="Correo PayPal" value={form.correo_paypal} />
                                                                <ConfirmItem label="Nombre Usuario" value={form.nombre_usuario} />
                                                                <ConfirmItem label="ID Transacción" value={form.id_transaccion} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ConfirmItem label="Cartera" value={form.cartera_bitcoin} />
                                                                <ConfirmItem label="Correo Usuario" value={form.correo_usuario} />
                                                                <ConfirmItem label="Hash" value={form.hash} />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col-reverse items-center gap-4 pt-8 sm:flex-row md:justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setStep(1)}
                                                    className="h-14 w-full rounded-2xl border-slate-200 px-8 font-bold hover:bg-slate-100 sm:w-auto dark:border-slate-800 dark:hover:bg-slate-800"
                                                >
                                                    Regresar a Editar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    disabled={isSubmitting}
                                                    className="group relative h-16 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-10 text-base font-extrabold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 sm:w-auto disabled:opacity-70"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                                                    {isSubmitting ? (
                                                        <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                                                    ) : (
                                                        <Send className="mr-3 h-6 w-6 animate-pulse" />
                                                    )}
                                                    {isSubmitting ? 'Enviando...' : 'Confirmar y Enviar'}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

// ─── Subcomponentes auxiliares (igual que en billing-plan) ──────────────

function InputField({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    inputMode = 'text',
    icon,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
    icon?: React.ReactNode;
}) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
                {label}
            </label>
            <div className="relative">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        {icon}
                    </div>
                )}
                <Input
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    inputMode={inputMode}
                    className={`h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 focus-visible:border-sky-500 focus-visible:ring-sky-500/50 dark:border-slate-800 dark:bg-slate-950/50 ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus-visible:ring-red-500/30' : 'hover:border-slate-300 dark:hover:border-slate-700'}`}
                />
            </div>
            {error && (
                <p className="animate-in px-1 text-xs font-bold text-red-500 fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}

function ConfirmItem({
    label,
    value,
    highlight = false,
    className = '',
}: {
    label: string;
    value: string;
    highlight?: boolean;
    className?: string;
}) {
    return (
        <div className={`space-y-1 ${className}`}>
            <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase dark:text-slate-500">
                {label}
            </p>
            <p
                className={`font-semibold ${highlight ? 'text-lg text-sky-600 dark:text-sky-400' : 'text-sm text-slate-800 dark:text-slate-200'}`}
            >
                {value || '—'}
            </p>
        </div>
    );
}
