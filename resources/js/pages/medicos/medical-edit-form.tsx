import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import {
    User,
    MapPin,
    Briefcase,
    ChevronRight,
    ChevronLeft,
    AlertCircle,
    Sparkles,
    Stethoscope,
    ShieldCheck,
    Send,
    Loader2,
} from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

// shadcn components
import RichTextEditor from '@/components/RichTextEditor';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Lucide icons

// ─── Props desde Inertia ───────────────────────────────────────────────────────
interface MedicoProp {
    id: number;
    nombre: string;
    apellido: string;
    second_name?: string;
    last_name?: string;
    cedula_medico?: string;
    sexo: string;
    telefono: string;
    whatsapp?: string;
    correo: string;
    pais_id?: number | null;
    estado_id?: number | null;
    ciudad_id?: number | null;
    direccion?: string;
    especialidad_id?: number | null;
    consultorio_costo?: number;
    horario?: string;
    experiencia?: number;
    usted_es?: string;
    foto?: string;
    perfil_medico?: string;
    tratamientos?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    name_original?: string;
    especialidad?: { id: number; nombre_especialidad: string } | null;
    pais?: { id: number; nombre_paises: string } | null;
    estado?: { id: number; name: string } | null;
    ciudad?: { id: number; name: string } | null;
}

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface Pais {
    id: number;
    nombre_paises: string;
}

interface Estado {
    id: number;
    name: string;
}

interface Ciudad {
    id: number;
    name: string;
}

interface Especialidad {
    id: number;
    nombre_especialidad: string;
}

// ─── Zod Schemas ──────────────────────────────────────────────────────────────
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB (foto)
const MAX_TITULO_SIZE = 10 * 1024 * 1024; // 10MB (título profesional)
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg'];
const ALLOWED_TITULO_TYPES = ['application/pdf', ...ALLOWED_IMAGE_TYPES];

const step1Schema = z.object({
    nombre: z.string().min(2, 'Campo requerido'),
    apellido: z.string().min(2, 'Campo requerido'),
    second_name: z.string().optional(),
    last_name: z.string().optional(),
    cedula_medico: z
        .string()
        .min(1, 'Campo requerido')
        .max(30, 'Máximo 30 caracteres'),
    sexo: z.enum(['MASCULINO', 'FEMENINO'], 'Campo requerido'),
    telefono: z
        .string()
        .min(1, 'Campo requerido')
        .regex(/^[+]?[\d\s-]+$/, 'Formato inválido')
        .refine(
            (val) => {
                const soloDigitos = val.replace(/[\s-]/g, '');

                return soloDigitos.length >= 6 && soloDigitos.length <= 20;
            },
            { message: 'El teléfono debe tener entre 6 y 20 dígitos' },
        ),
    whatsapp: z
        .string()
        .min(1, 'Campo requerido')
        .regex(/^[+]?[\d\s-]+$/, 'Formato inválido')
        .refine(
            (val) => {
                const soloDigitos = val.replace(/[\s-]/g, '');

                return soloDigitos.length >= 6 && soloDigitos.length <= 20;
            },
            { message: 'El whatsapp debe tener entre 6 y 20 dígitos' },
        ),
    email_dr: z.string().email('Email inválido'),
});

const step2Schema = z.object({
    pais: z.string().min(1, 'Campo requerido'),
    estado: z.string().min(1, 'Campo requerido'),
    ciudad: z.string().min(1, 'Campo requerido'),
    direccion_completa: z.string().min(10, 'Mínimo 10 caracteres'),
    facebook: z.string().url('URL inválida').optional().or(z.literal('')),
    twitter: z.string().url('URL inválida').optional().or(z.literal('')),
    linkedin: z.string().url('URL inválida').optional().or(z.literal('')),
    instagram: z.string().url('URL inválida').optional().or(z.literal('')),
});

const toNumber = (val: unknown) => {
    if (val === '' || val === null || val === undefined) {
        return undefined;
    }

    const num = Number(val);

    return isNaN(num) ? val : num;
};

const step3Schema = z.object({
    especialidad: z.string().min(1, 'Campo requerido'),
    experiencia: z.coerce
        .number({
            invalid_type_error: 'Debe ser un número',
        })
        .min(1, 'Mínimo 1 año')
        .max(100, 'Máximo 100 años')
        .or(z.literal('').transform(() => undefined)) // Captura el vacío si lo hubiera y lo maneja
        .refine((val) => val !== undefined && !isNaN(val), {
            message: 'Campo requerido',
        }),

    costo_consulta: z.coerce
        .number({
            invalid_type_error: 'Debe ser un número',
        })
        .positive('Debe ser mayor a 0')
        .or(z.literal('').transform(() => undefined))
        .refine((val) => val !== undefined && !isNaN(val), {
            message: 'Campo requerido',
        }),
    horario: z.string().min(1, 'Campo requerido'),
    leyenda_dr: z.string().min(2, 'Mínimo 2 caracteres'),
    perfil_med: z
        .string()
        .min(100, 'Mínimo 100 caracteres')
        .max(1500, 'Máximo 1500 caracteres'),
    tratamientos: z
        .string()
        .min(100, 'Mínimo 100 caracteres')
        .max(1500, 'Máximo 1500 caracteres'),
    codigo: z.string().optional(),
    // Validación de archivos (opcional para edición)
    foto: z
        .union([
            z
                .instanceof(File)
                .refine(
                    (file) => file.size <= MAX_FILE_SIZE,
                    'El archivo no debe superar los 5MB',
                )
                .refine(
                    (file) => ALLOWED_IMAGE_TYPES.includes(file.type),
                    'Solo se permiten imágenes PNG, JPG o JPEG',
                ),
            z.literal(''),
            z.undefined(),
        ])
        .optional(),
    titulo_file: z
        .union([
            z
                .instanceof(File)
                .refine(
                    (file) => file.size <= MAX_TITULO_SIZE,
                    'El archivo no debe superar los 10MB',
                )
                .refine(
                    (file) => ALLOWED_TITULO_TYPES.includes(file.type),
                    'Solo se permiten PDF, PNG, JPG o JPEG',
                ),
            z.literal(''),
            z.undefined(),
        ])
        .optional(),
});

// Esquema combinado para todo el formulario
const combinedSchema = z
    .object({})
    .merge(step1Schema)
    .merge(step2Schema)
    .merge(step3Schema);

type FormData = z.infer<typeof combinedSchema>;

// ─── Componentes de campo reutilizables ──────────────────────────────────────

interface FieldWrapperProps {
    label: string;
    error?: string;
    children: React.ReactNode;
    className?: string;
}

const FieldWrapper = ({
    label,
    error,
    children,
    className = '',
}: FieldWrapperProps) => (
    <div className={`space-y-2 ${className}`}>
        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
            {label}
        </Label>
        {children}
        {error && (
            <p className="animate-in px-1 text-xs font-bold text-red-500 fade-in slide-in-from-top-1">
                {error}
            </p>
        )}
    </div>
);

const FormInput = ({
    control,
    name,
    label,
    placeholder,
    type = 'text',
    inputMode,
    className,
}: {
    control: any;
    name: string;
    label: string;
    placeholder: string;
    type?: string;
    inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url';
    className?: string;
}) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <FieldWrapper
                label={label}
                error={fieldState.error?.message}
                className={className}
            >
                <Input
                    {...field}
                    type={type}
                    inputMode={inputMode}
                    placeholder={placeholder}
                    className="h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-slate-300 focus-visible:border-amber-500 focus-visible:ring-amber-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                />
            </FieldWrapper>
        )}
    />
);

const FormSelect = ({
    control,
    name,
    label,
    placeholder,
    options,
    loading = false,
    disabled = false,
    className,
    onValueChange,
}: {
    control: any;
    name: string;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
    loading?: boolean;
    disabled?: boolean;
    className?: string;
    onValueChange?: (value: string) => void;
}) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <FieldWrapper
                label={label}
                error={fieldState.error?.message}
                className={className}
            >
                <Select
                    onValueChange={(value) => {
                        field.onChange(value);
                        onValueChange?.(value);
                    }}
                    value={field.value}
                    disabled={disabled || loading}
                >
                    <SelectTrigger className="h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-amber-500 focus:ring-amber-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700">
                        <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl dark:border-slate-800">
                        {loading ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
                            </div>
                        ) : (
                            options.map((opt) => (
                                <SelectItem
                                    key={opt.value}
                                    value={opt.value}
                                    className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20"
                                >
                                    {opt.label}
                                </SelectItem>
                            ))
                        )}
                    </SelectContent>
                </Select>
            </FieldWrapper>
        )}
    />
);

const FormTextarea = ({
    control,
    name,
    label,
    placeholder,
    rows = 3,
    className,
}: {
    control: any;
    name: string;
    label: string;
    placeholder: string;
    rows?: number;
    className?: string;
}) => (
    <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
            <FieldWrapper
                label={label}
                error={fieldState.error?.message}
                className={className}
            >
                <Textarea
                    {...field}
                    rows={rows}
                    placeholder={placeholder}
                    className="rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-slate-300 focus-visible:border-amber-500 focus-visible:ring-amber-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700"
                />
            </FieldWrapper>
        )}
    />
);

// ─── Componente principal ──────────────────────────────────────────────────────
export default function DoctorFormStepper({
    medico,
    userId,
}: {
    medico?: MedicoProp | null;
    userId?: number;
}) {
    const isEditing = !!medico;

    const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

    // ── Estado para datos de API ──
    const [paises, setPaises] = useState<Pais[]>([]);
    const [estados, setEstados] = useState<Estado[]>([]);
    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
    const [loading, setLoading] = useState({
        paises: false,
        estados: false,
        ciudades: false,
        especialidades: false,
    });

    // ── Archivos y previsualización ──
    const [fotoPreview, setFotoPreview] = useState<string | null>(
        medico?.foto ? `/imagen/${medico.foto}` : null,
    );

    const existingFoto = medico?.foto || null;

    // ── React Hook Form ──
    const form = useForm<FormData>({
        resolver: zodResolver(combinedSchema),
        mode: 'onChange', // Validación en tiempo real
        defaultValues: {
            nombre: medico?.nombre || '',
            apellido: medico?.apellido || '',
            second_name: medico?.second_name || '',
            last_name: medico?.last_name || '',
            cedula_medico: medico?.cedula_medico || '',
            sexo: medico?.sexo || undefined,
            telefono: medico?.telefono || '',
            whatsapp: medico?.whatsapp || '',
            email_dr: medico?.correo || '',
            pais: medico?.pais_id ? String(medico.pais_id) : '',
            estado: medico?.estado_id ? String(medico.estado_id) : '',
            ciudad: medico?.ciudad_id ? String(medico.ciudad_id) : '',
            direccion_completa: medico?.direccion || '',
            facebook: medico?.facebook || '',
            twitter: medico?.twitter || '',
            linkedin: medico?.linkedin || '',
            instagram: medico?.instagram || '',
            especialidad: medico?.especialidad_id
                ? String(medico.especialidad_id)
                : '',
            experiencia: medico?.experiencia || undefined,
            costo_consulta: medico?.consultorio_costo || undefined,
            horario: medico?.horario || '',
            leyenda_dr: medico?.usted_es || '',
            perfil_med: medico?.perfil_medico || '',
            tratamientos: medico?.tratamientos || '',
            codigo: '',
            foto: undefined,
            titulo_file: undefined,
        },
    });

    const {
        control,
        handleSubmit,
        setValue,
        watch,
        getValues,
        setFocus,
        setError,
        trigger,
        formState,
    } = form;
    const { errors, isSubmitting } = formState;
    const paisWatch = watch('pais');
    const estadoWatch = watch('estado');

    // ── Cargar datos iniciales ──
    useEffect(() => {
        const loadPaises = async () => {
            setLoading((prev) => ({ ...prev, paises: true }));

            try {
                const res = await fetch('/api/paises');
                const data = await res.json();
                setPaises(data);
            } catch {
                toast.error('Error al cargar países');
            } finally {
                setLoading((prev) => ({ ...prev, paises: false }));
            }
        };
        const loadEspecialidades = async () => {
            setLoading((prev) => ({ ...prev, especialidades: true }));

            try {
                const res = await fetch('/api/especialidades');
                const data = await res.json();
                setEspecialidades(data);
            } catch {
                toast.error('Error al cargar especialidades');
            } finally {
                setLoading((prev) => ({ ...prev, especialidades: false }));
            }
        };
        loadPaises();
        loadEspecialidades();
    }, []);

    // ── Precargar estados si existe país al editar ──
    useEffect(() => {
        if (medico?.pais_id) {
            cargarEstados(String(medico.pais_id), true);
        }
    }, []);

    // ── Precargar ciudades si existe estado al editar ──
    useEffect(() => {
        if (medico?.estado_id) {
            cargarCiudades(String(medico.estado_id), true);
        }
    }, []);

    // ── Handlers de locación (con flag keepSelection) ──
    const cargarEstados = async (paisId: string, keepSelection = false) => {
        setEstados([]);

        if (!paisId) {
            if (!keepSelection) {
                setValue('estado', '');
                setValue('ciudad', '');
            }

            return;
        }

        setLoading((prev) => ({ ...prev, estados: true }));

        try {
            const res = await fetch(`/api/paises/${paisId}/estados`);
            const data = await res.json();
            const mapped = data.map((e: any) => ({
                id: Number(e.id),
                name: e.name,
            }));
            setEstados(mapped);

            if (!keepSelection) {
                setValue('estado', '');
                setValue('ciudad', '');
                setCiudades([]);
            } else {
                const currentEstadoId = Number(medico?.estado_id);
                const exists = mapped.some(
                    (e: any) => e.id === currentEstadoId,
                );

                if (!exists) {
                    setValue('estado', '');
                    setValue('ciudad', '');
                    setCiudades([]);
                }
            }
        } catch {
            toast.error('Error al cargar estados');
        } finally {
            setLoading((prev) => ({ ...prev, estados: false }));
        }
    };

    const cargarCiudades = async (estadoId: string, keepSelection = false) => {
        setCiudades([]);

        if (!estadoId) {
            if (!keepSelection) {
                setValue('ciudad', '');
            }

            return;
        }

        setLoading((prev) => ({ ...prev, ciudades: true }));

        try {
            const res = await fetch(`/api/estados/${estadoId}/ciudades`);
            const data = await res.json();
            const mapped = data.map((c: any) => ({
                id: Number(c.id),
                name: c.name,
            }));
            setCiudades(mapped);

            if (!keepSelection) {
                setValue('ciudad', '');
            } else {
                const currentCiudadId = Number(medico?.ciudad_id);
                const exists = mapped.some(
                    (c: any) => c.id === currentCiudadId,
                );

                if (!exists) {
                    setValue('ciudad', '');
                }
            }
        } catch {
            toast.error('Error al cargar ciudades');
        } finally {
            setLoading((prev) => ({ ...prev, ciudades: false }));
        }
    };

    // ── Validación por paso ──
    const validateStep = async (step: 1 | 2 | 3): Promise<boolean> => {
        let fields: (keyof FormData)[] = [];

        if (step === 1) {
            fields = [
                'nombre',
                'apellido',
                'second_name',
                'last_name',
                'sexo',
                'telefono',
                'whatsapp',
                'email_dr',
            ];
        } else if (step === 2) {
            fields = [
                'pais',
                'estado',
                'ciudad',
                'direccion_completa',
                'facebook',
                'twitter',
                'linkedin',
                'instagram',
            ];
        } else {
            fields = [
                'especialidad',
                'experiencia',
                'costo_consulta',
                'horario',
                'leyenda_dr',
                'perfil_med',
                'tratamientos',
                'codigo',
                'foto',
                'titulo_file',
            ];
        }

        const result = await trigger(fields as any);

        if (!result) {
            toast.error('Por favor, corrige los errores marcados en rojo');
            const firstError = Object.keys(errors)[0];

            if (firstError) {
                // setFocus(firstError as any); // puedes descomentar si tienes un ref para el campo
            }

            return false;
        }

        return true;
    };

    const nextStep = async () => {
        const valid = await validateStep(currentStep);

        if (!valid) {
            return;
        }

        if (currentStep < 3) {
            setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
        }
    };

    // ── Manejo de archivos con react-hook-form ──
    const handleFileChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'foto' | 'titulo',
    ) => {
        const file = e.target.files?.[0];
        setValue(type, file || '', { shouldValidate: !!file });

        if (type === 'foto') {
            if (file) {
                const reader = new FileReader();
                reader.onload = (ev) =>
                    setFotoPreview(ev.target?.result as string);
                reader.readAsDataURL(file);
            } else if (existingFoto) {
                setFotoPreview(`/imagen/${existingFoto}`);
            } else {
                setFotoPreview(null);
            }
        }
    };

    // ── Envío final ──
    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        const payload: Record<string, any> = {
            nombre: data.nombre,
            apellido: data.apellido,
            second_name: data.second_name || '',
            last_name: data.last_name || '',
            cedula_medico: data.cedula_medico || '',
            sexo: data.sexo,
            telefono: data.telefono,
            whatsapp: data.whatsapp || '',
            email_dr: data.email_dr,
            pais: data.pais,
            estado: data.estado,
            ciudad: data.ciudad,
            direccion_completa: data.direccion_completa,
            especialidad_id: data.especialidad,
            experiencia: data.experiencia,
            costo_consulta: data.costo_consulta,
            horario: data.horario,
            leyenda_dr: data.leyenda_dr,
            perfil_med: data.perfil_med,
            tratamientos: data.tratamientos,
            facebook: data.facebook || '',
            twitter: data.twitter || '',
            linkedin: data.linkedin || '',
            instagram: data.instagram || '',
        };

        if (!isEditing) {
            payload.user_id = obtenerUserId();
        }

        if (isEditing) {
            formData.append('_method', 'PUT');
        }

        Object.entries(payload).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        if (data.foto) {
            formData.append('foto', data.foto);
        }

        if (data.titulo_file) {
            formData.append('titulo_file', data.titulo_file);
        }

        try {
            const csrfToken = document
                .querySelector('meta[name="csrf-token"]')
                ?.getAttribute('content');
            const url = isEditing
                ? `/api/medicos/${medico!.id}`
                : '/api/medicos';
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': csrfToken || '',
                    Accept: 'application/json',
                },
                body: formData,
            });
            const responseData = await res.json();

            if (!res.ok) {
                throw new Error(responseData.message || 'Error en el servidor');
            }

            toast.success(
                isEditing
                    ? 'Perfil actualizado correctamente'
                    : 'Formulario enviado correctamente',
            );

            if (responseData.redirect) {
                window.location.href = responseData.redirect;
            }
        } catch (error: any) {
            toast.error(error.message || 'Error al enviar');
        }
    };

    const obtenerUserId = (): number => {
        const match = window.location.pathname.match(
            /\/calendar_example\/(\d+)/,
        );

        return match ? parseInt(match[1]) : 0;
    };

    // ─── Renderizado de pasos ──────────────────────────────────────────────
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <PasoDatosPersonales control={control} />;
            case 2:
                return (
                    <PasoDireccion
                        control={control}
                        paises={paises}
                        estados={estados}
                        ciudades={ciudades}
                        loading={loading}
                        cargarEstados={cargarEstados}
                        cargarCiudades={cargarCiudades}
                    />
                );
            case 3:
                return (
                    <PasoProfesional
                        control={control}
                        especialidades={especialidades}
                        loading={loading}
                        fotoPreview={fotoPreview}
                        onFileChange={handleFileChange}
                        errors={errors}
                    />
                );
            default:
                return null;
        }
    };

    // ─── JSX ─────────────────────────────────────────────────────────────────────
    return (
        <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-slate-50 font-sans text-slate-900 transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            {/* Efectos de fondo */}
            <div
                className="absolute inset-0 scale-105 bg-cover bg-center opacity-[0.03] blur-xl dark:opacity-[0.05]"
                style={{ backgroundImage: `url('/imagen/1674252818.jpg')` }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_70%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />
            <div className="pointer-events-none absolute -top-20 left-[15%] h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/10" />
            <div className="pointer-events-none absolute top-[40%] right-[5%] h-[300px] w-[300px] rounded-full bg-sky-300/20 blur-[100px] dark:bg-sky-500/10" />

            <div className="relative z-10 flex flex-1 flex-col justify-center py-10">
                <main className="container mx-auto max-w-4xl px-4">
                    <Alert className="mb-6 rounded-2xl border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800/30 dark:bg-amber-950/30 dark:text-amber-300">
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                        <AlertTitle className="font-semibold">
                            Información importante
                        </AlertTitle>
                        <AlertDescription>
                            Toda la información del siguiente formulario será
                            visible en tu Perfil Médico.
                        </AlertDescription>
                    </Alert>

                    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-white to-slate-50 p-[1px] shadow-2xl shadow-amber-500/10 backdrop-blur-xl dark:from-[#0f1e3d]/90 dark:to-[#0b1121]/90">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-amber-600/30 via-amber-500/10 to-transparent dark:from-amber-600/50 dark:via-amber-500/20 dark:to-transparent" />
                        <div className="relative rounded-[calc(2rem-1px)] bg-white/90 dark:bg-[#0b1426]/95">
                            {/* Línea superior pulsante */}
                            <div className="relative h-1 w-full overflow-hidden rounded-t-[calc(2rem-1px)]">
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
                                <div className="absolute top-0 left-1/2 h-full w-32 -translate-x-1/2 animate-[pulse_2s_ease-in-out_infinite] bg-amber-400 shadow-[0_0_12px_3px_rgba(245,158,11,0.8)]" />
                            </div>

                            {/* Header */}
                            <div className="flex flex-col items-center justify-between gap-6 px-6 py-8 text-center md:flex-row md:px-10 md:pt-10 md:pb-6 md:text-left">
                                <div className="flex flex-col items-center gap-5 md:flex-row">
                                    <div className="group relative">
                                        <div className="absolute -inset-3 animate-[spin_10s_linear_infinite] rounded-full border border-dashed border-amber-400/40 dark:border-amber-400/20" />
                                        <div className="absolute -inset-1 animate-[spin_5s_linear_infinite_reverse] rounded-full border border-orange-400/40 border-l-amber-500/80 dark:border-orange-500/30" />
                                        <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md" />
                                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30">
                                            <Stethoscope className="h-7 w-7" />
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left">
                                        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
                                            {isEditing
                                                ? 'Editar Perfil Médico'
                                                : 'Registro de Médico'}
                                        </h1>
                                        <p className="mt-2 flex items-center justify-center gap-1 text-sm font-medium text-amber-600 md:justify-start dark:text-amber-400">
                                            <Sparkles className="h-4 w-4" />{' '}
                                            {isEditing
                                                ? 'Actualiza tu perfil profesional en TuMediBot'
                                                : 'Completa tu perfil profesional en TuMediBot'}
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden flex-col items-end md:flex">
                                    <span className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                                        Paso {currentStep} de 3
                                    </span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3].map((s) => (
                                            <div
                                                key={s}
                                                className={`h-1.5 rounded-full transition-all duration-500 ${currentStep >= s
                                                        ? 'w-8 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                                                        : 'w-2 bg-slate-200 dark:bg-slate-800'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="px-4 pb-10 md:px-10">
                                {/* Stepper visual */}
                                <div className="relative mb-12 px-2 pt-4 md:px-6">
                                    <div className="absolute top-1/2 right-[10%] left-[10%] z-0 h-0.5 -translate-y-1/2 rounded-full bg-slate-200 dark:bg-slate-800">
                                        <div
                                            className="h-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-700 ease-in-out"
                                            style={{
                                                width:
                                                    currentStep === 1
                                                        ? '0%'
                                                        : currentStep === 2
                                                            ? '50%'
                                                            : '100%',
                                            }}
                                        />
                                    </div>

                                    <div className="relative z-10 flex w-full justify-between">
                                        {[
                                            {
                                                num: 1,
                                                label: 'Datos Personales',
                                                icon: User,
                                            },
                                            {
                                                num: 2,
                                                label: 'Dirección',
                                                icon: MapPin,
                                            },
                                            {
                                                num: 3,
                                                label: 'Profesional',
                                                icon: Briefcase,
                                            },
                                        ].map((s) => {
                                            const isActive =
                                                currentStep === s.num;
                                            const isPast = currentStep > s.num;

                                            return (
                                                <div
                                                    key={s.num}
                                                    className="flex flex-col items-center gap-3"
                                                >
                                                    <div className="group relative">
                                                        {isActive && (
                                                            <>
                                                                <div className="absolute -inset-3 animate-[spin_8s_linear_infinite] rounded-full border border-dashed border-amber-400/30" />
                                                                <div className="absolute inset-0 animate-pulse rounded-full bg-amber-500/20 blur-md" />
                                                            </>
                                                        )}
                                                        <div
                                                            className={`relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-500 ${isActive
                                                                    ? 'scale-110 border-amber-500 bg-white text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)] dark:bg-[#0f1a2e]'
                                                                    : isPast
                                                                        ? 'border-transparent bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md'
                                                                        : 'border-slate-200 bg-white text-slate-300 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-600'
                                                                }`}
                                                        >
                                                            <s.icon
                                                                className={`h-5 w-5 ${isActive ? 'animate-bounce' : ''} [animation-duration:2s]`}
                                                            />
                                                        </div>
                                                    </div>
                                                    <span
                                                        className={`text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 md:text-[11px] ${isActive
                                                                ? 'text-amber-600 dark:text-amber-400'
                                                                : isPast
                                                                    ? 'text-slate-700 dark:text-slate-300'
                                                                    : 'text-slate-400 dark:text-slate-600'
                                                            }`}
                                                    >
                                                        {s.label}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Formulario */}
                                <form
                                    onSubmit={handleSubmit(onSubmit)}
                                    className="space-y-6"
                                >
                                    {renderStep()}

                                    {/* Botones de navegación */}
                                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
                                        <div className="flex gap-2">
                                            {currentStep > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    onClick={prevStep}
                                                    className="h-14 rounded-2xl border-slate-200 px-8 font-bold hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-800"
                                                >
                                                    <ChevronLeft className="mr-2 h-4 w-4" />
                                                    Regresar
                                                </Button>
                                            )}
                                            {currentStep < 3 && (
                                                <Button
                                                    type="button"
                                                    onClick={nextStep}
                                                    className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 px-10 text-base font-bold text-white shadow-lg shadow-amber-500/25 transition-all duration-300 hover:scale-105 hover:shadow-amber-500/40"
                                                >
                                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                                    Continuar
                                                    <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                                                </Button>
                                            )}
                                        </div>

                                        {currentStep === 3 && (
                                            <Button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="group relative h-14 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-10 text-base font-extrabold text-white shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/40 disabled:opacity-70 disabled:pointer-events-none"
                                            >
                                                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />
                                                {isSubmitting ? (
                                                    <>
                                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                                        Guardando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="mr-3 h-5 w-5 animate-pulse" />
                                                        {isEditing
                                                            ? 'Actualizar'
                                                            : 'Enviar'}
                                                    </>
                                                )}
                                            </Button>
                                        )}

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            onClick={() => {
                                                form.reset();
                                                setFotoPreview(null);
                                                setCurrentStep(1);
                                            }}
                                            className="h-14 rounded-2xl px-8 font-bold hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10"
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            <Footer />
        </div>
    );
}

// ─── Paso 1: Datos Personales ──────────────────────────────────────────────
function PasoDatosPersonales({ control }: { control: any }) {
    return (
        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
            <div className="grid grid-cols-1 gap-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:grid-cols-2 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                <FormInput
                    control={control}
                    name="nombre"
                    label="Nombre *"
                    placeholder="Simón"
                />
                <FormInput
                    control={control}
                    name="apellido"
                    label="Apellido *"
                    placeholder="Boada"
                />
                <FormInput
                    control={control}
                    name="second_name"
                    label="Segundo Nombre"
                    placeholder="José"
                />
                <FormInput
                    control={control}
                    name="last_name"
                    label="Segundo Apellido"
                    placeholder="Pérez"
                />
                <FormInput
                    control={control}
                    name="cedula_medico"
                    label="Cédula Profesional *"
                />
                <FormInput
                    control={control}
                    name="email_dr"
                    label="Correo Electrónico *"
                    placeholder="dr@example.com"
                    type="email"
                />

                <FormInput
                    control={control}
                    name="telefono"
                    label="Teléfono *"
                    placeholder="+58 412 1234567"
                    inputMode="tel"
                />
                <FormInput
                    control={control}
                    name="whatsapp"
                    label="WhatsApp"
                    placeholder="+58 412 1234567"
                    inputMode="tel"
                />

                <div className="space-y-2">
                    <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                        Sexo *
                    </Label>
                    <Controller
                        name="sexo"
                        control={control}
                        render={({ field, fieldState }) => (
                            <>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <SelectTrigger className="w-full h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 hover:border-slate-300 focus:border-amber-500 focus:ring-amber-500/50 dark:border-slate-800 dark:bg-slate-950/50 dark:hover:border-slate-700">
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-2xl border-slate-200 shadow-xl dark:border-slate-800">
                                        <SelectItem
                                            value="MASCULINO"
                                            className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20"
                                        >
                                            Masculino
                                        </SelectItem>
                                        <SelectItem
                                            value="FEMENINO"
                                            className="rounded-xl focus:bg-amber-50 dark:focus:bg-amber-900/20"
                                        >
                                            Femenino
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldState.error && (
                                    <p className="animate-in px-1 text-xs font-bold text-red-500 fade-in slide-in-from-top-1">
                                        {fieldState.error.message}
                                    </p>
                                )}
                            </>
                        )}
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Paso 2: Dirección y Contacto ──────────────────────────────────────────
function PasoDireccion({
    control,
    paises,
    estados,
    ciudades,
    loading,
    cargarEstados,
    cargarCiudades,
}: {
    control: any;
    paises: Pais[];
    estados: Estado[];
    ciudades: Ciudad[];
    loading: any;
    cargarEstados: (paisId: string, keepSelection?: boolean) => void;
    cargarCiudades: (estadoId: string, keepSelection?: boolean) => void;
}) {
    return (
        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
            <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormSelect
                        control={control}
                        name="pais"
                        label="País *"
                        placeholder="Seleccionar país"
                        options={paises.map((p) => ({
                            value: String(p.id),
                            label: p.nombre_paises,
                        }))}
                        loading={loading.paises}
                        onValueChange={(v) => cargarEstados(v, false)}
                    />
                    <FormSelect
                        control={control}
                        name="estado"
                        label="Estado *"
                        placeholder={
                            estados.length === 0
                                ? 'Espera...'
                                : 'Seleccionar estado'
                        }
                        options={estados.map((e) => ({
                            value: String(e.id),
                            label: e.name,
                        }))}
                        loading={loading.estados}
                        disabled={!paises.length || loading.estados}
                        onValueChange={(v) => cargarCiudades(v, false)}
                    />
                    <FormSelect
                        control={control}
                        name="ciudad"
                        label="Ciudad *"
                        placeholder={
                            ciudades.length === 0
                                ? 'Espera...'
                                : 'Seleccionar ciudad'
                        }
                        options={ciudades.map((c) => ({
                            value: String(c.id),
                            label: c.name,
                        }))}
                        loading={loading.ciudades}
                        disabled={!estados.length || loading.ciudades}
                    />
                </div>

                <FormTextarea
                    control={control}
                    name="direccion_completa"
                    label="Dirección Completa *"
                    placeholder="Av. Principal, Edif. Central, Piso 2, Oficina 201"
                    rows={3}
                />

                <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                    <FormInput
                        control={control}
                        name="facebook"
                        label="Facebook"
                        placeholder="https://facebook.com/usuario"
                        type="url"
                    />
                    <FormInput
                        control={control}
                        name="twitter"
                        label="Twitter / X"
                        placeholder="https://x.com/usuario"
                        type="url"
                    />
                    <FormInput
                        control={control}
                        name="linkedin"
                        label="LinkedIn"
                        placeholder="https://linkedin.com/in/usuario"
                        type="url"
                    />
                    <FormInput
                        control={control}
                        name="instagram"
                        label="Instagram"
                        placeholder="https://instagram.com/usuario"
                        type="url"
                    />
                </div>
            </div>
        </div>
    );
}

// ─── Paso 3: Información Profesional ──────────────────────────────────────
function PasoProfesional({
    control,
    especialidades,
    loading,
    fotoPreview,
    onFileChange,
    errors,
}: {
    control: any;
    especialidades: Especialidad[];
    loading: any;
    fotoPreview: string | null;
    onFileChange: (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'foto' | 'titulo',
    ) => void;
    errors: any;
}) {
    return (
        <div className="animate-in duration-500 fade-in slide-in-from-right-8">
            <div className="space-y-6 rounded-3xl border border-slate-100 bg-slate-50/50 p-6 md:p-8 dark:border-white/5 dark:bg-slate-900/20">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormSelect
                        control={control}
                        name="especialidad"
                        label="Especialidad *"
                        placeholder="Seleccionar"
                        options={especialidades.map((e) => ({
                            value: String(e.id),
                            label: e.nombre_especialidad,
                        }))}
                        loading={loading.especialidades}
                    />
                    <FormInput
                        control={control}
                        name="experiencia"
                        label="Años de Experiencia *"
                        placeholder="5"
                        type="number"
                        inputMode="numeric"
                    />
                    <FormInput
                        control={control}
                        name="costo_consulta"
                        label="Costo Consulta (USD) *"
                        placeholder="50"
                        type="number"
                        inputMode="decimal"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                    <FormInput
                        control={control}
                        name="horario"
                        label="Horario *"
                        placeholder="Lun-Vie 8am-6pm"
                    />
                    <FormInput
                        control={control}
                        name="leyenda_dr"
                        label="Usted es *"
                        placeholder="Cirujano, Odontólogo..."
                    />
                    <FormInput
                        control={control}
                        name="codigo"
                        label="Código Secreto (Opcional)"
                        placeholder="****"
                    />
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Título Profesional (PDF/Imagen)
                        </Label>
                        <Input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(e) => onFileChange(e, 'titulo_file')}
                            className="h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-700 hover:file:bg-amber-100 dark:border-slate-800 dark:bg-slate-950/50 dark:file:bg-amber-900/30 dark:file:text-amber-300"
                        />
                        <p className="text-xs text-muted-foreground">
                            Máx. 10MB
                        </p>
                        {errors.titulo_file && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.titulo_file.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Foto Profesional *
                        </Label>
                        <Input
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => onFileChange(e, 'foto')}
                            className="h-14 rounded-2xl border-slate-200 bg-white px-4 shadow-sm transition-all duration-200 file:mr-4 file:rounded-xl file:border-0 file:bg-amber-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-amber-700 hover:file:bg-amber-100 dark:border-slate-800 dark:bg-slate-950/50 dark:file:bg-amber-900/30 dark:file:text-amber-300"
                        />
                        <p className="text-xs text-muted-foreground">
                            Máx. 5MB (imagen)
                        </p>
                        {errors.foto && (
                            <p className="text-xs font-bold text-red-500">
                                {errors.foto.message}
                            </p>
                        )}
                        {fotoPreview && (
                            <div className="mt-2 rounded-md border p-2">
                                <img
                                    src={fotoPreview}
                                    alt="Vista previa"
                                    className="max-h-40 rounded-md object-contain"
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                    {/* Perfil Médico con TipTap */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Perfil Médico *
                        </Label>
                        <Controller
                            name="perfil_med"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Describe tu experiencia, formación y enfoque profesional..."
                                        minLength={100}
                                        maxLength={1500}
                                        className={
                                            fieldState.error
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {fieldState.error && (
                                        <p className="animate-in px-1 text-xs font-bold text-red-500">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    {/* Tratamientos con TipTap */}
                    <div className="space-y-2">
                        <Label className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                            Tratamientos *
                        </Label>
                        <Controller
                            name="tratamientos"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <RichTextEditor
                                        value={field.value}
                                        onChange={field.onChange}
                                        placeholder="Describa los tratamientos que ofrece..."
                                        minLength={100}
                                        maxLength={1500}
                                        className={
                                            fieldState.error
                                                ? 'border-red-500'
                                                : ''
                                        }
                                    />
                                    {fieldState.error && (
                                        <p className="animate-in px-1 text-xs font-bold text-red-500">
                                            {fieldState.error.message}
                                        </p>
                                    )}
                                </>
                            )}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
