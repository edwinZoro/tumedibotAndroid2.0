import { Head, router, useForm } from '@inertiajs/react';
import {
    Bell,
    CheckCircle2,
    Clock,
    Plus,
    Pill,
    Power,
    Search,
    Sparkles,
    Trash2,
    Volume2,
    X,
    Calendar,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import Footer from '@/components/footer';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface Recordatorio {
    id: number;
    medicamento_id: number | null;
    nombre_medicamento: string;
    presentacion: string | null;
    dosis: string;
    intervalo_horas: number;
    hora_inicio: string;
    dias_semana: string[] | null;
    fecha_inicio: string;
    fecha_fin: string | null;
    email_recordatorio: boolean;
    notas: string | null;
    activo: boolean;
    created_at: string;
}

interface MedicamentoCatalogo {
    id: number;
    nombre_comercial: string;
    principio_activo: string;
    presentaciones: string[] | string | null;
    dosis_options: string[] | string | null;
    frecuencia_options: string[] | string | null;
    categoria: string | null;
}

interface Props {
    tienePaciente: boolean;
    recordatorios: Recordatorio[];
}

// ─── Web Audio API Sound Generator ───────────────────────────────────────────
function createAlarmAudio() {
    try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();

        const playTone = (freq: number, duration: number, delay: number) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

            gain.gain.setValueAtTime(0.3, ctx.currentTime + delay);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + delay);
            osc.stop(ctx.currentTime + delay + duration);
        };

        // Triple chimes sequence
        playTone(880, 0.2, 0);       // A5
        playTone(1174.66, 0.25, 0.25); // D6
        playTone(1318.51, 0.35, 0.55); // E6

        setTimeout(() => {
            playTone(880, 0.2, 0);
            playTone(1174.66, 0.25, 0.25);
            playTone(1318.51, 0.35, 0.55);
        }, 1000);
    } catch {
        // Fallback quiet failure if Web Audio API not supported
    }
}

export default function MisMedicamentos({ tienePaciente, recordatorios }: Props) {
    const [openModal, setOpenModal] = useState(false);
    const [isCustomName, setIsCustomName] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MedicamentoCatalogo[]>([]);
    const [selectedMedicamento, setSelectedMedicamento] = useState<MedicamentoCatalogo | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    // Alarm active state
    const [activeAlarm, setActiveAlarm] = useState<{ recordatorio: Recordatorio; hora: string } | null>(null);

    // Form
    const { data, setData, post, processing, errors, reset } = useForm({
        medicamento_id: '' as string | number,
        nombre_libre: '',
        presentacion: '',
        dosis: '',
        intervalo_horas: '8',
        hora_inicio: '08:00',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: '',
        email_recordatorio: true,
        notas: '',
    });

    // Catálogo autocomplete search — sólo buscar si el usuario escribe al menos 2 caracteres
    useEffect(() => {
        if (isCustomName || searchQuery.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setIsSearching(true);
            try {
                const res = await fetch(`/api/medicamentos/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
                if (res.ok) {
                    const items = await res.json();
                    setSearchResults(items);
                }
            } catch {
                // Ignore search error
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, isCustomName]);

    // Real-time alarm checker in browser
    useEffect(() => {
        const checkAlarms = () => {
            const now = new Date();
            const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
            const hoyISO = now.toISOString().split('T')[0];

            for (const rec of recordatorios) {
                if (!rec.activo) continue;
                if (rec.fecha_inicio > hoyISO) continue;
                if (rec.fecha_fin && rec.fecha_fin < hoyISO) continue;

                const intervalo = rec.intervalo_horas || 24;
                const [hInicio] = rec.hora_inicio.split(':').map(Number);
                const horasDosis: string[] = [];

                for (let h = 0; h < 24; h += intervalo) {
                    const horaCalc = (hInicio + h) % 24;
                    horasDosis.push(`${String(horaCalc).padStart(2, '0')}:00`);
                }

                if (horasDosis.includes(currentHHMM) && !activeAlarm) {
                    setActiveAlarm({ recordatorio: rec, hora: currentHHMM });
                    createAlarmAudio();
                    toast.info(`💊 Hora de tomar: ${rec.nombre_medicamento} (${rec.dosis})`, {
                        duration: 10000,
                    });
                }
            }
        };

        const timer = setInterval(checkAlarms, 30000);
        return () => clearInterval(timer);
    }, [recordatorios, activeAlarm]);

    // Seleccionar medicamento del catálogo -> auto-llena presentación y dosis por defecto
    const handleSelectMedicamento = (m: MedicamentoCatalogo) => {
        setSelectedMedicamento(m);

        let defaultPres = '';
        if (Array.isArray(m.presentaciones) && m.presentaciones.length > 0) {
            defaultPres = String(m.presentaciones[0]);
        } else if (typeof m.presentaciones === 'string') {
            defaultPres = m.presentaciones;
        }

        let defaultDosis = '';
        if (Array.isArray(m.dosis_options) && m.dosis_options.length > 0) {
            defaultDosis = String(m.dosis_options[0]);
        } else if (typeof m.dosis_options === 'string') {
            defaultDosis = m.dosis_options;
        }

        setData((prev) => ({
            ...prev,
            medicamento_id: m.id,
            nombre_libre: '',
            presentacion: defaultPres,
            dosis: defaultDosis,
        }));

        setSearchResults([]);
    };

    // Cambiar entre catálogo y nombre libre
    const handleToggleCustomName = () => {
        const nextCustom = !isCustomName;
        setIsCustomName(nextCustom);
        setSelectedMedicamento(null);
        setSearchQuery('');
        setSearchResults([]);
        setData((prev) => ({
            ...prev,
            medicamento_id: '',
            nombre_libre: '',
            presentacion: '',
            dosis: '',
        }));
    };

    // Form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/paciente/mis-medicamentos', {
            preserveScroll: true,
            onSuccess: () => {
                setOpenModal(false);
                reset();
                setSelectedMedicamento(null);
                setSearchQuery('');
                toast.success('Recordatorio creado exitosamente');
            },
            onError: () => {
                toast.error('Revisa los campos obligatorios');
            },
        });
    };

    // Toggle activo
    const handleToggle = (id: number) => {
        router.patch(`/paciente/mis-medicamentos/${id}/toggle`, {}, {
            preserveScroll: true,
            onSuccess: () => toast.success('Estado actualizado'),
        });
    };

    // Delete
    const handleDelete = (id: number) => {
        if (confirm('¿Deseas eliminar este recordatorio?')) {
            router.delete(`/paciente/mis-medicamentos/${id}`, {
                preserveScroll: true,
                onSuccess: () => toast.success('Recordatorio eliminado'),
            });
        }
    };

    // Formatear horas del día para la tarjeta
    const getHorasCalculadas = (horaInicio: string, intervalo: number) => {
        const [h] = horaInicio.split(':').map(Number);
        const lista: string[] = [];
        for (let i = 0; i < 24; i += intervalo) {
            const hCalc = (h + i) % 24;
            const periodo = hCalc >= 12 ? 'PM' : 'AM';
            const h12 = hCalc % 12 === 0 ? 12 : hCalc % 12;
            lista.push(`${h12}:00 ${periodo}`);
        }
        return lista;
    };

    return (
        <div className="flex min-h-screen flex-col justify-between bg-slate-50 text-slate-900 antialiased dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Mis Medicamentos · TuMediBot" />

            {/* ══ HERO ═══════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-emerald-50/60 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#10b98115_1px,transparent_1px),linear-gradient(to_bottom,#10b98115_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#10b98108_1px,transparent_1px),linear-gradient(to_bottom,#10b98108_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-emerald-400/20 blur-[120px] dark:bg-emerald-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-teal-300/30 blur-[100px] dark:bg-teal-500/15" />

                <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-500 shadow-lg shadow-emerald-500/30">
                                <Pill className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400">
                                    <span className="h-2 w-2 animate-ping rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Recordatorios de Medicamentos
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-emerald-600 md:justify-start dark:text-emerald-400">
                                    <Sparkles className="h-4 w-4" /> Notificaciones por correo electrónico y alarmas in-app
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                onClick={() => {
                                    createAlarmAudio();
                                    toast.success('Sonido de prueba reproducido');
                                }}
                                className="rounded-2xl border-emerald-300 bg-white/80 text-xs font-bold text-emerald-700 shadow-sm hover:bg-emerald-50 dark:border-emerald-800 dark:bg-slate-900 dark:text-emerald-400"
                            >
                                <Volume2 className="mr-1.5 h-4 w-4" /> Probar Alarma
                            </Button>

                            <Dialog open={openModal} onOpenChange={setOpenModal}>
                                <DialogTrigger asChild>
                                    <Button className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-[1.02] hover:shadow-emerald-500/40">
                                        <Plus className="mr-1.5 h-5 w-5" /> Agregar Medicamento
                                    </Button>
                                </DialogTrigger>

                                {/* ══ MODAL RE-DISEÑADO & CENTRADO ═══════════════════════════════ */}
                                <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl border-emerald-500/20 shadow-2xl bg-white dark:bg-slate-900">
                                    <DialogHeader className="p-6 pb-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0">
                                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                            <Pill className="h-5 w-5 text-emerald-500" />
                                            Nuevo Recordatorio de Medicamento
                                        </DialogTitle>
                                        <DialogDescription>
                                            Selecciona del catálogo o escribe el nombre de tu medicamento para configurar tus dosis.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
                                        <div className="p-6 overflow-y-auto space-y-5 flex-1 max-h-[calc(85vh-140px)]">
                                            {/* Selector: Catálogo o Nombre Libre */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                                        Medicamento
                                                    </Label>
                                                    <button
                                                        type="button"
                                                        onClick={handleToggleCustomName}
                                                        className="text-xs font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        {isCustomName ? '🔍 Buscar en catálogo' : '✍️ Escribir nombre libre'}
                                                    </button>
                                                </div>

                                                {!isCustomName ? (
                                                    <div className="relative">
                                                        <div className="relative">
                                                            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                                                            <Input
                                                                type="text"
                                                                placeholder="Escribe el nombre del medicamento para buscar..."
                                                                value={searchQuery}
                                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                                className="h-11 rounded-xl pl-9"
                                                            />
                                                        </div>

                                                        {/* Autocomplete Dropdown — Sólo se muestra cuando hay búsqueda activa */}
                                                        {searchResults.length > 0 && !selectedMedicamento && (
                                                            <div className="absolute z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900">
                                                                {searchResults.map((m) => (
                                                                    <button
                                                                        key={m.id}
                                                                        type="button"
                                                                        onClick={() => handleSelectMedicamento(m)}
                                                                        className="w-full px-4 py-2.5 text-left transition hover:bg-emerald-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800/50 last:border-none"
                                                                    >
                                                                        <div className="text-sm font-bold text-slate-900 dark:text-white">
                                                                            {m.nombre_comercial}
                                                                        </div>
                                                                        <div className="text-xs text-slate-500">
                                                                            {m.principio_activo} {m.categoria ? `• ${m.categoria}` : ''}
                                                                        </div>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}

                                                        {selectedMedicamento && (
                                                            <div className="mt-2 flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/80 p-3 dark:border-emerald-900 dark:bg-emerald-950/40">
                                                                <div>
                                                                    <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                                                                        {selectedMedicamento.nombre_comercial}
                                                                    </div>
                                                                    <div className="text-xs text-emerald-700 dark:text-emerald-400">
                                                                        {selectedMedicamento.principio_activo}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        setSelectedMedicamento(null);
                                                                        setData('medicamento_id', '');
                                                                        setSearchQuery('');
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4 text-emerald-700" />
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        placeholder="Nombre del medicamento (ej: Ibuprofeno 400mg)"
                                                        value={data.nombre_libre}
                                                        onChange={(e) => setData('nombre_libre', e.target.value)}
                                                        className="h-11 rounded-xl"
                                                    />
                                                )}
                                            </div>

                                            {/* Presentación y Dosis */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Presentación
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Ej: Tabletas 500mg, Jarabe..."
                                                        value={data.presentacion}
                                                        onChange={(e) => setData('presentacion', e.target.value)}
                                                        className="h-11 rounded-xl"
                                                    />
                                                    {selectedMedicamento && Array.isArray(selectedMedicamento.presentaciones) && selectedMedicamento.presentaciones.length > 1 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {selectedMedicamento.presentaciones.map((p, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => setData('presentacion', String(p))}
                                                                    className={`text-[11px] px-2 py-0.5 rounded-full border transition ${
                                                                        data.presentacion === String(p)
                                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                                                                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    {String(p)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Dosis *
                                                    </Label>
                                                    <Input
                                                        type="text"
                                                        placeholder="Ej: 1 tableta, 5ml, 2 cápsulas..."
                                                        value={data.dosis}
                                                        onChange={(e) => setData('dosis', e.target.value)}
                                                        required
                                                        className="h-11 rounded-xl"
                                                    />
                                                    {errors.dosis && (
                                                        <p className="text-xs text-red-500">{errors.dosis}</p>
                                                    )}
                                                    {selectedMedicamento && Array.isArray(selectedMedicamento.dosis_options) && selectedMedicamento.dosis_options.length > 1 && (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {selectedMedicamento.dosis_options.map((d, idx) => (
                                                                <button
                                                                    key={idx}
                                                                    type="button"
                                                                    onClick={() => setData('dosis', String(d))}
                                                                    className={`text-[11px] px-2 py-0.5 rounded-full border transition ${
                                                                        data.dosis === String(d)
                                                                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold dark:bg-emerald-950 dark:text-emerald-300'
                                                                            : 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300'
                                                                    }`}
                                                                >
                                                                    {String(d)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Intervalo de horas y Hora Inicio */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Frecuencia (Cada cuántas horas) *
                                                    </Label>
                                                    <select
                                                        value={data.intervalo_horas}
                                                        onChange={(e) => setData('intervalo_horas', e.target.value)}
                                                        className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm focus:border-emerald-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950"
                                                    >
                                                        <option value="4">Cada 4 horas (6 veces al día)</option>
                                                        <option value="6">Cada 6 horas (4 veces al día)</option>
                                                        <option value="8">Cada 8 horas (3 veces al día)</option>
                                                        <option value="12">Cada 12 horas (2 veces al día)</option>
                                                        <option value="24">Cada 24 horas (1 vez al día)</option>
                                                        <option value="48">Cada 48 horas (Cada 2 días)</option>
                                                    </select>
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Hora de primera dosis *
                                                    </Label>
                                                    <Input
                                                        type="time"
                                                        value={data.hora_inicio}
                                                        onChange={(e) => setData('hora_inicio', e.target.value)}
                                                        required
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Fechas de Tratamiento */}
                                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Fecha de inicio *
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={data.fecha_inicio}
                                                        onChange={(e) => setData('fecha_inicio', e.target.value)}
                                                        required
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>

                                                <div className="space-y-1.5">
                                                    <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                        Fecha de fin (Opcional)
                                                    </Label>
                                                    <Input
                                                        type="date"
                                                        value={data.fecha_fin}
                                                        onChange={(e) => setData('fecha_fin', e.target.value)}
                                                        className="h-11 rounded-xl"
                                                    />
                                                </div>
                                            </div>

                                            {/* Checkbox de Email */}
                                            <div className="flex items-center justify-between rounded-xl border border-slate-200 p-3.5 dark:border-slate-800">
                                                <div>
                                                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                        Recordatorio por Correo Electrónico
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        Te enviaremos un email cada vez que sea hora de tu dosis.
                                                    </div>
                                                </div>
                                                <Checkbox
                                                    checked={data.email_recordatorio}
                                                    onCheckedChange={(val) => setData('email_recordatorio', Boolean(val))}
                                                />
                                            </div>

                                            {/* Notas */}
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    Notas / Instrucciones (Opcional)
                                                </Label>
                                                <Textarea
                                                    placeholder="Ej: Tomar con las comidas, evitar productos lácteos..."
                                                    value={data.notas}
                                                    onChange={(e) => setData('notas', e.target.value)}
                                                    rows={2}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>

                                        <DialogFooter className="p-4 px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-900/80 shrink-0 flex justify-end gap-3">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setOpenModal(false)}
                                                className="rounded-xl"
                                            >
                                                Cancelar
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processing}
                                                className="rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-bold"
                                            >
                                                {processing ? 'Guardando...' : 'Guardar Recordatorio'}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ CONTENIDO / LISTA DE MEDICAMENTOS ════════════════════════ */}
            <main className="relative z-20 mx-auto -mt-8 max-w-5xl px-4 sm:px-6 lg:px-8">
                {recordatorios.length === 0 ? (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 p-8 text-center shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                            <Pill className="h-8 w-8" />
                        </div>
                        <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">
                            No tienes recordatorios de medicamentos
                        </h3>
                        <p className="mt-1 text-sm text-slate-500 max-w-md mx-auto">
                            Agrega tus medicamentos actuales para recibir recordatorios automáticos por correo electrónico y alarmas in-app.
                        </p>
                        <Button
                            onClick={() => setOpenModal(true)}
                            className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 font-bold text-white shadow-md"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Agregar primer medicamento
                        </Button>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        {recordatorios.map((rec) => {
                            const horasDia = getHorasCalculadas(rec.hora_inicio, rec.intervalo_horas);

                            return (
                                <Card
                                    key={rec.id}
                                    className={`relative overflow-hidden rounded-3xl border transition-all duration-300 shadow-md ${
                                        rec.activo
                                            ? 'border-emerald-200/80 bg-white/90 dark:border-emerald-900/60 dark:bg-slate-900/80'
                                            : 'border-slate-200/60 bg-slate-100/60 opacity-75 dark:border-slate-800/40 dark:bg-slate-950/40'
                                    }`}
                                >
                                    <div
                                        className={`absolute top-0 left-0 h-full w-2 ${
                                            rec.activo ? 'bg-emerald-500' : 'bg-slate-400'
                                        }`}
                                    />

                                    <CardHeader className="pl-6 pr-5 pt-5 pb-3">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white">
                                                        {rec.nombre_medicamento}
                                                    </CardTitle>
                                                    <Badge
                                                        variant={rec.activo ? 'default' : 'secondary'}
                                                        className={
                                                            rec.activo
                                                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                                                : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                        }
                                                    >
                                                        {rec.activo ? 'Activo' : 'Pausado'}
                                                    </Badge>
                                                </div>
                                                {rec.presentacion && (
                                                    <div className="mt-0.5 text-xs font-semibold text-slate-500">
                                                        {rec.presentacion}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1.5">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleToggle(rec.id)}
                                                    title={rec.activo ? 'Pausar' : 'Activar'}
                                                    className="h-8 w-8 rounded-xl"
                                                >
                                                    <Power
                                                        className={`h-4 w-4 ${
                                                            rec.activo ? 'text-emerald-600' : 'text-slate-400'
                                                        }`}
                                                    />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(rec.id)}
                                                    title="Eliminar"
                                                    className="h-8 w-8 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>

                                    <CardContent className="pl-6 pr-5 pb-5 space-y-4">
                                        <div className="grid grid-cols-2 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 dark:border-slate-800 dark:bg-slate-800/40">
                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Dosis
                                                </div>
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    {rec.dosis}
                                                </div>
                                            </div>

                                            <div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                    Frecuencia
                                                </div>
                                                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                                    Cada {rec.intervalo_horas}h
                                                </div>
                                            </div>
                                        </div>

                                        {/* Horarios del día */}
                                        <div>
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 mb-1.5">
                                                <Clock className="h-3.5 w-3.5 text-emerald-500" /> Horarios de dosis diarias:
                                            </div>
                                            <div className="flex flex-wrap gap-1.5">
                                                {horasDia.map((h, i) => (
                                                    <span
                                                        key={i}
                                                        className="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-extrabold text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300"
                                                    >
                                                        {h}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Fechas de inicio/fin & canal */}
                                        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                                <span>Desde: {rec.fecha_inicio}</span>
                                                {rec.fecha_fin && <span>• Hasta: {rec.fecha_fin}</span>}
                                            </div>

                                            <div className="flex items-center gap-1">
                                                {rec.email_recordatorio ? (
                                                    <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                                                        Email activado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-[10px] bg-slate-100 text-slate-500">
                                                        Sin email
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        {rec.notas && (
                                            <div className="rounded-xl bg-amber-50/80 p-2.5 text-xs text-amber-900 border border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900/40">
                                                <strong>Instrucciones:</strong> {rec.notas}
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </main>

            {/* ══ MODAL DE ALARMA TRIGGERED EN PANTALLA ═════════════════════ */}
            {activeAlarm && (
                <Dialog open={!!activeAlarm} onOpenChange={() => setActiveAlarm(null)}>
                    <DialogContent className="sm:max-w-[450px] border-emerald-500 bg-emerald-950 text-white shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-3 text-2xl font-extrabold text-emerald-300">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 animate-bounce">
                                    <Pill className="h-7 w-7" />
                                </div>
                                ¡Hora de tomar tu medicamento!
                            </DialogTitle>
                            <DialogDescription className="text-emerald-200 text-sm">
                                Recordatorio programado para las {activeAlarm.hora}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 rounded-2xl bg-emerald-900/80 p-4 border border-emerald-700/60 space-y-2">
                            <div className="text-xl font-black text-white">
                                {activeAlarm.recordatorio.nombre_medicamento}
                            </div>
                            <div className="text-sm font-semibold text-emerald-300">
                                Dosis: {activeAlarm.recordatorio.dosis}
                            </div>
                            {activeAlarm.recordatorio.notas && (
                                <div className="text-xs text-emerald-200 italic pt-1 border-t border-emerald-800">
                                    "{activeAlarm.recordatorio.notas}"
                                </div>
                            )}
                        </div>

                        <DialogFooter className="mt-6">
                            <Button
                                onClick={() => setActiveAlarm(null)}
                                className="w-full h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-lg shadow-emerald-500/40"
                            >
                                <CheckCircle2 className="mr-2 h-5 w-5" /> Marcar como tomado / Aceptar
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}

            <Footer />
        </div>
    );
}
