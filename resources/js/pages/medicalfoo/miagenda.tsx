import React from 'react';
import {
    Calendar,
    CalendarDays,
    Clock,
    User,
    Mail,
    Phone,
    CheckCircle,
    XCircle,
    AlertCircle,
    CalendarClock,
    ArrowLeft,
    HeartPulse,
    Search,
    Users,
    PlusCircle,
    Edit,
    FileText,
    History,
    Stethoscope,
    NotepadText,
    Download,
    Share2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function AgendaCitasDescription() {
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
                        href="/agenda"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Agenda
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <Calendar className="h-3.5 w-3.5" />
                        Módulo de Gestión de Citas
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Agenda de Citas
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del componente para la programación, visualización y gestión de consultas médicas en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Agenda de Citas"</strong> es el módulo central para la programación y seguimiento de
                            consultas médicas en <strong>TuMediBot</strong>. Permite al médico visualizar un calendario con los días
                            ocupados, gestionar la lista de pacientes con sus citas, asignar o modificar fechas, y acceder a un
                            detalle rápido de cada cita. A continuación, se desglosa su funcionalidad y elementos visuales.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Calendario mensual */}
                    <Section
                        title="1. Calendario mensual con días de cita"
                        icon={<CalendarDays className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    En la parte superior del módulo se muestra un <strong>calendario mensual</strong> que permite al médico
                                    tener una visión general de los días con citas agendadas. Los días con cita se marcan visualmente para
                                    facilitar la planificación.
                                </p>
                                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 mb-3">
                                    <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-slate-500 dark:text-slate-400">
                                        <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 text-center text-sm mt-1">
                                        {[26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 1, 2, 3, 4, 5].map((d, i) => (
                                            <div key={i} className={`py-1 rounded-full ${i === 5 || i === 12 || i === 18 || i === 25 ? 'bg-sky-200 dark:bg-sky-900/50 text-sky-700 dark:text-sky-300 font-bold' : ''}`}>
                                                {d}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center justify-center gap-4 mt-3 text-xs">
                                        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-sky-200 dark:bg-sky-900/50"></span> Con cita</span>
                                        <span className="flex items-center gap-1"><span className="inline-block h-3 w-3 rounded-full bg-slate-200 dark:bg-slate-700"></span> Sin cita</span>
                                    </div>
                                </div>
                                <p className="text-sm">
                                    El calendario permite navegar entre meses (ej. <strong>August 2026</strong>) y proporciona una referencia
                                    visual rápida para identificar días disponibles u ocupados.
                                </p>
                            </>
                        }
                    />

                    {/* 2. Lista de pacientes con citas */}
                    <Section
                        title="2. Lista de pacientes / solicitudes de cita"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Debajo del calendario, se presenta una <strong>tabla o listado</strong> con todos los pacientes que
                                    tienen citas programadas o solicitudes pendientes. Cada fila incluye:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Paciente:</strong> Nombre del paciente junto al motivo de la consulta (ej. "cristian pelaez control", "nuno diaz trastorno, enfermo").
                                    </li>
                                    <li>
                                        <strong>Contacto:</strong> Correo electrónico y número de teléfono para comunicación directa.
                                    </li>
                                    <li>
                                        <strong>Estado:</strong> Etiqueta que indica si la cita está <strong>CONFIRMADA</strong> o en otro estado (pendiente, cancelada, etc.).
                                    </li>
                                    <li>
                                        <strong>Acción:</strong> Botón o enlace <strong>"Cambiar fecha"</strong> para reprogramar la cita.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <Search className="h-3 w-3" /> Buscador por nombre
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <PlusCircle className="h-3 w-3" /> Agregar nueva cita
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Detalle de una cita específica */}
                    <Section
                        title="3. Detalle de cita específica"
                        icon={<CalendarClock className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al hacer clic en una cita o desde el panel lateral, se muestra el <strong>detalle completo</strong> de
                                    una consulta en particular. Este incluye:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Fecha y hora:</strong> Por ejemplo, <span className="font-mono text-xs">Martes, 18 de agosto - 9:00 AM</span>.
                                    </li>
                                    <li>
                                        <strong>Estado:</strong> Confirmada (indicador visual).
                                    </li>
                                    <li>
                                        <strong>Paciente:</strong> Nombre completo (ej. "Calisto Perez").
                                    </li>
                                    <li>
                                        <strong>Motivo:</strong> Descripción breve del motivo de la consulta (ej. "dolor de cabezas").
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Desde este detalle se puede acceder a acciones adicionales como <strong>editar</strong>, <strong>cancelar</strong>,
                                    <strong>unirse a videoconsulta</strong> (si aplica) o ver el historial del paciente.
                                </p>
                            </>
                        }
                    />

                    {/* 4. Gestión de fechas */}
                    <Section
                        title="4. Gestión de fechas y reprogramación"
                        icon={<Edit className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    La funcionalidad principal del módulo es la <strong>gestión dinámica de fechas</strong>. El médico puede:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Asignar fecha:</strong> Al recibir una solicitud de cita, el médico puede asignar una fecha y
                                        hora disponibles.
                                    </li>
                                    <li>
                                        <strong>Cambiar fecha:</strong> Desde el botón <strong>"Cambiar fecha"</strong> en la lista de pacientes,
                                        se abre un selector para reprogramar la cita a otro día/hora.
                                    </li>
                                    <li>
                                        <strong>Confirmación automática:</strong> El sistema notifica al paciente sobre los cambios.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Todas las modificaciones se reflejan instantáneamente en el calendario y en la lista de pacientes.
                                </p>
                            </>
                        }
                    />

                    {/* 5. Acciones adicionales */}
                    <Section
                        title="5. Acciones complementarias"
                        icon={<FileText className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Además de la programación, el módulo de agenda ofrece acciones relacionadas con el expediente del paciente:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Historial clínico:</strong> Acceso rápido al historial del paciente desde la cita.
                                    </li>
                                    <li>
                                        <strong>Receta médica:</strong> Generar o ver recetas asociadas a la cita.
                                    </li>
                                    <li>
                                        <strong>Notas:</strong> Añadir observaciones sobre la consulta.
                                    </li>
                                    <li>
                                        <strong>Descargar PDF:</strong> Exportar la información de la cita en formato PDF.
                                    </li>
                                    <li>
                                        <strong>Compartir:</strong> Enviar el detalle de la cita a otro profesional o al paciente.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 6. Integración con el resto de la plataforma */}
                    <Section
                        title="6. Contexto y navegación"
                        icon={<Share2 className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo <strong>"Agenda de Citas"</strong> está integrado en el menú lateral de la plataforma, dentro
                                    del área de <strong>Médicos → Citas (Agenda)</strong>. Se conecta directamente con:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Mis Pacientes:</strong> Para ver el listado completo de pacientes y sus datos.</li>
                                    <li><strong>Historial Clínico:</strong> Para acceder a los registros médicos de cada paciente.</li>
                                    <li><strong>Recetas y Notas:</strong> Para gestionar la documentación clínica.</li>
                                    <li><strong>Notificaciones:</strong> Para recibir alertas de nuevas solicitudes o cambios de cita.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Esta integración permite un flujo de trabajo continuo desde la programación hasta la atención médica.
                                </p>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Agenda de Citas"</strong> es un <strong>panel de control de consultas</strong> que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Visualización mensual de días ocupados en el calendario.</li>
                                    <li>Lista completa de pacientes con sus citas y estados.</li>
                                    <li>Asignación y reprogramación de fechas de manera rápida.</li>
                                    <li>Acceso directo a los datos clínicos de cada paciente.</li>
                                    <li>Herramientas de gestión documental (PDF, compartir, etc.).</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Todo ello con una interfaz clara y eficiente, que facilita la organización de la consulta médica y mejora la experiencia tanto del médico como del paciente.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}

// Componente auxiliar para cada sección
function Section({ title, icon, content }) {
    return (
        <Card className="border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50 transition-all hover:shadow-md">
            <CardContent className="p-6">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                    {icon && <span className="text-sky-500">{icon}</span>}
                    {title}
                </h2>
                <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                    {content}
                </div>
            </CardContent>
        </Card>
    );
}