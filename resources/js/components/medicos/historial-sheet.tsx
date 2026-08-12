import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import {
    Loader2,
    FileText,
    X,
    Edit,
    Trash2,
    Download,
    Share2,
    CheckCircle2,
} from 'lucide-react';
import { HistorialForm } from './historial-form';
import { toast } from 'sonner';

interface HistorialSheetProps {
    citaId: number | null;
    open: boolean;
    onClose: () => void;
}

export function HistorialSheet({ citaId, open, onClose }: HistorialSheetProps) {
    const [loading, setLoading] = useState(false);
    const [historial, setHistorial] = useState<any>(null);
    const [medicoSettings, setMedicoSettings] = useState<any>({});
    const [isEditing, setIsEditing] = useState(false);
    const [compartido, setCompartido] = useState(false);
    const [toggling, setToggling] = useState(false);

    useEffect(() => {
        if (open && citaId) {
            fetchHistorial();
        } else {
            setHistorial(null);
            setIsEditing(false);
        }
    }, [open, citaId]);

    const fetchHistorial = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/medico/historial/${citaId}`);
            if (res.ok) {
                const data = await res.json();
                setHistorial(data.historial);
                setCompartido(data.historial?.compartido ?? false);
                setMedicoSettings({
                    firma: data.firma_medico,
                    sello: data.sello_medico,
                    logo: data.logo,
                    sello_hospital: data.sello_hospital,
                    nombre_hospital: data.nombre_hospital,
                    direccion_hospital: data.direccion_hospital,
                });
                setIsEditing(!data.historial);
            }
        } catch (e) {
            console.error('Error fetching historial:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!historial) return;
        if (!confirm('¿Estás seguro de eliminar este historial?')) return;

        try {
            const res = await fetch(`/medico/historial/${historial.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
            });

            if (res.ok) {
                toast.success('Historial eliminado correctamente');
                setHistorial(null);
                setMedicoSettings({});
                setIsEditing(true);
            } else {
                toast.error('Error al eliminar el historial');
            }
        } catch {
            toast.error('Error al eliminar el historial');
        }
    };

    const handleToggleCompartir = async () => {
        if (!historial) return;
        setToggling(true);
        try {
            const res = await fetch(
                `/medico/historial/${historial.id}/compartir`,
                {
                    method: 'PATCH',
                    headers: {
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                        Accept: 'application/json',
                    },
                },
            );
            if (res.ok) {
                const data = await res.json();
                setCompartido(data.compartido);
                toast.success(
                    data.compartido
                        ? 'Historial compartido con el paciente'
                        : 'Historial dejado de compartir',
                );
            } else {
                toast.error('Error al cambiar el estado de compartir');
            }
        } catch {
            toast.error('Error al cambiar el estado de compartir');
        } finally {
            setToggling(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
            >
                {/* Header */}
                <SheetHeader className="border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-teal-500 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner">
                                <FileText className="h-5 w-5 text-white" />
                            </span>
                            <div>
                                <SheetTitle className="text-base font-bold text-white">
                                    Historial Clínico
                                </SheetTitle>
                                <p className="text-[11px] font-medium text-white/70">
                                    Gestión de la cita clínica
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="flex h-full flex-col items-center justify-center text-slate-500">
                            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                            <p>Cargando información clínica...</p>
                        </div>
                    ) : (
                        <>
                            {isEditing ? (
                                <HistorialForm
                                    citaId={citaId!}
                                    historial={historial}
                                    medicoFirma={medicoSettings.firma}
                                    medicoSello={medicoSettings.sello}
                                    medicoLogo={medicoSettings.logo}
                                    selloHospital={
                                        medicoSettings.sello_hospital
                                    }
                                    nombreHospital={
                                        medicoSettings.nombre_hospital
                                    }
                                    direccionHospital={
                                        medicoSettings.direccion_hospital
                                    }
                                    onSuccess={() => {
                                        fetchHistorial();
                                        setIsEditing(false);
                                        onClose();
                                    }}
                                    onCancel={() =>
                                        historial
                                            ? setIsEditing(false)
                                            : onClose()
                                    }
                                />
                            ) : historial ? (
                                <div className="space-y-6 p-6">
                                    <div className="mb-4 flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setIsEditing(true)}
                                        >
                                            <Edit className="mr-2 h-4 w-4" />{' '}
                                            Editar
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={handleDelete}
                                        >
                                            <Trash2 className="mr-2 h-4 w-4" />{' '}
                                            Eliminar
                                        </Button>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="bg-sky-600 hover:bg-sky-700"
                                            onClick={() =>
                                                window.open(
                                                    `/medico/historial/${historial.id}/pdf`,
                                                    '_blank',
                                                )
                                            }
                                        >
                                            <Download className="mr-2 h-4 w-4" />{' '}
                                            Descargar PDF
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            disabled={toggling}
                                            className={
                                                compartido
                                                    ? 'border-emerald-500 text-emerald-600 hover:bg-emerald-50'
                                                    : ''
                                            }
                                            onClick={handleToggleCompartir}
                                        >
                                            {compartido ? (
                                                <>
                                                    <CheckCircle2 className="mr-2 h-4 w-4" />{' '}
                                                    Compartido
                                                </>
                                            ) : (
                                                <>
                                                    <Share2 className="mr-2 h-4 w-4" />{' '}
                                                    Compartir
                                                </>
                                            )}
                                        </Button>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                            <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                Diagnóstico
                                            </h4>
                                            <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                {historial.diagnostico}
                                            </p>
                                        </div>
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                            <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                Tratamiento
                                            </h4>
                                            <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                {historial.tratamiento}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            {historial.examen_fisico && (
                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                    <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                        Examen Físico
                                                    </h4>
                                                    <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                        {
                                                            historial.examen_fisico
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {historial.examen_funcional && (
                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                    <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                        Examen Funcional
                                                    </h4>
                                                    <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                        {
                                                            historial.examen_funcional
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {historial.examen_paraclinico && (
                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                    <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                        Examen Paraclínico
                                                    </h4>
                                                    <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                        {
                                                            historial.examen_paraclinico
                                                        }
                                                    </p>
                                                </div>
                                            )}
                                            {historial.conclusiones && (
                                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                    <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                        Conclusiones
                                                    </h4>
                                                    <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                        {historial.conclusiones}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
