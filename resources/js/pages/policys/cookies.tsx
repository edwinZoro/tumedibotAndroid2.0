import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Cookie, ShieldCheck, Info, ArrowLeft, HeartPulse, Settings, Database } from 'lucide-react';

export default function CookiesPolicy() {
    return (
        <>
            <Head title="Política de Cookies - TuMediBot" />

            <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-[#070c18] dark:text-slate-300">
                {/* Header Superior */}
                <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-[#070c18]/80">
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
                            href="/"
                            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </header>

                <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                    {/* Banner Informativo */}
                    <div className="mb-8 rounded-2xl border border-sky-200 bg-sky-50/80 p-5 text-sky-900 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30 dark:text-sky-200">
                        <div className="flex items-start gap-3">
                            <Cookie className="mt-0.5 h-6 w-6 flex-shrink-0 text-sky-600 dark:text-sky-400" />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sky-900 dark:text-sky-200">
                                    Transparencia en la Navegación
                                </h3>
                                <p className="text-sm leading-relaxed text-sky-800/90 dark:text-sky-300/80">
                                    En TuMediBot utilizamos cookies y tecnologías similares únicamente para garantizar el correcto funcionamiento del sistema, mantener sesiones seguras de médicos y pacientes, y mejorar la experiencia de uso en nuestra plataforma.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Encabezado */}
                    <div className="mb-10 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Uso de Cookies y Almacenamiento Local
                        </div>
                        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                            Política de Cookies
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Última actualización: Septiembre de 2026 — TuMediBot.com
                        </p>
                    </div>

                    {/* Contenido de la Política */}
                    <article className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Info className="h-5 w-5 text-sky-500" />
                                1. ¿Qué es una Cookie?
                            </h2>
                            <p>
                                Una cookie es un pequeño archivo de texto que un sitio web almacena en su ordenador o dispositivo móvil cuando usted lo visita. Permite que el sitio recuerde sus acciones y preferencias (como inicio de sesión, idioma y otras preferencias de visualización) durante un período de tiempo.
                            </p>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Database className="h-5 w-5 text-sky-500" />
                                2. Tipos de Cookies que Utilizamos
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        a) Cookies Esenciales y de Seguridad (Estrictamente Necesarias)
                                    </h3>
                                    <p>
                                        Son indispensables para permitir el inicio de sesión seguro de médicos y pacientes, autenticar peticiones (tokens CSRF) y garantizar la integridad de las videoconsultas y expedientes.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        b) Cookies de Funcionalidad y Preferencias
                                    </h3>
                                    <p>
                                        Permiten recordar sus ajustes de interfaz, como el modo oscuro/claro o las preferencias de idioma y zona horaria para la programación de citas.
                                    </p>
                                </div>

                                <div>
                                    <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                                        c) Cookies de Rendimiento y Analítica
                                    </h3>
                                    <p>
                                        Nos ayudan a entender de forma anónima cómo interactúan los usuarios con la plataforma para corregir errores y optimizar la velocidad de respuesta del sistema.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Settings className="h-5 w-5 text-sky-500" />
                                3. Gestión y Desactivación de Cookies
                            </h2>
                            <p className="mb-3">
                                Puede restringir, bloquear o borrar las cookies de TuMediBot configurando las opciones de su navegador web:
                            </p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Google Chrome:</strong> Configuración &gt; Privacidad y seguridad &gt; Cookies y otros datos de sitios.</li>
                                <li><strong>Mozilla Firefox:</strong> Opciones &gt; Privacidad &amp; Seguridad &gt; Cookies y datos del sitio.</li>
                                <li><strong>Safari:</strong> Preferencias &gt; Privacidad &gt; Bloquear todas las cookies.</li>
                            </ul>
                            <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 font-medium">
                                Nota: La deshabilitación de cookies esenciales puede impedir el inicio de sesión o el correcto funcionamiento del portal médico.
                            </p>
                        </section>
                    </article>
                </main>
            </div>
        </>
    );
}
