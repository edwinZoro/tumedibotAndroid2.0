import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

// shadcn components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Lucide icons
import {
  User,
  MapPin,
  Briefcase,
  ChevronRight,
  ChevronLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Stethoscope,
} from 'lucide-react';

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
const step1Schema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  apellido: z.string().min(2, 'Mínimo 2 caracteres'),
  second_name: z.string().optional(),
  last_name: z.string().optional(),
  sexo: z.enum(['MASCULINO', 'FEMENINO'], { required_error: 'Campo requerido' }),
  telefono: z.string().regex(/^[+]?[\d\s-]{6,15}$/, 'Formato inválido'),
  whatsapp: z.string().regex(/^[+]?[\d\s-]{6,15}$/, 'Formato inválido').optional(),
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

const step3Schema = z.object({
  especialidad: z.string().min(1, 'Campo requerido'),
  experiencia: z.coerce.number().min(1, 'Mínimo 1 año').max(100, 'Máximo 100 años'),
  costo_consulta: z.coerce.number().positive('Debe ser mayor a 0'),
  horario: z.string().min(1, 'Campo requerido'),
  leyenda_dr: z.string().min(2, 'Mínimo 2 caracteres'),
  perfil_med: z.string().min(100, 'Mínimo 100 caracteres').max(1500, 'Máximo 1500 caracteres'),
  tratamientos: z.string().min(100, 'Mínimo 100 caracteres').max(1500, 'Máximo 1500 caracteres'),
  codigo: z.string().optional(),
});

// Tipo para el formulario completo
type FormData = z.infer<typeof step1Schema> &
  z.infer<typeof step2Schema> &
  z.infer<typeof step3Schema> & {
    titulo_file?: File;
    foto?: File;
  };

// ─── Componente principal ──────────────────────────────────────────────────────
export default function DoctorFormStepper() {
  // ── Estado del stepper ──
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
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [tituloFile, setTituloFile] = useState<File | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  // ── React Hook Form ──
  const form = useForm<FormData>({
    resolver: zodResolver(z.object({}).passthrough()),
    defaultValues: {
      nombre: '',
      apellido: '',
      second_name: '',
      last_name: '',
      sexo: undefined,
      telefono: '',
      whatsapp: '',
      email_dr: '',
      pais: '',
      estado: '',
      ciudad: '',
      direccion_completa: '',
      facebook: '',
      twitter: '',
      linkedin: '',
      instagram: '',
      especialidad: '',
      experiencia: undefined,
      costo_consulta: undefined,
      horario: '',
      leyenda_dr: '',
      perfil_med: '',
      tratamientos: '',
      codigo: '',
    },
  });

  const { control, handleSubmit, setValue, watch, getValues, setFocus, setError } = form;

  // Observar cambios para cargar estados/ciudades
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
      } catch (error) {
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
      } catch (error) {
        toast.error('Error al cargar especialidades');
      } finally {
        setLoading((prev) => ({ ...prev, especialidades: false }));
      }
    };
    loadPaises();
    loadEspecialidades();
  }, []);

  // ── Cargar estados al cambiar país ──
  useEffect(() => {
    if (!paisWatch) {
      setEstados([]);
      setCiudades([]);
      setValue('estado', '');
      setValue('ciudad', '');
      return;
    }
    const loadEstados = async () => {
      setLoading((prev) => ({ ...prev, estados: true }));
      try {
        const res = await fetch(`/api/paises/${paisWatch}/estados`);
        const data = await res.json();
        setEstados(data);
        setValue('estado', '');
        setValue('ciudad', '');
        setCiudades([]);
      } catch (error) {
        toast.error('Error al cargar estados');
      } finally {
        setLoading((prev) => ({ ...prev, estados: false }));
      }
    };
    loadEstados();
  }, [paisWatch, setValue]);

  // ── Cargar ciudades al cambiar estado ──
  useEffect(() => {
    if (!estadoWatch) {
      setCiudades([]);
      setValue('ciudad', '');
      return;
    }
    const loadCiudades = async () => {
      setLoading((prev) => ({ ...prev, ciudades: true }));
      try {
        const res = await fetch(`/api/estados/${estadoWatch}/ciudades`);
        const data = await res.json();
        setCiudades(data);
        setValue('ciudad', '');
      } catch (error) {
        toast.error('Error al cargar ciudades');
      } finally {
        setLoading((prev) => ({ ...prev, ciudades: false }));
      }
    };
    loadCiudades();
  }, [estadoWatch, setValue]);

  // ── Validación por paso con foco en el primer error ──
  const validateStep = async (step: 1 | 2 | 3): Promise<boolean> => {
    let schema;
    if (step === 1) schema = step1Schema;
    else if (step === 2) schema = step2Schema;
    else schema = step3Schema;

    const values = getValues();
    const result = await schema.safeParseAsync(values);

    if (!result.success) {
      // Aseguramos que result.error existe y tiene errores
      const errors = result.error?.errors || [];
      if (errors.length > 0) {
        errors.forEach((err) => {
          const path = err.path.join('.');
          setError(path as any, { message: err.message });
        });
        // Enfocar el primer campo con error
        const firstError = errors[0];
        if (firstError) {
          const path = firstError.path.join('.');
          setFocus(path as any);
        }
        toast.error('Por favor, corrige los errores marcados en rojo');
      } else {
        // Caso raro: no hay errores pero success es false, mostramos mensaje genérico
        toast.error('Hay errores en el formulario, revisa los campos');
      }
      return false;
    }
    return true;
  };

  const nextStep = async () => {
    const valid = await validateStep(currentStep);
    if (!valid) return;
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as 1 | 2 | 3);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as 1 | 2 | 3);
  };

  // ── Manejo de archivos ──
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'foto' | 'titulo'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'foto') {
      setFotoFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setTituloFile(file);
    }
  };

  // ── Envío final ──
  const onSubmit = async () => {
    const valid = await validateStep(3);
    if (!valid) return;

    if (!fotoFile) {
      toast.error('Debes subir una foto profesional');
      return;
    }

    const formData = new FormData();
    const values = getValues();

    const payload = {
      nombre: values.nombre,
      apellido: values.apellido,
      second_name: values.second_name || '',
      last_name: values.last_name || '',
      sexo: values.sexo,
      telefono: values.telefono,
      whatsapp: values.whatsapp || '',
      email_dr: values.email_dr,
      pais: values.pais,
      estado: values.estado,
      ciudad: values.ciudad,
      direccion_completa: values.direccion_completa,
      especialidad_id: values.especialidad,
      experiencia: values.experiencia,
      costo_consulta: values.costo_consulta,
      horario: values.horario,
      leyenda_dr: values.leyenda_dr,
      perfil_med: values.perfil_med,
      tratamientos: values.tratamientos,
      facebook: values.facebook || '',
      twitter: values.twitter || '',
      linkedin: values.linkedin || '',
      instagram: values.instagram || '',
      user_id: obtenerUserId(),
    };

    Object.entries(payload).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (fotoFile) formData.append('foto', fotoFile);
    if (tituloFile) formData.append('titulo_file', tituloFile);

    try {
      const csrfToken = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');

      const res = await fetch('/api/medicos', {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrfToken || '',
          Accept: 'application/json',
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error en el servidor');

      toast.success('Formulario enviado correctamente');
      if (data.redirect) window.location.href = data.redirect;
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar');
    }
  };

  const obtenerUserId = (): number => {
    const match = window.location.pathname.match(/\/calendar_example\/(\d+)/);
    return match ? parseInt(match[1]) : 0;
  };

  // ── Renderizado de pasos ──
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
          />
        );
      default:
        return null;
    }
  };

  // ─── JSX ─────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
      {/* ══ HERO SECTION (sin badge de paso) ═══════════════════════════════ */}
      <section className="relative overflow-hidden bg-blue-50/50 dark:bg-[#0b1121] pt-12 pb-16 lg:pt-16 lg:pb-20">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)]" />
        <div className="absolute top-0 right-[15%] h-[400px] w-[400px] rounded-full bg-blue-400/20 dark:bg-blue-600/15 blur-[120px]" />
        <div className="absolute bottom-[-100px] left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 dark:bg-sky-500/15 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
              <Stethoscope className="h-8 w-8 text-white" />
              <div className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500">
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                Registro de Médico
              </h1>
              <p className="mt-1 flex items-center justify-center gap-1 text-sm font-medium text-sky-600 dark:text-sky-400 md:justify-start">
                <Sparkles className="h-4 w-4" /> Completa tu perfil profesional en TuMediBot
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTENIDO DEL FORMULARIO ══════════════════════════════════════ */}
      <main className="mx-auto -mt-8 max-w-4xl px-4 sm:px-6 lg:px-8 relative z-20 pb-12">
        {/* Alerta informativa */}
        <Alert className="mb-6 border-sky-200 bg-sky-50 text-sky-800 dark:border-sky-800/30 dark:bg-sky-950/30 dark:text-sky-300">
          <AlertCircle className="h-5 w-5 text-sky-500" />
          <AlertTitle className="font-semibold">Información importante</AlertTitle>
          <AlertDescription>
            Toda la información del siguiente formulario será visible en tu Perfil Médico.
          </AlertDescription>
        </Alert>

        {/* Card principal con el stepper */}
        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-xl backdrop-blur-md dark:border-slate-800/60 dark:bg-slate-900/50">
          <CardHeader className="border-b border-slate-200/60 pb-4 dark:border-slate-700/60">
            <CardTitle className="flex flex-col items-start gap-1 text-2xl font-bold text-slate-800 dark:text-slate-100">
              <span className="flex items-center gap-2">
                <Briefcase className="h-6 w-6 text-sky-500" />
                Formulario del Perfil Médico
              </span>
              <span className="text-sm font-medium text-sky-600 dark:text-sky-400">
                Paso {currentStep} de 3
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-6">
            {/* Stepper visual (mejorado) */}
            <div className="mb-8 flex items-center justify-between">
              {[1, 2, 3].map((step) => (
                <React.Fragment key={step}>
                  <div
                    className={`flex items-center gap-2 ${
                      step <= currentStep ? 'text-sky-600 dark:text-sky-400' : 'text-slate-400'
                    }`}
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold transition-colors ${
                        step < currentStep
                          ? 'border-sky-500 bg-sky-500 text-white dark:border-sky-400 dark:bg-sky-400'
                          : step === currentStep
                            ? 'border-sky-500 bg-sky-500/10 text-sky-500 dark:border-sky-400 dark:bg-sky-400/20 dark:text-sky-400'
                            : 'border-slate-300 bg-transparent text-slate-400 dark:border-slate-600'
                      }`}
                    >
                      {step < currentStep ? <CheckCircle className="h-5 w-5" /> : step}
                    </div>
                    <span className="hidden text-sm font-semibold md:inline">
                      {step === 1 && 'Datos Personales'}
                      {step === 2 && 'Dirección'}
                      {step === 3 && 'Profesional'}
                    </span>
                  </div>
                  {step < 3 && (
                    <div
                      className={`h-0.5 flex-1 transition-colors ${
                        step < currentStep ? 'bg-sky-500 dark:bg-sky-400' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}

              {/* Botones de navegación */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60 pt-6 dark:border-slate-700/60">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={prevStep}
                      className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Regresar
                    </Button>
                  )}
                  {currentStep < 3 && (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="bg-gradient-to-r from-blue-600 to-sky-500 text-white hover:from-blue-500 hover:to-sky-400"
                    >
                      Continuar
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>

                {currentStep === 3 && (
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-400 hover:to-green-400"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Enviar
                  </Button>
                )}

                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    form.reset();
                    setFotoPreview(null);
                    setFotoFile(null);
                    setTituloFile(null);
                    setCurrentStep(1);
                  }}
                  className="text-slate-500 hover:text-red-500 dark:text-slate-400"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

// ─── Paso 1: Datos Personales ─────────────────────────────────────────────────
function PasoDatosPersonales({ control }: { control: any }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre *</Label>
          <Controller
            name="nombre"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="nombre" placeholder="Simón" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="apellido">Apellido *</Label>
          <Controller
            name="apellido"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="apellido" placeholder="Boada" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="second_name">Segundo Nombre</Label>
          <Controller
            name="second_name"
            control={control}
            render={({ field }) => <Input id="second_name" placeholder="José" {...field} />}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Segundo Apellido</Label>
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => <Input id="last_name" placeholder="Pérez" {...field} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo *</Label>
          <Controller
            name="sexo"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger id="sexo">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MASCULINO">Masculino</SelectItem>
                    <SelectItem value="FEMENINO">Femenino</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono *</Label>
          <Controller
            name="telefono"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="telefono" placeholder="+58 412 1234567" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Controller
            name="whatsapp"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="whatsapp" placeholder="+58 412 1234567" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email_dr">Correo Electrónico *</Label>
          <Controller
            name="email_dr"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="email_dr" type="email" placeholder="dr@example.com" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Paso 2: Dirección y Contacto ─────────────────────────────────────────────
function PasoDireccion({
  control,
  paises,
  estados,
  ciudades,
  loading,
}: {
  control: any;
  paises: Pais[];
  estados: Estado[];
  ciudades: Ciudad[];
  loading: any;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="pais">País *</Label>
          <Controller
            name="pais"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading.paises}
                >
                  <SelectTrigger id="pais">
                    <SelectValue placeholder="Seleccionar país" />
                  </SelectTrigger>
                  <SelectContent>
                    {paises.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>
                        {p.nombre_paises}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="estado">Estado *</Label>
          <Controller
            name="estado"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!paises || loading.estados}
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ciudad">Ciudad *</Label>
          <Controller
            name="ciudad"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!estados || loading.ciudades}
                >
                  <SelectTrigger id="ciudad">
                    <SelectValue placeholder="Seleccionar ciudad" />
                  </SelectTrigger>
                  <SelectContent>
                    {ciudades.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="direccion_completa">Dirección Completa *</Label>
        <Controller
          name="direccion_completa"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <Textarea
                id="direccion_completa"
                rows={3}
                placeholder="Av. Principal, Edif. Central, Piso 2, Oficina 201"
                {...field}
              />
              {fieldState.error && (
                <p className="text-xs text-red-500">{fieldState.error.message}</p>
              )}
            </>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="facebook">Facebook</Label>
          <Controller
            name="facebook"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="facebook" placeholder="https://facebook.com/usuario" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter / X</Label>
          <Controller
            name="twitter"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="twitter" placeholder="https://x.com/usuario" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Controller
            name="linkedin"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="linkedin" placeholder="https://linkedin.com/in/usuario" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram</Label>
          <Controller
            name="instagram"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="instagram" placeholder="https://instagram.com/usuario" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}

// ─── Paso 3: Información Profesional ──────────────────────────────────────────
function PasoProfesional({
  control,
  especialidades,
  loading,
  fotoPreview,
  onFileChange,
}: {
  control: any;
  especialidades: Especialidad[];
  loading: any;
  fotoPreview: string | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>, type: 'foto' | 'titulo') => void;
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="especialidad">Especialidad *</Label>
          <Controller
            name="especialidad"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={loading.especialidades}
                >
                  <SelectTrigger id="especialidad">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>
                        {e.nombre_especialidad}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="experiencia">Años de Experiencia *</Label>
          <Controller
            name="experiencia"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="experiencia" type="number" placeholder="5" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costo_consulta">Costo Consulta (USD) *</Label>
          <Controller
            name="costo_consulta"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="costo_consulta" type="number" placeholder="50" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="horario">Horario *</Label>
          <Controller
            name="horario"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="horario" placeholder="Lun-Vie 8am-6pm" {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="leyenda_dr">Usted es *</Label>
          <Controller
            name="leyenda_dr"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Input id="leyenda_dr" placeholder="Cirujano, Odontólogo..." {...field} />
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="codigo">Código Secreto (Opcional)</Label>
          <Controller
            name="codigo"
            control={control}
            render={({ field }) => <Input id="codigo" placeholder="****" {...field} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="titulo_file">Título Profesional (PDF/Imagen)</Label>
          <Input
            id="titulo_file"
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => onFileChange(e, 'titulo')}
          />
          <p className="text-xs text-muted-foreground">Máx. 5MB</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="foto">Foto Profesional *</Label>
          <Input
            id="foto"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={(e) => onFileChange(e, 'foto')}
          />
          <p className="text-xs text-muted-foreground">Máx. 5MB (imagen)</p>
          {fotoPreview && (
            <div className="mt-2 rounded-md border p-2">
              <img src={fotoPreview} alt="Vista previa" className="max-h-40 rounded-md object-contain" />
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="perfil_med">Perfil Médico *</Label>
          <Controller
            name="perfil_med"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  id="perfil_med"
                  rows={6}
                  placeholder="Describa su experiencia y especialidades..."
                  {...field}
                />
                <p className="text-xs text-muted-foreground">Mín. 100 caracteres, máx. 1500</p>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tratamientos">Tratamientos *</Label>
          <Controller
            name="tratamientos"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <Textarea
                  id="tratamientos"
                  rows={6}
                  placeholder="Describa los tratamientos que ofrece..."
                  {...field}
                />
                <p className="text-xs text-muted-foreground">Mín. 100 caracteres, máx. 1500</p>
                {fieldState.error && (
                  <p className="text-xs text-red-500">{fieldState.error.message}</p>
                )}
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
}
