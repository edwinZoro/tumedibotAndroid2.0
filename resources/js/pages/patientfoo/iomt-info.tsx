import React from 'react';
import {
    Activity,
    Bluetooth,
    ShieldCheck,
    Share2,
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

export default function IoMTDescription() {
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
                        href="/paciente/monitoreo-iomt"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mi Monitorización
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-teal-200 bg-teal-50 text-teal-700 dark:border-teal-900/50 dark:bg-teal-950/40 dark:text-teal-400">
                        <Activity className="h-3.5 w-3.5" />
                        Monitorización IoMT
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Internet de las Cosas Médicas (IoMT)
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Guía completa sobre cómo conectar tus dispositivos inteligentes y compartir tus métricas de salud con tus médicos de confianza.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El <strong>Internet de las Cosas Médicas (IoMT)</strong> es un ecosistema tecnológico que permite recopilar, transmitir y analizar datos de salud en tiempo real utilizando dispositivos conectados a internet. En TuMediBot, hemos creado una <strong>Sala de Monitorización</strong> privada y segura donde puedes centralizar la información de tus relojes inteligentes, tensiómetros, oxímetros y más.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. ¿Cómo funciona la conexión? */}
                    <Section
                        title="1. Conexión de Dispositivos (Bluetooth / WiFi)"
                        icon={<Bluetooth className="h-5 w-5 text-teal-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Para recopilar tu información de salud, nuestra plataforma permite la sincronización de dispositivos mediante <strong>Bluetooth</strong> o <strong>WiFi</strong>:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Bluetooth Web API:</strong> Desde tu navegador o aplicación móvil, puedes enlazar dispositivos como pulseras de actividad o tensiómetros inteligentes directamente a TuMediBot.
                                    </li>
                                    <li>
                                        <strong>Sincronización en la Nube:</strong> Si tu dispositivo sube datos a su propia nube (ej. Apple Health, Google Fit), podrás conectarlo para que esa información se unifique aquí.
                                    </li>
                                    <li>
                                        <strong>Métricas Capturadas:</strong> Frecuencia Cardíaca, Presión Arterial, Saturación de Oxígeno (SpO2), Temperatura y Niveles de Glucosa.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <Watch className="h-3 w-3" /> Smartwatches
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Smartphone className="h-3 w-3" /> Móvil
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Cifrado y Privacidad */}
                    <Section
                        title="2. Cifrado y Privacidad de tus Datos"
                        icon={<ShieldCheck className="h-5 w-5 text-teal-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    La salud es información crítica, por lo que priorizamos tu privacidad por encima de todo:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Cifrado de Extremo a Extremo:</strong> Desde el momento en que el dispositivo envía el dato hasta que se guarda en la base de datos de TuMediBot, la información viaja encriptada.
                                    </li>
                                    <li>
                                        <strong>Almacenamiento Seguro:</strong> Nadie (ni siquiera los administradores de la plataforma) puede interpretar tus métricas en crudo.
                                    </li>
                                    <li>
                                        <strong>Tú tienes el control:</strong> Eres el dueño absoluto de tu información. Sólo tú decides con quién compartirla.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1"><Lock className="h-3 w-3" /> Encriptación AES-256</Badge>
                                    <Badge variant="secondary" className="gap-1"><Database className="h-3 w-3" /> Base de Datos Segura</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Compartir con tus Médicos */}
                    <Section
                        title="3. Compartir con tus Médicos"
                        icon={<Share2 className="h-5 w-5 text-teal-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Si bien tus datos están privados por defecto, puedes otorgar acceso a los médicos que están tratando tu caso:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Autorización Específica:</strong> Existe un botón llamado <strong>"Compartir con mis médicos"</strong> en tu Sala de Monitorización. Al pulsarlo, puedes elegir de una lista exactamente a qué médico darle acceso.
                                    </li>
                                    <li>
                                        <strong>Visibilidad Médica:</strong> Al conceder acceso, el profesional verá tus gráficos en tiempo real desde su propia interfaz. Esto es ideal para monitoreos a largo plazo o recuperación posoperatoria.
                                    </li>
                                    <li>
                                        <strong>Revocar acceso:</strong> Si cambias de opinión, puedes quitar el permiso con un solo clic. El médico perderá el acceso a tu Sala instantáneamente.
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
                    {icon && <span className="text-teal-500">{icon}</span>}
                    {title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}