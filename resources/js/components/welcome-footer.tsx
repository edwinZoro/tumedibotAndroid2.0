import React from 'react';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';
import { soydoctor } from '@/routes';

interface WelcomeFooterProps {
    auth?: {
        user: {
            is_medico?: boolean;
            hasFactura?: boolean;
        } | null;
    };
}

export function WelcomeFooter({ auth }: WelcomeFooterProps) {
    const currentYear = new Date().getFullYear();

    const isDoctor = auth?.user?.is_medico === true;
    const hasFactura = auth?.user?.hasFactura === true;

    const scrollToTop = () => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const navLinks = [
        {
            heading: 'Pacientes',
            links: [
                { label: 'Datos Médicos', href: '/patientfoo/medicaldata' },
                { label: 'Mis Archivos', href: '/patientfoo/myfiles' },
                { label: 'Mis Citas', href: '/patientfoo/myappoinments' },
                { label: 'Buscar Médicos', href: '/medicos/search' },
                { label: 'Videoconsultas', href: '/patientfoo/video' },
            ],
        },
        {
            heading: 'Médicos',
            links: [
                ...(!isDoctor && !hasFactura
                    ? [{ label: 'Unirse como Doctor', href: soydoctor().url }]
                    : []),
                {
                    label: 'Portal Médico',
                    href: 'https://noticias.tumedibot.com/wp/',
                    external: true,
                },
                { label: 'Mis Pacientes', href: '/medicalfoo/mispacientes' },
                { label: 'Agenda de Citas', href: '/medicalfoo/miagenda' },
                {
                    label: 'Archivos Compartidos',
                    href: '/medicalfoo/archivos',
                },
            ],
        },
        {
            heading: 'Legal y Soporte',
            links: [
                {
                    label: 'Términos de Servicio',
                    href: '/terminos-de-servicio',
                },
                {
                    label: 'Política de Privacidad',
                    href: '/politica-de-privacidad',
                },
                { label: 'Política de Cookies', href: '/politica-de-cookies' },
                { label: 'Notificaciones', href: '/notificaciones' },
                {
                    label: 'Contacto',
                    href: '#',
                    title: 'tumedibot@gmail.com',
                    onClick: (e: any) => {
                        e.preventDefault();
                        navigator.clipboard.writeText('tumedibot@gmail.com');
                        toast.success('Correo copiado exitosamente');
                    }
                },
            ],
        },
    ];

    const socials = [
        {
            label: 'Facebook',
            icon: 'fa-facebook-f',
            href: 'https://facebook.com',
        },
        {
            label: 'Instagram',
            icon: 'fa-instagram',
            href: 'https://instagram.com',
        },
        {
            label: 'LinkedIn',
            icon: 'fa-linkedin-in',
            href: 'https://linkedin.com',
        },
        { label: 'TikTok', icon: 'fa-tiktok', href: 'https://tiktok.com' },
    ];

    return (
        <footer className="wf-footer">
            <div className="wf-accent-bar" />
            <div className="wf-glow" aria-hidden="true">
                <div className="wf-glow-center" />
                <div className="wf-glow-right" />
            </div>
            <div className="wf-inner container">
                <div className="wf-grid">
                    <div className="wf-brand">
                        <a href="#inicio" className="wf-logo">
                            <div className="wf-logo-icon">
                                <i className="fa-solid fa-heart-pulse" />
                            </div>
                            <span className="wf-logo-text">
                                TuMedi
                                <span className="wf-logo-accent">Bot</span>
                            </span>
                        </a>
                        <p className="wf-description">
                            Plataforma médica digital integral que conecta a
                            pacientes con profesionales de la salud. Agenda
                            consultas, obtén recetas digitales y gestiona tus
                            registros médicos en un entorno totalmente seguro.
                        </p>
                        <div className="wf-status">
                            <span className="wf-status-dot">
                                <span className="wf-status-ping" />
                                <span className="wf-status-core" />
                            </span>
                            Sistemas Operacionales 24/7
                        </div>
                        <div className="wf-social-block">
                            <span className="wf-social-label">
                                Conéctate con nosotros
                            </span>
                            <div className="wf-social-row">
                                {socials.map((s) => (
                                    <a
                                        key={s.label}
                                        href={s.href}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={s.label}
                                        className="wf-social-btn"
                                    >
                                        <i className={`fa-brands ${s.icon}`} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                    {navLinks.map((col) => (
                        <div key={col.heading} className="wf-col">
                            <h4 className="wf-col-heading">{col.heading}</h4>
                            <ul className="wf-col-list">
                                {col.links.map((link) => (
                                    <li key={link.label}>
                                        {link.external ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="wf-link"
                                                title={(link as any).title}
                                            >
                                                <i className="fa-solid fa-chevron-right wf-link-icon" />
                                                {link.label}
                                                <i className="fa-solid fa-arrow-up-right-from-square wf-link-external ml-1" />
                                            </a>
                                        ) : (
                                            <Link
                                                href={link.href}
                                                className="wf-link"
                                                title={(link as any).title}
                                                onClick={(link as any).onClick}
                                            >
                                                <i className="fa-solid fa-chevron-right wf-link-icon" />
                                                {link.label}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="wf-bottom">
                    <p className="wf-copyright">
                        &copy; {currentYear}{' '}
                        <strong className="wf-copyright-brand">
                            TuMediBot
                        </strong>{' '}
                        — Todos los derechos reservados.
                    </p>
                    <div className="wf-badges">
                        <span className="wf-badge wf-badge--green">
                            <i className="fa-solid fa-shield-halved" />
                            Plataforma 100% Segura
                        </span>
                        <span className="wf-badge wf-badge--blue">
                            <i className="fa-solid fa-lock" />
                            Datos Cifrados 256-bit
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={scrollToTop}
                        aria-label="Volver arriba"
                        className="wf-top-btn"
                    >
                        Volver arriba <i className="fa-solid fa-arrow-up" />
                    </button>
                </div>
            </div>
        </footer>
    );
}

export default WelcomeFooter;
