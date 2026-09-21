import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Activity,
    HeartPulse,
    Droplet,
    Scale,
    Stethoscope,
    Wifi,
    Bluetooth,
    RefreshCw,
    ShieldCheck,
    Share2,
    UserRound,
    Loader2
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
import { Label } from '@/components/ui/label';
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

export default function IoMTDashboard({ iomtData = {}, medicos = [], compartidoCon = [], isDoctorView = false, paciente = null }: Props) {
    const [isSyncing, setIsSyncing] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
    const [syncProgress, setSyncProgress] = useState(0);

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
                    value: 70 + Math.random() * 15 // Variación entre 70 y 85
                });
                return newArray;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Sincronización simulada
    const handleSync = (device: string) => {
        setSelectedDevice(device);
        setIsSyncing(true);
        setSyncProgress(0);

        const interval = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    completeSync(device);
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    const completeSync = (device: string) => {
        setIsSyncing(false);
        // Aquí generaríamos un dato aleatorio para simular el dispositivo
        let data = {};
        if (device === 'tensiometro') data = { sys: 120 + Math.floor(Math.random() * 10), dia: 80 + Math.floor(Math.random() * 5) };
        if (device === 'oximetro') data = { spo2: 98 + Math.floor(Math.random() * 2), bpm: 75 + Math.floor(Math.random() * 10) };
        if (device === 'glucometro') data = { glucosa: 95 + Math.floor(Math.random() * 20) };
        if (device === 'bascula') data = { peso: 75.5 + (Math.random() * 2 - 1), imc: 24.5 };

        router.post('/paciente/monitoreo-iomt', {
            device_type: device,
            data: data,
            recorded_at: new Date().toISOString()
        }, {
            preserveScroll: true,
            onSuccess: () => setSelectedDevice(null)
        });
    };

    // Helper para parsear data si es string (json) o si ya es objeto
    const getChartData = (type: string) => {
        if (!iomtData[type]) return [];
        return iomtData[type].map(d => ({
            ...d.data,
            time: new Date(d.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })).reverse(); // Para que el más antiguo esté a la izquierda
    };

    const oximetroData = getChartData('oximetro');
    const tensiometroData = getChartData('tensiometro');
    const glucometroData = getChartData('glucometro');

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
                            Datos encriptados de extremo a extremo
                        </p>
                    </div>

                    {!isDoctorView && (
                        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <CompartirDialog medicos={medicos} compartidoCon={compartidoCon} />
                        </div>
                    )}
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    
                    {/* Tensiómetro */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-red-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400 text-lg">
                                    <Stethoscope className="h-5 w-5" />
                                    Presión Arterial
                                </CardTitle>
                                {!isDoctorView && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 rounded-full shadow-sm hover:text-red-500 border-slate-200 dark:border-slate-700">
                                                <Bluetooth className="h-4 w-4 mr-1" /> Conectar
                                            </Button>
                                        </DialogTrigger>
                                        <SyncModal device="tensiometro" name="Tensiómetro Inteligente" isSyncing={isSyncing} syncProgress={syncProgress} onSync={handleSync} />
                                    </Dialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            {tensiometroData.length > 0 ? (
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={tensiometroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                                                </linearGradient>
                                                <linearGradient id="colorDia" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                            <Area type="monotone" dataKey="sys" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" name="Sistólica" />
                                            <Area type="monotone" dataKey="dia" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorDia)" name="Diastólica" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay datos registrados</div>
                            )}
                            <div className="absolute top-4 right-6 text-right">
                                {tensiometroData.length > 0 && (
                                    <>
                                        <div className="text-3xl font-black text-slate-800 dark:text-slate-100 drop-shadow-sm">
                                            {tensiometroData[tensiometroData.length - 1].sys} <span className="text-xl text-slate-400 font-medium">/ {tensiometroData[tensiometroData.length - 1].dia}</span>
                                        </div>
                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">mmHg</div>
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Oxímetro */}
                    <Card className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-lg dark:shadow-none bg-white dark:bg-slate-900/60 backdrop-blur-xl group">
                        <CardHeader className="bg-gradient-to-r from-teal-500/10 to-transparent pb-4 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="flex justify-between items-center">
                                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-teal-400 text-lg">
                                    <HeartPulse className="h-5 w-5 animate-pulse" />
                                    Ritmo y Oxígeno
                                </CardTitle>
                                {!isDoctorView && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 rounded-full shadow-sm hover:text-teal-500 border-slate-200 dark:border-slate-700">
                                                <Wifi className="h-4 w-4 mr-1" /> Conectar
                                            </Button>
                                        </DialogTrigger>
                                        <SyncModal device="oximetro" name="Oxímetro de Pulso" isSyncing={isSyncing} syncProgress={syncProgress} onSync={handleSync} />
                                    </Dialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            <div className="h-[200px] w-full relative z-0">
                                {/* Gráfico en vivo simulado de fondo para el ritmo */}
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
                                        {oximetroData.length > 0 ? oximetroData[oximetroData.length - 1].spo2 : '--'} <span className="text-lg">%</span>
                                    </div>
                                </div>
                                <div className="h-16 w-px bg-slate-200 dark:bg-slate-700 mx-4"></div>
                                <div className="text-center">
                                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">BPM</div>
                                    <div className="text-4xl font-black text-teal-500 drop-shadow-sm flex items-baseline justify-center gap-1">
                                        {oximetroData.length > 0 ? oximetroData[oximetroData.length - 1].bpm : '--'} <span className="text-lg">♥</span>
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
                                    Nivel de Glucosa
                                </CardTitle>
                                {!isDoctorView && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 rounded-full shadow-sm hover:text-amber-500 border-slate-200 dark:border-slate-700">
                                                <Bluetooth className="h-4 w-4 mr-1" /> Conectar
                                            </Button>
                                        </DialogTrigger>
                                        <SyncModal device="glucometro" name="Glucómetro Inteligente" isSyncing={isSyncing} syncProgress={syncProgress} onSync={handleSync} />
                                    </Dialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            {glucometroData.length > 0 ? (
                                <div className="h-[200px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={glucometroData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#64748b'}} />
                                            <Tooltip contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff'}} />
                                            <Line type="step" dataKey="glucosa" stroke="#f59e0b" strokeWidth={3} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{r: 6}} name="Glucosa" />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay datos registrados</div>
                            )}
                             <div className="absolute top-4 right-6 text-right">
                                {glucometroData.length > 0 && (
                                    <>
                                        <div className="text-3xl font-black text-amber-500 drop-shadow-sm">
                                            {glucometroData[glucometroData.length - 1].glucosa}
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
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" size="sm" className="h-8 rounded-full shadow-sm hover:text-purple-500 border-slate-200 dark:border-slate-700">
                                                <Bluetooth className="h-4 w-4 mr-1" /> Conectar
                                            </Button>
                                        </DialogTrigger>
                                        <SyncModal device="bascula" name="Báscula Inteligente" isSyncing={isSyncing} syncProgress={syncProgress} onSync={handleSync} />
                                    </Dialog>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent className="pt-6 relative">
                            {iomtData['bascula'] && iomtData['bascula'].length > 0 ? (
                                <div className="flex h-[200px] items-center justify-around">
                                     <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full h-36 w-36 flex flex-col items-center justify-center border-4 border-purple-100 dark:border-purple-900/50 shadow-inner">
                                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400">
                                            {iomtData['bascula'][0].data.peso}
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Kg</div>
                                    </div>
                                    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-full h-36 w-36 flex flex-col items-center justify-center border-4 border-emerald-100 dark:border-emerald-900/50 shadow-inner">
                                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                            {iomtData['bascula'][0].data.imc}
                                        </div>
                                        <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">IMC</div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-[200px] flex items-center justify-center text-slate-400 text-sm">No hay datos registrados</div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
            <Footer />
        </div>
    );
}

// Subcomponente para el Modal de Sincronización
function SyncModal({ device, name, isSyncing, syncProgress, onSync }: any) {
    return (
        <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl">
                    <Bluetooth className="h-5 w-5 text-blue-500" />
                    Emparejar Dispositivo
                </DialogTitle>
                <DialogDescription>
                    Encienda su <b>{name}</b> y asegúrese de que el Bluetooth o WiFi esté activado para sincronizar los datos cifrados.
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center justify-center p-8 space-y-6">
                
                {isSyncing ? (
                    <>
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping"></div>
                            <div className="absolute inset-2 rounded-full border-4 border-blue-500/50 animate-ping" style={{ animationDelay: '0.2s' }}></div>
                            <div className="relative bg-gradient-to-tr from-blue-600 to-sky-400 rounded-full p-6 shadow-xl shadow-blue-500/20">
                                <RefreshCw className="h-10 w-10 text-white animate-spin" />
                            </div>
                        </div>
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs font-semibold text-slate-500">
                                <span>Sincronizando datos médicos (E2EE)...</span>
                                <span>{syncProgress}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 transition-all duration-300 ease-out" style={{ width: `${syncProgress}%` }}></div>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="bg-slate-100 dark:bg-slate-900 rounded-full p-8">
                            <Bluetooth className="h-12 w-12 text-slate-400 dark:text-slate-600" />
                        </div>
                        <Button 
                            onClick={() => onSync(device)} 
                            className="w-full h-12 text-md rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white shadow-lg shadow-blue-500/25"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Iniciar Sincronización
                        </Button>
                    </>
                )}
            </div>
        </DialogContent>
    );
}

function CompartirDialog({ medicos, compartidoCon }: { medicos: MedicoProp[], compartidoCon: number[] }) {
    const [open, setOpen] = useState(false);
    const [seleccionados, setSeleccionados] = useState<number[]>([]);
    const [enviando, setEnviando] = useState(false);

    const abrir = () => {
        setSeleccionados(compartidoCon || []);
        setOpen(true);
    };

    const toggle = (medicoId: number, checked: boolean) => {
        setSeleccionados((prev) =>
            checked ? [...prev, medicoId] : prev.filter((id) => id !== medicoId)
        );
    };

    const guardar = () => {
        setEnviando(true);
        router.patch('/paciente/monitoreo-iomt/compartir', { medico_ids: seleccionados }, {
            preserveScroll: true,
            onSuccess: () => {
                setOpen(false);
                toast.success('Accesos actualizados correctamente.');
            },
            onError: () => toast.error('No se pudieron actualizar los accesos.'),
            onFinish: () => setEnviando(false)
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400" onClick={abrir}>
                    <Share2 className="mr-2 h-4 w-4" />
                    Compartir con médicos
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[440px] bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-sky-500" />
                        Compartir Telemetría IoMT
                    </DialogTitle>
                    <DialogDescription>
                        Selecciona a qué médicos les das permiso para visualizar tu sala de monitoreo en tiempo real.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-2 max-h-72 space-y-2 overflow-y-auto pr-1">
                    {medicos.length === 0 ? (
                        <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800/40 dark:text-slate-400">
                            Aún no tienes médicos asignados.
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
                                        onCheckedChange={(checked) => toggle(medico.id, checked === true)}
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
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        disabled={enviando}
                        onClick={guardar}
                        className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400 text-white"
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
