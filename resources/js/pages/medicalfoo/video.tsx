import React from 'react';
import {
    Video,
    Phone,
    PhoneOff,
    Mic,
    MicOff,
    Camera,
    CameraOff,
    Shield,
    ShieldCheck,
    AlertTriangle,
    Clock,
    User,
    Users,
    Calendar,
    HeartPulse,
    ArrowLeft,
    LogOut,
    Settings,
    MessageSquare,
    FileText,
    History,
    Stethoscope,
    Lock,
    Wifi,
    CircleUser,
    Play,
    ChevronDown,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';

export default function VideollamadaDescription() {
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
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <Stethoscope className="h-3.5 w-3.5" />
                        Portal Médico: Videoconsultas
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Guía de Teleconsulta para Médicos
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descubre cómo utilizar el módulo de videoconsultas de TuMediBot para brindar una excelente atención remota, acceder al historial clínico y gestionar recetas durante la llamada.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Videollamada"</strong> es la herramienta de teleconsulta de <strong>TuMediBot</strong>,
                            que permite al médico y al paciente realizar una consulta médica en tiempo real mediante videollamada.
                            Utiliza la infraestructura de <strong>Jitsi Meet</strong> para garantizar una conexión segura y de alta calidad.
                            Desde aquí, el profesional puede ver los datos de la cita, unirse a la reunión, controlar su micrófono y cámara,
                            y gestionar la sesión clínica.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Encabezado de la videollamada */}
                    <Section
                        title="1. Encabezado e información de la cita"
                        icon={<Video className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    En la parte superior del módulo se muestra un encabezado con la información clave de la consulta:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Ícono de video:</strong> Indica que se trata de una videollamada segura.
                                    </li>
                                    <li>
                                        <strong>Título:</strong> "Videollamada segura" con subtítulo <em>"Consulta con tu médico"</em>.
                                    </li>
                                    <li>
                                        <strong>Fecha y hora:</strong> Por ejemplo, <span className="font-mono text-xs">2026-08-20 a las 08:30:00</span>.
                                    </li>
                                    <li>
                                        <strong>Botón "Salir":</strong> Para abandonar la sala de videollamada y regresar a la agenda de citas.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Conexión segura
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Clock className="h-3 w-3" /> Cita programada
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Sala de espera y acceso a Jitsi */}
                    <Section
                        title="2. Sala de espera y acceso a la reunión (Jitsi)"
                        icon={<Play className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El panel izquierdo muestra la <strong>sala de espera</strong> con la integración de <strong>Jitsi Meet</strong>.
                                    Los elementos principales son:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Logo de Jitsi:</strong> Indica la plataforma de videoconferencia utilizada.
                                    </li>
                                    <li>
                                        <strong>Título "Entrar a la reunión":</strong> Invita al usuario a unirse a la consulta.
                                    </li>
                                    <li>
                                        <strong>Nombre de la reunión:</strong> Identificador único de la cita (ej. <span className="font-mono text-xs">Tumedibot Cita 13 9 Cwqsb</span>).
                                    </li>
                                    <li>
                                        <strong>Campo de nombre del participante:</strong> Muestra el nombre del médico o paciente (ej. "Calisto Perez").
                                    </li>
                                    <li>
                                        <strong>Botón "Entrar a la reunión":</strong> Botón azul con flecha desplegable para acceder a la videollamada.
                                    </li>
                                </ul>
                                <div className="mt-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 text-xs">
                                    <p className="font-mono">Tumedibot Cita 13 9 Cwqsb</p>
                                    <p className="text-slate-500 dark:text-slate-400 mt-1">Sala generada automáticamente para esta cita</p>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Controles de audio y video */}
                    <Section
                        title="3. Controles de audio y video"
                        icon={<Mic className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Antes de entrar a la reunión, el médico puede configurar sus dispositivos de audio y video:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Micrófono:</strong> Ícono de micrófono con opción para silenciar/activar. Flecha superior para seleccionar el dispositivo de entrada.
                                    </li>
                                    <li>
                                        <strong>Cámara:</strong> Ícono de cámara con opción para encender/apagar. Flecha superior para seleccionar la cámara.
                                    </li>
                                    <li>
                                        <strong>Colgar:</strong> Botón rojo con ícono de teléfono para cancelar la entrada o salir de la llamada.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1"><Mic className="h-3 w-3" /> Audio configurable</Badge>
                                    <Badge variant="secondary" className="gap-1"><Camera className="h-3 w-3" /> Video configurable</Badge>
                                    <Badge variant="secondary" className="gap-1"><PhoneOff className="h-3 w-3" /> Salir</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 4. Advertencia de permisos */}
                    <Section
                        title="4. Advertencia de permisos del navegador"
                        icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
                        content={
                            <>
                                <Alert variant="warning" className="border-amber-200 bg-amber-50/80 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                                    <AlertTitle className="font-semibold">Permisos requeridos</AlertTitle>
                                    <AlertDescription>
                                        <strong>Tienes que habilitar el acceso al micrófono y a la cámara</strong> para poder participar en la videollamada. Si no otorgas estos permisos, no podrás ser visto ni escuchado por el paciente.
                                    </AlertDescription>
                                </Alert>
                                <p className="mt-3 text-sm">
                                    El sistema solicita automáticamente estos permisos al navegador. En caso de denegarlos, se muestra esta alerta en color amarillo para que el usuario los habilite manualmente desde la configuración del navegador.
                                </p>
                            </>
                        }
                    />

                    {/* 5. Vista previa del paciente */}
                    <Section
                        title="5. Vista previa del paciente"
                        icon={<CircleUser className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El panel derecho muestra una <strong>vista previa del paciente</strong> que se unirá a la videollamada.
                                    Los elementos son:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Fondo oscuro:</strong> Simula el área de video donde aparecerá la imagen del paciente.
                                    </li>
                                    <li>
                                        <strong>Avatar circular:</strong> Muestra las iniciales del paciente (ej. <strong>CP</strong> para "Calisto Perez") sobre un círculo de color morado.
                                    </li>
                                    <li>
                                        <strong>Nombre del paciente:</strong> En el panel de Jitsi se muestra "Calisto Perez" como participante.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Cuando el paciente se conecte, su video en vivo reemplazará este avatar. Mientras tanto, el avatar con iniciales sirve como identificador visual.
                                </p>
                            </>
                        }
                    />

                    {/* 6. Barra lateral de herramientas */}
                    <Section
                        title="6. Barra lateral de herramientas"
                        icon={<Settings className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    En el extremo derecho de la pantalla se encuentra una <strong>barra lateral de herramientas</strong> con iconos para acceder a funcionalidades adicionales durante la videollamada:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Compartir pantalla:</strong> Para mostrar documentos o imágenes al paciente.
                                    </li>
                                    <li>
                                        <strong>Chat:</strong> Mensajería instantánea durante la consulta.
                                    </li>
                                    <li>
                                        <strong>Levantar mano:</strong> Para solicitar la palabra en reuniones grupales.
                                    </li>
                                    <li>
                                        <strong>Configuración:</strong> Ajustes de audio, video y calidad de conexión.
                                    </li>
                                    <li>
                                        <strong>Seguridad:</strong> Opciones de encriptación y bloqueo de la sala.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1"><MessageSquare className="h-3 w-3" /> Chat</Badge>
                                    <Badge variant="outline" className="gap-1"><Settings className="h-3 w-3" /> Configuración</Badge>
                                    <Badge variant="outline" className="gap-1"><Lock className="h-3 w-3" /> Seguridad</Badge>
                                    <Badge variant="outline" className="gap-1"><Wifi className="h-3 w-3" /> Calidad</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 7. Integración con el expediente clínico */}
                    <Section
                        title="7. Acceso en Tiempo Real al Expediente Clínico"
                        icon={<Stethoscope className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Durante la videollamada, encontrarás el botón <strong>"Expediente Clínico"</strong> en la barra superior junto al botón de Salir. Este botón despliega un menú que te permite acceder y actualizar los datos del paciente sin interrumpir la consulta:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Historial clínico:</strong> Revisa y actualiza diagnósticos, alergias, o antecedentes médicos al instante.
                                    </li>
                                    <li>
                                        <strong>Nueva Receta:</strong> Crea prescripciones digitales para el paciente mientras estás conversando con él.
                                    </li>
                                    <li>
                                        <strong>Notas Clínicas:</strong> Toma apuntes privados relevantes durante la sesión.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Toda la información que registres aquí quedará guardada de forma segura y estará vinculada automáticamente a esta cita específica y al perfil del paciente. Podrás consultarla posteriormente desde la sección <strong>Mis Pacientes</strong>.
                                </p>
                            </>
                        }
                    />

                    {/* 8. Flujo de la consulta */}
                    <Section
                        title="8. Flujo completo de la videoconsulta"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El flujo típico de una videoconsulta en TuMediBot es el siguiente:
                                </p>
                                <ol className="list-decimal pl-5 space-y-2.5">
                                    <li>
                                        <strong>El paciente agenda una cita</strong> desde su portal o la solicita al médico.
                                    </li>
                                    <li>
                                        <strong>El médico confirma la cita</strong> desde la Agenda de Citas.
                                    </li>
                                    <li>
                                        <strong>El médico accede a la videollamada</strong> desde el botón "Unirse" en la cita.
                                    </li>
                                    <li>
                                        <strong>Configura sus dispositivos</strong> (micrófono, cámara) en la sala de espera de Jitsi.
                                    </li>
                                    <li>
                                        <strong>Entra a la reunión</strong> y espera a que el paciente se conecte.
                                    </li>
                                    <li>
                                        <strong>Realiza la consulta</strong>, accediendo al historial, recetas y notas según sea necesario.
                                    </li>
                                    <li>
                                        <strong>Finaliza la llamada</strong> y guarda las notas clínicas generadas durante la consulta.
                                    </li>
                                </ol>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <Video className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Videollamada"</strong> es la herramienta de teleconsulta que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Videollamada segura entre médico y paciente vía Jitsi Meet.</li>
                                    <li>Encabezado con información de la cita (fecha, hora, participantes).</li>
                                    <li>Sala de espera con configuración de micrófono y cámara.</li>
                                    <li>Vista previa del paciente con avatar e iniciales.</li>
                                    <li>Barra de herramientas con chat, compartir pantalla y seguridad.</li>
                                    <li>Integración con el expediente clínico (historial, recetas, notas).</li>
                                    <li>Flujo completo desde la agenda hasta el cierre de la consulta.</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Esta funcionalidad permite brindar atención médica remota de calidad, manteniendo la privacidad y el acceso a la información clínica en tiempo real.
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