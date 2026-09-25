import { router, useForm } from '@inertiajs/react';
import {
    Activity,
    ClipboardList,
    Loader2,
    Mail,
    Phone,
    Plus,
    Ruler,
    Stethoscope,
    UserPlus,
    UserRound,
    Weight,
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
import pacientesRoutes from '@/routes/medicos/pacientes';

export function AgregarPacienteDialog({
    open,
    onOpenChange,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}) {
    const [motivoInput, setMotivoInput] = useState('');
    const [motivos, setMotivos] = useState<string[]>([]);
    const [sintomaInput, setSintomaInput] = useState('');
    const [sintomas, setSintomas] = useState<string[]>([]);
    const [enviando, setEnviando] = useState(false);
    const form = useForm({
        nombre_paciente: '',
        email_paciente: '',
        tlf_paciente: '',
        edad: '',
        peso: '',
        estatura: '',
        tipo: 'CONSULTA',
    });

    const resetDialogo = () => {
        form.reset();
        form.setData('tipo', 'CONSULTA');
        form.clearErrors();
        setMotivoInput('');
        setMotivos([]);
        setSintomaInput('');
        setSintomas([]);
        setEnviando(false);
    };

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

        setEnviando(true);
        router.post(
            pacientesRoutes.store.url(),
            {
                ...form.data,
                motivos: listaMotivos,
                sintomas: listaSintomas,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    onOpenChange(false);
                    resetDialogo();
                    toast.success(
                        'Paciente añadido. Ahora puedes asignarle fecha y hora.',
                    );
                },
                onError: (errors) => {
                    const mensaje = Object.values(errors)[0];
                    toast.error(
                        typeof mensaje === 'string'
                            ? mensaje
                            : 'Revisa los datos del paciente.',
                    );
                },
                onFinish: () => setEnviando(false),
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    resetDialogo();
                }

                onOpenChange(next);
            }}
        >
            <DialogContent className="max-h-[85dvh] overflow-y-auto p-4 sm:p-6 sm:max-w-[640px] rounded-3xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <UserPlus className="h-5 w-5 text-sky-500" />
                        Agregar paciente
                    </DialogTitle>
                    <DialogDescription>
                        Registra un paciente de tu consultorio. Luego asigna
                        fecha y hora desde Citas (Agenda).
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="mt-2 space-y-4">
                    <div className="space-y-2">
                        <Label
                            htmlFor="nombre_paciente"
                            className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                        >
                            Nombre
                        </Label>
                        <div className="relative">
                            <UserRound className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-sky-500" />
                            <Input
                                id="nombre_paciente"
                                maxLength={20}
                                className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                value={form.data.nombre_paciente}
                                onChange={(e) =>
                                    form.setData(
                                        'nombre_paciente',
                                        e.target.value,
                                    )
                                }
                            />
                        </div>
                        {form.errors.nombre_paciente && (
                            <p className="px-1 text-xs font-bold text-red-500">
                                {form.errors.nombre_paciente}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label
                                htmlFor="email_paciente"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Correo
                            </Label>
                            <div className="relative">
                                <Mail className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-sky-500" />
                                <Input
                                    id="email_paciente"
                                    type="email"
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    value={form.data.email_paciente}
                                    onChange={(e) =>
                                        form.setData(
                                            'email_paciente',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            {form.errors.email_paciente && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.email_paciente}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="tlf_paciente"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Teléfono
                            </Label>
                            <div className="relative">
                                <Phone className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-emerald-500" />
                                <Input
                                    id="tlf_paciente"
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    value={form.data.tlf_paciente}
                                    onChange={(e) =>
                                        form.setData(
                                            'tlf_paciente',
                                            e.target.value,
                                        )
                                    }
                                />
                            </div>
                            {form.errors.tlf_paciente && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.tlf_paciente}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div className="space-y-2">
                            <Label
                                htmlFor="edad"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Edad
                            </Label>
                            <div className="relative">
                                <Activity className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-violet-500" />
                                <Input
                                    id="edad"
                                    type="number"
                                    min={1}
                                    max={120}
                                    inputMode="numeric"
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    value={form.data.edad}
                                    onChange={(e) =>
                                        form.setData('edad', e.target.value)
                                    }
                                />
                            </div>
                            {form.errors.edad && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.edad}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="peso"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Peso (kg)
                            </Label>
                            <div className="relative">
                                <Weight className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-amber-500" />
                                <Input
                                    id="peso"
                                    type="number"
                                    min={1}
                                    max={255}
                                    inputMode="numeric"
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    value={form.data.peso}
                                    onChange={(e) =>
                                        form.setData('peso', e.target.value)
                                    }
                                />
                            </div>
                            {form.errors.peso && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.peso}
                                </p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label
                                htmlFor="estatura"
                                className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400"
                            >
                                Estatura (m)
                            </Label>
                            <div className="relative">
                                <Ruler className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                <Input
                                    id="estatura"
                                    placeholder="1.70"
                                    inputMode="decimal"
                                    className="h-11 rounded-2xl border-slate-200 bg-white pr-4 pl-11 shadow-sm dark:border-slate-800 dark:bg-slate-950/50"
                                    value={form.data.estatura}
                                    onChange={(e) =>
                                        form.setData('estatura', e.target.value)
                                    }
                                />
                            </div>
                            {form.errors.estatura && (
                                <p className="px-1 text-xs font-bold text-red-500">
                                    {form.errors.estatura}
                                </p>
                            )}
                        </div>
                    </div>

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
                                <SelectValue />
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

                    <DialogFooter className="sticky bottom-0 z-10 mt-6 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 p-4 sm:p-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 rounded-b-3xl">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="rounded-xl"
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            disabled={
                                enviando ||
                                !form.data.nombre_paciente ||
                                !form.data.email_paciente ||
                                !form.data.tlf_paciente
                            }
                            className="rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 shadow-md hover:from-blue-500 hover:to-sky-400"
                        >
                            {enviando ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Agregar paciente'
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
