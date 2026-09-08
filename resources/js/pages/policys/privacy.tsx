import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, HeartPulse, Server, UserCheck } from 'lucide-react';

export default function Privacy() {
    return (
        <>
            <Head title="Política de Privacidad y Protección de Datos - TuMediBot" />

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
                            <ShieldCheck className="mt-0.5 h-6 w-6 flex-shrink-0 text-sky-600 dark:text-sky-400" />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-sky-900 dark:text-sky-200">
                                    Compromiso de Confidencialidad y Custodia de Datos Médicos
                                </h3>
                                <p className="text-sm leading-relaxed text-sky-800/90 dark:text-sky-300/80">
                                    En TuMediBot valoramos y respetamos la privacidad de médicos y pacientes. Todos los datos de salud se procesan bajo rigurosos protocolos de cifrado y seguridad digital, cumpliendo con las regulaciones de protección de datos personales de Latinoamérica.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Título Principal */}
                    <div className="mb-10 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <Lock className="h-3.5 w-3.5" />
                            Protección de Datos Privados
                        </div>
                        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                            Política de Privacidad
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Última actualización: Septiembre de 2026 — TuMediBot.com
                        </p>
                    </div>

                    {/* Secciones de la Política */}
                    <article className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <UserCheck className="h-5 w-5 text-sky-500" />
                                1. Información que Recopilamos
                            </h2>
                            <p className="mb-3">
                                Para prestar nuestros servicios de telemedicina y gestión de citas, recopilamos la siguiente información:
                            </p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>Datos de Médicos:</strong> Nombre completo, identificación profesional (cédula/licencia médica), especialidad, correo electrónico, teléfono de contacto y horarios de atención.</li>
                                <li><strong>Datos de Pacientes:</strong> Nombre, datos de contacto, fecha de nacimiento y registros de citas médicas programadas.</li>
                                <li><strong>Información de Salud (Historial Clínico y Recetas):</strong> Los datos clínicos ingresados por el profesional de la salud durante las consultas son almacenados de forma encriptada bajo estricta confidencialidad.</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Eye className="h-5 w-5 text-sky-500" />
                                2. Uso de la Información
                            </h2>
                            <p className="mb-3">La información recopilada se utiliza exclusivamente para:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Facilitar el enlace, agenda de citas y videoconsultas entre médicos y pacientes.</li>
                                <li>Permitir al médico la gestión de sus notas clínicas, expedientes y generación de recetas.</li>
                                <li>Verificar la identidad y las credenciales profesionales de los médicos registrados.</li>
                                <li>Enviar notificaciones operativas relacionadas con sus citas o cuenta.</li>
                            </ul>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Server className="h-5 w-5 text-sky-500" />
                                3. Custodia, Encriptación y No Comercialización
                            </h2>
                            <p className="mb-3">
                                <strong>TuMediBot NO vende, alquila ni comercializa datos personales o de salud de sus usuarios con terceros.</strong>
                            </p>
                            <p>
                                Toda la información transmitida y almacenada cuenta con protocolos de cifrado y medidas de seguridad técnicas diseñadas para evitar accesos no autorizados, pérdidas o divulgación.
                            </p>
                        </section>

                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FileText className="h-5 w-5 text-sky-500" />
                                4. Derechos de los Usuarios (ARCO)
                            </h2>
                            <p>
                                Tanto médicos como pacientes tienen derecho a acceder, rectificar, cancelar u oponerse al tratamiento de sus datos personales. Para ejercer estos derechos o solicitar la eliminación de su cuenta, puede ponerse en contacto a través de los canales oficiales de asistencia de TuMediBot.com.
                            </p>
                        </section>
                    </article>
                </main>
            </div>
        </>
    );
}
