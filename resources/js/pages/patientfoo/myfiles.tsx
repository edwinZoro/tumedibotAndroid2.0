import React from 'react';
import {
    HeartPulse,
    FolderOpen,
    Upload,
    FileText,
    FileImage,
    Eye,
    Download,
    Share2,
    Trash2,
    Lock,
    ShieldCheck,
    Plus,
    X,
    ChevronDown,
    User,
    Users,
    HardDrive,
    Files,
    AlertCircle,
    CheckCircle,
    Info,
    Database,
    ArrowLeft,
    FolderLock,
    FilePlus,
    FileCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';

export default function MisArchivosDescription() {
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
                        href="/paciente/mis-archivos"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Mis Archivos
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <FolderOpen className="h-3.5 w-3.5" />
                        Bóveda Personal de Documentos
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Mis Archivos
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del módulo donde el paciente almacena, organiza y comparte sus documentos médicos en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Mis Archivos"</strong> es la <strong>bóveda personal de documentos médicos</strong> del
                            paciente dentro de <strong>TuMediBot</strong>. Aquí el paciente puede subir archivos (recetas, exámenes,
                            radiologías, laboratorios, recomendaciones), organizarlos por tipo, verlos, descargarlos, compartirlos con
                            sus médicos o eliminarlos. El acceso es <strong>privado</strong>: solo el paciente decide qué comparte y con quién.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Vista general */}
                    <Section
                        title="1. Vista general del módulo"
                        icon={<FolderOpen className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al acceder a <strong>"Mis Archivos"</strong>, el paciente visualiza un panel con:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Encabezado:</strong> Título "Mis Archivos" con el subtítulo <em>"Tu bóveda personal de documentos médicos"</em>.
                                    </li>
                                    <li>
                                        <strong>Ícono representativo:</strong> Una carpeta azul que simboliza el almacenamiento seguro.
                                    </li>
                                    <li>
                                        <strong>Indicador de seguridad:</strong> Una etiqueta verde con el texto <strong>"Acceso privado - compartes solo lo que tú decides"</strong>.
                                    </li>
                                    <li>
                                        <strong>Panel "Mi Bóveda":</strong> Título con el subtítulo <em>"Almacenamiento privado - el médico solo ve lo que compartes"</em>.
                                    </li>
                                    <li>
                                        <strong>Botón "Subir Archivo":</strong> Botón azul en la esquina superior derecha del panel.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1 text-green-700 border-green-300 dark:text-green-400 dark:border-green-900/50">
                                        <Lock className="h-3 w-3" /> Acceso privado
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <ShieldCheck className="h-3 w-3" /> Compartes solo lo que decides
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Tabla de archivos */}
                    <Section
                        title="2. Tabla de archivos de la bóveda"
                        icon={<Files className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El cuerpo del módulo muestra una <strong>tabla</strong> con todos los archivos que el paciente ha subido
                                    a su bóveda. Las columnas son:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>ARCHIVO:</strong> Nombre del archivo con su extensión (ej. <span className="font-mono text-xs">historical_132-1.pdf</span>, <span className="font-mono text-xs">medibot_f.png</span>).
                                    </li>
                                    <li>
                                        <strong>TIPO:</strong> Categoría del documento, mostrada como badge (ej. <em>RECETA</em>, <em>LABORATORIO</em>).
                                    </li>
                                    <li>
                                        <strong>COMPARTIDO CON:</strong> Nombre(s) del médico(s) con quien se ha compartido el archivo (ej. <em>Calisto Mendez</em>). Si no se ha compartido, se muestra un guion "—".
                                    </li>
                                    <li>
                                        <strong>TAMAÑO:</strong> Tamaño del archivo (en la captura aparece con un guion "—", pero normalmente se mostraría en KB/MB).
                                    </li>
                                    <li>
                                        <strong>ACCIONES:</strong> Conjunto de botones para realizar operaciones sobre el archivo:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>Ver (ojo):</strong> Previsualizar el documento.</li>
                                            <li><strong>Descargar (flecha hacia abajo):</strong> Guardar el archivo localmente.</li>
                                            <li><strong>Compartir:</strong> Botón con borde azul para compartir con un médico.</li>
                                            <li><strong>Eliminar (papelera roja):</strong> Borrar el archivo de la bóveda.</li>
                                        </ul>
                                    </li>
                                </ul>
                                <div className="mt-3 bg-slate-100 dark:bg-slate-800/50 rounded-lg p-4 text-xs">
                                    <div className="grid grid-cols-5 gap-2 font-medium text-slate-500 dark:text-slate-400 border-b pb-1">
                                        <span>ARCHIVO</span><span>TIPO</span><span>COMPARTIDO CON</span><span>TAMAÑO</span><span>ACCIONES</span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 py-2 border-b border-slate-200/50 dark:border-slate-700/50 items-center">
                                        <span className="flex items-center gap-1"><FileText className="h-3 w-3 text-red-500" /> historical_132-1.pdf</span>
                                        <span><Badge variant="outline" className="text-xs">RECETA</Badge></span>
                                        <span><Badge variant="outline" className="text-xs">Calisto Mendez</Badge></span>
                                        <span>—</span>
                                        <span className="flex gap-1"><Eye className="h-3 w-3" /><Download className="h-3 w-3" /><Share2 className="h-3 w-3 text-blue-500" /><Trash2 className="h-3 w-3 text-red-400" /></span>
                                    </div>
                                    <div className="grid grid-cols-5 gap-2 py-2 items-center">
                                        <span className="flex items-center gap-1"><FileImage className="h-3 w-3 text-green-500" /> medibot_f.png</span>
                                        <span><Badge variant="outline" className="text-xs">LABORATORIO</Badge></span>
                                        <span><Badge variant="outline" className="text-xs">Calisto Mendez</Badge></span>
                                        <span>—</span>
                                        <span className="flex gap-1"><Eye className="h-3 w-3" /><Download className="h-3 w-3" /><Share2 className="h-3 w-3 text-blue-500" /><Trash2 className="h-3 w-3 text-red-400" /></span>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    {/* 3. Modal de subida de archivo */}
                    <Section
                        title="3. Modal para subir un archivo"
                        icon={<Upload className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al hacer clic en el botón <strong>"Subir Archivo"</strong>, se abre un <strong>modal</strong> titulado
                                    <em> "Subir a mi Bóveda"</em>, con el subtítulo: <em>"El archivo queda almacenado de forma privada. Solo tú lo ves hasta que decidas compartirlo con un médico."</em>
                                </p>
                                <p className="mb-3">El formulario del modal contiene:</p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>ARCHIVO:</strong> Campo para examinar archivos con el texto <em>"Examinar... No se ha seleccionado ningún archivo."</em>
                                    </li>
                                    <li>
                                        <strong>TIPO DE DOCUMENTO:</strong> Un menú desplegable con las siguientes opciones:
                                        <ul className="list-circle pl-5 mt-1 space-y-1">
                                            <li><strong>Examen</strong></li>
                                            <li><strong>Radiología</strong></li>
                                            <li><strong>Receta</strong></li>
                                            <li><strong>Laboratorio</strong></li>
                                            <li><strong>Recomendación</strong></li>
                                            <li><strong>Otro</strong></li>
                                        </ul>
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    En la parte inferior hay dos botones: <strong>"Cancelar"</strong> (blanco) y <strong>"Subir"</strong> (azul),
                                    que se habilita una vez seleccionado el archivo y el tipo.
                                </p>
                            </>
                        }
                    />

                    {/* 4. Tipos de documentos */}
                    <Section
                        title="4. Tipos de documentos soportados"
                        icon={<FileText className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo permite clasificar los archivos en diferentes categorías para facilitar su organización y
                                    búsqueda posterior:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Examen:</strong> Resultados de exámenes médicos generales.</li>
                                    <li><strong>Radiología:</strong> Imágenes de rayos X, tomografías, resonancias, etc.</li>
                                    <li><strong>Receta:</strong> Prescripciones médicas emitidas por profesionales.</li>
                                    <li><strong>Laboratorio:</strong> Resultados de análisis clínicos.</li>
                                    <li><strong>Recomendación:</strong> Indicaciones o sugerencias de otros especialistas.</li>
                                    <li><strong>Otro:</strong> Cualquier documento que no encaje en las categorías anteriores.</li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> Examen</Badge>
                                    <Badge variant="outline" className="gap-1"><FileImage className="h-3 w-3" /> Radiología</Badge>
                                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> Receta</Badge>
                                    <Badge variant="outline" className="gap-1"><FileText className="h-3 w-3" /> Laboratorio</Badge>
                                    <Badge variant="outline" className="gap-1"><FileCheck className="h-3 w-3" /> Recomendación</Badge>
                                    <Badge variant="outline" className="gap-1"><FilePlus className="h-3 w-3" /> Otro</Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 5. Acciones sobre archivos */}
                    <Section
                        title="5. Acciones disponibles sobre cada archivo"
                        icon={<Share2 className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Cada archivo de la tabla cuenta con una serie de acciones que permiten gestionarlo:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Ver:</strong> Previsualizar el archivo en un visor integrado sin descargarlo.
                                    </li>
                                    <li>
                                        <strong>Descargar:</strong> Guardar el archivo en el dispositivo local del paciente.
                                    </li>
                                    <li>
                                        <strong>Compartir:</strong> Enviar el archivo a un médico específico de la plataforma. Al hacer clic se
                                        abre un selector con la lista de médicos disponibles.
                                    </li>
                                    <li>
                                        <strong>Eliminar:</strong> Borrar el archivo de la bóveda de forma permanente (con confirmación previa).
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Todas las acciones se representan con íconos claros e intuitivos que agilizan su uso.
                                </p>
                            </>
                        }
                    />

                    {/* 6. Privacidad y control */}
                    <Section
                        title="6. Privacidad y control del paciente"
                        icon={<Lock className="h-5 w-5 text-green-500" />}
                        content={
                            <>
                                <Alert variant="default" className="border-green-200 bg-green-50/80 text-green-900 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
                                    <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="font-semibold">Acceso privado - compartes solo lo que tú decides</AlertTitle>
                                    <AlertDescription>
                                        El paciente tiene el control total sobre sus documentos. Ningún médico puede ver un archivo a menos que el paciente lo comparta explícitamente.
                                    </AlertDescription>
                                </Alert>
                                <ul className="list-disc pl-5 space-y-2.5 mt-3">
                                    <li>
                                        <strong>Almacenamiento privado:</strong> Los archivos están cifrados y solo accesibles por el paciente.
                                    </li>
                                    <li>
                                        <strong>Compartir selectivo:</strong> El paciente elige qué archivo compartir y con qué médico.
                                    </li>
                                    <li>
                                        <strong>Revocación de acceso:</strong> El paciente puede dejar de compartir un archivo en cualquier momento.
                                    </li>
                                    <li>
                                        <strong>Registro de accesos:</strong> El paciente puede ver quién ha accedido a sus documentos.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 7. Navegación y contexto */}
                    <Section
                        title="7. Navegación y contexto dentro de la plataforma"
                        icon={<Users className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo <strong>"Mis Archivos"</strong> se encuentra dentro del menú lateral, en la sección
                                    <strong> Paciente</strong>, junto a otras opciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Datos Médicos:</strong> Información personal y clínica del paciente.</li>
                                    <li><strong>Mis Archivos:</strong> Bóveda personal de documentos médicos.</li>
                                    <li><strong>Mis Citas:</strong> Agenda de citas programadas.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Desde este módulo, el paciente puede organizar su documentación clínica y compartirla con los médicos
                                    que lo atienden, facilitando la continuidad de la atención.
                                </p>
                            </>
                        }
                    />

                    {/* Resumen funcional */}
                    <Card className="border-sky-200 bg-sky-50/80 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                        <CardContent className="p-6">
                            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FolderLock className="h-5 w-5 text-sky-600 dark:text-sky-400" />
                                Resumen funcional
                            </h2>
                            <div className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 space-y-2.5">
                                <p>
                                    El componente <strong>"Mis Archivos"</strong> es la bóveda personal de documentos médicos que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Almacenamiento privado y cifrado de documentos médicos.</li>
                                    <li>Subida de archivos con clasificación por tipo (examen, receta, laboratorio, etc.).</li>
                                    <li>Tabla organizada con columnas de archivo, tipo, compartido con, tamaño y acciones.</li>
                                    <li>Acciones de ver, descargar, compartir y eliminar.</li>
                                    <li>Control total del paciente sobre qué comparte y con quién.</li>
                                    <li>Integración con el portal del paciente (Datos Médicos, Mis Citas).</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Este módulo empodera al paciente para gestionar su información clínica de forma segura y compartirla solo cuando lo considere necesario.
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