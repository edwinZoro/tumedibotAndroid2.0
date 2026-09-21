import React from 'react';
import {
    Activity,
    Stethoscope,
    ShieldCheck,
    LineChart,
    HeartPulse,
    ArrowLeft,
    Wifi,
    Lock,
    Watch,
    Smartphone,
    Database,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function MedicoIoMTDescription() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 text-slate-700 dark:text-slate-300">
            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20 transition-transform group-hover:scale-105">
                            <HeartPulse className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            TuMedi<span className="text-sky-500 dark:text-sky-400">Bot</span>
                        </span>
                    </Link>

                    <Link
                        href="/medicalfoo/miagenda"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mi Agenda
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900/50 dark:bg-indigo-950/40 dark:text-indigo-400">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Portal Médico: IoMT
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Guía de Monitorización Médica (IoMT)
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descubre cómo acceder y analizar las métricas en tiempo real de tus pacientes gracias a la integración del Internet de las Cosas Médicas.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El <strong>Internet de las Cosas Médicas (IoMT)</strong> revoluciona el seguimiento clínico. En TuMediBot, permitimos que los pacientes sincronicen sus dispositivos inteligentes de salud (como tensiómetros, oxímetros, y relojes inteligentes). Como médico, si el paciente te otorga acceso, podrás monitorear sus signos vitales a distancia mediante una <strong>Sala de Monitorización</strong> centralizada y visual.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. ¿Cómo funciona la conexión? */}
                    <Section
                        title="1. ¿Cómo obtiene el paciente los datos?"
                        icon={<Activity className="h-5 w-5 text-indigo-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El paciente es el responsable de sincronizar sus dispositivos a través de nuestra plataforma utilizando <strong>Bluetooth</strong> o interfaces web.
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Recolección Continua:</strong> Se recogen datos como Frecuencia Cardíaca, Presión Arterial, Saturación de Oxígeno (SpO2), y Niveles de Glucosa.
                                    </li>
                                    <li>
                                        <strong>Actualización en Tiempo Real:</strong> Cuando el paciente realiza una nueva medición, el sistema actualiza inmediatamente los gráficos, permitiéndote tomar decisiones clínicas basadas en datos recientes.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 2. Cifrado y Privacidad */}
                    <Section
                        title="2. Seguridad Clínica y Privacidad"
                        icon={<ShieldCheck className="h-5 w-5 text-indigo-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Como profesional de la salud, sabes lo importante que es proteger los datos clínicos:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Acceso Exclusivo:</strong> No puedes ver los datos IoMT de un paciente a menos que este te haya dado <strong>autorización explícita</strong>. Si el paciente revoca el permiso, dejarás de tener acceso instantáneamente.
                                    </li>
                                    <li>
                                        <strong>Cifrado Estricto:</strong> Toda la telemetría viaja protegida con cifrado de extremo a extremo y se almacena encriptada para cumplir con las normativas de protección de datos médicos.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3" /> Privacidad del Paciente</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Compartir con tus Médicos */}
                    <Section
                        title="3. Análisis de Datos (Sala de Monitorización)"
                        icon={<LineChart className="h-5 w-5 text-indigo-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Para analizar los datos de un paciente autorizado:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Acceso al Panel:</strong> Dirígete a la sección <em>Monitorización IoMT</em> dentro de tu portal médico. Verás una lista con todos los pacientes que han compartido su información contigo.
                                    </li>
                                    <li>
                                        <strong>Gráficos Dinámicos:</strong> Al hacer clic en el nombre de un paciente, ingresarás a su Sala de Monitorización. Allí encontrarás paneles interactivos y gráficas históricas de cada métrica (ej. curvas de glucosa a lo largo de la semana o variaciones en la presión arterial).
                                    </li>
                                    <li>
                                        <strong>Toma de Decisiones:</strong> Esta herramienta es ideal para el seguimiento de pacientes crónicos, ajustes de medicación, y monitoreos post-operatorios desde la comodidad de tu consultorio.
                                    </li>
                                </ul>
                            </>
                        }
                    />
                </div>
            </main>
        </div>
    );
}

// Componente auxiliar para cada sección
function Section({ title, icon, content }: { title: string; icon: React.ReactNode; content: React.ReactNode }) {
    return (
        <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 transition-all hover:shadow-md">
            <CardContent className="p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    {icon && <span className="text-indigo-500">{icon}</span>}
                    {title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}