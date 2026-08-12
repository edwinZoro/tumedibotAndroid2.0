import React, { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Save, Eraser, Upload } from 'lucide-react';

interface HistorialProps {
    citaId: number;
    historial?: any;
    medicoFirma?: string;
    medicoSello?: string;
    medicoLogo?: string;
    selloHospital?: string;
    nombreHospital?: string;
    direccionHospital?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function HistorialForm({
    citaId,
    historial,
    medicoFirma,
    medicoSello,
    medicoLogo,
    selloHospital,
    nombreHospital,
    direccionHospital,
    onSuccess,
    onCancel,
}: HistorialProps) {
    const isEditing = !!historial;
    const signatureRef = useRef<SignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(400);
    const [firmaPreview, setFirmaPreview] = useState<string | null>(
        medicoFirma || null,
    );

    useEffect(() => {
        if (!containerRef.current) return;
        const updateWidth = () => {
            const w = containerRef.current?.clientWidth ?? 400;
            setCanvasWidth(w);
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(containerRef.current);
        return () => observer.disconnect();
    }, []);

    const [form, setForm] = useState({
        diagnostico: historial?.diagnostico || '',
        tratamiento: historial?.tratamiento || '',
        conclusiones: historial?.conclusiones || '',
        examen_fisico: historial?.examen_fisico || '',
        examen_funcional: historial?.examen_funcional || '',
        examen_paraclinico: historial?.examen_paraclinico || '',
        firma_medico: medicoFirma || '',
        sello_medico: medicoSello || '',
        logo: medicoLogo || '',
        sello_hospital: selloHospital || '',
        nombre_hospital: nombreHospital || '',
        direccion_hospital: direccionHospital || '',
    });
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDrawing, setIsDrawing] = useState(false);

    const setField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'logo' | 'sello' | 'sello_hospital',
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = type === 'logo' ? 80 : 150;
                const MAX_HEIGHT = type === 'logo' ? 80 : 150;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/png');

                if (type === 'logo') setField('logo', dataUrl);
                else if (type === 'sello') setField('sello_medico', dataUrl);
                else setField('sello_hospital', dataUrl);
            };
            img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
    };

    const clearSignature = () => {
        signatureRef.current?.clear();
        setFirmaPreview(null);
        setField('firma_medico', '');
        setIsDrawing(false);
    };

    const handleSignatureEnd = () => {
        if (!signatureRef.current || signatureRef.current.isEmpty()) return;
        try {
            const firma = signatureRef.current
                .getTrimmedCanvas()
                .toDataURL('image/png');
            setField('firma_medico', firma);
            setFirmaPreview(firma);
        } catch {
            const firma = signatureRef.current.toDataURL('image/png');
            setField('firma_medico', firma);
            setFirmaPreview(firma);
        }
    };

    const captureFirma = (): string => {
        if (signatureRef.current && !signatureRef.current.isEmpty()) {
            try {
                return signatureRef.current
                    .getTrimmedCanvas()
                    .toDataURL('image/png');
            } catch {
                return signatureRef.current.toDataURL('image/png');
            }
        }
        return firmaPreview || form.firma_medico || '';
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const firmaData = captureFirma();
        const payload = {
            diagnostico: form.diagnostico,
            tratamiento: form.tratamiento,
            conclusiones: form.conclusiones,
            examen_fisico: form.examen_fisico,
            examen_funcional: form.examen_funcional,
            examen_paraclinico: form.examen_paraclinico,
            firma_medico: firmaData || null,
            sello_medico: form.sello_medico || null,
            logo: form.logo || null,
            sello_hospital: form.sello_hospital || null,
            nombre_hospital: form.nombre_hospital || null,
            direccion_hospital: form.direccion_hospital || null,
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

            <hr className="border-slate-200 dark:border-slate-800" />

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Datos del Hospital / Clínica
                    </h3>
                    <p className="text-xs text-slate-500">
                        Aparecerán en el PDF junto con el logo del médico.
                    </p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="nombre_hospital">
                            Nombre del Hospital
                        </Label>
                        <Input
                            id="nombre_hospital"
                            value={form.nombre_hospital}
                            onChange={(e) =>
                                setField('nombre_hospital', e.target.value)
                            }
                            placeholder="Hospital Central"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="direccion_hospital">
                            Dirección del Hospital
                        </Label>
                        <Input
                            id="direccion_hospital"
                            value={form.direccion_hospital}
                            onChange={(e) =>
                                setField('direccion_hospital', e.target.value)
                            }
                            placeholder="Av. Principal #123"
                        />
                    </div>
                </div>
                <div className="mt-4 space-y-2">
                    <Label>Sello del Hospital</Label>
                    <div className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                        {form.sello_hospital ? (
                            <>
                                <img
                                    src={form.sello_hospital}
                                    alt="Sello Hospital"
                                    className="max-h-full object-contain"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Label className="flex cursor-pointer items-center rounded-lg bg-black/50 px-3 py-1.5 text-white hover:bg-black/70">
                                        <Upload className="mr-2 h-4 w-4" />{' '}
                                        Cambiar
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={(e) =>
                                                handleImageUpload(
                                                    e,
                                                    'sello_hospital',
                                                )
                                            }
                                        />
                                    </Label>
                                </div>
                            </>
                        ) : (
                            <Label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-slate-400 hover:text-sky-500">
                                <Upload className="mb-2 h-6 w-6" />
                                <span className="text-xs">
                                    Subir sello del hospital
                                </span>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) =>
                                        handleImageUpload(e, 'sello_hospital')
                                    }
                                />
                            </Label>
                        )}
                    </div>
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-4">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        Firma, Sello y Logo
                    </h3>
                    <p className="text-xs text-slate-500">
                        Se guardan junto con este historial al presionar
                        &quot;Guardar Historial&quot;.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label>Firma Digital</Label>
                        <div
                            ref={containerRef}
                            className="relative overflow-hidden rounded-lg border border-slate-300 bg-white dark:border-slate-700"
                        >
                            {firmaPreview && !isDrawing && (
                                <img
                                    src={firmaPreview}
                                    alt="Firma actual"
                                    className="pointer-events-none absolute inset-0 z-0 h-full w-full object-contain opacity-40"
                                />
                            )}
                            <SignatureCanvas
                                ref={signatureRef}
                                penColor="blue"
                                onBegin={() => setIsDrawing(true)}
                                onEnd={handleSignatureEnd}
                                canvasProps={{
                                    width: canvasWidth,
                                    height: 128,
                                    className:
                                        'relative z-10 cursor-crosshair block',
                                }}
                            />
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="mt-1 w-full text-xs"
                            onClick={clearSignature}
                        >
                            <Eraser className="mr-1 h-3 w-3" /> Limpiar firma
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Label>Sello Médico</Label>
                        <div className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                            {form.sello_medico ? (
                                <>
                                    <img
                                        src={form.sello_medico}
                                        alt="Sello"
                                        className="max-h-full object-contain"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Label className="flex cursor-pointer items-center rounded-lg bg-black/50 px-3 py-1.5 text-white hover:bg-black/70">
                                            <Upload className="mr-2 h-4 w-4" />{' '}
                                            Cambiar
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleImageUpload(
                                                        e,
                                                        'sello',
                                                    )
                                                }
                                            />
                                        </Label>
                                    </div>
                                </>
                            ) : (
                                <Label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-slate-400 hover:text-sky-500">
                                    <Upload className="mb-2 h-6 w-6" />
                                    <span className="text-xs">
                                        Subir imagen
                                    </span>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageUpload(e, 'sello')
                                        }
                                    />
                                </Label>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Logo</Label>
                        <div className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                            {form.logo ? (
                                <>
                                    <img
                                        src={form.logo}
                                        alt="Logo"
                                        className="max-h-full object-contain"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                                        <Label className="flex cursor-pointer items-center rounded-lg bg-black/50 px-3 py-1.5 text-white hover:bg-black/70">
                                            <Upload className="mr-2 h-4 w-4" />{' '}
                                            Cambiar
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleImageUpload(e, 'logo')
                                                }
                                            />
                                        </Label>
                                    </div>
                                </>
                            ) : (
                                <Label className="flex h-full w-full cursor-pointer flex-col items-center justify-center text-slate-400 hover:text-sky-500">
                                    <Upload className="mb-2 h-6 w-6" />
                                    <span className="text-xs">Subir logo</span>
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) =>
                                            handleImageUpload(e, 'logo')
                                        }
                                    />
                                </Label>
                            )}
                        </div>
                    </div>
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
