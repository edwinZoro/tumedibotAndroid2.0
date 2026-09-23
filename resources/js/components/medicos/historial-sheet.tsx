import {
    Loader2,
    FileText,
    X,
    Edit,
    Trash2,
    Download,
    Share2,
    CheckCircle2,
    Mail,
    Send,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { HistorialForm } from './historial-form';

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
    const [pacienteEmail, setPacienteEmail] = useState<string | null>(null);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);
    const [medicoConfigurado, setMedicoConfigurado] = useState(true);

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
                setPacienteEmail(data.paciente_email ?? null);
                setMedicoConfigurado(data.medico_configurado ?? true);
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
        if (!historial) {
            return;
        }

        if (!confirm('¿Estás seguro de eliminar este historial?')) {
            return;
        }

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
        if (!historial) {
            return;
        }

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

    const abrirDialogEmail = () => {
        if (!pacienteEmail) {
            toast.error(
                'Este paciente no tiene un correo electrónico registrado.',
            );

            return;
        }

        setEmailInput(pacienteEmail);
        setEmailDialogOpen(true);
    };

    const handleEnviarEmail = async () => {
        if (!historial) {
            return;
        }

        setSendingEmail(true);

        try {
            const res = await fetch(
                `/medico/historial/${historial.id}/enviar-email`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({ email: emailInput }),
                },
            );
            const data = await res.json();

            if (res.ok && data.success) {
                toast.success(`Historial enviado por correo a ${data.email}`);
                setEmailDialogOpen(false);
            } else {
                toast.error(data.message ?? 'No se pudo enviar el correo.');
            }
        } catch {
            toast.error('Error al enviar el correo.');
        } finally {
            setSendingEmail(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
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
                    </div>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto pb-24">
                    {loading ? (
                        <div className="flex h-full flex-col items-center justify-center text-slate-500">
                            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                            <p>Cargando información clínica...</p>
                        </div>
                    ) : (
                        <>
                            {isEditing ? (
                                <>
                                    {!medicoConfigurado && (
                                        <div className="mx-4 mt-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/30">
                                            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
                                            <div>
                                                <p className="text-sm font-bold text-amber-700 dark:text-amber-300">
                                                    Configuración incompleta
                                                </p>
                                                <p className="text-xs text-amber-600 dark:text-amber-400">
                                                    Debes configurar tu firma,
                                                    sello y datos de
                                                    Hospital/Clínica desde el
                                                    Área Médica antes de crear
                                                    un historial.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <HistorialForm
                                        citaId={citaId!}
                                        historial={historial}
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
                                </>
                            ) : historial ? (
                                <div className="space-y-6 p-4 sm:p-6">
                                    <div className="mb-4 flex flex-wrap justify-center sm:justify-end gap-2">
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
                                            className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                                            onClick={abrirDialogEmail}
                                        >
                                            <Mail className="mr-2 h-4 w-4" />{' '}
                                            Enviar por email
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

            {/* Diálogo de confirmación para envío por email */}
            <Dialog
                open={emailDialogOpen}
                onOpenChange={(v) => !sendingEmail && setEmailDialogOpen(v)}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-emerald-600" />
                            Enviar historial por email
                        </DialogTitle>
                        <DialogDescription>
                            Se enviará el PDF del historial clínico #
                            {historial?.id} al correo indicado.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2 py-2">
                        <label className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                            Correo del paciente
                        </label>
                        <Input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            placeholder="correo@ejemplo.com"
                            disabled={sendingEmail}
                        />
                    </div>
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEmailDialogOpen(false)}
                            disabled={sendingEmail}
                        >
                            Cancelar
                        </Button>
                        <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            onClick={handleEnviarEmail}
                            disabled={sendingEmail || !emailInput.trim()}
                        >
                            {sendingEmail ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Enviar
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Sheet>
    );
}
