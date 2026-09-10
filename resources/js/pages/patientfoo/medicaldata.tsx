import React from 'react';
import {
    HeartPulse,
    User,
    Phone,
    Mail,
    Calendar,
    Weight,
    Ruler,
    Shield,
    ShieldCheck,
    Lock,
    Edit,
    Save,
    X,
    PlusCircle,
    AlertCircle,
    CheckCircle,
    Info,
    Activity,
    FileText,
    ArrowLeft,
    Users,
    Eye,
    EyeOff,
    KeyRound,
    Database,
    Sparkles,
    HeartHandshake,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Link } from '@inertiajs/react';

export default function DatosMedicosDescription() {
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
                        href="/paciente/datos-medicos"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Ir a Datos Médicos
                    </Link>
                </div>
            </header>

            <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                {/* Encabezado del documento */}
                <div className="mb-10 text-center sm:text-left">
                    <Badge variant="outline" className="inline-flex items-center gap-2 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                        <FileText className="h-3.5 w-3.5" />
                        Información Personal y Médica
                    </Badge>
                    <h1 className="mt-3 text-3xl font-extrabold text-slate-900 sm:text-4xl dark:text-white">
                        Datos Médicos del Paciente
                    </h1>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        Descripción detallada del módulo donde el paciente registra, consulta y edita su información personal y médica en TuMediBot.
                    </p>
                </div>

                {/* Resumen introductorio */}
                <Card className="mb-8 border-slate-200 bg-white/80 shadow-sm backdrop-blur-sm dark:border-slate-800 dark:bg-slate-900/50">
                    <CardContent className="p-6">
                        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
                            El componente <strong>"Datos Médicos"</strong> es el espacio donde el paciente mantiene actualizada su
                            información personal y clínica dentro de <strong>TuMediBot</strong>. Aquí puede ver un resumen completo de
                            sus datos, editarlos cuando sea necesario y garantizar que su médico cuente con información precisa para
                            brindar una atención adecuada. Todos los datos sensibles se almacenan <strong>cifrados de extremo a extremo</strong>.
                        </p>
                    </CardContent>
                </Card>

                {/* Secciones */}
                <div className="space-y-6">
                    {/* 1. Vista general del módulo */}
                    <Section
                        title="1. Vista general del módulo"
                        icon={<Activity className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al acceder a <strong>"Datos Médicos"</strong>, el paciente encuentra un panel con:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Encabezado del módulo:</strong> Título "Datos Médicos" con el subtítulo <em>"Tu información personal y médica en un solo lugar"</em>.
                                    </li>
                                    <li>
                                        <strong>Ícono representativo:</strong> Un corazón con un check, que simboliza la salud y la verificación de datos.
                                    </li>
                                    <li>
                                        <strong>Indicador de seguridad:</strong> Una etiqueta verde con el texto <strong>"Datos cifrados de extremo a extremo"</strong>, que refuerza la privacidad.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="outline" className="gap-1 text-green-700 border-green-300 dark:text-green-400 dark:border-green-900/50">
                                        <ShieldCheck className="h-3 w-3" /> Cifrado de extremo a extremo
                                    </Badge>
                                    <Badge variant="outline" className="gap-1">
                                        <Lock className="h-3 w-3" /> Datos protegidos
                                    </Badge>
                                </div>
                            </>
                        }
                    />

                    {/* 2. Tabla de datos del paciente */}
                    <Section
                        title="2. Tabla de datos del paciente (vista de consulta)"
                        icon={<Eye className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    La vista principal muestra una tarjeta titulada <strong>"Mis Datos Médicos"</strong>, con un botón
                                    azul <strong>"Editar"</strong> en la esquina superior derecha. Debajo, hay una tabla con dos columnas:
                                    <strong> CAMPO</strong> y <strong>VALOR</strong>, que lista los siguientes datos:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Nombre Completo:</strong> Ej. <em>Calisto Perez</em>.</li>
                                    <li><strong>Teléfono:</strong> Ej. <em>02563214563215</em>.</li>
                                    <li><strong>Correo Electrónico:</strong> Ej. <em>calisto@gmail.com</em>.</li>
                                    <li><strong>Edad:</strong> Ej. <em>54 años</em>.</li>
                                    <li><strong>Peso:</strong> Ej. <em>58 kg</em>.</li>
                                    <li><strong>Estatura:</strong> Ej. <em>1.65 m</em>.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Cada campo está acompañado por un ícono representativo (persona, teléfono, correo, calendario, peso, regla),
                                    lo que facilita la lectura y aporta claridad visual.
                                </p>
                            </>
                        }
                    />

                    {/* 3. Edición de datos (modal) */}
                    <Section
                        title="3. Edición de datos médicos (modal)"
                        icon={<Edit className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Al hacer clic en el botón <strong>"Editar"</strong>, se abre un <strong>modal</strong> titulado
                                    <em> "Editar Datos Médicos"</em> con un subtítulo que recuerda: <em>"Actualiza tu información personal y médica. Los datos se guardan cifrados."</em>
                                </p>
                                <p className="mb-3">
                                    El formulario contiene los siguientes campos, cada uno con su ícono correspondiente:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Nombre Completo:</strong> Campo de texto (ej. <em>Calisto Perez</em>), actualmente en edición.
                                    </li>
                                    <li>
                                        <strong>Teléfono:</strong> Campo numérico (ej. <em>02563214563215</em>).
                                    </li>
                                    <li>
                                        <strong>Correo Electrónico:</strong> Campo de email (ej. <em>calisto@gmail.com</em>).
                                    </li>
                                    <li>
                                        <strong>Edad:</strong> Campo numérico con control de incremento (ej. <em>54</em>).
                                    </li>
                                    <li>
                                        <strong>Peso (kg):</strong> Campo numérico con control de incremento (ej. <em>58</em>).
                                    </li>
                                    <li>
                                        <strong>Estatura:</strong> Campo numérico decimal (ej. <em>1.65</em>).
                                    </li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    En la parte inferior hay un botón grande verde <strong>"Guardar Cambios"</strong>, seguido de dos botones
                                    adicionales: <strong>"Cancelar"</strong> (blanco) y <strong>"Guardar Cambios"</strong> (azul).
                                </p>
                            </>
                        }
                    />

                    {/* 4. Campos editables y su estructura */}
                    <Section
                        title="4. Detalle de los campos editables"
                        icon={<Database className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    Cada campo del formulario está diseñado para capturar información específica y validada:
                                </p>
                                <div className="space-y-2.5">
                                    <div className="flex items-start gap-2">
                                        <User className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Nombre Completo:</strong> Texto libre, obligatorio. Se usa para identificarte en la plataforma.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Phone className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Teléfono:</strong> Numérico, con formato internacional. Permite al médico contactarte.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Mail className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Correo Electrónico:</strong> Validado como email. Usado para notificaciones y acceso.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Calendar className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Edad:</strong> Numérico entero. Información relevante para el diagnóstico.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Weight className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Peso (kg):</strong> Numérico decimal. Dato antropométrico importante.
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Ruler className="h-4 w-4 text-sky-500 mt-0.5" />
                                        <div>
                                            <strong>Estatura:</strong> Numérico decimal (metros). Junto al peso, permite calcular el IMC.
                                        </div>
                                    </div>
                                </div>
                            </>
                        }
                    />

                    {/* 5. Seguridad y cifrado */}
                    <Section
                        title="5. Seguridad y cifrado de datos"
                        icon={<ShieldCheck className="h-5 w-5 text-green-500" />}
                        content={
                            <>
                                <Alert variant="default" className="border-green-200 bg-green-50/80 text-green-900 dark:border-green-900/40 dark:bg-green-950/30 dark:text-green-200">
                                    <ShieldCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    <AlertTitle className="font-semibold">Datos cifrados de extremo a extremo</AlertTitle>
                                    <AlertDescription>
                                        Toda la información personal y médica que ingresas está protegida mediante cifrado de extremo a extremo, garantizando que solo tú y tu médico autorizado puedan acceder a ella.
                                    </AlertDescription>
                                </Alert>
                                <ul className="list-disc pl-5 space-y-2.5 mt-3">
                                    <li>
                                        <strong>Encriptación en tránsito y en reposo:</strong> Los datos se cifran mientras viajan por la red y mientras están almacenados.
                                    </li>
                                    <li>
                                        <strong>Acceso restringido:</strong> Solo el paciente y los médicos con autorización pueden ver los datos.
                                    </li>
                                    <li>
                                        <strong>Cumplimiento normativo:</strong> Se siguen estándares internacionales de protección de datos de salud.
                                    </li>
                                </ul>
                            </>
                        }
                    />

                    {/* 6. Acciones disponibles */}
                    <Section
                        title="6. Acciones disponibles en el módulo"
                        icon={<Sparkles className="h-5 w-5 text-sky-500" />}
                        content={
                            <>
                                <p className="mb-3">
                                    El módulo "Datos Médicos" permite al paciente realizar las siguientes acciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li>
                                        <strong>Consultar:</strong> Ver todos sus datos en la tabla resumen.
                                    </li>
                                    <li>
                                        <strong>Editar:</strong> Abrir el modal de edición y modificar cualquier campo.
                                    </li>
                                    <li>
                                        <strong>Guardar:</strong> Confirmar los cambios realizados en el formulario.
                                    </li>
                                    <li>
                                        <strong>Cancelar:</strong> Cerrar el modal sin aplicar cambios.
                                    </li>
                                </ul>
                                <div className="mt-3 flex flex-wrap gap-2">
                                    <Badge variant="secondary" className="gap-1"><Eye className="h-3 w-3" /> Consultar</Badge>
                                    <Badge variant="secondary" className="gap-1"><Edit className="h-3 w-3" /> Editar</Badge>
                                    <Badge variant="secondary" className="gap-1"><Save className="h-3 w-3" /> Guardar</Badge>
                                    <Badge variant="secondary" className="gap-1"><X className="h-3 w-3" /> Cancelar</Badge>
                                </div>
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
                                    El módulo <strong>"Datos Médicos"</strong> se encuentra dentro del menú lateral, en la sección
                                    <strong> Paciente</strong>, junto a otras opciones:
                                </p>
                                <ul className="list-disc pl-5 space-y-2.5">
                                    <li><strong>Datos Médicos:</strong> Información personal y clínica del paciente.</li>
                                    <li><strong>Mis Archivos:</strong> Documentos compartidos por el paciente.</li>
                                    <li><strong>Mis Citas:</strong> Agenda de citas programadas.</li>
                                </ul>
                                <p className="mt-3 text-sm">
                                    Desde este módulo, el paciente mantiene su información lista para que el médico pueda acceder a ella
                                    durante las consultas, tanto presenciales como por videollamada.
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
                                    El componente <strong>"Datos Médicos"</strong> es el panel personal del paciente que integra:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Visualización de datos personales y médicos en tabla resumen.</li>
                                    <li>Edición de los campos mediante un modal intuitivo.</li>
                                    <li>Cifrado de extremo a extremo para proteger la información sensible.</li>
                                    <li>Íconos representativos que facilitan la lectura de cada dato.</li>
                                    <li>Botones claros para guardar o cancelar cambios.</li>
                                    <li>Integración con el resto del portal del paciente (archivos, citas).</li>
                                </ul>
                                <p className="mt-2 italic text-slate-500 dark:text-slate-400">
                                    Este módulo garantiza que el paciente tenga el control de su información, manteniéndola actualizada y segura para mejorar la calidad de la atención médica.
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