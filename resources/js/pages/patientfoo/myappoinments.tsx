import React from 'react';
import {
    HeartPulse,
    Calendar,
    CalendarDays,
    CalendarPlus,
    Clock,
    Video,
    Stethoscope,
    User,
    Users,
    Search,
    Plus,
    ChevronLeft,
    ChevronRight,
    CheckCircle,
    XCircle,
    AlertCircle,
    FileText,
    Info,
    ShieldCheck,
    Lock,
    MessageSquare,
    Stethoscope as StethoscopeIcon,
    ArrowLeft,
    Sparkles,
    ClipboardList,
    Activity,
    HeartHandshake,
    Phone,
    MapPin,
    BadgeCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';

export default function MisCitasDescription() {
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
                        href="/paciente/mis-citas"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mis Citas
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <Calendar className="h-3.5 w-3.5" />
                        Agenda Médica del Paciente
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Mis Citas
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del módulo donde el paciente agenda, consulta y gestiona sus citas médicas en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Mis Citas"</strong> es el módulo del paciente para gestionar todas sus consultas
                            médicas en <strong>TuMediBot</strong>. Aquí puede visualizar un calendario con los días ocupados, buscar
                            médicos por nombre o especialidad, solicitar nuevas citas (presenciales o por videollamada) indicando el
                            tipo de consulta, síntomas y motivos, y consultar el listado de sus citas programadas con la opción de
                            entrar a la videollamada o compartir información médica.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Vista general del módulo */}
                    <Section
                        title="1. Vista general del módulo"
                        icon={<CalendarDays className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al acceder a <strong>"Mis Citas"</strong>, el paciente encuentra un panel con:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Encabezado:</strong> Título "Mis Citas" con el subtítulo <em>"Agenda y consulta tus citas médicas"</em>.
                                    </li>
                                    <li>
                                        <strong>Ícono representativo:</strong> Un calendario azul que simboliza la agenda.
                                    </li>
                                    <li>
                                        <strong>Indicador de privacidad:</strong> Una etiqueta verde con el texto <strong>"Cada cita es visible solo para ti y tu médico"</strong>.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    El módulo está dividido en dos columnas principales: a la izquierda el <strong>calendario</strong> y a la
                                    derecha el <strong>buscador de médicos</strong> para agendar nuevas citas. Debajo se muestra el listado
                                    de citas próximas agrupadas por fecha.
                                </p>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1 text-green-700 border-green-300 dark:text-green-400 dark:border-green-900/50">
                                        <Lock className="h-3 w-3" /> Visibilidad privada
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Solo tú y tu médico
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Calendario de citas */}
                    <Section
                        title="2. Calendario mensual con días de cita"
                        icon={<CalendarDays className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    La columna izquierda contiene un <strong>calendario mensual</strong> que permite al paciente visualizar
                                    los días con citas agendadas. Los elementos son:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Navegación de mes:</strong> Flechas a los lados del nombre del mes (ej. <em>August 2026</em>, <em>September 2026</em>) para moverse entre meses.
                                    </li>
                                    <li>
                                        <strong>Días de la semana:</strong> Cabecera con Su, Mo, Tu, We, Th, Fr, Sa.
                                    </li>
                                    <li>
                                        <strong>Días del mes:</strong> Cuadrícula con los números de cada día. Los días con cita aparecen marcados con un punto azul debajo del número.
                                    </li>
                                    <li>
                                        <strong>Día seleccionado:</strong> Se resalta con un fondo azul (ej. el 18 o el 10 según la captura).
                                    </li>
                                    <li>
                                        <strong>Leyenda:</strong> Debajo del calendario se muestra la leyenda: <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-sky-500"></span> Con cita</span> y <span className="inline-flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-slate-300"></span> Sin cita</span>.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    El calendario permite tener una visión clara de la carga de citas y planificar nuevas consultas en días disponibles.
                                </p>
                            </>
                        }
                    />

                    {/* 3. Solicitar nueva cita - Buscador de médicos */}
                    <Section
                        title="3. Solicitar nueva cita: buscador de médicos"
                        icon={<Search className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    La columna derecha contiene el panel <strong>"Solicitar nueva cita"</strong> con el subtítulo
                                    <em> "Busca un médico; él te asignará fecha y hora"</em>. Sus elementos son:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Barra de búsqueda:</strong> Campo para escribir el nombre del médico o la especialidad (ej. "Buscar por nombre o especialidad...").
                                    </li>
                                    <li>
                                        <strong>Botón "Buscar":</strong> Azul, a la derecha de la barra, para ejecutar la búsqueda.
                                    </li>
                                    <li>
                                        <strong>Tabla de médicos:</strong> Con las columnas:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>MÉDICO:</strong> Foto y nombre del profesional (ej. Aida Hidalgo, Andrea Guillén, Angelica Palma, Arturo Lopez, Beatriz Herrera, Berenice Ochoa, Calisto Mendez, Christian Dittamo, Cristin Mesa, Danail Revilla).</li>
                                            <li><strong>ESPECIALIDAD:</strong> Badge azul con la especialidad (ej. NEUROLOGÍA, MEDICINA GENERAL, FERTILIDAD DE LA MUJER, FONIATRÍA, NUTRICIÓN, ANGIOLOGÍA).</li>
                                            <li><strong>COSTO:</strong> Precio de la consulta (ej. $30, $15, $50, $65, $12, $25).</li>
                                            <li><strong>ACCIÓN:</strong> Botón azul <strong>"+ Agendar cita"</strong> para solicitar una cita con ese médico.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>Paginación:</strong> En la parte inferior se muestran botones de paginación ("Anterior", números 1-6, "Siguiente").
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 4. Modal "Solicitar cita" */}
                    <Section
                        title="4. Modal para solicitar una cita"
                        icon={<CalendarPlus className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al hacer clic en <strong>"+ Agendar cita"</strong> junto a un médico, se abre un <strong>modal</strong> titulado
                                    <em> "Solicitar cita"</em> con el subtítulo: <em>"Con [Nombre del médico] · [Especialidad]. El médico te asignará fecha y hora en su agenda."</em>
                                </p>
                                <p className="mb-3">El formulario del modal contiene los siguientes campos:</p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>TIPO DE CITA:</strong> Menú desplegable con las opciones:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>Consulta en consultorio:</strong> Cita presencial.</li>
                                            <li><strong>Videollamada:</strong> Consulta remota por video.</li>
                                        </ul>
                                    </li>
                                    <li>
                                        <strong>SÍNTOMAS (opcional · varios):</strong> Campo de texto con el placeholder <em>"Ej: Fiebre, diarrea, vómito..."</em> y un botón con ícono "+" para añadir más síntomas.
                                    </li>
                                    <li>
                                        <strong>MOTIVOS (opcional · varios):</strong> Campo de texto con el placeholder <em>"Ej: Trastorno, enfermedad, dolencia..."</em> y un botón con ícono "+" para añadir más motivos.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    En la parte inferior hay dos botones: <strong>"Cancelar"</strong> (blanco) y <strong>"Solicitar cita"</strong> (azul).
                                    Al enviar, la solicitud queda pendiente hasta que el médico asigne una fecha y hora.
                                </p>
                            </>
                        }
                    />

                    {/* 5. Listado de citas programadas */}
                    <Section
                        title="5. Listado de citas próximas"
                        icon={<ClipboardList className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Debajo del calendario y del buscador, el paciente visualiza sus <strong>citas programadas</strong>
                                    agrupadas por fecha. Cada grupo tiene un encabezado como:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Encabezado de grupo:</strong> Ej. <em>"Citas del jueves, 20 de agosto"</em> o <em>"Citas del martes, 18 de agosto"</em>, junto a un contador de citas (ej. "1 CITA").
                                    </li>
                                    <li>
                                        <strong>Tarjeta de cita:</strong> Cada cita incluye:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>Hora:</strong> Ej. <em>8:30 AM</em> o <em>9:00 AM</em>.</li>
                                            <li><strong>Estado:</strong> Badge verde con el texto <em>CONFIRMADA</em>.</li>
                                            <li><strong>Médico:</strong> Nombre y especialidad (ej. <em>Calisto Mendez · ANGIOLOGÍA</em>).</li>
                                            <li><strong>Motivo:</strong> Descripción breve (ej. <em>dolor</em>, <em>dolor de cabezas</em>).</li>
                                            <li><strong>Acciones:</strong>
                                                <ul className="list-square pl-5 mt-1 space-y-1">
                                                    <li><strong>Entrar a videollamada:</strong> Botón azul con ícono de video (solo para citas por videollamada).</li>
                                                    <li><strong>Cancelar:</strong> Ícono de X roja para cancelar la cita.</li>
                                                </ul>
                                            </li>
                                            <li><strong>Compartir:</strong> Sección inferior con botones:
                                                <ul className="list-square pl-5 mt-1 space-y-1">
                                                    <li><strong>Informe médico:</strong> Para compartir informes previos.</li>
                                                    <li><strong>Nota:</strong> Menú desplegable para compartir notas.</li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 6. Acciones sobre las citas */}
                    <Section
                        title="6. Acciones disponibles sobre cada cita"
                        icon={<Activity className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El paciente puede realizar varias acciones sobre sus citas:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Entrar a videollamada:</strong> Iniciar la consulta remota con el médico en la hora programada.
                                    </li>
                                    <li>
                                        <strong>Cancelar cita:</strong> Eliminar la cita de la agenda (con confirmación previa).
                                    </li>
                                    <li>
                                        <strong>Compartir informe médico:</strong> Adjuntar un informe previo al médico antes de la consulta.
                                    </li>
                                    <li>
                                        <strong>Compartir nota:</strong> Enviar una nota o comentario adicional al médico.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1"><Video className="h-3 w-3" /> Videollamada</Badge>
                                    <Badge variant="secondary" className="gap-1"><XCircle className="h-3 w-3" /> Cancelar</Badge>
                                    <Badge variant="secondary" className="gap-1"><FileText className="h-3 w-3" /> Informe</Badge>
                                    <Badge variant="secondary" className="gap-1"><MessageSquare className="h-3 w-3" /> Nota</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 7. Flujo de solicitud de cita */}
                    <Section
                        title="7. Flujo completo para agendar una cita"
                        icon={<Sparkles className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El flujo típico para agendar una cita en TuMediBot es el siguiente:
                                </p>
                                <ol className="list-decimal pl-5 space-y-2.5">
                                    <li>
                                        <strong>Buscar al médico:</strong> El paciente usa la barra de búsqueda por nombre o especialidad.
                                    </li>
                                    <li>
                                        <strong>Seleccionar al médico:</strong> Revisa la especialidad y el costo, y hace clic en "+ Agendar cita".
                                    </li>
                                    <li>
                                        <strong>Completar el formulario:</strong> Elige el tipo de cita (consultorio o videollamada) y, opcionalmente, añade síntomas y motivos.
                                    </li>
                                    <li>
                                        <strong>Enviar solicitud:</strong> El médico recibe la solicitud y asigna una fecha y hora.
                                    </li>
                                    <li>
                                        <strong>Confirmación:</strong> El paciente recibe una notificación con la fecha y hora asignadas.
                                    </li>
                                    <li>
                                        <strong>Consulta:</strong> El día de la cita, el paciente asiste al consultorio o entra a la videollamada.
                                    </li>
                                    <li>
                                        <strong>Compartir información:</strong> Puede adjuntar informes o notas antes de la consulta.
                                    </li>
                                </ol>
                            </>
                        }
                    />

                    {/* 8. Navegación y contexto */}
                    <Section
                        title="8. Navegación y contexto dentro de la plataforma"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo <strong>"Mis Citas"</strong> se encuentra dentro del menú lateral, en la sección
                                    <strong> Paciente</strong>, junto a otras opciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Datos Médicos:</strong> Información personal y clínica del paciente.</li>
                                    <li><strong>Mis Archivos:</strong> Bóveda personal de documentos médicos.</li>
                                    <li><strong>Mis Citas:</strong> Agenda de citas programadas.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Desde este módulo, el paciente puede gestionar toda su agenda médica y comunicarse con los profesionales
                                    de la salud de forma rápida y sencilla.
                                </p>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <HeartHandshake className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Mis Citas"</strong> es el panel de gestión de citas del paciente que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Calendario mensual con marcado visual de días con cita.</li>
                                    <li>Buscador de médicos por nombre o especialidad, con costo y botón para agendar.</li>
                                    <li>Modal de solicitud de cita con selección de tipo (consultorio o videollamada) y campos de síntomas y motivos.</li>
                                    <li>Listado de citas próximas agrupadas por fecha, con estado y datos del médico.</li>
                                    <li>Acciones sobre cada cita: entrar a videollamada, cancelar, compartir informe o nota.</li>
                                    <li>Integración con el resto del portal del paciente (Datos Médicos, Mis Archivos).</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Este módulo permite al paciente mantener una agenda organizada y acceder a la atención médica de forma ágil y segura.
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