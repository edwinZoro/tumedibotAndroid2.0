import { router } from '@inertiajs/react';
import { Loader2, Save } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface HistorialProps {
    citaId: number;
    historial?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export function HistorialForm({
    citaId,
    historial,
    onSuccess,
    onCancel,
}: HistorialProps) {
    const isEditing = !!historial;

    const [form, setForm] = useState({
        diagnostico: historial?.diagnostico || '',
        tratamiento: historial?.tratamiento || '',
        conclusiones: historial?.conclusiones || '',
        examen_fisico: historial?.examen_fisico || '',
        examen_funcional: historial?.examen_funcional || '',
        examen_paraclinico: historial?.examen_paraclinico || '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const setField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            diagnostico: form.diagnostico,
            tratamiento: form.tratamiento,
            conclusiones: form.conclusiones,
            examen_fisico: form.examen_fisico,
            examen_funcional: form.examen_funcional,
            examen_paraclinico: form.examen_paraclinico,
        };

        setProcessing(true);
        setErrors({});

        const url = isEditing
            ? `/medico/historial/${historial.id}`
            : `/medico/historial/${citaId}`;
        const method = isEditing ? 'put' : 'post';

        try {
            await router[method](url, payload, {
                preserveScroll: true,
                preserveState: false,
            });
            toast.success(
                isEditing ? 'Historial actualizado' : 'Historial creado',
            );
            onSuccess();
        } catch {
            toast.error('Error al guardar el historial');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6 p-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="diagnostico">
                        Diagnóstico <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="diagnostico"
                        value={form.diagnostico}
                        onChange={(e) =>
                            setField('diagnostico', e.target.value)
                        }
                        placeholder="Escribe el diagnóstico médico"
                        className="min-h-[100px]"
                        required
                    />
                    {errors.diagnostico && (
                        <p className="text-xs text-red-500">
                            {errors.diagnostico}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="tratamiento">
                        Tratamiento <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                        id="tratamiento"
                        value={form.tratamiento}
                        onChange={(e) =>
                            setField('tratamiento', e.target.value)
                        }
                        placeholder="Tratamiento recetado"
                        className="min-h-[100px]"
                        required
                    />
                    {errors.tratamiento && (
                        <p className="text-xs text-red-500">
                            {errors.tratamiento}
                        </p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="examen_fisico">Examen Físico</Label>
                    <Textarea
                        id="examen_fisico"
                        value={form.examen_fisico}
                        onChange={(e) =>
                            setField('examen_fisico', e.target.value)
                        }
                        placeholder="Observaciones del examen físico"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="examen_funcional">Examen Funcional</Label>
                    <Textarea
                        id="examen_funcional"
                        value={form.examen_funcional}
                        onChange={(e) =>
                            setField('examen_funcional', e.target.value)
                        }
                        placeholder="Resultados del examen funcional"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="examen_paraclinico">
                        Examen Paraclínico
                    </Label>
                    <Textarea
                        id="examen_paraclinico"
                        value={form.examen_paraclinico}
                        onChange={(e) =>
                            setField('examen_paraclinico', e.target.value)
                        }
                        placeholder="Resultados paraclínicos"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="conclusiones">Conclusiones</Label>
                    <Textarea
                        id="conclusiones"
                        value={form.conclusiones}
                        onChange={(e) =>
                            setField('conclusiones', e.target.value)
                        }
                        placeholder="Conclusiones finales"
                    />
                </div>
            </div>

            <div className="mt-4 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-sky-500 text-white"
                    disabled={processing}
                >
                    {processing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isEditing ? 'Actualizar Historial' : 'Guardar Historial'}
                </Button>
            </div>
        </form>
    );
}
