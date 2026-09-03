import { useForm } from '@inertiajs/react';
import {
    Calendar as CalendarIcon,
    ClipboardList,
    Loader2,
    Plus,
    Stethoscope,
    X,
} from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
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
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import citasRoutes from '@/routes/pacientes/citas';

export interface MedicoAgendar {
    id: number;
    nombre: string;
    especialidad?: string | null;
    consultorio_costo?: string | number | null;
    foto?: string | null;
}

export default function AgendarCitaDialog({
    medico,
    open,
    onOpenChange,
}: {
    medico: MedicoAgendar | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [motivoInput, setMotivoInput] = useState('');
    const [motivos, setMotivos] = useState<string[]>([]);
    const [sintomaInput, setSintomaInput] = useState('');
    const [sintomas, setSintomas] = useState<string[]>([]);
    const form = useForm({
        id_medico: medico?.id ?? 0,
        tipo: '',
    });

    const agregarItem = (
        lista: string[],
        setLista: React.Dispatch<React.SetStateAction<string[]>>,
        valor: string,
    ): boolean => {
        const limpio = valor.trim();

        if (!limpio) {
            return false;
        }

        const existe = lista.some(
            (v) => v.toLowerCase() === limpio.toLowerCase(),
        );

        if (existe) {
            toast.error('Ese elemento ya está en la lista.');

            return false;
        }

        if (lista.length >= 20) {
            toast.error('Máximo 20 elementos.');

            return false;
        }

        setLista((prev) => [...prev, limpio]);

        return true;
    };

    const agregarMotivo = () => {
        if (agregarItem(motivos, setMotivos, motivoInput)) {
            setMotivoInput('');
        }
    };

    const agregarSintoma = () => {
        if (agregarItem(sintomas, setSintomas, sintomaInput)) {
            setSintomaInput('');
        }
    };

    const quitarMotivo = (index: number) => {
        setMotivos((prev) => prev.filter((_, i) => i !== index));
    };

    const quitarSintoma = (index: number) => {
        setSintomas((prev) => prev.filter((_, i) => i !== index));
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        // Si quedó texto en algún input sin pulsar +, lo incluimos
        let listaMotivos = motivos;
        const pendienteMotivo = motivoInput.trim();

        if (
            pendienteMotivo &&
            !listaMotivos.some(
                (m) => m.toLowerCase() === pendienteMotivo.toLowerCase(),
            )
        ) {
            listaMotivos = [...listaMotivos, pendienteMotivo];
            setMotivos(listaMotivos);
            setMotivoInput('');
        }

        let listaSintomas = sintomas;
        const pendienteSintoma = sintomaInput.trim();

        if (
            pendienteSintoma &&
            !listaSintomas.some(
                (s) => s.toLowerCase() === pendienteSintoma.toLowerCase(),
            )
        ) {
            listaSintomas = [...listaSintomas, pendienteSintoma];
            setSintomas(listaSintomas);
            setSintomaInput('');
        }

        form.transform((data) => ({
            ...data,
            motivos: listaMotivos,
            sintomas: listaSintomas,
        }));

        form.post(citasRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => {
                onOpenChange(false);
                toast.success(
                    'Solicitud enviada. El médico te asignará fecha y hora.',
                );
            },
            onError: (errors) => {
                const mensaje = Object.values(errors)[0];
                toast.error(
                    typeof mensaje === 'string'
                        ? mensaje
                        : 'Revisa los datos de la cita.',
                );
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[640px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-sky-500" />
                        Solicitar cita
                    </DialogTitle>
                    <DialogDescription>
                        {medico ? (
                            <>
                                Con <strong>{medico.nombre}</strong>
                                {medico.especialidad
                                    ? ` · ${medico.especialidad}`
                                    : ''}
                                . El médico te asignará fecha y hora en su
                                agenda.
                            </>
                        ) : (
                            'Completa los datos de tu solicitud.'
                        )}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Tipo de cita
                        </Label>
                        <Select
                            value={form.data.tipo}
                            onValueChange={(v) => form.setData('tipo', v)}
                        >
                            <SelectTrigger className="relative h-11 rounded-2xl border-slate-200 bg-white pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50">
                                <Stethoscope className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-sky-500" />
                                <SelectValue placeholder="Selecciona el tipo de cita" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CONSULTA">
                                    Consulta en consultorio
                                </SelectItem>
                                <SelectItem value="VIDEOLLAMADA">
                                    Videollamada
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        {form.errors.tipo && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.tipo}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="sintoma_input"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Sintomas{' '}
                            <span className="font-medium text-slate-400 normal-case">
                                (opcional · varios)
                            </span>
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <ClipboardList className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-violet-500" />
                                <Input
                                    id="sintoma_input"
                                    className="h-11 w-full rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    placeholder="Ej: Fiebre, diarrea, vómito..."
                                    value={sintomaInput}
                                    onChange={(e) =>
                                        setSintomaInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            agregarSintoma();
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                type="button"
                                size="icon"
                                onClick={agregarSintoma}
                                disabled={!sintomaInput.trim()}
                                className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-500 shadow-md hover:from-violet-500 hover:to-purple-400"
                                title="Añadir síntoma"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>

                        {sintomas.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {sintomas.map((sintoma, index) => (
                                    <li key={`${sintoma}-${index}`}>
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 rounded-full border-violet-200 bg-violet-50 py-1.5 pr-1.5 pl-3 text-xs font-semibold text-violet-800 dark:border-violet-800 dark:bg-violet-950/40 dark:text-violet-200"
                                        >
                                            {sintoma}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    quitarSintoma(index)
                                                }
                                                className="flex h-5 w-5 items-center justify-center rounded-full text-violet-600 transition hover:bg-violet-200/80 dark:text-violet-300 dark:hover:bg-violet-900"
                                                aria-label={`Quitar ${sintoma}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label
                            htmlFor="motivo_input"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Motivos{' '}
                            <span className="font-medium text-slate-400 normal-case">
                                (opcional · varios)
                            </span>
                        </Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <ClipboardList className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-sky-500" />
                                <Input
                                    id="motivo_input"
                                    className="h-11 w-full rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    placeholder="Ej: Trastorno, enfermedad, dolencia..."
                                    value={motivoInput}
                                    onChange={(e) =>
                                        setMotivoInput(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            agregarMotivo();
                                        }
                                    }}
                                />
                            </div>
                            <Button
                                type="button"
                                size="icon"
                                onClick={agregarMotivo}
                                disabled={!motivoInput.trim()}
                                className="h-11 w-11 shrink-0 rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                                title="Añadir motivo"
                            >
                                <Plus className="h-5 w-5" />
                            </Button>
                        </div>

                        {motivos.length > 0 && (
                            <ul className="mt-2 flex flex-wrap gap-2">
                                {motivos.map((motivo, index) => (
                                    <li key={`${motivo}-${index}`}>
                                        <Badge
                                            variant="outline"
                                            className="gap-1.5 rounded-full border-sky-200 bg-sky-50 py-1.5 pr-1.5 pl-3 text-xs font-semibold text-sky-800 dark:border-sky-800 dark:bg-sky-950/40 dark:text-sky-200"
                                        >
                                            {motivo}
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    quitarMotivo(index)
                                                }
                                                className="flex h-5 w-5 items-center justify-center rounded-full text-sky-600 transition hover:bg-sky-200/80 dark:text-sky-300 dark:hover:bg-sky-900"
                                                aria-label={`Quitar ${motivo}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <DialogFooter className="mt-6">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={form.processing || !form.data.tipo}
                            className="bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {form.processing ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Enviando...
                                </>
                            ) : (
                                'Solicitar cita'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
