import {
    CheckCircle2,
    Download,
    Edit,
    Loader2,
    Mail,
    Pill,
    Send,
    Share2,
    Trash2,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
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
import { RecetaForm } from './receta-form';

interface RecetaSheetProps {
    citaId: number | null;
    open: boolean;
    onClose: () => void;
}

export function RecetaSheet({ citaId, open, onClose }: RecetaSheetProps) {
    const [loading, setLoading] = useState(false);
    const [receta, setReceta] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [compartido, setCompartido] = useState(false);
    const [toggling, setToggling] = useState(false);
    const [pacienteEmail, setPacienteEmail] = useState<string | null>(null);
    const [medicoConfigurado, setMedicoConfigurado] = useState(true);
    const [emailDialogOpen, setEmailDialogOpen] = useState(false);
    const [emailInput, setEmailInput] = useState('');
    const [sendingEmail, setSendingEmail] = useState(false);

    const fetchReceta = async () => {
        setLoading(true);

        try {
            const res = await fetch(`/medico/receta/${citaId}`);

            if (res.ok) {
                const data = await res.json();
                setReceta(data.receta);
                setCompartido(data.receta?.compartido ?? false);
                setPacienteEmail(data.paciente_email ?? null);
                setMedicoConfigurado(data.medico_configurado ?? true);
                setIsEditing(!data.receta);
            }
        } catch (e) {
            console.error('Error fetching receta:', e);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (open && citaId) {
            fetchReceta();
        } else {
            setReceta(null);
            setIsEditing(false);
        }
    }, [open, citaId]);

    const handleDelete = async () => {
        if (!receta) {
            return;
        }

        if (!confirm('¿Estás seguro de eliminar esta receta?')) {
            return;
        }

        try {
            const res = await fetch(`/medico/receta/${receta.id}`, {
                method: 'DELETE',
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
            });

            if (res.ok) {
                toast.success('Receta eliminada');
                setReceta(null);
                setIsEditing(true);
            } else {
                toast.error('Error al eliminar la receta');
            }
        } catch {
            toast.error('Error al eliminar la receta');
        }
    };

    const handleToggleCompartir = async () => {
        if (!receta) {
            return;
        }

        setToggling(true);

        try {
            const res = await fetch(`/medico/receta/${receta.id}/compartir`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
            });

            if (res.ok) {
                const data = await res.json();
                setCompartido(data.compartido);
                toast.success(
                    data.compartido
                        ? 'Receta compartida con el paciente'
                        : 'Receta dejada de compartir',
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
        if (!receta) {
            return;
        }

        setSendingEmail(true);

        try {
            const res = await fetch(
                `/medico/receta/${receta.id}/enviar-email`,
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
                toast.success(`Receta enviada por correo a ${data.email}`);
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

    const parseMedicamentos = (raw: string | null | undefined) => {
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);

            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    };

    const parseIndicaciones = (raw: string | null | undefined): string[] => {
        if (!raw) {
            return [];
        }

        try {
            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return parsed;
            }
        } catch {
            // Not JSON — treat as legacy plain text
        }

        return [raw];
    };

    const formatDate = (raw: any): string => {
        if (!raw) {
            return '';
        }

        const dateStr = typeof raw === 'string' ? raw : (raw?.date ?? '');

        if (typeof dateStr !== 'string' || !dateStr) {
            return '';
        }

        const parts = dateStr.substring(0, 10).split('-');

        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }

        return dateStr;
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-3xl"
            >
                {/* Header */}
                <SheetHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner">
                                <Pill className="h-5 w-5 text-white" />
                            </span>
                            <div>
                                <SheetTitle className="text-base font-bold text-white">
                                    Receta Médica
                                </SheetTitle>
                                <p className="text-[11px] font-medium text-white/70">
                                    Receta del paciente
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
                            <p>Cargando receta...</p>
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
                                                    una receta.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    <RecetaForm
                                        citaId={citaId!}
                                        receta={receta}
                                        onSuccess={() => {
                                            fetchReceta();
                                            setIsEditing(false);
                                            onClose();
                                        }}
                                        onCancel={() =>
                                            receta
                                                ? setIsEditing(false)
                                                : onClose()
                                        }
                                    />
                                </>
                            ) : receta ? (
                                <div className="space-y-6 p-6">
                                    {/* Botones de acción */}
                                    <div className="mb-4 flex flex-wrap justify-end gap-2">
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
                                                    `/medico/receta/${receta.id}/pdf`,
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

                                    {/* Datos de la receta */}
                                    <div className="grid gap-6">
                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                            <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                Información general
                                            </h4>
                                            <div className="grid grid-cols-2 gap-3 text-sm">
                                                <div>
                                                    <span className="text-slate-500">
                                                        Tipo:
                                                    </span>{' '}
                                                    <span className="font-semibold">
                                                        {receta.tipo_receta ===
                                                        'controlada'
                                                            ? 'Controlada / Restringida'
                                                            : receta.tipo_receta ===
                                                                'preventiva'
                                                              ? 'Preventiva'
                                                              : 'Simple'}
                                                    </span>
                                                </div>
                                                {receta.proxima_cita && (
                                                    <div>
                                                        <span className="text-slate-500">
                                                            Próxima cita:
                                                        </span>{' '}
                                                        <span className="font-semibold">
                                                            {formatDate(
                                                                receta.proxima_cita,
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {receta.diagnostico && (
                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                    Diagnóstico
                                                </h4>
                                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                                    {receta.diagnostico}
                                                </p>
                                            </div>
                                        )}

                                        <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                            <h4 className="mb-3 text-xs font-bold text-slate-500 uppercase">
                                                Medicamentos
                                            </h4>
                                            <div className="space-y-2">
                                                {parseMedicamentos(
                                                    receta.medicamentos,
                                                ).map((med: any, i: number) => (
                                                    <div
                                                        key={i}
                                                        className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
                                                    >
                                                        <p className="text-sm font-bold">
                                                            {med.nombre}
                                                        </p>
                                                        <p className="mt-1 text-xs text-slate-500">
                                                            {med.presentacion &&
                                                                `Presentación: ${med.presentacion} · `}
                                                            {med.dosis &&
                                                                `Dosis: ${med.dosis} · `}
                                                            {med.frecuencia &&
                                                                `Frecuencia: ${med.frecuencia} · `}
                                                            {med.duracion &&
                                                                `Duración: ${med.duracion} · `}
                                                            {med.cantidad &&
                                                                `Cantidad: ${med.cantidad}`}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {receta.indicaciones && (
                                            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                                <h4 className="mb-2 text-xs font-bold text-slate-500 uppercase">
                                                    Indicaciones
                                                </h4>
                                                <ol className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                                                    {parseIndicaciones(
                                                        receta.indicaciones,
                                                    ).map(
                                                        (
                                                            ind: string,
                                                            i: number,
                                                        ) => (
                                                            <li
                                                                key={i}
                                                                className="flex gap-2"
                                                            >
                                                                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[10px] font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                                    {i + 1}
                                                                </span>
                                                                <span>
                                                                    {ind}
                                                                </span>
                                                            </li>
                                                        ),
                                                    )}
                                                </ol>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : null}
                        </>
                    )}
                </div>

                {/* Diálogo de envío por email */}
                <Dialog
                    open={emailDialogOpen}
                    onOpenChange={(v) => !sendingEmail && setEmailDialogOpen(v)}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-emerald-600" />
                                Enviar receta por email
                            </DialogTitle>
                            <DialogDescription>
                                Se enviará el PDF de la receta médica #
                                {receta?.id} al correo indicado.
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
            </SheetContent>
        </Sheet>
    );
}
