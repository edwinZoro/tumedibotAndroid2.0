import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ShieldAlert, FileText, ArrowLeft, HeartPulse } from 'lucide-react';

export default function Terms() {
    return (
        <>
            <Head title="Términos y Condiciones de Servicio para Profesionales de la Salud - TuMediBot" />

            <div className="min-h-screen bg-slate-50 text-slate-700 dark:bg-[#070c18] dark:text-slate-300">
                {/* Top Header Navigation */}
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
                    {/* Legal Banner Alert */}
                    <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-900 shadow-sm dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                        <div className="flex items-start gap-3">
                            <ShieldAlert className="mt-0.5 h-6 w-6 flex-shrink-0 text-amber-600 dark:text-amber-400" />
                            <div className="space-y-1">
                                <h3 className="font-semibold text-amber-900 dark:text-amber-200">
                                    Aviso Legal Importante sobre Responsabilidad Médica
                                </h3>
                                <p className="text-sm leading-relaxed text-amber-800/90 dark:text-amber-300/80">
                                    Todo diagnóstico, prescripción, receta médica e información registrada mediante notas u historial clínico en esta plataforma es de <strong>única y exclusiva responsabilidad del médico profesional</strong>. TuMediBot actúa únicamente como un intermediario tecnológico.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Document Header */}
                    <div className="mb-10 text-center sm:text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                            <FileText className="h-3.5 w-3.5" />
                            Marco Regulatorio de Salud
                        </div>
                        <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                            TÉRMINOS Y CONDICIONES DE SERVICIO PARA PROFESIONALES DE LA SALUD
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Última actualización: Septiembre de 2026 | Sitio Web: https://www.tumedibot.com
                        </p>
                    </div>

                    {/* Main Document Content */}
                    <article className="space-y-8 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                        {/* Sección 1 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                1. Naturaleza de la Plataforma
                            </h2>
                            <p className="mb-3">
                                <strong>TuMediBot</strong> es una plataforma tecnológica que provee soluciones de software como servicio (SaaS) destinadas a facilitar la gestión de la agenda digital, videoconsultas en vivo, almacenamiento seguro de información y la comunicación interactiva entre médicos y pacientes.
                            </p>
                            <p>
                                <strong>TuMediBot NO es un prestador de servicios médicos, institución hospitalaria ni farmacia.</strong> Nuestra labor se limita estrictamente a la provisión, mantenimiento y soporte del entorno tecnológico que conecta a las partes.
                            </p>
                        </section>

                        {/* Sección 2 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                2. Declaración de Autonomía y Responsabilidad Profesional
                            </h2>
                            <p className="mb-3">
                                El Médico o Profesional de la Salud que se registra en <strong>TuMediBot</strong> acepta, reconoce y garantiza expresamente que:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2.5">
                                <li>
                                    <strong>Ejercicio Profesional Independiente:</strong> La relación médico-paciente se constituye exclusivamente entre el profesional registrado y el usuario que solicita la atención. TuMediBot no interviene en la relación clínica ni en la toma de decisiones médicas.
                                </li>
                                <li>
                                    <strong>Contenido y Registros Clínicos:</strong> Todo diagnóstico, nota médica, plan de tratamiento, historial clínico, recomendación y <strong>emisión de recetas u órdenes médicas</strong> generadas o almacenadas a través de la plataforma son <strong>responsabilidad única, personal e intransferible del Médico</strong>.
                                </li>
                                <li>
                                    <strong>Validez de Recetas e Indicaciones:</strong> El Profesional de la Salud es el único responsable de asegurar que el contenido de sus recetas e informes cumpla con la normativa sanitaria aplicable en el país o jurisdicción donde ejerza y en la que se halle el paciente.
                                </li>
                                <li>
                                    <strong>Deslinde de Responsabilidad:</strong> <strong>TuMediBot</strong>, sus propietarios, directivos, empleados y desarrolladores quedan <strong>completamente deslindados</strong> de cualquier responsabilidad civil, penal, administrativa o mercantil derivada de mala práctica, negligencia, error de diagnóstico, dosificación incorrecta o cualquier eventualidad o daño ocasionado al paciente a raíz de la atención brindada por el Médico.
                                </li>
                            </ol>
                        </section>

                        {/* Sección 3 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                3. Requisitos de Registro y Credenciales
                            </h2>
                            <p className="mb-3">
                                Para registrarse y operar en la plataforma, el Profesional de la Salud debe cumplir y certificar los siguientes aspectos:
                            </p>
                            <ul className="list-disc pl-5 space-y-2.5">
                                <li>
                                    <strong>Titulación Habilitante:</strong> Poseer título universitario, cédula profesional, exequátur o licencia vigente otorgada por la autoridad de salud correspondiente en su país de ejercicio.
                                </li>
                                <li>
                                    <strong>Veracidad de la Información:</strong> Toda la información proporcionada al crear el perfil profesional (especialidad, identificación, credenciales) debe ser exacta y verificable. TuMediBot se reserva el derecho de suspender o cancelar la cuenta de cualquier usuario que proporcione información falsa o engañosa.
                                </li>
                                <li>
                                    <strong>Seguridad de la Cuenta:</strong> El usuario es responsable de mantener la confidencialidad de sus credenciales de acceso (usuario y contraseña) y de las actividades desarrolladas en su cuenta.
                                </li>
                            </ul>
                        </section>

                        {/* Sección 4 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                4. Confidencialidad y Protección de Datos de Salud
                            </h2>
                            <p className="mb-3">
                                En cumplimiento con los estándares internacionales y normativas de protección de datos personales de América Latina:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2.5">
                                <li>
                                    <strong>Propiedad de los Datos:</strong> La información clínica ingresada por el médico pertenece al paciente o al profesional en los términos prescritos por la ley. TuMediBot actúa únicamente en calidad de <strong>Encargado del Tratamiento de Datos</strong>.
                                </li>
                                <li>
                                    <strong>Encriptación y Custodia:</strong> TuMediBot implementa medidas de seguridad técnicas y organizativas para proteger los datos de salud transmitidos (encriptación en tránsito y en reposo).
                                </li>
                                <li>
                                    <strong>Secreto Profesional:</strong> El uso de herramientas digitales no exime al Profesional de la Salud del deber ético y legal del secreto profesional sobre los datos del paciente.
                                </li>
                            </ol>
                        </section>

                        {/* Sección 5 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                5. Limitación en Casos de Urgencia o Emergencia
                            </h2>
                            <p className="mb-3">
                                La plataforma <strong>TuMediBot</strong> no está diseñada ni destinada a la atención de situaciones de emergencia médica que pongan en riesgo la vida.
                            </p>
                            <ul className="list-disc pl-5 space-y-2.5">
                                <li>
                                    El Médico se compromete a instruir e informar a sus pacientes que, en caso de urgencia o emergencia clínica, deben dirigirse inmediatamente al centro de salud o servicio de urgencias local más cercano.
                                </li>
                            </ul>
                        </section>

                        {/* Sección 6 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                6. Disponibilidad y Uso de las Herramientas Tecnológicas
                            </h2>
                            <ol className="list-decimal pl-5 space-y-2.5">
                                <li>
                                    <strong>Disponibilidad del Servicio:</strong> TuMediBot realiza esfuerzos razonables para mantener la plataforma disponible en forma continua. Sin embargo, no garantiza un funcionamiento ininterrumpido debido a mantenimientos programados, fallas de conectividad o causas de fuerza mayor.
                                </li>
                                <li>
                                    <strong>Uso Adecuado:</strong> Queda estrictamente prohibido utilizar la plataforma para fines ilícitos, prescripción no autorizada de medicamentos controlados en jurisdicciones no permitidas o cualquier actividad contraria a la deontología médica.
                                </li>
                            </ol>
                        </section>

                        {/* Sección 7 */}
                        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                                7. Jurisdicción Aplicable y Aceptación
                            </h2>
                            <ol className="list-decimal pl-5 space-y-2.5">
                                <li>
                                    <strong>Uso Internacional:</strong> TuMediBot opera para la región de Latinoamérica. El Profesional de la Salud se compromete a respetar las leyes locales de salud, farmacovigilancia y protección de datos vigentes en su país de residencia y ejercicio profesional.
                                </li>
                                <li>
                                    <strong>Aceptación Expresa:</strong> El clic en el botón de aceptación durante el registro, así como el uso continuado de los servicios de <strong>TuMediBot.com</strong>, constituye la aceptación plena y sin reservas de todos los términos establecidos en este documento.
                                </li>
                            </ol>
                        </section>
                    </article>
                </main>
            </div>
        </>
    );
}
