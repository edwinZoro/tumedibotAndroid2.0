import React from 'react';
import {
    FolderOpen,
    FileText,
    File,
    Image,
    Calendar,
    Search,
    Filter,
    Trash2,
    Download,
    Eye,
    User,
    Users,
    Stethoscope,
    HeartPulse,
    ArrowLeft,
    Lock,
    Unlock,
    Share2,
    Clock,
    FileArchive,
    FileImage,
    FileSpreadsheet,
    FilePlus,
    FileSearch,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from '@inertiajs/react';

export default function ArchivosCompartidosDescription() {
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
                        href="/archivos"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Archivos Compartidos
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <FolderOpen className="h-3.5 w-3.5" />
                        Gestión de Documentos
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Archivos Compartidos
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del componente para la visualización y gestión de documentos compartidos por pacientes en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Archivos Compartidos"</strong> permite al médico acceder a los documentos que los
                            pacientes han autorizado compartir. Esto incluye <strong>recetas, resultados de laboratorio, recomendaciones,
                                informes médicos</strong> y cualquier otro archivo que el paciente haya subido y permitido ver al profesional.
                            La interfaz está diseñada para una búsqueda y gestión rápida y eficiente.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Vista general y privacidad */}
                    <Section
                        title="1. Vista general y control de privacidad"
                        icon={<Lock className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo muestra únicamente los documentos que el paciente ha <strong>autorizado explícitamente</strong>
                                    para compartir con su médico. Un mensaje claro indica: <em>"Solo ves lo que el paciente autorizó"</em>,
                                    garantizando la confidencialidad y el cumplimiento de normativas de protección de datos.
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <Badge variant="outline" className="gap-1">
                                        <Lock className="h-3 w-3" /> Acceso restringido por autorización
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Unlock className="h-3 w-3" /> Solo documentos autorizados
                                    </Badge>
                                </div>
                                <p className="mt-3 text-sm">
                                    Esto asegura que el médico solo vea la información que el paciente ha decidido compartir voluntariamente.
                                </p>
                            </>
                        }
                    />

                    {/* 2. Búsqueda y filtros */}
                    <Section
                        title="2. Búsqueda y filtros avanzados"
                        icon={<Search className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Para facilitar la localización de archivos, la herramienta ofrece un panel de <strong>búsqueda y filtrado</strong>
                                    que permite:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Buscar por nombre del paciente:</strong> Campo de texto para escribir el nombre o parte del nombre.
                                    </li>
                                    <li>
                                        <strong>Filtro por fecha de subida:</strong> Dos campos de fecha (rango) para acotar los documentos por su fecha de carga.
                                    </li>
                                    <li>
                                        <strong>Botón "Limpiar":</strong> Restablece los filtros a su estado inicial.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1">
                                        <Search className="h-3 w-3" /> Buscar por nombre
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <Calendar className="h-3 w-3" /> Filtro por fecha
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <Filter className="h-3 w-3" /> Limpiar filtros
                                    </Badge>
                                </div>
                                <p className="mt-3 text-sm">
                                    También se muestra un contador de resultados, por ejemplo: <em>"Mostrando 2 de 2 pacientes con archivos"</em>.
                                </p>
                            </>
                        }
                    />

                    {/* 3. Lista de pacientes con archivos */}
                    <Section
                        title="3. Lista de pacientes con archivos compartidos"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El resultado de la búsqueda/filtro se presenta como una <strong>lista de pacientes</strong> que tienen al
                                    menos un documento compartido. Cada paciente muestra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Nombre del paciente:</strong> Ej. <span className="font-mono text-xs">Calisto Perez</span>.
                                    </li>
                                    <li>
                                        <strong>Número de documentos compartidos:</strong> Ej. <em>"2 documentos compartidos"</em>.
                                    </li>
                                    <li>
                                        <strong>Tabla de archivos:</strong> Una lista detallada con las columnas:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>ARCHIVO:</strong> Nombre del archivo (enlace o ícono).</li>
                                            <li><strong>TIPO:</strong> Categoría del documento (RECETA, LABORATORIO, RECOMENDACIÓN, etc.).</li>
                                            <li><strong>SUBIDO:</strong> Fecha de subida (ej. 2026-08-31).</li>
                                            <li><strong>ACCIONES:</strong> Botones para descargar, eliminar o ver (iconos de papelera, ojo, etc.).</li>
                                        </ul>
                                    </li>
                                </ul>
                                <div className="mt-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 text-xs">
                                    <div className="grid grid-cols-4 gap-2 font-medium text-slate-500 dark:text-slate-400 border-b pb-1">
                                        <span>ARCHIVO</span><span>TIPO</span><span>SUBIDO</span><span>ACCIONES</span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 py-1 border-b border-slate-200/50 dark:border-slate-700/50">
                                        <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-red-500" /> historical_132-1.pdf</span>
                                        <span><Badge variant="outline" className="text-xs">RECETA</Badge></span>
                                        <span>2026-08-31</span>
                                        <span><Trash2 className="h-3 w-3 text-red-400 inline" /></span>
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 py-1">
                                        <span className="flex items-center gap-1"><FileImage className="h-3 w-3 text-green-500" /> medibot_f.png</span>
                                        <span><Badge variant="outline" className="text-xs">LABORATORIO</Badge></span>
                                        <span>2026-08-10</span>
                                        <span><Trash2 className="h-3 w-3 text-red-400 inline" /></span>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    {/* 4. Detalle de archivos por paciente (vista individual) */}
                    <Section
                        title="4. Vista individual de archivos por paciente"
                        icon={<User className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al seleccionar un paciente específico (ej. <strong>fabio</strong>), se muestra un resumen con:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Nombre del paciente</strong> y el número de documentos compartidos (ej. "1 documento compartido").
                                    </li>
                                    <li>
                                        Una lista similar a la anterior, pero filtrada solo para ese paciente, con los mismos campos (archivo, tipo, fecha, acciones).
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Esta vista es útil para revisar toda la documentación de un paciente en particular sin distracciones.
                                </p>
                            </>
                        }
                    />

                    {/* 5. Tipos de archivos y categorías */}
                    <Section
                        title="5. Tipos de documentos y categorías"
                        icon={<FileText className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Los archivos se clasifican en diferentes tipos para facilitar su identificación y organización. Los tipos comunes incluyen:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>RECETA:</strong> Prescripción médica.</li>
                                    <li><strong>LABORATORIO:</strong> Resultados de exámenes de laboratorio.</li>
                                    <li><strong>RECOMENDACIÓN:</strong> Sugerencias o indicaciones del paciente o de otro profesional.</li>
                                    <li><strong>INFORME:</strong> Informes médicos detallados.</li>
                                    <li><strong>IMAGEN:</strong> Radiografías, ecografías, etc.</li>
                                    <li><strong>OTRO:</strong> Cualquier otro tipo de documento.</li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> RECETA</Badge>
                                    <Badge variant="outline" className="gap-1"><FileImage className="h-3 w-3" /> LABORATORIO</Badge>
                                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> RECOMENDACIÓN</Badge>
                                    <Badge variant="outline" className="gap-1"><File className="h-3 w-3" /> OTRO</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 6. Acciones sobre los archivos */}
                    <Section
                        title="6. Acciones disponibles sobre los archivos"
                        icon={<Download className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Para cada archivo, el médico puede realizar las siguientes acciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Descargar:</strong> Guardar el archivo en el dispositivo local.
                                    </li>
                                    <li>
                                        <strong>Eliminar:</strong> (Icono de papelera) Solo si el médico tiene permisos para borrar el archivo compartido (generalmente, solo el paciente puede eliminar, pero en algunos casos el médico puede ocultarlo).
                                    </li>
                                    <li>
                                        <strong>Ver/Previsualizar:</strong> Abrir el archivo en el navegador o en un visor integrado.
                                    </li>
                                    <li>
                                        <strong>Compartir:</strong> Reenviar el archivo a otro profesional (si la plataforma lo permite).
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Las acciones se representan con iconos claros (🗑️ para eliminar, 👁️ para ver, ⬇️ para descargar) que mejoran la usabilidad.
                                </p>
                            </>
                        }
                    />

                    {/* 7. Navegación y contexto */}
                    <Section
                        title="7. Contexto y navegación"
                        icon={<Share2 className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo <strong>"Archivos Compartidos"</strong> se encuentra dentro del área de <strong>Médicos</strong>,
                                    accesible desde el menú lateral. También se relaciona con otras secciones de la plataforma:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Mis Pacientes:</strong> Para ver el listado completo de pacientes.</li>
                                    <li><strong>Agenda de Citas:</strong> Para programar consultas y acceder a los archivos desde la cita.</li>
                                    <li><strong>Historial Clínico:</strong> Para integrar los documentos compartidos con el expediente.</li>
                                    <li><strong>Recetas:</strong> Para asociar archivos de recetas a las prescripciones.</li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1">
                                        <Users className="h-3 w-3" /> PACIENTES
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <Stethoscope className="h-3 w-3" /> BUSCAR MÉDICOS
                                    </Badge>
                                    <Badge variant="secondary" className="gap-1">
                                        <FileText className="h-3 w-3" /> TÉRMINOS DE SERVICIO
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FolderOpen className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Archivos Compartidos"</strong> es un <strong>gestor documental</strong> que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Visualización de documentos autorizados por los pacientes.</li>
                                    <li>Búsqueda avanzada por nombre y filtros de fecha.</li>
                                    <li>Listado organizado por paciente, mostrando todos sus archivos.</li>
                                    <li>Clasificación por tipo (receta, laboratorio, etc.).</li>
                                    <li>Acciones de descarga, eliminación y previsualización.</li>
                                    <li>Navegación integrada con el resto de módulos médicos.</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Esta herramienta agiliza el acceso a la información clínica compartida, mejorando la continuidad de la atención y la toma de decisiones.
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