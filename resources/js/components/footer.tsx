import { Link, usePage } from '@inertiajs/react';
import {
    HeartPulse,
    Facebook,
    Instagram,
    Linkedin,
    ShieldCheck,
    Lock,
    ArrowUp,
    ChevronRight,
    ExternalLink,
} from 'lucide-react';
import React from 'react';
import { soydoctor } from '@/routes';

interface FooterProps {
    auth?: {
        user: {
            is_medico?: boolean;
            hasFactura?: boolean;
        } | null;
    };
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .56.04.82.12V9.4a6.27 6.27 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.48 6.3 6.3 0 0 0 1.86-4.48V8.65a8.3 8.3 0 0 0 4.87 1.57V6.77a4.85 4.85 0 0 1-1-.08z" />
        </svg>
    );
}

export function Footer({ auth: propsAuth }: FooterProps) {
    const currentYear = new Date().getFullYear();

    const pageProps = usePage<{
        auth?: { user?: { is_medico?: boolean; hasFactura?: boolean } | null };
        can?: { hasFactura?: boolean };
    }>().props;

    const auth = propsAuth || pageProps?.auth;
    const can = pageProps?.can;

    const isDoctor =
        auth?.user?.is_medico === true ||
        auth?.user?.hasFactura === true ||
        can?.hasFactura === true;

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <footer className="relative mt-20 border-t border-slate-200/80 bg-gradient-to-b from-slate-50/90 via-slate-100/70 to-slate-100/90 text-slate-600 backdrop-blur-xl transition-colors duration-300 dark:border-slate-800/80 dark:from-slate-950/95 dark:via-slate-900/90 dark:to-slate-950 dark:text-slate-400">
            <div className="mb-10 h-1 w-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 opacity-85" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-56 w-[500px] -translate-x-1/2 bg-blue-500/10 blur-[110px] dark:bg-sky-500/15" />
                <div className="absolute right-10 bottom-0 h-48 w-48 bg-teal-500/5 blur-[90px] dark:bg-teal-500/10" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 pt-4 pb-8 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-12">
                    <div className="space-y-5 sm:col-span-2 lg:col-span-2">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-3"
                        >
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-sky-400 text-white shadow-md shadow-blue-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-500/40">
                                <HeartPulse className="h-6 w-6 animate-pulse" />
                            </div>
                            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                TuMedi
                                <span className="text-sky-500 dark:text-sky-400">
                                    Bot
                                </span>
                            </span>
                        </Link>

                        <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                            Plataforma médica digital integral que conecta a
                            pacientes con profesionales de la salud. Agenda
                            consultas, obtén recetas digitales y gestiona tus
                            registros médicos en un entorno totalmente seguro.
                        </p>

                        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-400">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                            </span>
                            Sistemas Operacionales 24/7
                        </div>

                        <div className="pt-2">
                            <span className="mb-3 block text-xs font-semibold tracking-wider text-slate-400 uppercase dark:text-slate-500">
                                Conéctate con nosotros
                            </span>
                            <div className="flex items-center gap-3">
                                <a
                                    href="https://facebook.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Facebook"
                                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                                >
                                    <Facebook className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                                </a>
                                <a
                                    href="https://instagram.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Instagram"
                                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                                >
                                    <Instagram className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                                </a>
                                <a
                                    href="https://linkedin.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="LinkedIn"
                                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                >
                                    <Linkedin className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                                </a>
                                <a
                                    href="https://tiktok.com"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="TikTok"
                                    className="group flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 text-slate-600 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-400 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-400 dark:hover:border-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                                >
                                    <TikTokIcon className="h-4.5 w-4.5 transition-transform group-hover:scale-110" />
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Pacientes
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                {
                                    label: 'Buscar Médicos',
                                    href: '/medicos/search',
                                },
                                {
                                    label: 'Videoconsultas',
                                    href: '/paciente/mis-citas',
                                },
                                {
                                    label: 'Mis Citas',
                                    href: '/paciente/mis-citas',
                                },
                                {
                                    label: 'Mis Archivos Médicos',
                                    href: '/paciente/mis-archivos',
                                },
                                {
                                    label: 'Datos Médicos',
                                    href: '/paciente/datos-medicos',
                                },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Médicos
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {!isDoctor && (
                                <li>
                                    <Link
                                        href={soydoctor().url}
                                        className="group inline-flex items-center gap-1 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                        <span>Unirse como Doctor</span>
                                    </Link>
                                </li>
                            )}
                            <li>
                                <a
                                    href="https://noticias.tumedibot.com/wp/"
                                    target="_blank"
                                    rel="noreferrer"
                                    aria-label="Portal Médico"
                                    className="group inline-flex items-center gap-1 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400"
                                >
                                    <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                    <span>Portal Médico</span>
                                    <ExternalLink className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                </a>
                            </li>
                            {[
                                {
                                    label: 'Mis Pacientes',
                                    href: '/medicalfoo/mispacientes',
                                },
                                {
                                    label: 'Agenda de Citas',
                                    href: '/medicalfoo/miagenda',
                                },
                                {
                                    label: 'Archivos Compartidos',
                                    href: '/medicalfoo/archivos',
                                },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Legal y Soporte
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            {[
                                {
                                    label: 'Términos de Servicio',
                                    href: '/terminos-de-servicio',
                                },
                                {
                                    label: 'Política de Privacidad',
                                    href: '/politica-de-privacidad',
                                },
                                {
                                    label: 'Política de Cookies',
                                    href: '/politica-de-cookies',
                                },
                                {
                                    label: 'Notificaciones',
                                    href: '/notificaciones',
                                },
                                {
                                    label: 'Centro de Ayuda',
                                    href: '/#servicios',
                                },
                            ].map((item, idx) => (
                                <li key={idx}>
                                    <Link
                                        href={item.href}
                                        className="group inline-flex items-center gap-1 text-slate-600 transition-all duration-200 hover:translate-x-1 hover:text-blue-600 dark:text-slate-400 dark:hover:text-sky-400"
                                    >
                                        <ChevronRight className="h-3.5 w-3.5 text-blue-500 opacity-0 transition-opacity group-hover:opacity-100 dark:text-sky-400" />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-200/80 pt-8 dark:border-slate-800/80">
                    <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                        <p className="text-center text-xs font-medium text-slate-500 sm:text-left dark:text-slate-400">
                            &copy; {currentYear}{' '}
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                                TuMediBot
                            </span>{' '}
                            — Todos los derechos reservados.
                        </p>

                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs">
                            <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold text-emerald-700 shadow-xs dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Plataforma 100% Segura
                            </span>
                            <span className="flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3 py-1 text-[11px] font-semibold text-sky-700 shadow-xs dark:border-sky-500/20 dark:bg-sky-500/10 dark:text-sky-400">
                                <Lock className="h-3.5 w-3.5" />
                                Datos Cifrados 256-bit
                            </span>
                        </div>

                        <button
                            onClick={scrollToTop}
                            type="button"
                            aria-label="Volver arriba"
                            className="group inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-slate-200/80 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-300 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                        >
                            <span>Volver arriba</span>
                            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
