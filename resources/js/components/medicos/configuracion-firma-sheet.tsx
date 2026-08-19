import { Eraser, FileSignature, Loader2, Save, Upload, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';

interface ConfiguracionFirmaSheetProps {
    open: boolean;
    onClose: () => void;
    onSaved?: () => void;
}

export function ConfiguracionFirmaSheet({
    open,
    onClose,
    onSaved,
}: ConfiguracionFirmaSheetProps) {
    const signatureRef = useRef<SignatureCanvas>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasWidth, setCanvasWidth] = useState(400);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [firmaPreview, setFirmaPreview] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);

    const [form, setForm] = useState({
        firma_medico: '',
        sello_medico: '',
        logo: '',
        sello_hospital: '',
        nombre_hospital: '',
        direccion_hospital: '',
    });

    useEffect(() => {
        if (!containerRef.current) {
            return;
        }

        const updateWidth = () => {
            const w = containerRef.current?.clientWidth ?? 400;
            setCanvasWidth(w);
        };
        updateWidth();
        const observer = new ResizeObserver(updateWidth);
        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [open]);

    useEffect(() => {
        if (open) {
            fetchConfig();
        }
    }, [open]);

    const fetchConfig = async () => {
        setLoading(true);

        try {
            const res = await fetch('/medico/configuracion-firma');

            if (res.ok) {
                const data = await res.json();
                setForm({
                    firma_medico: data.firma_medico || '',
                    sello_medico: data.sello_medico || '',
                    logo: data.logo || '',
                    sello_hospital: data.sello_hospital || '',
                    nombre_hospital: data.nombre_hospital || '',
                    direccion_hospital: data.direccion_hospital || '',
                });
                setFirmaPreview(data.firma_medico || null);
            }
        } catch {
            toast.error('Error al cargar la configuración');
        } finally {
            setLoading(false);
        }
    };

    const setField = (field: string, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'logo' | 'sello_medico' | 'sello_hospital',
    ) => {
        const file = e.target.files?.[0];

        if (!file) {
            return;
        }

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

                setField(type, dataUrl);
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
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
            return;
        }

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

        if (
            !firmaData ||
            !form.sello_medico ||
            !form.logo ||
            !form.nombre_hospital
        ) {
            toast.error(
                'Firma, sello médico, logo y nombre del Hospital/Clínica son obligatorios',
            );

            return;
        }

        setSaving(true);

        try {
            const res = await fetch('/medico/configuracion-firma', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    firma_medico: firmaData,
                    sello_medico: form.sello_medico,
                    logo: form.logo,
                    sello_hospital: form.sello_hospital || null,
                    nombre_hospital: form.nombre_hospital || null,
                    direccion_hospital: form.direccion_hospital || null,
                }),
            });

            if (res.ok) {
                toast.success('Configuración guardada correctamente');
                onSaved?.();
                onClose();
            } else {
                toast.error('Error al guardar la configuración');
            }
        } catch {
            toast.error('Error al guardar la configuración');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
            <SheetContent
                side="right"
                className="flex w-full flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
            >
                {/* Header */}
                <SheetHeader className="border-b border-slate-200 bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-5 dark:border-slate-700">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 shadow-inner">
                                <FileSignature className="h-5 w-5 text-white" />
                            </span>
                            <div>
                                <SheetTitle className="text-base font-bold text-white">
                                    Configuración de Firma y Hospital/Clínica
                                </SheetTitle>
                                <p className="text-[11px] font-medium text-white/70">
                                    Se usa en historiales clínicos y recetas
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
                            <p>Cargando configuración...</p>
                        </div>
                    ) : (
                        <form
                            onSubmit={submit}
                            className="flex flex-col gap-6 p-6"
                        >
                            {/* Datos del Hospital/Clínica */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        Datos del Hospital/Clínica
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Aparecerán en el PDF de historiales y
                                        recetas.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nombre_hospital">
                                            Nombre del Hospital/Clínica{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="nombre_hospital"
                                            value={form.nombre_hospital}
                                            onChange={(e) =>
                                                setField(
                                                    'nombre_hospital',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Hospital Central"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="direccion_hospital">
                                            Dirección del Hospital/Clínica
                                        </Label>
                                        <Input
                                            id="direccion_hospital"
                                            value={form.direccion_hospital}
                                            onChange={(e) =>
                                                setField(
                                                    'direccion_hospital',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Av. Principal #123"
                                        />
                                    </div>
                                </div>
                                <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Sello del Hospital/Clínica */}
                                    <div className="space-y-2">
                                        <Label>
                                            Sello del Hospital/Clínica
                                        </Label>
                                        <div className="group relative flex h-32 flex-col items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                            {form.sello_hospital ? (
                                                <>
                                                    <img
                                                        src={
                                                            form.sello_hospital
                                                        }
                                                        alt="Sello Hospital/Clínica"
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
                                                        Subir sello del
                                                        hospital/Clínica
                                                    </span>
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
                                            )}
                                        </div>
                                    </div>

                                    {/* Logo */}
                                    <div className="space-y-2">
                                        <Label>
                                            Logo{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
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
                                                                    handleImageUpload(
                                                                        e,
                                                                        'logo',
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
                                                        Subir logo
                                                    </span>
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={(e) =>
                                                            handleImageUpload(
                                                                e,
                                                                'logo',
                                                            )
                                                        }
                                                    />
                                                </Label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Firma y Sello Médico */}
                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                                <div className="mb-4">
                                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                        Firma y Sello Médico
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        Se guardan una sola vez y se reutilizan
                                        en todos los documentos.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* Firma */}
                                    <div className="space-y-2">
                                        <Label>
                                            Firma Digital{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
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
                                                penColor="black"
                                                onBegin={() =>
                                                    setIsDrawing(true)
                                                }
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
                                            <Eraser className="mr-1 h-3 w-3" />{' '}
                                            Limpiar firma
                                        </Button>
                                    </div>

                                    {/* Sello Médico */}
                                    <div className="space-y-2">
                                        <Label>
                                            Sello Médico{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
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
                                                                        'sello_medico',
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
                                                            handleImageUpload(
                                                                e,
                                                                'sello_medico',
                                                            )
                                                        }
                                                    />
                                                </Label>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Botones */}
                            <div className="mt-2 flex justify-end gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={saving}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    type="submit"
                                    className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
                                    disabled={saving}
                                >
                                    {saving ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Save className="mr-2 h-4 w-4" />
                                    )}
                                    Guardar configuración
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}
