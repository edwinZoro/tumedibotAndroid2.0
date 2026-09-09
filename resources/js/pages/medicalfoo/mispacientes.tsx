import React from 'react';
import {
    Users,
    User,
    Phone,
    Calendar,
    History,
    Stethoscope,
    FileText,
    ClipboardList,
    NotepadText,
    PlusCircle,
    Search,
    Video,
    FileEdit,
    Trash2,
    Download,
    Mail,
    Share2,
    LayoutDashboard,
    ArrowLeft,
    HeartPulse,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

export default function MisPacientesDescription() {
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
                        href="/pacientes"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mis Pacientes
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <LayoutDashboard className="h-3.5 w-3.5" />
                        Módulo Médico
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Mis Pacientes
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del componente central para la gestión de pacientes y citas en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Mis Pacientes"</strong> es el módulo central dentro del área médica de la plataforma{' '}
                            <strong>TuMediBot</strong>. Su propósito es permitir al médico gestionar la lista de sus pacientes, acceder
                            rápidamente a su información clínica y realizar acciones clave como revisar citas, añadir notas, generar
                            recetas y consultar el historial médico. A continuación, se desglosa su funcionalidad y elementos visuales.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Vista principal */}
                    <Section
                        title="1. Vista principal: Lista de pacientes"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al ingresar al módulo, el médico visualiza una <strong>tabla</strong> con todos sus pacientes
                                    registrados. Esta tabla incluye:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Columna "PACIENTE":</strong> Muestra el nombre de usuario o nombre completo del paciente (ej.{' '}
                                        <span className="font-mono text-xs">cristian.pelaez</span>, <span className="font-mono text-xs">Calisto Perez</span>).
                                    </li>
                                    <li>
                                        <strong>Columna "CONTACTO":</strong> Contiene el correo electrónico y el número de teléfono del paciente.
                                    </li>
                                    <li>
                                        <strong>Columna "DATOS":</strong> Ícono de teléfono junto al número, para facilitar la llamada.
                                    </li>
                                    <li>
                                        <strong>Columna "CITAS":</strong> Un botón o enlace con el texto <strong>"Ver citas"</strong> que permite acceder al detalle de las citas de ese paciente.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                    <Badge variant="secondary" className="gap-1">
                                        <Search className="h-3 w-3" /> Buscador por nombre
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <PlusCircle className="h-3 w-3" /> Agregar Paciente
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <Users className="h-3 w-3" /> Contador de pacientes
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Ver citas */}
                    <Section
                        title="2. Acción: Ver citas de un paciente"
                        icon={<Calendar className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al hacer clic en <strong>"Ver citas"</strong> junto a un paciente, se abre un panel lateral o modal que
                                    muestra la información detallada de ese paciente. Este panel contiene:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Encabezado</strong> con el nombre del paciente (ej. "Citas de cristian pelaez").
                                    </li>
                                    <li>
                                        <strong>Número de citas registradas</strong> (ej. "1 cita registrada").
                                    </li>
                                    <li>
                                        <strong>Lista de citas:</strong> Cada cita muestra la fecha y hora (ej. "17:00:00") y un estado (ej. "confirmada").
                                    </li>
                                    <li>
                                        <strong>Botón "Unirse"</strong> (para teleconsultas o videollamadas) junto a cada cita.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1">
                                        <History className="h-3 w-3" /> Historial
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Stethoscope className="h-3 w-3" /> Receta
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <NotepadText className="h-3 w-3" /> Notas
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <FileEdit className="h-3 w-3" /> Editar
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Trash2 className="h-3 w-3" /> Eliminar
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Download className="h-3 w-3" /> Descargar PDF
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Mail className="h-3 w-3" /> Enviar por email
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Share2 className="h-3 w-3" /> Compartido
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Historial clínico */}
                    <Section
                        title="3. Historial clínico"
                        icon={<ClipboardList className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al pulsar <strong>"Historial"</strong>, se despliega un formulario que contiene las siguientes secciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>DIAGNÓSTICO:</strong> Campo de texto libre para registrar el diagnóstico principal.
                                    </li>
                                    <li>
                                        <strong>TRATAMIENTO:</strong> Descripción del tratamiento prescrito.
                                    </li>
                                    <li>
                                        <strong>EXAMEN FÍSICO:</strong> Resultados del examen físico.
                                    </li>
                                    <li>
                                        <strong>EXAMEN FUNCIONAL:</strong> Resultados de pruebas funcionales.
                                    </li>
                                    <li>
                                        <strong>EXAMEN PARACLÍNICO:</strong> Resultados de análisis de laboratorio o imágenes.
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Este formulario permite <strong>editar</strong> y <strong>guardar</strong> la información, y también se
                                    pueden realizar acciones como descargar el historial en PDF, enviarlo por email o compartirlo con otros
                                    profesionales.
                                </p>
                            </>
                        }
                    />

                    {/* 4. Receta médica */}
                    <Section
                        title="4. Receta médica"
                        icon={<Stethoscope className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al seleccionar <strong>"Receta"</strong>, se abre un formulario específico para prescripciones, que incluye:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Tipo de receta:</strong> Opciones para seleccionar entre <em>Simple</em>, <em>Controlada/Restringida</em> o <em>Preventiva</em>.
                                    </li>
                                    <li>
                                        <strong>Diagnóstico (opcional):</strong> Asociado a la receta.
                                    </li>
                                    <li>
                                        <strong>Medicamentos:</strong> Lista dinámica donde se pueden añadir medicamentos. Cada medicamento se busca mediante un campo con autocompletado (ej. "ace, ibu, amox, omeprazol...").
                                    </li>
                                    <li>
                                        <strong>Indicaciones:</strong> Instrucciones adicionales para el paciente (ej. "Indicación 1 para el paciente").
                                    </li>
                                    <li>
                                        <strong>Próxima cita (opcional):</strong> Campo para sugerir una fecha de seguimiento (dd/mm/aaaa).
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    El formulario permite añadir múltiples medicamentos e indicaciones, y al guardar genera un documento estructurado.
                                </p>
                            </>
                        }
                    />

                    {/* 5. Notas rápidas */}
                    <Section
                        title="5. Notas rápidas"
                        icon={<NotepadText className="h-5 w-5 text-sky-500" />}
                        content={
                            <p>
                                La opción <strong>"Notas"</strong> abre un sencillo editor de texto donde el médico puede escribir observaciones
                                libres sobre el paciente, sin estructura predefinida. Estas notas se almacenan y quedan asociadas al expediente
                                del paciente para consultas futuras.
                            </p>
                        }
                    />

                    {/* 6. Opciones adicionales */}
                    <Section
                        title="6. Opciones adicionales de gestión"
                        icon={<FileEdit className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Dentro del detalle de la cita o del expediente del paciente, se encuentran otras acciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Editar:</strong> Modificar cualquier campo del registro actual.
                                    </li>
                                    <li>
                                        <strong>Eliminar:</strong> Borrar el registro (con confirmación previa).
                                    </li>
                                    <li>
                                        <strong>Descargar PDF:</strong> Generar un documento PDF del historial, la receta o la nota.
                                    </li>
                                    <li>
                                        <strong>Enviar por email:</strong> Enviar el documento directamente al correo del paciente.
                                    </li>
                                    <li>
                                        <strong>Compartido:</strong> Opción para compartir el expediente con otros médicos o especialistas.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 7. Navegación y contexto */}
                    <Section
                        title="7. Navegación y contexto"
                        icon={<LayoutDashboard className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El componente <strong>"Mis Pacientes"</strong> forma parte del menú lateral de la plataforma, que incluye
                                    otras secciones como:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>Buscar Médicos</li>
                                    <li>
                                        Paciente (con subopciones: Datos Médicos, Mis Archivos, Mis Citas)
                                    </li>
                                    <li>
                                        Médicos (con subopciones: Área Médico, Mis Pacientes, Citas (Agenda), Archivos Compartidos)
                                    </li>
                                    <li>Reportar Pagos</li>
                                    <li>Soporte Técnico</li>
                                    <li>Notificaciones</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Desde <strong>"Mis Pacientes"</strong> se accede directamente a la gestión de pacientes y citas, y desde
                                    allí se enlaza con el resto de funcionalidades (historial, recetas, notas) que forman parte del expediente
                                    electrónico.
                                </p>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <HeartPulse className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Mis Pacientes"</strong> es un <strong>dashboard médico</strong> que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Visibilidad completa de la cartera de pacientes.</li>
                                    <li>Acceso rápido a las citas de cada paciente.</li>
                                    <li>Herramientas clínicas esenciales (historial, recetas, notas).</li>
                                    <li>Opciones de gestión documental (PDF, email, compartir).</li>
                                    <li>Flujo de trabajo orientado a la consulta médica, tanto presencial como virtual (botón "Unirse").</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Todo ello con una interfaz limpia, basada en componentes modales y tablas, que facilita la navegación y la
                                    toma de decisiones clínicas.
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