import {
    Check,
    CheckCircle2,
    Loader2,
    Pencil,
    Plus,
    Share2,
    StickyNote,
    Trash2,
    X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';

const csrf = () =>
    document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content') || '';

interface NotaItem {
    id: number;
    contenido: string;
    compartido: boolean;
    created_at: string | null;
}

interface NotaSheetProps {
    citaId: number | null;
    open: boolean;
    onClose: () => void;
}

export function NotaSheet({ citaId, open, onClose }: NotaSheetProps) {
    const [loading, setLoading] = useState(false);
    const [notas, setNotas] = useState<NotaItem[]>([]);
    const [adding, setAdding] = useState(false);
    const [newContent, setNewContent] = useState('');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editContent, setEditContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [togglingId, setTogglingId] = useState<number | null>(null);

    const fetchNotas = async () => {
        setLoading(true);

        try {
            const res = await fetch(`/medico/nota/${citaId}`);

            if (res.ok) {
                const data = await res.json();
                setNotas(data.notas ?? []);
            }
        } catch {
            toast.error('Error al cargar las notas');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && citaId) {
            fetchNotas();
            setAdding(false);
            setEditingId(null);
        } else {
            setNotas([]);
            setAdding(false);
            setEditingId(null);
        }
    }, [open, citaId]);

    const handleAdd = async () => {
        if (!newContent.trim()) {
            toast.error('La nota no puede estar vacía');

            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`/medico/nota/${citaId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ contenido: newContent.trim() }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setNotas((prev) => [data.nota, ...prev]);
                setNewContent('');
                setAdding(false);
                toast.success('Nota añadida');
            } else {
                toast.error(data.message ?? 'Error al guardar la nota');
            }
        } catch {
            toast.error('Error al guardar la nota');
        } finally {
            setSaving(false);
        }
    };

    const handleUpdate = async (id: number) => {
        if (!editContent.trim()) {
            toast.error('La nota no puede estar vacía');

            return;
        }

        setSaving(true);

        try {
            const res = await fetch(`/medico/nota/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrf(),
                    Accept: 'application/json',
                },
                body: JSON.stringify({ contenido: editContent.trim() }),
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setNotas((prev) =>
                    prev.map((n) => (n.id === id ? data.nota : n)),
                );
                setEditingId(null);
                toast.success('Nota actualizada');
            } else {
                toast.error(data.message ?? 'Error al actualizar la nota');
            }
        } catch {
            toast.error('Error al actualizar la nota');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar esta nota?')) {
return;
}

        try {
            const res = await fetch(`/medico/nota/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-TOKEN': csrf(), Accept: 'application/json' },
            });

            if (res.ok) {
                setNotas((prev) => prev.filter((n) => n.id !== id));
                toast.success('Nota eliminada');
            } else {
                toast.error('Error al eliminar la nota');
            }
        } catch {
            toast.error('Error al eliminar la nota');
        }
    };

    const handleToggleCompartir = async (nota: NotaItem) => {
        setTogglingId(nota.id);

        try {
            const res = await fetch(`/medico/nota/${nota.id}/compartir`, {
                method: 'PATCH',
                headers: {
                    'X-CSRF-TOKEN': csrf(),
                    Accept: 'application/json',
                },
            });
            const data = await res.json();

            if (res.ok && data.success) {
                setNotas((prev) =>
                    prev.map((n) =>
                        n.id === nota.id
                            ? { ...n, compartido: data.compartido }
                            : n,
                    ),
                );
                toast.success(
                    data.compartido
                        ? 'Nota compartida con el paciente'
                        : 'Nota dejada de compartir',
                );
            }
        } catch {
            toast.error('Error al cambiar el estado de compartir');
        } finally {
            setTogglingId(null);
        }
    };

    const startEdit = (nota: NotaItem) => {
        setEditingId(nota.id);
        setEditContent(nota.contenido);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditContent('');
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
            >
                <SheetHeader className="border-b border-slate-200 bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner">
                                <StickyNote className="h-5 w-5 text-white" />
                            </span>
                            <div>
                                <SheetTitle className="text-base font-bold text-white">
                                    Notas Médicas
                                </SheetTitle>
                                <p className="text-[11px] font-medium text-white/70">
                                    Notas de evolución del paciente
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

                <div className="flex-1 overflow-y-auto p-6">
                    {loading ? (
                        <div className="flex h-full flex-col items-center justify-center text-slate-500">
                            <Loader2 className="mb-4 h-8 w-8 animate-spin" />
                            <p>Cargando notas...</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {/* Botón añadir */}
                            {!adding && (
                                <Button
                                    variant="outline"
                                    className="w-full border-dashed border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                                    onClick={() => setAdding(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Añadir nota
                                </Button>
                            )}

                            {/* Formulario añadir */}
                            {adding && (
                                <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 dark:border-amber-800 dark:bg-amber-900/10">
                                    <Textarea
                                        value={newContent}
                                        onChange={(e) =>
                                            setNewContent(e.target.value)
                                        }
                                        placeholder="Escribe la nota o indicación para el paciente..."
                                        className="min-h-[80px] resize-none border-amber-200 focus-visible:ring-amber-400 dark:border-amber-800"
                                        autoFocus
                                    />
                                    <div className="mt-2 flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setAdding(false);
                                                setNewContent('');
                                            }}
                                            disabled={saving}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-amber-600 hover:bg-amber-700"
                                            onClick={handleAdd}
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Check className="mr-1 h-3.5 w-3.5" />
                                            )}
                                            Guardar
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Lista de notas */}
                            {notas.length === 0 && !adding ? (
                                <div className="flex flex-col items-center justify-center py-12 text-center text-slate-400">
                                    <StickyNote className="mb-3 h-10 w-10 opacity-40" />
                                    <p className="text-sm">
                                        No hay notas registradas para esta cita.
                                    </p>
                                </div>
                            ) : (
                                notas.map((nota) => (
                                    <div
                                        key={nota.id}
                                        className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-950"
                                    >
                                        {editingId === nota.id ? (
                                            <>
                                                <Textarea
                                                    value={editContent}
                                                    onChange={(e) =>
                                                        setEditContent(
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="min-h-[80px] resize-none"
                                                    autoFocus
                                                />
                                                <div className="mt-2 flex justify-end gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={cancelEdit}
                                                        disabled={saving}
                                                    >
                                                        Cancelar
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        className="bg-amber-600 hover:bg-amber-700"
                                                        onClick={() =>
                                                            handleUpdate(
                                                                nota.id,
                                                            )
                                                        }
                                                        disabled={saving}
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                                                        ) : (
                                                            <Check className="mr-1 h-3.5 w-3.5" />
                                                        )}
                                                        Guardar
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="mb-2 flex items-start justify-between gap-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                                                            {nota.id}
                                                        </span>
                                                        {nota.compartido && (
                                                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                                                                <CheckCircle2 className="h-2.5 w-2.5" />
                                                                Compartido
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex flex-shrink-0 gap-1">
                                                        <button
                                                            onClick={() =>
                                                                startEdit(nota)
                                                            }
                                                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
                                                            title="Editar"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleToggleCompartir(
                                                                    nota,
                                                                )
                                                            }
                                                            disabled={
                                                                togglingId ===
                                                                nota.id
                                                            }
                                                            className={`rounded-lg p-1.5 transition hover:bg-slate-100 dark:hover:bg-slate-800 ${
                                                                nota.compartido
                                                                    ? 'text-emerald-500'
                                                                    : 'text-slate-400 hover:text-emerald-500'
                                                            }`}
                                                            title={
                                                                nota.compartido
                                                                    ? 'Dejar de compartir'
                                                                    : 'Compartir con el paciente'
                                                            }
                                                        >
                                                            {togglingId ===
                                                            nota.id ? (
                                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                            ) : (
                                                                <Share2 className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    nota.id,
                                                                )
                                                            }
                                                            className="rounded-lg p-1.5 text-rose-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-sm whitespace-pre-wrap text-slate-700 dark:text-slate-300">
                                                    {nota.contenido}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
