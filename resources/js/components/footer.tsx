import React from 'react';

import { Link } from '@inertiajs/react';
import {
    HeartPulse,
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    ShieldCheck,
    Lock,
} from 'lucide-react';

export function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-16 md:mt-24 border-t border-slate-200/80 bg-white/90 text-slate-600 backdrop-blur-md transition-colors duration-300 dark:border-slate-800/80 dark:bg-[#070c18] dark:text-slate-400">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 bg-blue-500/5 blur-[90px] dark:bg-sky-500/10" />
            </div>

            <div className="relative mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
                {/* Top Main Grid */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand / Logo Info Column (spans 2 on lg) */}
                    <div className="space-y-4 lg:col-span-2">
                        <Link href="/" className="inline-flex items-center gap-2.5 group">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 text-white shadow-lg shadow-blue-500/25 transition-transform duration-300 group-hover:scale-105">
                                <HeartPulse className="h-6 w-6" />
                            </div>
                            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                                TuMedi<span className="text-sky-500 dark:text-sky-400">Bot</span>
                            </span>
                        </Link>

                        <p className="max-w-sm text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                            TuMediBot es la plataforma líder en telemedicina, conectando a pacientes con los mejores médicos y especialistas en segundos.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center gap-2.5 pt-2">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Facebook"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 transition-all duration-200 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-sky-500 dark:hover:bg-sky-500/10 dark:hover:text-sky-400"
                            >
                                <Facebook className="h-4 w-4" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Instagram"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 transition-all duration-200 hover:border-rose-500 hover:bg-rose-50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-rose-500 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
                            >
                                <Instagram className="h-4 w-4" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="LinkedIn"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 transition-all duration-200 hover:border-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-blue-500 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                                <Linkedin className="h-4 w-4" />
                            </a>
                            <a
                                href="https://x.com"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Twitter / X"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-100/70 text-slate-600 transition-all duration-200 hover:border-slate-400 hover:bg-slate-200 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 dark:hover:border-slate-400 dark:hover:bg-slate-400/10 dark:hover:text-white"
                            >
                                <Twitter className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 1: Compañía */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Compañía
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/#servicios"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Sobre Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/medicos/search"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Nuestros Médicos
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/soydoctor"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Unirse como Doctor
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#inicio"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 2: Servicios */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Servicios
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <Link
                                    href="/paciente/mis-citas"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Videoconsultas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/paciente/mis-citas"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Recetas Electrónicas
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/medicos/search"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Segunda Opinión
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/#servicios"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Planes de Salud
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Seguridad */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold tracking-widest text-slate-900 uppercase dark:text-slate-200">
                            Legal
                        </h4>
                        <ul className="space-y-2.5 text-sm">
                            <li>
                                <a
                                    href="/terminos-de-servicio"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Términos de Servicio
                                </a>
                            </li>
                            <li>
                                <a
                                    href='/politica-de-privacidad'
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Política de Privacidad
                                </a>
                            </li>
                            <li>
                                <a
                                    href='/politica-de-cookies'
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Política de Cookies
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="text-slate-500 transition-colors hover:text-blue-600 dark:text-slate-400 dark:hover:text-white"
                                >
                                    Seguridad de Datos
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Separator */}
                <div className="my-8 h-px bg-slate-200/80 dark:bg-slate-800/80" />

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                        &copy; {currentYear} TuMediBot — Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-400">
                            <ShieldCheck className="h-3.5 w-3.5" />
                            Plataforma 100% Segura
                        </span>
                        <span className="flex items-center gap-1.5 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-[11px] font-semibold text-sky-700 dark:border-sky-900/50 dark:bg-sky-950/40 dark:text-sky-400">
                            <Lock className="h-3.5 w-3.5" />
                            Datos Cifrados
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
