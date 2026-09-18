import React from 'react';
import {
    HeartPulse,
    Pill,
    Search,
    Clock,
    Mail,
    Volume2,
    ShieldCheck,
    CheckCircle2,
    ArrowLeft,
    Sparkles,
    Calendar,
    FileText,
    Bell,
    Power,
    CheckCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';

export default function MisMedicamentosDescription() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 text-slate-700 dark:from-slate-950 dark:to-slate-900 dark:text-slate-300">
            {/* Header / Navbar */}
            <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-950/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link href="/" className="inline-flex items-center gap-2 group">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
                            <HeartPulse className="h-5 w-5" />
                        </div>
                        <span className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                            TuMedi<span className="text-emerald-500 dark:text-emerald-400">Bot</span>
                        </span>
                    </Link>

                    <Link
                        href="/paciente/mis-medicamentos"
                        className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mis Medicamentos
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado principal */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300">
                        <Pill className="h-3.5 w-3.5 text-emerald-600" />
                        Sistema de Alertas y Notificaciones Automatizadas
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Procedimiento: Mis Medicamentos
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Guía completa explicativa sobre cómo los pacientes configuran, reciben correos y activan alarmas in-app para la toma de sus medicamentos.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El módulo <strong>"Mis Medicamentos"</strong> es la herramienta de <strong>recordatorio automatizado de tratamiento</strong> de <strong>TuMediBot</strong>. Permite al paciente registrar los fármacos prescritos o de uso personal, definir intervalos de tomas (cada 4h, 6h, 8h, 12h, 24h), elegir la hora de la primera dosis y recibir notificaciones puntuales a través de <strong>correo electrónico</strong> y <strong>alarmas sonoras in-app</strong> en tiempo real.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones de procedimiento */}
                <div className="space-y-6">
                    {/* 1. Vista general */}
                    <Section
                        title="1. Vista general del módulo"
                        icon={<Pill className="h-5 w-5 text-emerald-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al acceder a <strong>"Mis Medicamentos"</strong>, el paciente encuentra una interfaz limpia e interactiva diseñada para la máxima adherencia a sus tratamientos médicos:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Botón "Probar Alarma":</strong> Permite probar la señal sonora del navegador (Web Audio API) y activar los permisos de reproducción de sonido.
                                    </li>
                                    <li>
                                        <strong>Botón "Agregar Medicamento":</strong> Abre la ventana modal para configurar un nuevo tratamiento.
                                    </li>
                                    <li>
                                        <strong>Tarjetas de tratamientos activos:</strong> Muestra cada medicamento configurado con su dosis, frecuencia, horarios diarios calculados, botón de pausar/activar y eliminación.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 2. Búsqueda y autocompletado */}
                    <Section
                        title="2. Catálogo de 776 medicamentos y nombre libre"
                        icon={<Search className="h-5 w-5 text-emerald-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El sistema cuenta con una base de datos de <strong>776 medicamentos comerciales y principios activos</strong> con soporte de autocompletado en vivo:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Búsqueda inteligente:</strong> Al escribir 2 o más letras en el buscador, el sistema muestra sugerencias instantáneas con el nombre comercial, principio activo y categoría.
                                    </li>
                                    <li>
                                        <strong>Auto-llenado automático:</strong> Al elegir un medicamento del catálogo, el formulario completa automáticamente la <strong>Presentación</strong> (ej. <em>Tabletas 500mg</em>) y la <strong>Dosis</strong> recomendada (ej. <em>1 tableta</em>).
                                    </li>
                                    <li>
                                        <strong>Opción de Nombre Libre:</strong> Si el medicamento deseado no está en el catálogo, el paciente puede alternar a <em>"Escribir nombre libre"</em> para ingresar cualquier marca o preparado casero.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 3. Configuración de dosis y frecuencias */}
                    <Section
                        title="3. Programación de dosis y frecuencias"
                        icon={<Clock className="h-5 w-5 text-emerald-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El paciente establece los detalles exactos del tratamiento:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Intervalos de tomas:</strong> Selecciona frecuencias estándar de <em>Cada 4h, 6h, 8h, 12h, 24h o 48h</em>.
                                    </li>
                                    <li>
                                        <strong>Hora de inicio del ciclo:</strong> Indica la hora a la que inicia la primera toma del día (ej: <em>08:00 AM</em>).
                                    </li>
                                    <li>
                                        <strong>Rango de fechas:</strong> Fecha de inicio obligatoria y fecha de finalización opcional (para tratamientos continuos o indefinidos).
                                    </li>
                                    <li>
                                        <strong>Notas e instrucciones especiales:</strong> Indicaciones como <em>"Tomar con los alimentos"</em> o <em>"Evitar lácteos"</em>.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 4. Canales de notificación */}
                    <Section
                        title="4. Canales de recordatorio (Correo + Alarma In-App)"
                        icon={<Mail className="h-5 w-5 text-emerald-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    TuMediBot garantiza el cumplimiento del horario a través de dos mecanismos simultáneos:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Correo Electrónico (Backend Cron):</strong> Un proceso en segundo plano (comando Artisan programado) verifica cada 30 minutos los horarios y envía un email diseñado con el nombre del fármaco, dosis, hora e instrucciones.
                                    </li>
                                    <li>
                                        <strong>Alarma Sonora In-App (Web Audio API):</strong> Mientras la app web se encuentre abierta en el navegador, un verificador en tiempo real reproduce un tono sintetizado y despliega una ventana emergente en pantalla.
                                    </li>
                                </ul>
                                <Alert className="mt-3 border-emerald-200 bg-emerald-50/80 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200">
                                    <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                    <AlertTitle className="font-bold">Notificación Garantizada</AlertTitle>
                                    <AlertDescription>
                                        Incluso si la pestaña del navegador está cerrada, el recordatorio por correo electrónico llegará siempre a la bandeja de entrada del paciente a la hora programada.
                                    </AlertDescription>
                                </Alert>
                            </>
                        }
                    />

                    {/* 5. Control de estados */}
                    <Section
                        title="5. Pausa, activación y eliminación de recordatorios"
                        icon={<Power className="h-5 w-5 text-emerald-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Cada tarjeta de medicamento en el panel de control permite gestionar fácilmente el tratamiento:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Botón Pausar / Activar:</strong> Desactiva temporalmente las notificaciones si el tratamiento fue suspendido momentáneamente por el médico, sin perder la configuración creada.
                                    </li>
                                    <li>
                                        <strong>Botón Eliminar:</strong> Remueve el recordatorio y libera la programación cuando el tratamiento ha concluido.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-emerald-200 bg-emerald-50/80 shadow-sm dark:border-emerald-900/40 dark:bg-emerald-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                Resumen funcional del módulo
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2">
                                <p>
                                    El módulo <strong>"Mis Medicamentos"</strong> le brinda al paciente seguridad, autonomía y puntualidad en el cumplimiento de sus prescripciones médicas mediante:
                                </p>
                                <ul className="list-disc pl-5 space-y-1.5">
                                    <li>Buscador inteligente con 776 medicamentos predefinidos.</li>
                                    <li>Cálculo en pantalla de todos los horarios de dosis diarias.</li>
                                    <li>Envío de correos automáticos puntuales por servidor.</li>
                                    <li>Alarma visual y sonora in-app durante el uso de la plataforma.</li>
                                    <li>Control total de pausado, reanudación e historial.</li>
                                </ul>
                            </div>
                        </CardContent>
                    </Card>
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
                    {icon && <span className="text-emerald-500">{icon}</span>}
                    {title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}
