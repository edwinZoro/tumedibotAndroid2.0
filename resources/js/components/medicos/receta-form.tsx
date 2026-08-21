import { router } from '@inertiajs/react';
import {
    Check,
    ClipboardList,
    Loader2,
    Pill,
    Plus,
    Save,
    Search,
    Trash2,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface MedicamentoForm {
    nombre: string;
    presentacion: string;
    dosis: string;
    frecuencia: string;
    duracion: string;
    cantidad: string;
}

interface MedicamentoBD {
    id: number;
    nombre_comercial: string;
    principio_activo: string;
    presentaciones: string[];
    dosis_options: string[];
    frecuencia_options: string[];
    duracion_options: string[];
    indicaciones: string;
    categoria: string;
}

interface MedOptions {
    presentaciones: string[];
    dosis_options: string[];
    frecuencia_options: string[];
    duracion_options: string[];
    indicaciones: string;
    categoria: string;
}

interface RecetaFormProps {
    citaId: number;
    receta?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

const MED_VACIO: MedicamentoForm = {
    nombre: '',
    presentacion: '',
    dosis: '',
    frecuencia: '',
    duracion: '',
    cantidad: '',
};

export function RecetaForm({
    citaId,
    receta,
    onSuccess,
    onCancel,
}: RecetaFormProps) {
    const isEditing = !!receta;

    const parseMedicamentos = (
        raw: string | null | undefined,
    ): MedicamentoForm[] => {
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
            return [''];
        }

        try {
            const parsed = JSON.parse(raw);

            if (Array.isArray(parsed)) {
                return parsed.length > 0 ? parsed : [''];
            }
        } catch {
            // Not JSON — treat as legacy plain text
        }

        return [raw];
    };

    const parseProximaCita = (raw: any): string => {
        if (!raw) {
            return '';
        }

        const dateStr = typeof raw === 'string' ? raw : (raw?.date ?? '');

        return typeof dateStr === 'string' ? dateStr.substring(0, 10) : '';
    };

    const [tipoReceta, setTipoReceta] = useState(
        receta?.tipo_receta || 'simple',
    );
    const [medicamentos, setMedicamentos] = useState<MedicamentoForm[]>(
        parseMedicamentos(receta?.medicamentos).length > 0
            ? parseMedicamentos(receta?.medicamentos)
            : [{ ...MED_VACIO }],
    );
    const [indicaciones, setIndicaciones] = useState<string[]>(
        parseIndicaciones(receta?.indicaciones),
    );
    const [diagnostico, setDiagnostico] = useState(receta?.diagnostico || '');
    const [proximaCita, setProximaCita] = useState(
        parseProximaCita(receta?.proxima_cita),
    );
    const [processing, setProcessing] = useState(false);

    // Buscador
    const [activeSearchIndex, setActiveSearchIndex] = useState<number | null>(
        null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<MedicamentoBD[]>([]);
    const [searching, setSearching] = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Opciones por medicamento
    const [medOptions, setMedOptions] = useState<Record<number, MedOptions>>(
        {},
    );

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setActiveSearchIndex(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const addMedicamento = () => {
        setMedicamentos((prev) => [...prev, { ...MED_VACIO }]);
    };

    const removeMedicamento = (index: number) => {
        setMedicamentos((prev) => prev.filter((_, i) => i !== index));
        setMedOptions((prev) => {
            const copy = { ...prev };
            delete copy[index];

            return copy;
        });
    };

    const addIndicacion = () => {
        setIndicaciones((prev) => [...prev, '']);
    };

    const removeIndicacion = (index: number) => {
        setIndicaciones((prev) => prev.filter((_, i) => i !== index));
    };

    const updateIndicacion = (index: number, value: string) => {
        setIndicaciones((prev) =>
            prev.map((ind, i) => (i === index ? value : ind)),
        );
    };

    const updateMedicamento = (
        index: number,
        field: keyof MedicamentoForm,
        value: string,
    ) => {
        setMedicamentos((prev) =>
            prev.map((med, i) =>
                i === index ? { ...med, [field]: value } : med,
            ),
        );
    };

    const openSearch = (index: number) => {
        setActiveSearchIndex(index);
        setSearchQuery(medicamentos[index]?.nombre || '');
        setSearchResults([]);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);

        if (searchTimer.current) {
            clearTimeout(searchTimer.current);
        }

        if (value.trim().length < 2) {
            setSearchResults([]);
            setSearching(false);

            return;
        }

        setSearching(true);

        searchTimer.current = setTimeout(async () => {
            try {
                const res = await fetch(
                    `/medico/medicamentos/search?q=${encodeURIComponent(value)}`,
                );

                if (res.ok) {
                    const data = await res.json();
                    setSearchResults(data);
                }
            } catch {
                setSearchResults([]);
            } finally {
                setSearching(false);
            }
        }, 300);
    };

    const selectMedicamento = (med: MedicamentoBD) => {
        const index = activeSearchIndex;

        if (index === null) {
            return;
        }

        const nombreCompleto = `${med.nombre_comercial} (${med.principio_activo})`;

        setMedicamentos((prev) =>
            prev.map((m, i) =>
                i === index
                    ? {
                          nombre: nombreCompleto,
                          presentacion: med.presentaciones[0] || '',
                          dosis: med.dosis_options[0] || '',
                          frecuencia: med.frecuencia_options[0] || '',
                          duracion: med.duracion_options[0] || '',
                          cantidad: '',
                      }
                    : m,
            ),
        );

        setMedOptions((prev) => ({
            ...prev,
            [index]: {
                presentaciones: med.presentaciones,
                dosis_options: med.dosis_options,
                frecuencia_options: med.frecuencia_options,
                duracion_options: med.duracion_options,
                indicaciones: med.indicaciones,
                categoria: med.categoria,
            },
        }));

        setActiveSearchIndex(null);
        setSearchQuery('');
        setSearchResults([]);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();

        const medList = medicamentos.filter((m) => m.nombre.trim());

        if (medList.length === 0) {
            toast.error('Debe agregar al menos un medicamento');

            return;
        }

        const indicacionesList = indicaciones.filter((i) => i.trim());

        const payload = {
            tipo_receta: tipoReceta,
            medicamentos: JSON.stringify(medList),
            indicaciones:
                indicacionesList.length > 0
                    ? JSON.stringify(indicacionesList)
                    : null,
            diagnostico: diagnostico || null,
            proxima_cita: proximaCita || null,
        };

        setProcessing(true);

        const url = isEditing
            ? `/medico/receta/${receta.id}`
            : `/medico/receta/${citaId}`;
        const method = isEditing ? 'put' : 'post';

        try {
            await router[method](url, payload, {
                preserveScroll: true,
                preserveState: false,
            });
            toast.success(isEditing ? 'Receta actualizada' : 'Receta creada');
            onSuccess();
        } catch {
            toast.error('Error al guardar la receta');
        } finally {
            setProcessing(false);
        }
    };

    // Componente pills para opciones
    const PillOptions = ({
        index,
        label,
        field,
        options,
    }: {
        index: number;
        label: string;
        field: keyof MedicamentoForm;
        options: string[] | undefined;
    }) => {
        const med = medicamentos[index];
        const selected = med ? med[field] : '';

        if (!options || options.length === 0) {
            return (
                <div className="space-y-1.5">
                    <Label className="text-[11px] text-slate-500">
                        {label}
                    </Label>
                    <Input
                        value={selected}
                        onChange={(e) =>
                            updateMedicamento(index, field, e.target.value)
                        }
                        placeholder={label}
                        className="h-8 text-xs"
                    />
                </div>
            );
        }

        return (
            <div className="space-y-1.5">
                <Label className="text-[11px] text-slate-500">{label}</Label>
                <div className="flex flex-wrap gap-1.5">
                    {options.map((opt) => {
                        const isSelected = selected === opt;

                        return (
                            <button
                                key={opt}
                                type="button"
                                onClick={() =>
                                    updateMedicamento(
                                        index,
                                        field,
                                        isSelected ? '' : opt,
                                    )
                                }
                                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-all ${
                                    isSelected
                                        ? 'bg-indigo-600 text-white shadow-sm'
                                        : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-900/30'
                                }`}
                            >
                                {isSelected && <Check className="h-3 w-3" />}
                                {opt}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <form onSubmit={submit} className="flex flex-col gap-6 p-4">
            {/* Tipo de receta */}
            <div className="space-y-2">
                <Label htmlFor="tipo_receta">Tipo de receta</Label>
                <div className="flex flex-wrap gap-2">
                    {[
                        {
                            val: 'simple',
                            label: 'Simple',
                        },
                        {
                            val: 'controlada',
                            label: 'Controlada / Restringida',
                        },
                        {
                            val: 'preventiva',
                            label: 'Preventiva',
                        },
                    ].map((t) => (
                        <button
                            key={t.val}
                            type="button"
                            onClick={() => setTipoReceta(t.val)}
                            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                                tipoReceta === t.val
                                    ? 'bg-indigo-600 text-white shadow-sm'
                                    : 'border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:bg-indigo-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-900/30'
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Diagnóstico (opcional) */}
            <div className="space-y-2">
                <Label htmlFor="diagnostico">
                    Diagnóstico{' '}
                    <span className="text-xs font-normal text-slate-400">
                        (opcional)
                    </span>
                </Label>
                <Textarea
                    id="diagnostico"
                    value={diagnostico}
                    onChange={(e) => setDiagnostico(e.target.value)}
                    placeholder="Diagnóstico asociado a la receta"
                    className="min-h-[70px]"
                />
            </div>

            {/* Medicamentos */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <Pill className="h-4 w-4 text-indigo-500" />
                        Medicamentos
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addMedicamento}
                    >
                        <Plus className="mr-1 h-4 w-4" /> Añadir
                    </Button>
                </div>

                <div className="space-y-3">
                    {medicamentos.map((med, index) => {
                        const isActiveSearch = activeSearchIndex === index;
                        const opts = medOptions[index];

                        return (
                            <div
                                key={index}
                                className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950"
                            >
                                <div className="mb-2 flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-500">
                                        Medicamento {index + 1}
                                        {opts?.categoria && (
                                            <span className="ml-2 rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                                {opts.categoria}
                                            </span>
                                        )}
                                    </span>
                                    {medicamentos.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeMedicamento(index)
                                            }
                                            className="text-rose-500 transition hover:text-rose-600"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Buscador */}
                                <div
                                    ref={isActiveSearch ? dropdownRef : null}
                                    className="relative mb-3"
                                >
                                    <div className="relative">
                                        <Search className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-slate-400" />
                                        <Input
                                            value={
                                                isActiveSearch
                                                    ? searchQuery
                                                    : med.nombre || ''
                                            }
                                            onChange={(e) => {
                                                if (!isActiveSearch) {
                                                    setActiveSearchIndex(index);
                                                }

                                                handleSearchChange(
                                                    e.target.value,
                                                );
                                            }}
                                            onFocus={() => openSearch(index)}
                                            placeholder="Buscar: ace, ibu, amox, omeprazol..."
                                            className="pl-9"
                                            autoComplete="off"
                                        />
                                        {searching && isActiveSearch && (
                                            <Loader2 className="absolute top-1/2 right-2.5 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
                                        )}
                                    </div>

                                    {/* Dropdown de resultados */}
                                    {isActiveSearch && !searching && (
                                        <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-64 overflow-y-auto rounded-lg border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-900">
                                            {searchResults.length > 0 ? (
                                                searchResults.map((result) => (
                                                    <button
                                                        key={result.id}
                                                        type="button"
                                                        onClick={() =>
                                                            selectMedicamento(
                                                                result,
                                                            )
                                                        }
                                                        className="block w-full border-b border-slate-100 px-4 py-2.5 text-left transition last:border-0 hover:bg-indigo-50 dark:border-slate-800 dark:hover:bg-indigo-900/20"
                                                    >
                                                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                                                            {
                                                                result.nombre_comercial
                                                            }
                                                            <span className="ml-2 text-xs font-normal text-slate-400">
                                                                {
                                                                    result.principio_activo
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-[11px] text-slate-500">
                                                            {
                                                                result.indicaciones
                                                            }
                                                        </div>
                                                    </button>
                                                ))
                                            ) : searchQuery.trim().length >=
                                              2 ? (
                                                <div className="px-4 py-3 text-center text-sm text-slate-400">
                                                    No se encontraron
                                                    medicamentos para "
                                                    {searchQuery}"
                                                </div>
                                            ) : (
                                                <div className="px-4 py-3 text-center text-sm text-slate-400">
                                                    Escribe al menos 2 letras
                                                    para buscar
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Indicación del medicamento */}
                                {opts?.indicaciones && !isActiveSearch && (
                                    <div className="mb-3 rounded-md bg-sky-50 px-3 py-2 text-[11px] text-sky-700 dark:bg-sky-900/20 dark:text-sky-300">
                                        <strong>Indicado para:</strong>{' '}
                                        {opts.indicaciones}
                                    </div>
                                )}

                                {/* Pills de opciones */}
                                {!isActiveSearch && med.nombre && (
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                        <PillOptions
                                            index={index}
                                            label="Presentación"
                                            field="presentacion"
                                            options={opts?.presentaciones}
                                        />
                                        <PillOptions
                                            index={index}
                                            label="Dosis"
                                            field="dosis"
                                            options={opts?.dosis_options}
                                        />
                                        <PillOptions
                                            index={index}
                                            label="Frecuencia"
                                            field="frecuencia"
                                            options={opts?.frecuencia_options}
                                        />
                                        <PillOptions
                                            index={index}
                                            label="Duración"
                                            field="duracion"
                                            options={opts?.duracion_options}
                                        />
                                        <div className="space-y-1.5">
                                            <Label className="text-[11px] text-slate-500">
                                                Cantidad
                                            </Label>
                                            <Input
                                                value={med.cantidad}
                                                onChange={(e) =>
                                                    updateMedicamento(
                                                        index,
                                                        'cantidad',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="21 tabletas"
                                                className="h-8 text-xs"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Indicaciones */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200">
                        <ClipboardList className="h-4 w-4 text-indigo-500" />
                        Indicaciones
                    </h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addIndicacion}
                    >
                        <Plus className="mr-1 h-4 w-4" /> Añadir
                    </Button>
                </div>

                <div className="space-y-2">
                    {indicaciones.map((ind, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400">
                                {index + 1}
                            </div>
                            <Textarea
                                value={ind}
                                onChange={(e) =>
                                    updateIndicacion(index, e.target.value)
                                }
                                placeholder={`Indicación ${index + 1} para el paciente`}
                                className="min-h-[60px] flex-1"
                            />
                            {indicaciones.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeIndicacion(index)}
                                    className="mt-1 flex-shrink-0 text-rose-500 transition hover:text-rose-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Próxima cita (opcional) */}
            <div className="space-y-2">
                <Label htmlFor="proxima_cita">
                    Próxima cita{' '}
                    <span className="text-xs font-normal text-slate-400">
                        (opcional)
                    </span>
                </Label>
                <Input
                    id="proxima_cita"
                    type="date"
                    value={proximaCita}
                    onChange={(e) => setProximaCita(e.target.value)}
                />
            </div>

            {/* Botones */}
            <div className="mt-2 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white"
                    disabled={processing}
                >
                    {processing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Save className="mr-2 h-4 w-4" />
                    )}
                    {isEditing ? 'Actualizar Receta' : 'Guardar Receta'}
                </Button>
            </div>
        </form>
    );
}
