import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertCircle,
    Loader2,
    User,
    MapPin,
    CheckCircle2,
    ShieldCheck,
    Send,
    ChevronRight,
} from 'lucide-react';

interface Props {
    userId: number;
    plan: 'andromeda' | 'fenix' | 'pegasus' | string;
}

interface FormState {
    user_id: number;
    plan: string;
    nombre: string;
    apellido: string;
    celular: string;
    ci_rif: string;
    pais_id: string;    // antes 'pais'
    estado_id: string;  // antes 'estado'
    ciudad_id: string;  // antes 'ciudad'
    direccion: string;
    codigo_postal: string;
}

interface LocationItem {
    id: number;
    nombre_paises?: string;
    name?: string;
}

export default function FacturacionPlan({ userId, plan }: Props) {
    const [step, setStep] = useState<number>(1);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [serverErrors, setServerErrors] = useState<string[]>([]);

    // Datos del formulario (siempre vacío al inicio)
    const [form, setForm] = useState<FormState>({
        user_id: userId,
        plan: plan,
        nombre: '',
        apellido: '',
        celular: '',
        ci_rif: '',
        pais_id: '',        // ← antes 'pais'
        estado_id: '',      // ← antes 'estado'
        ciudad_id: '',      // ← antes 'ciudad'
        direccion: '',
        codigo_postal: '',
    });

    // Selects Data
    const [paises, setPaises] = useState<LocationItem[]>([]);
    const [estados, setEstados] = useState<LocationItem[]>([]);
    const [ciudades, setCiudades] = useState<LocationItem[]>([]);

    const [loadingPaises, setLoadingPaises] = useState<boolean>(false);
    const [loadingEstados, setLoadingEstados] = useState<boolean>(false);
    const [loadingCiudades, setLoadingCiudades] = useState<boolean>(false);

    const planLabels: Record<string, string> = {
        andromeda: 'Andromeda',
        fenix: 'Fenix',
        pegasus: 'Pegasus',
    };
    const planLabel = planLabels[plan] || 'Desconocido';

    // Cargar solo países al montar (sin buscar factura)
    useEffect(() => {
        const cargarPaises = async () => {
            setLoadingPaises(true);
            try {
                const res = await fetch('/api/paises');
                if (res.ok) {
                    const data = await res.json();
                    setPaises(
                        data.map((p: any) => ({
                            ...p,
                            id: Number(p.id),
                        })),
                    );
                }
            } catch (error) {
                console.error('Error cargando países:', error);
            } finally {
                setLoadingPaises(false);
            }
        };
        cargarPaises();
    }, []); // Solo se ejecuta una vez

    // Handlers de locación
    const cargarEstados = async (paisId: string) => {
        setForm((prev) => ({ ...prev, pais_id: paisId, estado_id: '', ciudad_id: '' }));
        setEstados([]);
        setCiudades([]);
        if (!paisId) return;

        setLoadingEstados(true);
        try {
            const response = await fetch(`/api/paises/${paisId}/estados`);
            if (response.ok) {
                const data = await response.json();
                setEstados(data.map((e: any) => ({ ...e, id: Number(e.id) })));
            }
        } catch (error) {
            console.error('Error cargando estados:', error);
        } finally {
            setLoadingEstados(false);
        }
    };

    const cargarCiudades = async (estadoId: string) => {
        setForm((prev) => ({ ...prev, estado_id: estadoId, ciudad_id: '' }));
        setCiudades([]);
        if (!estadoId) return;

        setLoadingCiudades(true);
        try {
            const response = await fetch(`/api/estados/${estadoId}/ciudades`);
            if (response.ok) {
                const data = await response.json();
                setCiudades(data.map((c: any) => ({ ...c, id: Number(c.id) })));
            }
        } catch (error) {
            console.error('Error cargando ciudades:', error);
        } finally {
            setLoadingCiudades(false);
        }
    };

    // Helpers
    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    // Validación
    const getFieldErrors = () => {
        const e: Record<string, string> = {};
        if (!form.nombre || form.nombre.length < 2)
            e.nombre = 'Nombre obligatorio (Mínimo 2 caracteres).';
        if (!form.apellido || form.apellido.length < 2)
            e.apellido = 'Apellido obligatorio (Mínimo 2 caracteres).';
        if (!form.celular || !/^\d{10,15}$/.test(form.celular))
          e.celular = 'Teléfono requerido (Entre 10 y 15 dígitos).';
        if (!form.ci_rif || !/^\d{7,20}$/.test(form.ci_rif))
          e.ci_rif = 'N° de Identificación inválido (7 a 18 números).';
        if (!form.pais_id) e.pais = 'El país es obligatorio.';
        if (!form.estado_id) e.estado = 'El estado es obligatorio.';
        if (!form.ciudad_id) e.ciudad = 'La ciudad es obligatoria.';
        if (!form.direccion || form.direccion.length < 10)
            e.direccion = 'Dirección requerida (Mínimo 10 caracteres).';
        if (!form.codigo_postal || !/^\d{4,7}$/.test(form.codigo_postal))
          e.codigo_postal = 'Código postal inválido (4 a 7 números).';
        return e;
    };

    const fieldErrors = getFieldErrors();

    const validarPaso = (paso: number) => {
        const e = getFieldErrors();
        const currentTouched = { ...touched };
        const fieldsToCheck =
            paso === 1
                ? ['nombre', 'apellido', 'celular', 'ci_rif']
                : ['pais', 'estado', 'ciudad', 'direccion', 'codigo_postal'];

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
            user_id: userId,
            plan: plan,
            nombre: '',
            apellido: '',
            celular: '',
            ci_rif: '',
            pais_id: '',
            estado_id: '',
            ciudad_id: '',
            direccion: '',
            codigo_postal: '',
        });
        setTouched({});
        setServerErrors([]);
        setStep(1);
    };

    // Envío (siempre POST)
    const enviarFormulario = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validarPaso(2)) return;

        router.post(`/api/guardar-factura/${form.user_id}`, form, {
            onError: (errs) => {
                toast.error('Ocurrió un error al procesar la solicitud.');
                setServerErrors(Object.values(errs).flat() as string[]);
            },
            onSuccess: () => {
                resetearFormulario();
                // Redirigir al dashboard para actualizar permisos y sidebar
                 toast.success('Factura guardada correctamente. Redirigiendo al dashboard...');
            },
        });
    };

    // Renderizado (igual al original pero sin modoEditar)
    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            {/* Fondo decorativo */}
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

                            {/* Header (sin modoEditar) */}
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
                                            Facturación{' '}
                                            <br className="md:hidden" />
                                            <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-400">
                                                Plan {planLabel}
                                            </span>
                                        </h1>
                                        <p className="mt-2 text-sm font-medium text-slate-500 dark:text-slate-400">
                                            Completa tu proceso de forma rápida
                                            y segura para acceder a TuMediBot.
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden flex-col items-end md:flex">
                                    <span className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Paso {step} de 3
                                    </span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((s) => (
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
                                {/* Stepper */}
                                <div className="relative mb-12 px-2 pt-4 md:px-6">
                                    <div className="absolute top-1/2 right-[10%] left-[10%] z-0 h-0.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-blue-600 to-sky-500 shadow-[0_0_10px_rgba(56,189,248,0.5)] transition-all duration-700 ease-in-out"
                                            style={{
                                                width:
                                                    step === 1
                                                        ? '0%'
                                                        : step === 2
                                                          ? '50%'
                                                          : '100%',
                                            }}
                                        />
                                    </div>

                                    <div className="relative z-10 flex w-full justify-between">
                                        {[
                                            {
                                                num: 1,
                                                label: 'Datos Personales',
                                                icon: User,
                                            },
                                            {
                                                num: 2,
                                                label: 'Dirección',
                                                icon: MapPin,
                                            },
                                            {
                                                num: 3,
                                                label: 'Confirmación',
                                                icon: CheckCircle2,
                                            },
                                        ].map((s) => {
                                            const isActive = step === s.num;
                                            const isPast = step > s.num;
                                            return (
                                                <div
                                                    key={s.num}
                                                    className="flex flex-col items-center gap-3"
                                                >
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
                                                            <s.icon
                                                                className={`h-5 w-5 ${
                                                                    isActive
                                                                        ? 'animate-bounce'
                                                                        : ''
                                                                } [animation-duration:2s]`}
                                                            />
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

                                <form
                                    onSubmit={enviarFormulario}
                                    className="space-y-6"
                                >
                                    {/* PASO 1 */}
                                    {step === 1 && (
                                        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
                                            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:grid-cols-2 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                                                <InputField
                                                    id="nombre"
                                                    label="Nombre"
                                                    placeholder="Ej. Juan"
                                                    value={form.nombre}
                                                    onChange={(v) =>
                                                        handleChange(
                                                            'nombre',
                                                            v,
                                                        )
                                                    }
                                                    error={
                                                        touched.nombre
                                                            ? fieldErrors.nombre
                                                            : undefined
                                                    }
                                                />
                                                <InputField
                                                    id="apellido"
                                                    label="Apellido"
                                                    placeholder="Ej. Pérez"
                                                    value={form.apellido}
                                                    onChange={(v) =>
                                                        handleChange(
                                                            'apellido',
                                                            v,
                                                        )
                                                    }
                                                    error={
                                                        touched.apellido
                                                            ? fieldErrors.apellido
                                                            : undefined
                                                    }
                                                />
                                                <InputField
                                                    id="celular"
                                                    label="Teléfono Celular"
                                                    placeholder="Ej.300 1234567"
                                                    value={form.celular}
                                                    inputMode="numeric"
                                                    onChange={(v) =>
                                                        handleChange(
                                                            'celular',
                                                            v,
                                                        )
                                                    }
                                                    error={
                                                        touched.celular
                                                            ? fieldErrors.celular
                                                            : undefined
                                                    }
                                                />
                                                <InputField
                                                    id="ci_rif"
                                                    label="N° de Identificación"
                                                    placeholder="Ej. 12345678"
                                                    value={form.ci_rif}
                                                    inputMode="numeric"
                                                    onChange={(v) =>
                                                        handleChange(
                                                            'ci_rif',
                                                            v,
                                                        )
                                                    }
                                                    error={
                                                        touched.ci_rif
                                                            ? fieldErrors.ci_rif
                                                            : undefined
                                                    }
                                                />
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
                                                    onClick={() =>
                                                        manejarSiguientePaso(1)
                                                    }
                                                    className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-10 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                                    Siguiente Paso
                                                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 2 */}
                                    {step === 2 && (
                                        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
                                            <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                    <SelectField
                                                        id="pais"
                                                        label="País"
                                                        value={form.pais_id}
                                                        options={paises.map(
                                                            (p) => ({
                                                                value: String(
                                                                    p.id,
                                                                ),
                                                                label:
                                                                    p.nombre_paises ||
                                                                    '',
                                                            }),
                                                        )}
                                                        onChange={(v) => {
                                                            cargarEstados(v);
                                                            handleChange(
                                                                'pais_id',
                                                                v,
                                                            );
                                                        }}
                                                        loading={loadingPaises}
                                                        error={
                                                            touched.pais
                                                                ? fieldErrors.pais
                                                                : undefined
                                                        }
                                                        placeholder="Selecciona un país"
                                                    />
                                                    <SelectField
                                                        id="estado"
                                                        label="Estado"
                                                        value={form.estado_id}
                                                        options={estados.map(
                                                            (e) => ({
                                                                value: String(
                                                                    e.id,
                                                                ),
                                                                label:
                                                                    e.name ||
                                                                    '',
                                                            }),
                                                        )}
                                                        onChange={(v) => {
                                                            cargarCiudades(v);
                                                            handleChange(
                                                                'estado_id',
                                                                v,
                                                            );
                                                        }}
                                                        loading={loadingEstados}
                                                        disabled={
                                                            estados.length ===
                                                                0 ||
                                                            loadingEstados
                                                        }
                                                        error={
                                                            touched.estado
                                                                ? fieldErrors.estado
                                                                : undefined
                                                        }
                                                        placeholder={
                                                            estados.length === 0
                                                                ? 'Espera...'
                                                                : 'Selecciona estado'
                                                        }
                                                    />
                                                    <SelectField
                                                        id="ciudad"
                                                        label="Ciudad"
                                                        value={form.ciudad_id}
                                                        options={ciudades.map(
                                                            (c) => ({
                                                                value: String(
                                                                    c.id,
                                                                ),
                                                                label:
                                                                    c.name ||
                                                                    '',
                                                            }),
                                                        )}
                                                        onChange={(v) =>
                                                            handleChange(
                                                                'ciudad_id',
                                                                v,
                                                            )
                                                        }
                                                        loading={
                                                            loadingCiudades
                                                        }
                                                        disabled={
                                                            ciudades.length ===
                                                                0 ||
                                                            loadingCiudades
                                                        }
                                                        error={
                                                            touched.ciudad
                                                                ? fieldErrors.ciudad
                                                                : undefined
                                                        }
                                                        placeholder={
                                                            ciudades.length ===
                                                            0
                                                                ? 'Espera...'
                                                                : 'Selecciona ciudad'
                                                        }
                                                    />
                                                </div>
                                                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                                    <div className="md:col-span-2">
                                                        <InputField
                                                            id="direccion"
                                                            label="Dirección Física"
                                                            placeholder="Av. Principal, Edificio..."
                                                            value={
                                                                form.direccion
                                                            }
                                                            onChange={(v) =>
                                                                handleChange(
                                                                    'direccion',
                                                                    v,
                                                                )
                                                            }
                                                            error={
                                                                touched.direccion
                                                                    ? fieldErrors.direccion
                                                                    : undefined
                                                            }
                                                        />
                                                    </div>
                                                    <InputField
                                                        id="codigo_postal"
                                                        label="Código Postal"
                                                        placeholder="1010"
                                                        value={
                                                            form.codigo_postal
                                                        }
                                                        inputMode="numeric"
                                                        onChange={(v) =>
                                                            handleChange(
                                                                'codigo_postal',
                                                                v,
                                                            )
                                                        }
                                                        error={
                                                            touched.codigo_postal
                                                                ? fieldErrors.codigo_postal
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            <div className="flex flex-col-reverse gap-4 pt-8 sm:flex-row md:justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setStep(1)}
                                                    className="h-14 rounded-2xl border-slate-200 px-8 font-bold hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                                                >
                                                    Regresar
                                                </Button>
                                                <Button
                                                    type="button"
                                                    onClick={() =>
                                                        manejarSiguientePaso(2)
                                                    }
                                                    className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-10 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                                    Verificar Datos
                                                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}

                                    {/* PASO 3 */}
                                    {step === 3 && (
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
                                                                Todo Listo para
                                                                Activar
                                                            </h3>
                                                            <p className="mt-1 text-sm font-medium text-slate-600 dark:text-slate-400">
                                                                Por favor
                                                                verifica que
                                                                todo esté
                                                                correcto.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                                        <ConfirmItem
                                                            label="Plan Seleccionado"
                                                            value={`Plan ${planLabel}`}
                                                            highlight
                                                        />
                                                        <ConfirmItem
                                                            label="Titular"
                                                            value={`${form.nombre} ${form.apellido}`}
                                                        />
                                                        <ConfirmItem
                                                            label="Identificación"
                                                            value={form.ci_rif}
                                                        />
                                                        <ConfirmItem
                                                            label="Contacto"
                                                            value={form.celular}
                                                        />
                                                        <ConfirmItem
                                                            label="Ubicación"
                                                            value={`${paises.find((p) => p.id === Number(form.pais_id))?.nombre_paises || ''}, ${estados.find((e) => e.id === Number(form.estado_id))?.name || ''}`}
                                                        />
                                                        <ConfirmItem
                                                            label="Dirección"
                                                            value={
                                                                form.direccion
                                                            }
                                                            className="sm:col-span-2"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col-reverse items-center gap-4 pt-8 sm:flex-row md:justify-between">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={() => setStep(2)}
                                                    className="h-14 w-full rounded-2xl border-slate-200 px-8 font-bold hover:bg-slate-100 sm:w-auto dark:border-slate-800 dark:hover:bg-slate-800"
                                                >
                                                    Regresar a Editar
                                                </Button>
                                                <Button
                                                    type="submit"
                                                    className="group relative h-16 w-full overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-10 text-base font-extrabold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 sm:w-auto"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                                                    <Send className="mr-3 h-6 w-6 animate-pulse" />
                                                    Confirmar y Activar
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

            {/* Footer */}
            <footer className="relative z-10 mt-auto w-full border-t border-slate-200/50 bg-white/30 py-6 text-center text-sm text-slate-500 backdrop-blur-xl dark:border-slate-800/50 dark:bg-[#080e1c]/40 dark:text-slate-400">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-sky-400">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="text-[10px] font-bold tracking-widest uppercase">
                            Transacción Cifrada de Extremo a Extremo
                        </span>
                    </div>
                    <p>
                        &copy; {new Date().getFullYear()} —{' '}
                        <strong className="text-slate-700 dark:text-slate-300">
                            TuMediBot
                        </strong>
                        . Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        </div>
    );
}

// Subcomponentes auxiliares para el form
function InputField({
    id,
    label,
    placeholder,
    value,
    onChange,
    error,
    inputMode,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    error?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
}) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
                {label}
            </label>
            <Input
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                inputMode={inputMode}
                className={`h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 focus-visible:border-sky-500 focus-visible:ring-sky-500/50 dark:border-slate-800 dark:bg-slate-950/50 ${error ? 'border-red-500 focus-visible:ring-red-500/30' : 'hover:border-slate-300 dark:hover:border-slate-700'}`}
            />
            {error && (
                <p className="animate-in px-1 text-xs font-bold text-red-500 fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
}

function SelectField({
    id,
    label,
    placeholder,
    value,
    onChange,
    options,
    loading,
    disabled,
    error,
}: {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (v: string) => void;
    options: { value: string; label: string }[];
    loading?: boolean;
    disabled?: boolean;
    error?: string;
}) {
    return (
        <div className="space-y-2">
            <label
                htmlFor={id}
                className="flex items-center gap-2 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
            >
                {label}{' '}
                {loading && (
                    <Loader2 className="h-3 w-3 animate-spin text-sky-500" />
                )}
            </label>
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled || loading}
            >
                <SelectTrigger
                    id={id}
                    className={`h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 focus:border-sky-500 focus:ring-sky-500/50 dark:border-slate-800 dark:bg-slate-950/50 ${error ? 'border-red-500' : 'hover:border-slate-300 dark:hover:border-slate-700'}`}
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-xl dark:border-slate-800">
                    {options.map((o) => (
                        <SelectItem
                            key={o.value}
                            value={o.value}
                            className="rounded-xl focus:bg-sky-50 dark:focus:bg-sky-900/20"
                        >
                            {o.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
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
