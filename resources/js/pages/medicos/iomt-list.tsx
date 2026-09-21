import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, ShieldCheck, UserCircle, ArrowRight } from 'lucide-react';
import Footer from '@/components/footer';

interface Paciente {
    id: number;
    nombre_paciente: string;
    email_paciente: string;
    share_iomt_data: boolean;
}

interface Props {
    pacientes: Paciente[];
}

export default function IoMTList({ pacientes = [] }: Props) {
    return (
        <div className="flex min-h-screen flex-col justify-between">
            <Head title="Monitorización IoMT de Pacientes" />

            <div className="container mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/5 dark:bg-black/20 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm backdrop-blur-md">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-blue-600 dark:from-teal-400 dark:to-blue-500 flex items-center gap-3">
                            <Activity className="h-8 w-8 text-teal-500" />
                            Monitorización IoMT
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-500" />
                            Acceso en tiempo real a los dispositivos médicos compartidos por sus pacientes
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pacientes.length === 0 ? (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-white/50 dark:bg-slate-900/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                            No hay pacientes que estén compartiendo sus datos de dispositivos actualmente.
                        </div>
                    ) : (
                        pacientes.map(paciente => (
                            <Link 
                                key={paciente.id} 
                                href={`/medico/monitorizacion-iomt/${paciente.id}`}
                                className="block group"
                            >
                                <Card className="h-full border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="bg-teal-100 dark:bg-teal-900/30 p-3 rounded-full text-teal-600 dark:text-teal-400 group-hover:scale-110 transition-transform">
                                                <UserCircle className="h-8 w-8" />
                                            </div>
                                            <div className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs px-2 py-1 rounded-full font-semibold flex items-center gap-1">
                                                <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                                                Activo
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <CardTitle className="text-xl mb-1">{paciente.nombre_paciente}</CardTitle>
                                        <CardDescription className="flex items-center text-slate-500 justify-between mt-4">
                                            <span>Ver telemetría en vivo</span>
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </CardDescription>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
