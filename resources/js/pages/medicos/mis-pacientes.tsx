import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    FileText,
    Hourglass,
    Mail,
    Phone,
    Ruler,
    Search,
    ShieldCheck,
    Sparkles,
    Stethoscope,
    StickyNote,
    UserPlus,
    UserRound,
    Users,
    Weight,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { AgregarPacienteDialog } from '@/components/medicos/agregar-paciente-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { pacientes as pacientesMedico } from '@/routes/medicos';

interface PacienteProp {
    id: number;
    nombre: string;
    email?: string | null;
    telefono?: string | null;
    edad?: number | null;
    peso?: number | null;
    estatura?: string | null;
    origen?: string | null;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedPacientes {
    data: PacienteProp[];
    links: PaginationLink[];
}

interface Props {
    tieneMedico: boolean;
    pacientes: PaginatedPacientes;
    filters?: { q?: string };
}

export default function MisPacientes({
    tieneMedico,
    pacientes,
    filters,
}: Props) {
    const [busqueda, setBusqueda] = useState(filters?.q ?? '');
    const [dialogoAbierto, setDialogoAbierto] = useState(false);

    const buscar = (e: React.FormEvent) => {
        e.preventDefault();
        router.get(
            pacientesMedico.url({
                query: { q: busqueda.trim() || undefined },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    };

    const proximamente = () =>
        toast('Próximamente · este módulo estará disponible.');

    return (
        <div className="min-h-screen bg-slate-50 pb-12 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head title="Mis Pacientes · TuMediBot" />

            <section className="relative overflow-hidden bg-blue-50/50 pt-12 pb-16 lg:pt-16 lg:pb-20 dark:bg-[#0b1121]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
                <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/15" />
                <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[100px] dark:bg-sky-500/15" />

                <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                        <div className="flex items-center gap-4 text-center md:text-left">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <Users className="h-8 w-8 text-white" />
                                <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
                                </div>
                            </div>
                            <div>
                                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                    Mis Pacientes
                                </h1>
                                <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 md:justify-start dark:text-sky-400">
                                    <Sparkles className="h-4 w-4" /> Los
                                    pacientes de tu consultorio en un solo lugar
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/60 px-4 py-2 text-[11px] font-bold tracking-wide text-emerald-600 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-emerald-400">
                            <ShieldCheck className="h-4 w-4" />
                            Privado · solo tú ves los datos
                        </div>
                    </div>
                </div>
            </section>

            <main className="relative z-20 mx-auto -mt-8 max-w-6xl px-4 sm:px-6 lg:px-8">
                {!tieneMedico ? (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardContent className="flex flex-col items-center gap-3 px-6 py-16 text-center">
                            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                                <UserRound className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                                Completa tu perfil de médico
                            </h3>
                            <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
                                Necesitas un perfil médico activo para gestionar
                                tus pacientes.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-sky-400" />
                        <CardHeader className="flex flex-col gap-4 border-b border-slate-100 bg-slate-50 pt-6 pb-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800 dark:bg-slate-800/30">
                            <div>
                                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                                    <UserRound className="h-5 w-5 text-sky-500" />
                                    Lista de pacientes
                                </CardTitle>
                                <CardDescription className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                    Registra pacientes de consultorio y accede a
                                    su información
                                </CardDescription>
                            </div>
                            <Button
                                className="h-11 shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-sky-400"
                                onClick={() => setDialogoAbierto(true)}
                            >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Agregar Paciente
                            </Button>
                        </CardHeader>

                        <CardContent className="space-y-4 p-4">
                            <form onSubmit={buscar} className="relative">
                                <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-24 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    placeholder="Buscar por nombre..."
                                    value={busqueda}
                                    onChange={(e) =>
                                        setBusqueda(e.target.value)
                                    }
                                />
                                <Button
                                    type="submit"
                                    size="sm"
                                    className="absolute top-1/2 right-2 h-8 -translate-y-1/2 rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 px-3 text-xs font-semibold"
                                >
                                    Buscar
                                </Button>
                            </form>

                            {pacientes.data.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-10 text-center dark:border-slate-700 dark:bg-slate-900/40">
                                    <Hourglass className="h-8 w-8 text-slate-300" />
                                    <p className="text-sm font-semibold text-slate-500">
                                        Aún no tienes pacientes
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        Agrega un paciente de consultorio con el
                                        botón superior.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/80 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                                        <Table>
                                            <TableHeader className="bg-slate-50/80 dark:bg-slate-800/20">
                                                <TableRow className="hover:bg-transparent">
                                                    <TableHead className="h-12 pl-6 text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                        Paciente
                                                    </TableHead>
                                                    <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase md:table-cell dark:text-slate-400">
                                                        Contacto
                                                    </TableHead>
                                                    <TableHead className="hidden text-[11px] font-bold tracking-widest text-slate-500 uppercase sm:table-cell dark:text-slate-400">
                                                        Datos
                                                    </TableHead>
                                                    <TableHead className="pr-6 text-right text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                                        Historial · Recetas ·
                                                        Notas
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pacientes.data.map(
                                                    (paciente) => (
                                                        <TableRow
                                                            key={paciente.id}
                                                        >
                                                            <TableCell className="pl-6">
                                                                <span className="flex items-center gap-3">
                                                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 shadow-sm">
                                                                        <UserRound className="h-5 w-5 text-white" />
                                                                    </span>
                                                                    <span className="min-w-0">
                                                                        <span className="block truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                                            {
                                                                                paciente.nombre
                                                                            }
                                                                        </span>
                                                                        <Badge className="mt-1 border-transparent bg-sky-100 text-[10px] font-bold text-sky-700 uppercase dark:bg-sky-500/15 dark:text-sky-300">
                                                                            {paciente.origen ===
                                                                            'medico'
                                                                                ? 'Consultorio'
                                                                                : 'Paciente app'}
                                                                        </Badge>
                                                                    </span>
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="hidden md:table-cell">
                                                                <span className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Mail className="h-3 w-3 text-sky-500" />
                                                                        {paciente.email ??
                                                                            '—'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1.5">
                                                                        <Phone className="h-3 w-3 text-sky-500" />
                                                                        {paciente.telefono ??
                                                                            '—'}
                                                                    </span>
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="hidden sm:table-cell">
                                                                <span className="flex flex-wrap gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                                                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                                                                        <Activity className="h-3 w-3 text-violet-500" />
                                                                        {paciente.edad !=
                                                                        null
                                                                            ? `${paciente.edad} años`
                                                                            : '—'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                                                                        <Weight className="h-3 w-3 text-amber-500" />
                                                                        {paciente.peso !=
                                                                        null
                                                                            ? `${paciente.peso} kg`
                                                                            : '—'}
                                                                    </span>
                                                                    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">
                                                                        <Ruler className="h-3 w-3 text-rose-500" />
                                                                        {paciente.estatura
                                                                            ? `${paciente.estatura} m`
                                                                            : '—'}
                                                                    </span>
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="pr-6">
                                                                <div className="flex flex-wrap justify-end gap-1.5">
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={
                                                                            proximamente
                                                                        }
                                                                        className="rounded-xl text-[11px] font-semibold"
                                                                    >
                                                                        <FileText className="mr-1 h-3.5 w-3.5" />
                                                                        Historial
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={
                                                                            proximamente
                                                                        }
                                                                        className="rounded-xl text-[11px] font-semibold"
                                                                    >
                                                                        <FileText className="mr-1 h-3.5 w-3.5 text-emerald-500" />
                                                                        Recetas
                                                                    </Button>
                                                                    <Button
                                                                        size="sm"
                                                                        variant="outline"
                                                                        onClick={
                                                                            proximamente
                                                                        }
                                                                        className="rounded-xl text-[11px] font-semibold"
                                                                    >
                                                                        <StickyNote className="mr-1 h-3.5 w-3.5 text-amber-500" />
                                                                        Notas
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ),
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {pacientes.links.length > 3 && (
                                        <div className="flex flex-wrap items-center justify-center gap-1.5">
                                            {pacientes.links.map(
                                                (link, index) => (
                                                    <Link
                                                        key={index}
                                                        href={link.url || '#'}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                        className={cn(
                                                            'rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 select-none',
                                                            link.active
                                                                ? 'border-blue-600 bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30'
                                                                : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white',
                                                            !link.url &&
                                                                'pointer-events-none cursor-not-allowed opacity-40',
                                                        )}
                                                        preserveState
                                                        preserveScroll
                                                    />
                                                ),
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </CardContent>
                    </Card>
                )}
            </main>

            <AgregarPacienteDialog
                open={dialogoAbierto}
                onOpenChange={setDialogoAbierto}
            />
        </div>
    );
}
