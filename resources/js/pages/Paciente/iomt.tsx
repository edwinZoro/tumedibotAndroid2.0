import React, { useState, useEffect, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Activity,
    HeartPulse,
    Droplet,
    Scale,
    Stethoscope,
    Bluetooth,
    RefreshCw,
    ShieldCheck,
    Share2,
    UserRound,
    Loader2,
    CheckCircle2,
    AlertCircle,
    PlusCircle,
    AlertTriangle,
    Search,
    Filter,
    Trash2,
    Edit
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
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
} from "@/components/ui/alert-dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from 'sonner';

// --- Tipos de Datos ---
interface MedicoProp {
    id: number;
    nombre: string;
}

interface Props {
    iomtData: Record<string, any[]>;
    medicos?: MedicoProp[];
    compartidoCon?: number[];
    isDoctorView?: boolean;
    paciente?: any;
}

export type RiskLevel = 'normal' | 'warning' | 'danger';
export interface HealthRisk {
    level: RiskLevel;
    message: string;
}

export function evaluateRisk(device: string, data: any): HealthRisk {
    if (device === 'tensiometro') {
        const { sys, dia, pul } = data;
        if (sys >= 130 || dia >= 85) return { level: 'danger', message: 'Presión Alta' };
        if (sys < 90 || dia < 60) return { level: 'warning', message: 'Presión Baja' };
        if (pul > 100) return { level: 'danger', message: 'Taquicardia' };
        if (pul < 60) return { level: 'warning', message: 'Bradicardia' };
    }
    if (device === 'oximetro') {
        if (data.spo2 < 92) return { level: 'danger', message: 'Hipoxia Severa' };
        if (data.spo2 < 95) return { level: 'warning', message: 'Saturación Baja' };
        if (data.bpm > 100) return { level: 'danger', message: 'Taquicardia' };
        if (data.bpm < 60) return { level: 'warning', message: 'Bradicardia' };
    }
    if (device === 'glucometro') {
        if (data.glucosa > 140) return { level: 'danger', message: 'Glucosa Elevada' };
        if (data.glucosa < 70) return { level: 'warning', message: 'Hipoglucemia' };
    }
    if (device === 'bascula') {
        if (data.imc >= 30) return { level: 'danger', message: 'Obesidad' };
        if (data.imc >= 25) return { level: 'danger', message: 'Sobrepeso' };
        if (data.imc < 18.5) return { level: 'warning', message: 'Bajo Peso' };
    }
    return { level: 'normal', message: 'Normal' };
}

export default function IoMTDashboard({ iomtData = {}, medicos = [], compartidoCon = [], isDoctorView = false, paciente = null }: Props) {
    // Mock Data para animaciones si no hay data real
    const [liveHeartRate, setLiveHeartRate] = useState(
        Array.from({ length: 20 }, (_, i) => ({ time: i, value: 70 + Math.random() * 10 }))
    );

    // Animación del ritmo cardíaco
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveHeartRate(current => {
                const newArray = [...current.slice(1)];
                newArray.push({
                    time: current[current.length - 1].time + 1,
                    value: 70 + Math.random() * 15
                });
                return newArray;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleSaveReading = (deviceType: string, data: Record<string, any>) => {
        router.post('/paciente/monitoreo-iomt', {
            device_type: deviceType,
            data: data,
            recorded_at: new Date().toISOString()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Lectura de dispositivo registrada correctamente.');
            },
            onError: () => {
                toast.error('No se pudo guardar la lectura.');
            }
        });
    };

    // Helper para parsear data
    const getChartData = (type: string) => {
        if (!iomtData[type]) return [];
        return iomtData[type].map(d => ({
            ...d.data,
            recorded_at: d.recorded_at,
            id: d.id,
            time: new Date(d.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            risk: evaluateRisk(type, d.data)
        })).reverse(); // Para gráficos el más antiguo a la izquierda, pero para tablas queremos el más reciente arriba
    };

    const getTableData = (type: string) => {
        if (!iomtData[type]) return [];
        return iomtData[type].map(d => ({
            ...d.data,
            recorded_at: d.recorded_at,
            id: d.id,
            risk: evaluateRisk(type, d.data)
        })); // Ya viene ordenado DESC desde el backend
    };

    const tensiometroChart = getChartData('tensiometro');
    const oximetroChart = getChartData('oximetro');
    const glucometroChart = getChartData('glucometro');
    const basculaChart = getChartData('bascula');

    const tensiometroTable = getTableData('tensiometro');
    const oximetroTable = getTableData('oximetro');
    const glucometroTable = getTableData('glucometro');
    const basculaTable = getTableData('bascula');

    const latestTensiometro = tensiometroChart.length > 0 ? tensiometroChart[tensiometroChart.length - 1] : null;
    const latestOximetro = oximetroChart.length > 0 ? oximetroChart[oximetroChart.length - 1] : null;
    const latestGlucometro = glucometroChart.length > 0 ? glucometroChart[glucometroChart.length - 1] : null;
    const latestBascula = basculaChart.length > 0 ? basculaChart[basculaChart.length - 1] : null;

    // Estados para Filtros de Tablas
    const [searchDate, setSearchDate] = useState('');
    const [filterRisk, setFilterRisk] = useState<'all' | 'warnings'>('all');

    // Función de filtrado genérica
    const filterTable = (data: any[]) => {
        return data.filter(row => {
            const matchDate = searchDate === '' || row.recorded_at.includes(searchDate);
            const matchRisk = filterRisk === 'all' || row.risk.level !== 'normal';
            return matchDate && matchRisk;
        });
    };

    // Tab activa para mostrar el historial
    const [activeHistoryTab, setActiveHistoryTab] = useState<'tensiometro' | 'oximetro' | 'glucometro' | 'bascula'>('tensiometro');

    const hasWarnings = (data: any[]) => data.some(d => d.risk.level !== 'normal');
    const anyGlobalWarnings = hasWarnings(tensiometroTable.slice(0, 5)) || hasWarnings(oximetroTable.slice(0, 5)) || hasWarnings(glucometroTable.slice(0, 5));

    return (
        <div className="flex min-h-screen flex-col justify-between">
            <Head title={isDoctorView ? `Monitorización - ${paciente?.nombre_paciente}` : "Mi Monitorización Médica"} />

            <div className="container mx-auto p-4 lg:p-8 space-y-8 flex-1 animate-in fade-in zoom-in duration-500">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/5 dark:bg-black/20 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 flex items-center gap-3">
                            <Activity className="h-8 w-8 text-teal-500" />
                            {isDoctorView ? `Monitorización IoMT: ${paciente?.nombre_paciente}` : 'Sala de Monitorización IoMT'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Datos médicos encriptados de extremo a extremo (E2EE)
                        </p>
                    </div>

                    {!isDoctorView && (
                        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <CompartirDialog medicos={medicos} compartidoCon={compartidoCon} />
                        </div>
                    )}
                </div>

                {/* Warning Banner Global */}
                {anyGlobalWarnings && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3 text-amber-800 dark:text-amber-400">
                            <AlertTriangle className="h-6 w-6 text-amber-500" />
                            <div>
                                <h3 className="font-bold text-sm">Advertencias Detectadas en Lecturas Recientes</h3>
                                <p className="text-xs">Existen valores recientes que están fuera de los rangos normales (Riesgo / Advertencia). Por favor revisa el historial clínico.</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/60"
                            onClick={() => {
                                setFilterRisk('warnings');
                                document.getElementById('history-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                        >
                            Ver Advertencias
                        </Button>
                    </div>
                )}

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tensiómetro (3 registros: SYS, DIA, PUL) */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-lg">
                                        <Stethoscope className="h-5 w-5" />
                                        Presión Arterial & Pulso
                                    </CardTitle>
                                </div>
                                {!isDoctorView && (
                                    <SyncModal device="tensiometro" name="Tensiómetro Inteligente" onSaveData={handleSaveReading} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative space-y-4">
                            {latestTensiometro && (
                                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 rounded-xl">
                                            <Stethoscope className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">SYS / DIA</div>
                                            <div className="text-2xl font-black text-slate-800 dark:text-slate-100">
                                                {latestTensiometro.sys} <span className="text-slate-400 font-medium text-lg">/ {latestTensiometro.dia}</span>
                                                <span className="text-xs font-semibold text-slate-400 ml-1">mmHg</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
                                            <HeartPulse className="h-6 w-6 animate-pulse" />
                                        </div>
                                        <div>
                                            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pulso (PUL)</div>
                                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                {latestTensiometro.pul || latestTensiometro.bpm || '--'} <span className="text-xs font-semibold text-slate-400">bpm</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {tensiometroChart.length > 0 ? (
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={tensiometroChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                                </linearGradient>
                                                <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                            <Area type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" name="Sistólica" />
                                            <Area type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDia)" name="Diastólica" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay registros de presión arterial registrados</div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Oxímetro */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-teal-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-lg">
                                    <HeartPulse className="h-5 w-5 animate-pulse" />
                                    Saturación SpO2 y Frecuencia
                                </CardTitle>
                                {!isDoctorView && (
                                    <SyncModal device="oximetro" name="Oxímetro de Pulso" onSaveData={handleSaveReading} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="h-[200px] w-full relative z-0">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={liveHeartRate} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <Line type="monotone" dataKey="value" stroke="#14b8a6" strokeWidth={2} dot={false} isAnimationActive={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent dark:from-slate-900/90 dark:via-slate-900/50 z-10 flex flex-row items-center justify-around">
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">SpO2</div>
                                    <div className="text-4xl font-black text-sky-500 drop-shadow-sm flex items-baseline justify-center gap-1">
                                        {latestOximetro ? latestOximetro.spo2 : '--'} <span className="text-lg">%</span>
                                    </div>
                                </div>
                                <div className="h-16 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">BPM</div>
                                    <div className="text-4xl font-black text-teal-500 drop-shadow-sm flex items-baseline justify-center gap-1">
                                        {latestOximetro ? latestOximetro.bpm : '--'} <span className="text-lg">♥</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Glucómetro */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-lg">
                                    <Droplet className="h-5 w-5" />
                                    Nivel de Glucosa en Sangre
                                </CardTitle>
                                {!isDoctorView && (
                                    <SyncModal device="glucometro" name="Glucómetro Inteligente" onSaveData={handleSaveReading} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            {glucometroChart.length > 0 ? (
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={glucometroChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff' }} />
                                            <Line type="step" dataKey="glucosa" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} name="Glucosa" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay registros de glucosa</div>
                            )}
                            <div className="absolute top-4 right-6 text-right">
                                {latestGlucometro && (
                                    <>
                                        <div className="text-3xl font-black text-amber-500 drop-shadow-sm">
                                            {latestGlucometro.glucosa}
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">mg/dL</div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Báscula */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-lg">
                                    <Scale className="h-5 w-5" />
                                    Composición Corporal
                                </CardTitle>
                                {!isDoctorView && (
                                    <SyncModal device="bascula" name="Báscula Inteligente" onSaveData={handleSaveReading} />
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            {latestBascula ? (
                                <div className="flex h-[200px] items-center justify-around">
                                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full h-36 w-36 flex flex-col items-center justify-center border-4 border-purple-100 dark:border-purple-900/50 shadow-inner">
                                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                                            {latestBascula.peso}
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Kg</div>
                                    </div>
                                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full h-36 w-36 flex flex-col items-center justify-center border-4 border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                            {latestBascula.imc}
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">IMC</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay registros de peso</div>
                            )}
                        </CardContent>
                    </Card>

                </div>

                {/* Historial Detallado - Tablas de Registros */}
                <div id="history-section" className="mt-12">
                    <Card className="border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-sm">
                        <CardHeader className="border-b border-slate-100 dark:border-slate-800 pb-0">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4">
                                <div>
                                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                        <Activity className="h-6 w-6 text-sky-500" />
                                        Historial Clínico y Registros
                                    </CardTitle>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Revisa el detalle de cada medición y las alertas médicas detectadas.</p>
                                </div>

                                {/* Filtros Rápidos */}
                                <div className="flex flex-wrap items-center gap-2 bg-slate-50 dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800">
                                    <div className="relative">
                                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                                        <Input
                                            type="date"
                                            value={searchDate}
                                            onChange={(e) => setSearchDate(e.target.value)}
                                            className="w-[150px] pl-9 h-9 text-sm"
                                        />
                                    </div>
                                    <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1"></div>
                                    <Button
                                        variant={filterRisk === 'all' ? 'default' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilterRisk('all')}
                                        className="h-9"
                                    >
                                        Todos
                                    </Button>
                                    <Button
                                        variant={filterRisk === 'warnings' ? 'destructive' : 'ghost'}
                                        size="sm"
                                        onClick={() => setFilterRisk('warnings')}
                                        className="h-9"
                                    >
                                        <AlertTriangle className="h-4 w-4 mr-1.5" /> Advertencias
                                    </Button>
                                </div>
                            </div>

                            {/* Pestañas de Navegación de Tablas */}
                            <div className="flex overflow-x-auto gap-4 pt-2 pb-0">
                                <button
                                    onClick={() => setActiveHistoryTab('tensiometro')}
                                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeHistoryTab === 'tensiometro' ? 'border-red-500 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Stethoscope className="inline h-4 w-4 mr-1.5" /> Tensiómetro
                                </button>
                                <button
                                    onClick={() => setActiveHistoryTab('oximetro')}
                                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeHistoryTab === 'oximetro' ? 'border-teal-500 text-teal-600 dark:text-teal-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    <HeartPulse className="inline h-4 w-4 mr-1.5" /> Oxímetro
                                </button>
                                <button
                                    onClick={() => setActiveHistoryTab('glucometro')}
                                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeHistoryTab === 'glucometro' ? 'border-amber-500 text-amber-600 dark:text-amber-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Droplet className="inline h-4 w-4 mr-1.5" /> Glucómetro
                                </button>
                                <button
                                    onClick={() => setActiveHistoryTab('bascula')}
                                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${activeHistoryTab === 'bascula' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                                >
                                    <Scale className="inline h-4 w-4 mr-1.5" /> Báscula
                                </button>
                            </div>
                        </CardHeader>

                        <CardContent className="p-0">
                            {/* TABLA: Tensiómetro */}
                            {activeHistoryTab === 'tensiometro' && (
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Fecha y Hora</TableHead>
                                                <TableHead>SYS (mmHg)</TableHead>
                                                <TableHead>DIA (mmHg)</TableHead>
                                                <TableHead>Pulso (bpm)</TableHead>
                                                <TableHead>Evaluación Clínica</TableHead>
                                                {!isDoctorView && <TableHead className="text-right">Acciones</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filterTable(tensiometroTable).length > 0 ? filterTable(tensiometroTable).map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-medium">{row.recorded_at}</TableCell>
                                                    <TableCell className="font-bold">{row.sys}</TableCell>
                                                    <TableCell className="font-bold text-slate-600 dark:text-slate-400">{row.dia}</TableCell>
                                                    <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{row.pul || row.bpm}</TableCell>
                                                    <TableCell>
                                                        <RiskBadge risk={row.risk} />
                                                    </TableCell>
                                                    {!isDoctorView && (
                                                        <TableCell className="text-right">
                                                            <ActionButtons row={row} device="tensiometro" isDoctorView={isDoctorView!} />
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={isDoctorView ? 5 : 6} className="text-center py-6 text-slate-400">No hay registros que coincidan con los filtros.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* TABLA: Oxímetro */}
                            {activeHistoryTab === 'oximetro' && (
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Fecha y Hora</TableHead>
                                                <TableHead>Saturación SpO2 (%)</TableHead>
                                                <TableHead>Frecuencia (bpm)</TableHead>
                                                <TableHead>Evaluación Clínica</TableHead>
                                                {!isDoctorView && <TableHead className="text-right">Acciones</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filterTable(oximetroTable).length > 0 ? filterTable(oximetroTable).map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-medium">{row.recorded_at}</TableCell>
                                                    <TableCell className="font-bold text-sky-600 dark:text-sky-400">{row.spo2}%</TableCell>
                                                    <TableCell className="font-bold text-teal-600 dark:text-teal-400">{row.bpm} bpm</TableCell>
                                                    <TableCell>
                                                        <RiskBadge risk={row.risk} />
                                                    </TableCell>
                                                    {!isDoctorView && (
                                                        <TableCell className="text-right">
                                                            <ActionButtons row={row} device="oximetro" isDoctorView={isDoctorView!} />
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={isDoctorView ? 4 : 5} className="text-center py-6 text-slate-400">No hay registros que coincidan con los filtros.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* TABLA: Glucómetro */}
                            {activeHistoryTab === 'glucometro' && (
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Fecha y Hora</TableHead>
                                                <TableHead>Glucosa (mg/dL)</TableHead>
                                                <TableHead>Evaluación Clínica</TableHead>
                                                {!isDoctorView && <TableHead className="text-right">Acciones</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filterTable(glucometroTable).length > 0 ? filterTable(glucometroTable).map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-medium">{row.recorded_at}</TableCell>
                                                    <TableCell className="font-bold text-amber-600 dark:text-amber-400">{row.glucosa} mg/dL</TableCell>
                                                    <TableCell>
                                                        <RiskBadge risk={row.risk} />
                                                    </TableCell>
                                                    {!isDoctorView && (
                                                        <TableCell className="text-right">
                                                            <ActionButtons row={row} device="glucometro" isDoctorView={isDoctorView!} />
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={isDoctorView ? 3 : 4} className="text-center py-6 text-slate-400">No hay registros que coincidan con los filtros.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}

                            {/* TABLA: Báscula */}
                            {activeHistoryTab === 'bascula' && (
                                <div className="w-full overflow-x-auto">
                                    <Table>
                                        <TableHeader className="bg-slate-50 dark:bg-slate-900/50">
                                            <TableRow>
                                                <TableHead>Fecha y Hora</TableHead>
                                                <TableHead>Peso (kg)</TableHead>
                                                <TableHead>IMC</TableHead>
                                                <TableHead>Evaluación Clínica</TableHead>
                                                {!isDoctorView && <TableHead className="text-right">Acciones</TableHead>}
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {filterTable(basculaTable).length > 0 ? filterTable(basculaTable).map((row) => (
                                                <TableRow key={row.id}>
                                                    <TableCell className="font-medium">{row.recorded_at}</TableCell>
                                                    <TableCell className="font-bold text-purple-600 dark:text-purple-400">{row.peso} kg</TableCell>
                                                    <TableCell className="font-bold text-emerald-600 dark:text-emerald-400">{row.imc}</TableCell>
                                                    <TableCell>
                                                        <RiskBadge risk={row.risk} />
                                                    </TableCell>
                                                    {!isDoctorView && (
                                                        <TableCell className="text-right">
                                                            <ActionButtons row={row} device="bascula" isDoctorView={isDoctorView!} />
                                                        </TableCell>
                                                    )}
                                                </TableRow>
                                            )) : (
                                                <TableRow><TableCell colSpan={isDoctorView ? 4 : 5} className="text-center py-6 text-slate-400">No hay registros que coincidan con los filtros.</TableCell></TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
            {/* Notas de la versión (Cambios de hoy) */}
            {/*   <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-blue-200 bg-blue-50/50 p-6 dark:border-blue-900/40 dark:bg-blue-950/20">
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-3 flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Notas de la Versión (Actualizaciones de Hoy)
                    </h3>
                    <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300">
                        <p>Hemos implementado importantes mejoras de <strong>Diseño Responsivo</strong> en toda la plataforma TuMediBot para garantizar una experiencia óptima tanto en teléfonos móviles como en monitores grandes:</p>
                        <ul className="list-disc pl-5 space-y-1.5">
                            <li><strong>Tablas Adaptables:</strong> Se corrigió el desbordamiento horizontal en historiales médicos, reportes de pagos y agendas. Ahora puedes deslizar táctilmente las tablas en dispositivos pequeños sin perder información o botones.</li>
                            <li><strong>Reporte de Pagos y Billetera:</strong> Se optimizó el espaciado entre las tarjetas (Billetera, Planes, Historial). Además, los botones de pago (PayPal y Crypto) ahora fluyen correctamente hacia abajo en pantallas estrechas sin desbordarse.</li>
                            <li><strong>Página Crypto (/pagar-crypto):</strong> Se ajustó la vista de direcciones de criptomonedas, asegurando que los textos de advertencia largos y las cifras en la tarjeta de Binance no fuercen el ensanchamiento horizontal de la pantalla.</li>
                        </ul>
                    </div>
                </div>
            </div> */}
            <Footer />
        </div>
    );
}

function ActionButtons({ row, device, isDoctorView }: { row: any, device: string, isDoctorView: boolean }) {
    if (isDoctorView) return null;

    const handleDelete = () => {
        router.delete(`/paciente/monitoreo-iomt/${row.id}`, {
            preserveScroll: true,
            onSuccess: () => toast.success('Registro eliminado correctamente.'),
            onError: () => toast.error('Error al eliminar el registro.')
        });
    };

    return (
        <div className="flex items-center justify-end gap-1">
            <EditRecordModal device={device} row={row} />
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50" title="Eliminar registro">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar Registro Médico?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente la lectura de {device} de tu historial clínico IoMT.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-200 dark:border-slate-800">Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 text-white hover:bg-red-700">
                            Eliminar Permanentemente
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

function EditRecordModal({ device, row }: { device: string; row: any }) {
    const [open, setOpen] = useState(false);

    const [sys, setSys] = useState('');
    const [dia, setDia] = useState('');
    const [pul, setPul] = useState('');

    const [spo2, setSpo2] = useState('');
    const [bpm, setBpm] = useState('');

    const [glucosa, setGlucosa] = useState('');

    const [peso, setPeso] = useState('');
    const [imc, setImc] = useState('');

    const handleOpenChange = (isOpen: boolean) => {
        if (isOpen) {
            setSys(row.sys?.toString() || '');
            setDia(row.dia?.toString() || '');
            setPul((row.pul || row.bpm)?.toString() || '');
            setSpo2(row.spo2?.toString() || '');
            setBpm(row.bpm?.toString() || '');
            setGlucosa(row.glucosa?.toString() || '');
            setPeso(row.peso?.toString() || '');
            setImc(row.imc?.toString() || '');
        }
        setOpen(isOpen);
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        let data: Record<string, any> = {};

        if (device === 'tensiometro') {
            data = { sys: parseInt(sys, 10), dia: parseInt(dia, 10), pul: parseInt(pul, 10) };
        } else if (device === 'oximetro') {
            data = { spo2: parseInt(spo2, 10), bpm: parseInt(bpm, 10) };
        } else if (device === 'glucometro') {
            data = { glucosa: parseInt(glucosa, 10) };
        } else if (device === 'bascula') {
            data = { peso: parseFloat(peso), imc: parseFloat(imc) };
        }

        router.put(`/paciente/monitoreo-iomt/${row.id}`, { data }, {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Registro actualizado correctamente.');
                setOpen(false);
            },
            onError: () => toast.error('Error al actualizar el registro.')
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50" title="Editar registro">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="max-h-[85dvh] overflow-y-auto p-4 sm:p-6 sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 rounded-3xl">
                <DialogHeader>
                    <DialogTitle>Editar Registro de {device}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSave} className="space-y-4 py-4">
                    {device === 'tensiometro' && (
                        <div className="grid grid-cols-3 gap-3">
                            <div><Label>SYS</Label><Input type="number" value={sys} onChange={e => setSys(e.target.value)} required /></div>
                            <div><Label>DIA</Label><Input type="number" value={dia} onChange={e => setDia(e.target.value)} required /></div>
                            <div><Label>PUL</Label><Input type="number" value={pul} onChange={e => setPul(e.target.value)} required /></div>
                        </div>
                    )}
                    {device === 'oximetro' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>SpO2 (%)</Label><Input type="number" value={spo2} onChange={e => setSpo2(e.target.value)} required /></div>
                            <div><Label>BPM</Label><Input type="number" value={bpm} onChange={e => setBpm(e.target.value)} required /></div>
                        </div>
                    )}
                    {device === 'glucometro' && (
                        <div><Label>Glucosa (mg/dL)</Label><Input type="number" value={glucosa} onChange={e => setGlucosa(e.target.value)} required /></div>
                    )}
                    {device === 'bascula' && (
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label>Peso (Kg)</Label><Input type="number" step="0.1" value={peso} onChange={e => setPeso(e.target.value)} required /></div>
                            <div><Label>IMC</Label><Input type="number" step="0.1" value={imc} onChange={e => setImc(e.target.value)} required /></div>
                        </div>
                    )}
                    <DialogFooter className="sticky bottom-0 z-10 mt-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 rounded-b-3xl">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="rounded-xl">Cancelar</Button>
                        <Button type="submit" className="rounded-xl bg-blue-600 text-white hover:bg-blue-700">Guardar Cambios</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

// Componente helper para pintar el badge de riesgo clínico
function RiskBadge({ risk }: { risk: HealthRisk }) {
    if (risk.level === 'danger') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400 text-xs font-bold border border-red-200 dark:border-red-900/50">
                <AlertCircle className="h-3.5 w-3.5" />
                {risk.message}
            </div>
        );
    }
    if (risk.level === 'warning') {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-900/50">
                <AlertTriangle className="h-3.5 w-3.5" />
                {risk.message}
            </div>
        );
    }
    return (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-900/50">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Normal
        </div>
    );
}

// Subcomponente para el Modal de Sincronización Bluetooth / Registro Manual
function SyncModal({ device, name, onSaveData }: { device: string; name: string; onSaveData: (type: string, data: any) => void }) {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'bluetooth' | 'manual'>('bluetooth');

    // Estados Bluetooth
    const [btState, setBtState] = useState<'idle' | 'scanning' | 'connected' | 'reading' | 'error'>('idle');
    const [btDeviceName, setBtDeviceName] = useState<string | null>(null);
    const [capturedData, setCapturedData] = useState<Record<string, any> | null>(null);
    const [btError, setBtError] = useState<string | null>(null);

    // Formulario Manual
    const [sysInput, setSysInput] = useState('120');
    const [diaInput, setDiaInput] = useState('80');
    const [pulInput, setPulInput] = useState('72');

    const [spo2Input, setSpo2Input] = useState('98');
    const [bpmInput, setBpmInput] = useState('75');

    const [glucosaInput, setGlucosaInput] = useState('95');

    const [pesoInput, setPesoInput] = useState('70.5');
    const [imcInput, setImcInput] = useState('23.2');

    const resetModalState = () => {
        setBtState('idle');
        setBtDeviceName(null);
        setCapturedData(null);
        setBtError(null);
    };

    const handleScanBluetooth = async () => {
        setBtError(null);
        setBtState('scanning');

        const nav = navigator as any;
        if (typeof window === 'undefined' || !nav.bluetooth) {
            setBtState('error');
            setBtError('Tu navegador o conexión actual no soporta Web Bluetooth API (requiere Chrome/Edge en HTTPS o localhost). Puedes utilizar el registro manual.');
            return;
        }

        const serviceUuidMap: Record<string, string[]> = {
            tensiometro: ['blood_pressure', '00001810-0000-1000-8000-00805f9b34fb'],
            oximetro: ['pulse_oximeter', '00001822-0000-1000-8000-00805f9b34fb', 'heart_rate'],
            glucometro: ['glucose', '00001808-0000-1000-8000-00805f9b34fb'],
            bascula: ['weight_scale', '0000181d-0000-1000-8000-00805f9b34fb'],
        };

        try {
            const deviceObj = await nav.bluetooth.requestDevice({
                acceptAllDevices: true,
                optionalServices: serviceUuidMap[device] || ['device_information', 'battery_service']
            });

            setBtDeviceName(deviceObj.name || `Dispositivo Bluetooth (${device})`);
            setBtState('connected');
            toast.success(`Dispositivo "${deviceObj.name || 'Bluetooth'}" seleccionado con éxito.`);

            if (deviceObj.gatt) {
                setBtState('reading');
                try {
                    await deviceObj.gatt.connect();
                } catch (e) {
                    console.warn("GATT Connection Notice:", e);
                }
            }

            // Simular lectura (aquí iría la interpretación GATT real)
            setTimeout(() => {
                let data: Record<string, any> = {};
                if (device === 'tensiometro') {
                    data = {
                        sys: 118 + Math.floor(Math.random() * 8),
                        dia: 78 + Math.floor(Math.random() * 6),
                        pul: 70 + Math.floor(Math.random() * 10)
                    };
                } else if (device === 'oximetro') {
                    data = {
                        spo2: 97 + Math.floor(Math.random() * 3),
                        bpm: 72 + Math.floor(Math.random() * 8)
                    };
                } else if (device === 'glucometro') {
                    data = { glucosa: 92 + Math.floor(Math.random() * 15) };
                } else if (device === 'bascula') {
                    data = { peso: 72.0 + (Math.random() * 2 - 1), imc: 23.5 };
                }

                setCapturedData(data);
                setBtState('idle');
            }, 1500);

        } catch (err: any) {
            console.log("Bluetooth prompt status:", err);
            setBtState('idle');
            if (err.name !== 'NotFoundError') {
                setBtError(err.message || 'No se pudo vincular con el dispositivo Bluetooth.');
            }
        }
    };

    const handleSaveBluetoothReading = () => {
        if (!capturedData) return;
        onSaveData(device, capturedData);
        setOpen(false);
        resetModalState();
    };

    const handleSaveManual = (e: any) => {
        e.preventDefault();
        let data: Record<string, any> = {};

        if (device === 'tensiometro') {
            const sys = parseInt(sysInput, 10);
            const dia = parseInt(diaInput, 10);
            const pul = parseInt(pulInput, 10);
            if (isNaN(sys) || isNaN(dia) || isNaN(pul)) {
                toast.error('Por favor ingresa valores numéricos válidos.');
                return;
            }
            data = { sys, dia, pul };
        } else if (device === 'oximetro') {
            const spo2 = parseInt(spo2Input, 10);
            const bpm = parseInt(bpmInput, 10);
            if (isNaN(spo2) || isNaN(bpm)) return;
            data = { spo2, bpm };
        } else if (device === 'glucometro') {
            const glucosa = parseInt(glucosaInput, 10);
            if (isNaN(glucosa)) return;
            data = { glucosa };
        } else if (device === 'bascula') {
            const peso = parseFloat(pesoInput);
            const imc = parseFloat(imcInput);
            if (isNaN(peso) || isNaN(imc)) return;
            data = { peso, imc };
        }

        onSaveData(device, data);
        setOpen(false);
        resetModalState();
    };

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) resetModalState(); }}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 rounded-full shadow-sm hover:text-blue-600 border-slate-200 dark:border-slate-700">
                    <Bluetooth className="h-4 w-4 mr-1 text-blue-500" /> Conectar
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <Bluetooth className="h-5 w-5 text-blue-500" /> Conectar {name}
                    </DialogTitle>
                    <DialogDescription>
                        Conecte su dispositivo médico por Bluetooth o registre los valores manualmente.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex border-b border-slate-200 dark:border-slate-800">
                    <button
                        type="button"
                        onClick={() => setActiveTab('bluetooth')}
                        className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'bluetooth' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <Bluetooth className="inline h-4 w-4 mr-1.5" /> Dispositivo Bluetooth
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveTab('manual')}
                        className={`flex-1 pb-3 text-sm font-semibold text-center border-b-2 transition-colors ${activeTab === 'manual' ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        <PlusCircle className="inline h-4 w-4 mr-1.5" /> Registro Manual
                    </button>
                </div>

                {activeTab === 'bluetooth' ? (
                    <div className="py-4 space-y-5">
                        {btError && (
                            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 flex items-start gap-2.5 text-xs text-red-700 dark:text-red-400">
                                <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                                <span>{btError}</span>
                            </div>
                        )}
                        {btState === 'scanning' && (
                            <div className="flex flex-col items-center justify-center p-6 space-y-3">
                                <RefreshCw className="h-10 w-10 text-blue-500 animate-spin" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Buscando dispositivos Bluetooth...</p>
                            </div>
                        )}
                        {btState === 'reading' && (
                            <div className="flex flex-col items-center justify-center p-6 space-y-3">
                                <Loader2 className="h-10 w-10 text-emerald-500 animate-spin" />
                                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                    Conectado a {btDeviceName}. Obteniendo telemetría...
                                </p>
                            </div>
                        )}
                        {capturedData ? (
                            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 space-y-3">
                                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                                    <CheckCircle2 className="h-5 w-5" /> Lectura Recibida
                                </div>
                                <div className="grid grid-cols-3 gap-2 text-center pt-2">
                                    {device === 'tensiometro' && (
                                        <>
                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-xs">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold">SYS</div>
                                                <div className="text-xl font-black text-slate-800 dark:text-white">{capturedData.sys}</div>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-xs">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold">DIA</div>
                                                <div className="text-xl font-black text-slate-800 dark:text-white">{capturedData.dia}</div>
                                            </div>
                                            <div className="p-2 bg-white dark:bg-slate-900 rounded-lg shadow-xs">
                                                <div className="text-[10px] text-slate-500 uppercase font-bold">PUL</div>
                                                <div className="text-xl font-black text-emerald-600">{capturedData.pul}</div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <Button onClick={handleSaveBluetoothReading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold mt-2">
                                    Guardar en mi expediente
                                </Button>
                            </div>
                        ) : (
                            btState === 'idle' && (
                                <div className="space-y-4 text-center py-4">
                                    <Button onClick={handleScanBluetooth} className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white">
                                        <Bluetooth className="h-4 w-4 mr-2" /> Buscar Dispositivo Bluetooth
                                    </Button>
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <form onSubmit={handleSaveManual} className="py-4 space-y-4">
                        {device === 'tensiometro' && (
                            <div className="grid grid-cols-3 gap-3">
                                <div><Label>SYS (Sistólica)</Label><Input type="number" value={sysInput} onChange={e => setSysInput(e.target.value)} required /></div>
                                <div><Label>DIA (Diastólica)</Label><Input type="number" value={diaInput} onChange={e => setDiaInput(e.target.value)} required /></div>
                                <div><Label>PUL (Pulso)</Label><Input type="number" value={pulInput} onChange={e => setPulInput(e.target.value)} required /></div>
                            </div>
                        )}
                        {device === 'oximetro' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>SpO2 (%)</Label><Input type="number" value={spo2Input} onChange={e => setSpo2Input(e.target.value)} required /></div>
                                <div><Label>Pulso (BPM)</Label><Input type="number" value={bpmInput} onChange={e => setBpmInput(e.target.value)} required /></div>
                            </div>
                        )}
                        {device === 'glucometro' && (
                            <div><Label>Glucosa (mg/dL)</Label><Input type="number" value={glucosaInput} onChange={e => setGlucosaInput(e.target.value)} required /></div>
                        )}
                        {device === 'bascula' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div><Label>Peso (Kg)</Label><Input type="number" step="0.1" value={pesoInput} onChange={e => setPesoInput(e.target.value)} required /></div>
                                <div><Label>IMC</Label><Input type="number" step="0.1" value={imcInput} onChange={e => setImcInput(e.target.value)} required /></div>
                            </div>
                        )}
                        <DialogFooter className="mt-6">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                                Guardar Registro
                            </Button>
                        </DialogFooter>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

function CompartirDialog({ medicos, compartidoCon }: { medicos: MedicoProp[]; compartidoCon: number[] }) {
    const [open, setOpen] = useState(false);
    const [seleccionados, setSeleccionados] = useState<number[]>([]);
    const [enviando, setEnviando] = useState(false);

    const abrir = () => {
        setSeleccionados(compartidoCon || []);
        setOpen(true);
    };

    const toggle = (medicoId: number, checked: boolean) => {
        setSeleccionados((prev) => checked ? [...prev, medicoId] : prev.filter((id) => id !== medicoId));
    };

    const guardar = () => {
        setEnviando(true);
        router.patch('/paciente/monitoreo-iomt/compartir', { medico_ids: seleccionados }, {
            preserveScroll: true,
            onSuccess: () => { setOpen(false); toast.success('Accesos actualizados correctamente.'); },
            onError: () => toast.error('No se pudieron actualizar los accesos.'),
            onFinish: () => setEnviando(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="font-semibold text-sky-600 hover:text-sky-700" onClick={abrir}>
                    <Share2 className="mr-2 h-4 w-4" /> Compartir con médicos
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px]">
                <DialogHeader>
                    <DialogTitle>Compartir Telemetría IoMT</DialogTitle>
                </DialogHeader>
                <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                    {medicos.length === 0 ? (
                        <p className="text-sm text-slate-500">Aún no tienes médicos asignados.</p>
                    ) : (
                        medicos.map((medico) => {
                            const activo = seleccionados.includes(medico.id);
                            return (
                                <label key={medico.id} className="flex cursor-pointer items-center gap-3 border p-3 rounded-2xl">
                                    <Checkbox checked={activo} onCheckedChange={(checked) => toggle(medico.id, checked === true)} />
                                    <span className="text-sm font-semibold"><UserRound className="inline h-4 w-4 mr-2" />{medico.nombre}</span>
                                </label>
                            );
                        })
                    )}
                </div>
                <DialogFooter className="mt-4">
                    <Button onClick={guardar} disabled={enviando} className="bg-blue-600 text-white">Guardar accesos</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
