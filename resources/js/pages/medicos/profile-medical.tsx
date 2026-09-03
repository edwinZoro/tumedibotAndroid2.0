import React, { useState, useMemo } from 'react';
import axios from 'axios';
import { Head, Link, router } from '@inertiajs/react';
import {
    Calendar,
    User,
    MapPin,
    Mail,
    DollarSign,
    Building2,
    Clock,
    Send,
    Globe,
    Map,
    Phone,
    Facebook,
    Twitter,
    Linkedin,
    Instagram,
    ArrowLeft,
    Award,
    Sparkles,
    Activity,
    BadgeCheck,
    Stethoscope,
    Compass,
    HeartPulse,
    ShieldCheck,
    MessagesSquare,
} from 'lucide-react';
import { toast } from 'sonner';

import AgendarCitaDialog, {
    type MedicoAgendar,
} from '@/components/agendar-cita-dialog';
import Footer from '@/components/footer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { login } from '@/routes';

// ─── Interfaces ────────────────────────────────────────────────────────────────
interface Especialidad {
    nombre_especialidad: string;
}

interface Ubicacion {
    nombre_paises?: string;
    name?: string;
}

interface Medico {
    id: number;
    nombre: string;
    apellido: string;
    second_name?: string;
    last_name?: string;
    sexo: 'MASCULINO' | 'FEMENINO';
    especialidad: string | Especialidad;
    foto?: string;
    perfil_medico: string;
    tratamientos: string;
    correo: string;
    consultorio_costo: number;
    pais: string | Ubicacion;
    estado: string | Ubicacion;
    ciudad: string | Ubicacion;
    direccion?: string;
    hospital_clinica?: string;
    nombre_hos_cli?: string;
    nmro_hos_cli?: string;
    horario: string;
    telefono: string;
    whatsapp?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
    usted_es: string;
    experiencia: number;
}

interface MedicoPerfilProps {
    medico: Medico;
    user: number;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function StatBadge({
    icon: Icon,
    label,
    value,
    colorClass,
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    colorClass: string;
}) {
    return (
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200/60 bg-white/60 px-5 py-3 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-white/5 dark:shadow-none">
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colorClass}`}
            >
                <Icon className="h-5 w-5" />
            </span>
            <div>
                <p className="text-[11px] font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                    {label}
                </p>
                <p className="text-sm font-bold text-slate-800 dark:text-white">
                    {value}
                </p>
            </div>
        </div>
    );
}

/**
 * Normaliza el valor de una red social guardado en BD.
 * Acepta: URL completa, "@username" o simplemente "username".
 */
function buildSocialUrl(
    raw: string | undefined | null,
    base: string,
): string | null {
    if (!raw) return null;
    const val = raw.trim();
    if (!val) return null;
    // Ya es una URL válida
    if (/^https?:\/\//i.test(val)) return val;
    // Quitar @ si lo tiene
    const username = val.replace(/^@/, '');
    return `${base}${username}`;
}

// ─── Social pill button ────────────────────────────────────────────────────────
function SocialPill({
    href,
    label,
    icon: Icon,
    brandBg,
}: {
    href: string;
    label: string;
    icon: React.ElementType;
    brandBg: string;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className={`group inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:brightness-110 ${brandBg}`}
        >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
        </a>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function MedicoPerfil({ medico, user }: MedicoPerfilProps) {
    const [dialogoAbierto, setDialogoAbierto] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<
        'about' | 'treatments' | 'location'
    >('about');
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
        email_doctor: medico.correo || '',
    });

    // ── Computed values ──
    const doctorTitle = useMemo(() => {
        const esp =
            typeof medico.especialidad === 'object'
                ? medico.especialidad.nombre_especialidad
                : medico.especialidad;
        if (medico.sexo === 'MASCULINO' && esp === 'ENFERMERÍA') return 'Lcdo.';
        if (medico.sexo === 'FEMENINO' && esp === 'ENFERMERÍA') return 'Lcda.';
        return medico.sexo === 'MASCULINO' ? 'Dr.' : 'Dra.';
    }, [medico]);

    const especialidadText =
        typeof medico.especialidad === 'object'
            ? medico.especialidad.nombre_especialidad
            : medico.especialidad;

    const medicoParaAgendar: MedicoAgendar = useMemo(() => ({
        id: medico.id,
        nombre: `${doctorTitle} ${medico.nombre} ${medico.apellido}`.trim(),
        especialidad: especialidadText,
        consultorio_costo: medico.consultorio_costo,
        foto: medico.foto,
    }), [medico, doctorTitle, especialidadText]);

    const doctorImage = medico.foto
        ? `/imagen/${medico.foto}`
        : '/images/doctor-default.jpg';
    const bgImage = medico.foto
        ? `/imagen/${medico.foto}`
        : '/imagen/1674252818.jpg';
    const initials =
        `${medico.nombre[0] ?? ''}${medico.apellido[0] ?? ''}`.toUpperCase();

    const paisText =
        typeof medico.pais === 'object'
            ? medico.pais.nombre_paises
            : medico.pais;
    const estadoText =
        typeof medico.estado === 'object' ? medico.estado.name : medico.estado;
    const ciudadText =
        typeof medico.ciudad === 'object' ? medico.ciudad.name : medico.ciudad;

    // Social URLs normalizadas
    const socialLinks = [
        {
            href: buildSocialUrl(medico.facebook, 'https://facebook.com/'),
            label: 'Facebook',
            icon: Facebook,
            brandBg: 'bg-[#1877F2]',
        },
        {
            href: buildSocialUrl(medico.twitter, 'https://x.com/'),
            label: 'Twitter / X',
            icon: Twitter,
            brandBg: 'bg-[#14171A]',
        },
        {
            href: buildSocialUrl(medico.linkedin, 'https://linkedin.com/in/'),
            label: 'LinkedIn',
            icon: Linkedin,
            brandBg: 'bg-[#0A66C2]',
        },
        {
            href: buildSocialUrl(medico.instagram, 'https://instagram.com/'),
            label: 'Instagram',
            icon: Instagram,
            brandBg:
                'bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
        },
    ].filter((s) => s.href !== null) as {
        href: string;
        label: string;
        icon: React.ElementType;
        brandBg: string;
    }[];

    // ── Handlers ──
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setContactForm((p) => ({ ...p, [name]: value }));
    };

    const submitContactForm = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: string[] = [];
        if (!contactForm.name) newErrors.push('El nombre es requerido');
        if (!contactForm.email) newErrors.push('El correo es requerido');
        if (!contactForm.phone) newErrors.push('El teléfono es requerido');
        if (!contactForm.message) newErrors.push('El mensaje es requerido');
        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors([]);
        setLoading(true);
        try {
            await axios.post('/enviar_correo', contactForm);
            alert('Mensaje enviado: Tu mensaje ha sido enviado exitosamente');
            setContactForm({
                name: '',
                email: '',
                phone: '',
                message: '',
                email_doctor: medico.correo || '',
            });
        } catch (error: any) {
            const apiErrors = error.response?.data?.errors;
            setErrors(
                apiErrors
                    ? (Object.values(apiErrors).flat() as string[])
                    : ['Ocurrió un error al enviar el mensaje'],
            );
        } finally {
            setLoading(false);
        }
    };

    // ── Tab config ──
    const tabs = [
        { key: 'about' as const, label: 'Biografía', icon: User },
        { key: 'treatments' as const, label: 'Tratamientos', icon: Activity },
        { key: 'location' as const, label: 'Ubicación', icon: MapPin },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased transition-colors duration-300 dark:bg-[#0b1121] dark:text-slate-100">
            <Head
                title={`Perfil · ${doctorTitle} ${medico.nombre} ${medico.apellido} — TuMediBot`}
            />

            {/* ══ HERO ══════════════════════════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-blue-50/50 pt-10 pb-0 text-slate-900 lg:pt-14 dark:bg-[#0b1121] dark:text-white">
                {/* Blurred backdrop photo */}
                <div
                    className="absolute inset-0 scale-105 bg-cover bg-center opacity-[0.03] blur-2xl dark:opacity-[0.07]"
                    style={{ backgroundImage: `url(${bgImage})` }}
                />

                {/* Cyan tech-grid overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#0ea5e915_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e915_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_60%,transparent_100%)] bg-[size:28px_28px] dark:bg-[linear-gradient(to_right,#38bdf808_1px,transparent_1px),linear-gradient(to_bottom,#38bdf808_1px,transparent_1px)]" />

                {/* Glow blobs */}
                <div className="absolute -top-20 right-[15%] h-[420px] w-[420px] rounded-full bg-blue-400/20 blur-[120px] dark:bg-blue-600/10" />
                <div className="absolute bottom-0 left-[10%] h-[300px] w-[300px] rounded-full bg-sky-300/30 blur-[90px] dark:bg-sky-500/10" />

                {/* Bottom gradient fade into body */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 dark:from-[#0b1121]" />

                <div className="relative z-10 mx-auto max-w-7xl px-4">
                    {/* Back link */}
                    <Link
                        href="/medicos/search"
                        className="group mb-10 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-sky-400 uppercase transition-colors hover:text-sky-300"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
                        Volver a la búsqueda
                    </Link>

                    {/* Profile row */}
                    <div className="flex flex-col items-center gap-8 text-center md:flex-row md:items-end md:text-left">
                        {/* Avatar with tech-inspired design */}
                        <div className="group relative mt-4 shrink-0 md:mt-0">
                            {/* Futuristic rotating rings */}
                            <div className="absolute -inset-6 animate-[spin_40s_linear_infinite] rounded-full border border-dashed border-sky-400/40 transition-colors duration-700 group-hover:border-sky-500/60 dark:border-sky-400/20 dark:group-hover:border-sky-400/50" />
                            <div className="absolute -inset-3 animate-[spin_25s_linear_infinite_reverse] rounded-full border border-blue-400/40 border-l-sky-500/80 transition-colors duration-700 group-hover:border-blue-500/60 dark:border-blue-500/30 dark:border-l-sky-300/80 dark:group-hover:border-blue-400/50" />

                            {/* Subtle inner glow */}
                            <div className="absolute inset-0 rounded-full bg-sky-400/20 blur-xl transition-all duration-700 group-hover:bg-sky-400/40 group-hover:blur-2xl dark:bg-sky-500/10 dark:group-hover:bg-sky-400/20" />

                            {/* Glassmorphism wrapper */}
                            <div className="relative rounded-full bg-gradient-to-b from-white/60 to-white/10 p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.1)] backdrop-blur-md dark:from-white/15 dark:to-transparent dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
                                <Avatar className="relative h-40 w-40 overflow-hidden rounded-full ring-1 ring-white/50 md:h-48 md:w-48 dark:ring-white/10">
                                    <AvatarImage
                                        src={doctorImage}
                                        alt={`${doctorTitle} ${medico.nombre} ${medico.apellido}`}
                                        className="h-full w-full object-cover object-top"
                                    />
                                    <AvatarFallback className="bg-white text-4xl font-extrabold text-sky-600 dark:bg-slate-900 dark:text-sky-400">
                                        {initials}
                                    </AvatarFallback>
                                </Avatar>
                            </div>

                            {/* Tech-styled Online indicator */}
                            <div className="absolute right-3 bottom-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-white/50 bg-white/80 shadow-[0_0_20px_rgba(16,185,129,0.3)] backdrop-blur-md dark:border-white/10 dark:bg-[#0b1121]/80">
                                <span className="absolute h-full w-full animate-ping rounded-full bg-emerald-400/40" />
                                <span className="h-3 w-3 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                            </div>
                        </div>

                        {/* Name / specialty / badges */}
                        <div className="flex-1 space-y-3 pb-2">
                            {/* Verified badge */}
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-[11px] font-bold tracking-widest text-emerald-600 uppercase dark:border-emerald-500/25 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <BadgeCheck className="h-3.5 w-3.5" />
                                Especialista Verificado · TuMediBot
                            </span>

                            {/* Full name */}
                            <h1 className="text-4xl leading-none font-extrabold tracking-tight text-slate-900 md:text-5xl lg:text-6xl dark:text-white">
                                {doctorTitle}{' '}
                                <span className="bg-gradient-to-r from-blue-600 to-sky-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-sky-400">
                                    {medico.nombre} {medico.apellido}
                                </span>
                            </h1>

                            {/* Specialty */}
                            <p className="flex items-center justify-center gap-2 text-base font-bold tracking-wider text-sky-600 uppercase md:justify-start dark:text-sky-300/90">
                                <Stethoscope className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                                {especialidadText}
                            </p>

                            {/* Stat badges */}
                            <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
                                <StatBadge
                                    icon={Award}
                                    label="Experiencia"
                                    value={`${medico.experiencia}+ años`}
                                    colorClass="bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                                />
                                <StatBadge
                                    icon={DollarSign}
                                    label="Consulta"
                                    value={`$${medico.consultorio_costo} USD`}
                                    colorClass="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                                />
                                <StatBadge
                                    icon={MapPin}
                                    label="Ubicación"
                                    value={`${ciudadText ?? ''}, ${paisText ?? ''}`}
                                    colorClass="bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                                />
                            </div>

                            {/* Social pills — solo si hay al menos uno */}
                            {socialLinks.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-2 pt-1 md:justify-start">
                                    {socialLinks.map((s) => (
                                        <SocialPill
                                            key={s.label}
                                            href={s.href}
                                            label={s.label}
                                            icon={s.icon}
                                            brandBg={s.brandBg}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="shrink-0 pb-2">
                            <Button
                                size="lg"
                                onClick={() => setDialogoAbierto(true)}
                                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-sky-500 px-8 py-6 text-base font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/40"
                            >
                                <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                <Calendar className="mr-2 h-5 w-5" />
                                Agendar Consulta
                            </Button>
                        </div>
                    </div>

                    {/* Floating pulse line decoration */}
                    <div className="relative mt-10 h-px w-full overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
                        <div className="absolute top-0 left-1/2 h-px w-32 -translate-x-1/2 bg-sky-400 shadow-[0_0_12px_3px_rgba(56,189,248,0.5)]" />
                    </div>
                </div>
            </section>

            {/* ══ DASHBOARD GRID ════════════════════════════════════════════════ */}
            <main className="mx-auto max-w-7xl px-4 py-10">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    {/* Left — tabs + content */}
                    <div className="space-y-6 lg:col-span-8">
                        {/* Tab bar */}
                        <div className="flex gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-800/60 dark:bg-slate-900/50">
                            {tabs.map(({ key, label, icon: Icon }) => (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition-all duration-200 ${
                                        activeTab === key
                                            ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-md shadow-blue-500/20'
                                            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                                    }`}
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="hidden sm:inline">
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {/* Tab panel */}
                        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-900/50 dark:shadow-none">
                            <CardContent className="p-8">
                                {/* ── About ─────────────────────────────────── */}
                                {activeTab === 'about' && (
                                    <div className="space-y-8">
                                        <SectionHeading
                                            icon={User}
                                            title="Acerca de Mí"
                                        />

                                        {/* En la pestaña de Biografía */}
                                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_h4]:text-base [&_h4]:font-bold [&_h5]:text-sm [&_h5]:font-bold [&_h6]:text-xs [&_h6]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
                                            {medico.perfil_medico ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: medico.perfil_medico,
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-slate-400 italic">
                                                    Sin biografía disponible.
                                                </p>
                                            )}
                                        </div>

                                        <Separator className="bg-slate-100 dark:bg-slate-800" />

                                        {/* Mini stat cards */}
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            <MiniCard
                                                icon={Compass}
                                                iconClass="bg-sky-500/10 text-sky-500"
                                                title="Especialidad"
                                                desc={especialidadText ?? ''}
                                            />
                                            <MiniCard
                                                icon={Award}
                                                iconClass="bg-yellow-500/10 text-yellow-500"
                                                title="Experiencia"
                                                desc={`${medico.experiencia} años de trayectoria profesional`}
                                            />
                                            <MiniCard
                                                icon={HeartPulse}
                                                iconClass="bg-rose-500/10 text-rose-500"
                                                title="Perfil"
                                                desc={medico.usted_es}
                                            />
                                            <MiniCard
                                                icon={ShieldCheck}
                                                iconClass="bg-emerald-500/10 text-emerald-500"
                                                title="Estado"
                                                desc="Activo · Consultas disponibles"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* ── Treatments ────────────────────────────── */}
                                {activeTab === 'treatments' && (
                                    <div className="space-y-8">
                                        <SectionHeading
                                            icon={Activity}
                                            title="Tratamientos y Procedimientos"
                                        />
                                        {/* En la pestaña de Tratamientos */}
                                        <div className="prose prose-sm prose-slate dark:prose-invert max-w-none leading-relaxed [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-bold [&_h4]:text-base [&_h4]:font-bold [&_h5]:text-sm [&_h5]:font-bold [&_h6]:text-xs [&_h6]:font-bold [&_ol]:list-decimal [&_ol]:pl-5 [&_ul]:list-disc [&_ul]:pl-5">
                                            {medico.tratamientos ? (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: medico.tratamientos,
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-slate-400 italic">
                                                    Sin tratamientos
                                                    especificados.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* ── Location ──────────────────────────────── */}
                                {activeTab === 'location' && (
                                    <div className="space-y-8">
                                        <SectionHeading
                                            icon={MapPin}
                                            title="Ubicación del Consultorio"
                                        />

                                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                            {/* Geo */}
                                            <div className="space-y-5">
                                                <LocationRow
                                                    icon={Globe}
                                                    iconClass="text-sky-500"
                                                    label="País"
                                                    value={paisText ?? ''}
                                                />
                                                <LocationRow
                                                    icon={Map}
                                                    iconClass="text-sky-500"
                                                    label="Estado / Provincia"
                                                    value={estadoText ?? ''}
                                                />
                                                <LocationRow
                                                    icon={Building2}
                                                    iconClass="text-sky-500"
                                                    label="Ciudad"
                                                    value={ciudadText ?? ''}
                                                />
                                            </div>

                                            {/* Clinic & address */}
                                            <div className="space-y-5">
                                                {medico.nombre_hos_cli && (
                                                    <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 dark:bg-blue-500/10">
                                                        <p className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                                                            {medico.hospital_clinica ??
                                                                'Centro Médico'}
                                                        </p>
                                                        <p className="font-semibold text-sky-600 dark:text-sky-400">
                                                            {
                                                                medico.nombre_hos_cli
                                                            }
                                                        </p>
                                                        {medico.nmro_hos_cli && (
                                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                                Consultorio nro:{' '}
                                                                {
                                                                    medico.nmro_hos_cli
                                                                }
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                {medico.direccion && (
                                                    <LocationRow
                                                        icon={MapPin}
                                                        iconClass="text-rose-500"
                                                        label="Dirección Física"
                                                        value={medico.direccion}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right — appointment + contact */}
                    <div className="space-y-6 lg:col-span-4">
                        {/* Appointment card */}
                        <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-[1px] shadow-xl dark:border-none dark:from-[#0f1e3d] dark:to-[#0b1121] dark:shadow-2xl">
                            {/* Gradient border */}
                            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-blue-600/10 via-sky-500/5 to-transparent dark:from-blue-600/40 dark:via-sky-500/20 dark:to-transparent" />
                            <div className="relative rounded-[calc(1.5rem-1px)] bg-white p-6 text-slate-800 dark:bg-[#0f1a2e] dark:text-white">
                                {/* Glow spot */}
                                <div className="pointer-events-none absolute top-0 right-0 h-40 w-40 rounded-full bg-sky-500/5 blur-[60px] dark:bg-sky-500/10" />

                                <div className="mb-5 flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-sky-500 dark:text-sky-400" />
                                    <h3 className="text-base font-bold text-slate-900 dark:text-sky-400">
                                        Información de Consulta
                                    </h3>
                                </div>

                                {/* Price */}
                                <div className="mb-5 flex items-end justify-between border-b border-slate-100 pb-5 dark:border-white/10">
                                    <span className="text-xs font-semibold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                                        Costo de Consulta
                                    </span>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                                            ${medico.consultorio_costo}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            USD
                                        </span>
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="space-y-4 text-sm">
                                    <AppointmentRow
                                        icon={Clock}
                                        label="Horario"
                                        value={medico.horario}
                                    />
                                    <AppointmentRow
                                        icon={Phone}
                                        label="Teléfono"
                                        value={medico.telefono}
                                    />
                                    {medico.whatsapp && (
                                        <AppointmentRow
                                            icon={MessagesSquare}
                                            label="WhatsApp"
                                            value={medico.whatsapp}
                                            iconClass="text-emerald-500 dark:text-emerald-400"
                                        />
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    onClick={() => setDialogoAbierto(true)}
                                    className="group relative mt-6 w-full cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-6 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:scale-[1.02] hover:from-blue-500 hover:to-sky-400"
                                >
                                    <span className="absolute inset-0 -translate-x-full skew-x-[-20deg] bg-white/10 transition-transform duration-500 group-hover:translate-x-full" />
                                    <Calendar className="mr-2 h-5 w-5" />
                                    Agendar Cita
                                </Button>
                            </div>
                        </div>

                        {/* Contact form */}
                        <Card className="overflow-hidden rounded-3xl border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-md dark:border-slate-900/60 dark:bg-slate-900/50 dark:shadow-none">
                            <CardHeader className="pt-6 pb-2">
                                <CardTitle className="flex items-center gap-2 text-base font-bold text-slate-800 dark:text-slate-100">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-sky-400" />
                                    Enviar Mensaje al Doctor
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-2 pb-6">
                                <form
                                    onSubmit={submitContactForm}
                                    className="space-y-4"
                                >
                                    {errors.length > 0 && (
                                        <div className="rounded-xl border border-destructive bg-destructive/10 px-4 py-3 text-xs text-destructive">
                                            <ul className="list-disc space-y-1 pl-4">
                                                {errors.map((e, i) => (
                                                    <li key={i}>{e}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {[
                                        {
                                            id: 'name',
                                            label: 'Nombre Completo',
                                            type: 'text',
                                            placeholder: 'Tu nombre',
                                        },
                                        {
                                            id: 'email',
                                            label: 'Correo Electrónico',
                                            type: 'email',
                                            placeholder: 'correo@ejemplo.com',
                                        },
                                        {
                                            id: 'phone',
                                            label: 'Teléfono',
                                            type: 'tel',
                                            placeholder: '+123 456 7890',
                                        },
                                    ].map(
                                        ({ id, label, type, placeholder }) => (
                                            <div key={id} className="space-y-1">
                                                <label
                                                    htmlFor={id}
                                                    className="text-[11px] font-bold tracking-widest text-slate-400 uppercase"
                                                >
                                                    {label}
                                                </label>
                                                <Input
                                                    id={id}
                                                    name={id}
                                                    type={type}
                                                    value={
                                                        (contactForm as any)[id]
                                                    }
                                                    onChange={handleInputChange}
                                                    placeholder={placeholder}
                                                    className="h-10 rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-sky-500/30 dark:border-slate-800 dark:bg-slate-950"
                                                />
                                            </div>
                                        ),
                                    )}

                                    <div className="space-y-1">
                                        <label
                                            htmlFor="message"
                                            className="text-[11px] font-bold tracking-widest text-slate-400 uppercase"
                                        >
                                            Mensaje / Consulta
                                        </label>
                                        <Textarea
                                            id="message"
                                            name="message"
                                            rows={4}
                                            value={contactForm.message}
                                            onChange={handleInputChange}
                                            placeholder="Escribe tu consulta aquí..."
                                            className="rounded-xl border-slate-200 bg-slate-50 focus-visible:ring-sky-500/30 dark:border-slate-800 dark:bg-slate-950"
                                        />
                                    </div>

                                    <input
                                        type="hidden"
                                        name="email_doctor"
                                        value={contactForm.email_doctor}
                                    />

                                    <Button
                                        type="submit"
                                        size="lg"
                                        disabled={loading}
                                        className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-sky-500 py-5 font-semibold text-white hover:from-blue-500 hover:to-sky-400"
                                    >
                                        <Send className="mr-2 h-4 w-4" />
                                        {loading
                                            ? 'Enviando...'
                                            : 'Enviar Mensaje'}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            <AgendarCitaDialog
                key={`${medicoParaAgendar.id}-${String(dialogoAbierto)}`}
                medico={medicoParaAgendar}
                open={dialogoAbierto}
                onOpenChange={setDialogoAbierto}
            />

            <Footer />
        </div>
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionHeading({
    icon: Icon,
    title,
}: {
    icon: React.ElementType;
    title: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-500/20">
                <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-xl font-bold tracking-tight">{title}</h3>
        </div>
    );
}

function MiniCard({
    icon: Icon,
    iconClass,
    title,
    desc,
}: {
    icon: React.ElementType;
    iconClass: string;
    title: string;
    desc: string;
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-900 dark:bg-slate-950/50">
            <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
            >
                <Icon className="h-4 w-4" />
            </span>
            <div>
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {title}
                </h4>
                <p className="mt-0.5 text-xs leading-snug text-muted-foreground">
                    {desc}
                </p>
            </div>
        </div>
    );
}

function LocationRow({
    icon: Icon,
    iconClass,
    label,
    value,
}: {
    icon: React.ElementType;
    iconClass: string;
    label: string;
    value: string;
}) {
    return (
        <div className="flex items-center gap-3">
            <Icon className={`h-5 w-5 shrink-0 ${iconClass}`} />
            <div>
                <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                    {label}
                </p>
                <p className="text-sm font-medium">{value}</p>
            </div>
        </div>
    );
}

function AppointmentRow({
    icon: Icon,
    label,
    value,
    iconClass = 'text-sky-500 dark:text-sky-400',
}: {
    icon: React.ElementType;
    label: string;
    value: string;
    iconClass?: string;
}) {
    return (
        <div className="flex gap-3">
            <Icon className={`h-5 w-5 shrink-0 ${iconClass} mt-0.5`} />
            <div>
                <p className="text-[11px] font-bold tracking-widest text-slate-500 uppercase dark:text-slate-400">
                    {label}
                </p>
                <p className="font-medium text-slate-800 dark:text-slate-200">
                    {value}
                </p>
            </div>
        </div>
    );
}
