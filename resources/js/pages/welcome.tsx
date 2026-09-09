import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { login, register } from '@/routes';
import { dashboard } from '@/routes';
import WelcomeFooter from '@/components/welcome-footer';
import '../../css/welcome.css';

export default function Welcome() {
    const { auth } = usePage<{ auth: { user: unknown } }>().props;
    const navbarRef = useRef<HTMLElement>(null);

    // Sticky navbar on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (navbarRef.current) {
                if (window.scrollY > 50) {
                    navbarRef.current.classList.add('scrolled');
                } else {
                    navbarRef.current.classList.remove('scrolled');
                }
            }
        };
        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Scroll animations (Intersection Observer)
    useEffect(() => {
        const observerOptions: IntersectionObserverInit = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15,
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements =
            document.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <>
            <Head title="TuMediBot | Videoconsulta Médica Global - Médicos, Citas Online y Salud Digital">
                <meta
                    name="description"
                    content="TuMediBot conecta pacientes con médicos generales y especialistas mediante videoconsultas. Agenda citas online, recibe atención médica desde casa y cuida tu salud con los mejores doctores. Plataforma líder en telemedicina y salud digital."
                />
                <meta
                    name="keywords"
                    content="médicos, doctor, salud, citas online, médicos generales, videoconsulta, telemedicina, especialistas médicos, consulta médica virtual, atención médica, doctores online, salud digital, agendar cita médica"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="TuMediBot" />
                <meta name="geo.region" content="ES" />
                <meta name="language" content="es" />

                {/* Open Graph */}
                <meta property="og:type" content="website" />
                <meta
                    property="og:title"
                    content="TuMediBot | Videoconsulta Médica Global - Médicos y Citas Online"
                />
                <meta
                    property="og:description"
                    content="Conecta con médicos generales y especialistas mediante videoconsultas. Agenda tus citas online y recibe atención médica desde cualquier lugar."
                />
                <meta property="og:url" content="https://tumedibot.com" />
                <meta property="og:site_name" content="TuMediBot" />
                <meta property="og:locale" content="es_ES" />
                <meta
                    property="og:image"
                    content="https://tumedibot.com/og-image.jpg"
                />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta
                    property="og:image:alt"
                    content="TuMediBot - Videoconsulta Médica"
                />

                {/* Twitter Card */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta
                    name="twitter:title"
                    content="TuMediBot | Videoconsulta Médica Global"
                />
                <meta
                    name="twitter:description"
                    content="Conecta con médicos generales y especialistas mediante videoconsultas. Agenda tus citas online fácilmente."
                />
                <meta
                    name="twitter:image"
                    content="https://tumedibot.com/og-image.jpg"
                />
                <meta
                    name="twitter:image:alt"
                    content="TuMediBot - Videoconsulta Médica"
                />

                {/* Canonical */}
                <link rel="canonical" href="https://tumedibot.com" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link
                    rel="preconnect"
                    href="https://fonts.gstatic.com"
                    crossOrigin="anonymous"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                />

                {/* JSON-LD Structured Data */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@graph': [
                                {
                                    '@type': 'MedicalBusiness',
                                    '@id': 'https://tumedibot.com/#medicalbusiness',
                                    name: 'TuMediBot',
                                    description:
                                        'Plataforma de telemedicina que conecta pacientes con médicos generales y especialistas mediante videoconsultas.',
                                    url: 'https://tumedibot.com',
                                    logo: 'https://tumedibot.com/favicon.svg',
                                    image: 'https://tumedibot.com/og-image.jpg',
                                    telephone: '+34-900-123-456',
                                    email: 'contacto@tumedibot.com',
                                    priceRange: '$$',
                                    areaServed: {
                                        '@type': 'Country',
                                        name: 'ES',
                                    },
                                    availableLanguage: ['es', 'en'],
                                    medicalSpecialty: [
                                        'GeneralPractice',
                                        'Cardiology',
                                        'Dermatology',
                                        'Pediatrics',
                                    ],
                                    provider: {
                                        '@type': 'Physician',
                                        name: 'TuMediBot',
                                        medicalSpecialty: [
                                            'GeneralPractice',
                                            'Cardiology',
                                            'Dermatology',
                                            'Pediatrics',
                                        ],
                                    },
                                },
                                {
                                    '@type': 'WebSite',
                                    '@id': 'https://tumedibot.com/#website',
                                    name: 'TuMediBot',
                                    url: 'https://tumedibot.com',
                                    inLanguage: 'es',
                                    description:
                                        'Plataforma líder en videoconsultas médicas, citas online y salud digital.',
                                    potentialAction: {
                                        '@type': 'SearchAction',
                                        target: {
                                            '@type': 'EntryPoint',
                                            urlTemplate:
                                                'https://tumedibot.com/buscar?q={search_term_string}',
                                        },
                                        'query-input':
                                            'required name=search_term_string',
                                    },
                                },
                                {
                                    '@type': 'WebPage',
                                    '@id': 'https://tumedibot.com/#webpage',
                                    url: 'https://tumedibot.com',
                                    name: 'TuMediBot | Videoconsulta Médica Global - Médicos y Citas Online',
                                    description:
                                        'Conecta con médicos generales y especialistas mediante videoconsultas. Agenda citas online desde casa.',
                                    isPartOf: {
                                        '@id': 'https://tumedibot.com/#website',
                                    },
                                    primaryImageOfPage: {
                                        '@id': 'https://tumedibot.com/#primaryimage',
                                    },
                                    about: {
                                        '@id': 'https://tumedibot.com/#medicalbusiness',
                                    },
                                    datePublished: '2026-01-01',
                                    dateModified: '2026-06-05',
                                    inLanguage: 'es',
                                    potentialAction: [
                                        {
                                            '@type': 'ReadAction',
                                            target: ['https://tumedibot.com'],
                                        },
                                    ],
                                },
                                {
                                    '@type': 'ImageObject',
                                    '@id': 'https://tumedibot.com/#primaryimage',
                                    url: 'https://tumedibot.com/og-image.jpg',
                                    width: 1200,
                                    height: 630,
                                    caption: 'TuMediBot - Videoconsulta Médica',
                                },
                            ],
                        }),
                    }}
                />
            </Head>

            <div className="welcome-page">
                {/* Navbar */}
                <header className="navbar" id="navbar" ref={navbarRef}>
                    <div className="nav-container container">
                        <a href="#inicio" className="logo">
                            <i className="fa-solid fa-heart-pulse"></i>
                            <b className="logo-text">
                                TuMedi<span>Bot</span>
                            </b>
                        </a>

                        <nav
                            className="nav-links"
                            id="nav-links"
                            aria-label="Navegación principal"
                        >
                            <a href="#inicio" className="nav-link active">
                                Inicio
                            </a>
                            <a href="#servicios" className="nav-link">
                                Servicios
                            </a>
                            <a href="#especialistas" className="nav-link">
                                Especialistas
                            </a>
                            <a href="#como-funciona" className="nav-link">
                                ¿Cómo funciona?
                            </a>
                            {auth?.user && (
                                <Link href={dashboard()} className="nav-link">
                                    Principal
                                </Link>
                            )}
                        </nav>

                        <div className="nav-actions">
                            {auth?.user ? (
                                <Link
                                    href={dashboard()}
                                    className="btn btn-primary"
                                >
                                    Principal
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={login().url}
                                        className="btn btn-outline"
                                    >
                                        Iniciar Sesión
                                    </Link>
                                    <Link
                                        href={register().url}
                                        className="btn btn-primary"
                                    >
                                        Regístrate
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <main>
                    {/* Hero Section */}
                    <section className="hero" id="inicio">
                        <div className="hero-bg-shapes">
                            <div className="shape shape-1"></div>
                            <div className="shape shape-2"></div>
                            <div className="shape shape-3"></div>
                        </div>

                        <div className="hero-container container">
                            <div className="hero-content animate-on-scroll">
                                <div className="badge">
                                    Salud digital al instante
                                </div>
                                <h1>
                                    Tu bienestar no puede esperar.{' '}
                                    <span className="text-gradient">
                                        Videoconsultas médicas
                                    </span>{' '}
                                    donde estés.
                                </h1>
                                <p>
                                    Conecta con los mejores especialistas,
                                    gestiona tus citas médicas y cuida tu salud
                                    desde la comodidad de tu hogar con la
                                    plataforma más avanzada.
                                </p>
                                <div className="hero-buttons">
                                    <a
                                        href="#especialistas"
                                        className="btn btn-primary btn-large"
                                    >
                                        Encontrar Especialista
                                    </a>
                                    <a
                                        href="#como-funciona"
                                        className="btn btn-glass btn-large"
                                    >
                                        <i className="fa-solid fa-circle-play"></i>{' '}
                                        Ver Demo
                                    </a>
                                </div>
                                <div className="hero-stats">
                                    <div className="stat">
                                        <span className="stat-number">
                                            10k+
                                        </span>
                                        <span className="stat-label">
                                            Pacientes Felices
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">
                                            500+
                                        </span>
                                        <span className="stat-label">
                                            Especialistas
                                        </span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-number">
                                            24/7
                                        </span>
                                        <span className="stat-label">
                                            Soporte Médico
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="hero-visual animate-on-scroll">
                                <div className="glass-card mockup-card">
                                    <div className="mockup-header">
                                        <div className="dots">
                                            <span></span>
                                            <span></span>
                                            <span></span>
                                        </div>
                                        <div className="mockup-title">
                                            Videoconsulta Activa
                                        </div>
                                    </div>
                                    <div className="mockup-body">
                                        <img
                                            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                            alt="Médico realizando videoconsulta con paciente - Consulta médica online TuMediBot"
                                            className="main-video"
                                        />
                                        <div className="caller-video">
                                            <img
                                                src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80"
                                                alt="Paciente en videoconsulta médica desde casa - Atención médica virtual TuMediBot"
                                                loading="lazy"
                                            />
                                        </div>
                                        <div className="call-controls">
                                            <button className="control-btn">
                                                <i className="fa-solid fa-microphone"></i>
                                            </button>
                                            <button className="control-btn">
                                                <i className="fa-solid fa-video"></i>
                                            </button>
                                            <button className="control-btn end-call">
                                                <i className="fa-solid fa-phone-slash"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="floating-badge badge-1">
                                    <div className="icon-box">
                                        <i className="fa-solid fa-calendar-check"></i>
                                    </div>
                                    <div>
                                        <strong>Cita Confirmada</strong>
                                        <span>Hoy, 10:30 AM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Services Section */}
                    <section className="services" id="servicios">
                        <div className="container">
                            <div className="section-header animate-on-scroll">
                                <h2>Ecosistema Integral de Salud</h2>
                                <p>
                                    Diseñado para ofrecer la mejor experiencia
                                    tanto a pacientes como a profesionales de la
                                    salud.
                                </p>
                            </div>

                            <div className="services-grid">
                                <div className="service-card glass-card animate-on-scroll">
                                    <div className="service-icon">
                                        <i className="fa-solid fa-video"></i>
                                    </div>
                                    <h3>Videoconsultas en HD</h3>
                                    <p>
                                        Atención médica a distancia con calidad
                                        de video superior, chat integrado e
                                        intercambio seguro de documentos médicos
                                        en tiempo real.
                                    </p>
                                </div>

                                <div
                                    className="service-card glass-card animate-on-scroll"
                                    style={{ transitionDelay: '100ms' }}
                                >
                                    <div className="service-icon">
                                        <i className="fa-solid fa-calendar-plus"></i>
                                    </div>
                                    <h3>Gestión Inteligente de Citas</h3>
                                    <p>
                                        Agenda, reprograma o cancela tus citas
                                        con solo unos clics. Sincronización
                                        automática con calendarios personales y
                                        recordatorios automáticos.
                                    </p>
                                </div>

                                <div
                                    className="service-card glass-card animate-on-scroll"
                                    style={{ transitionDelay: '200ms' }}
                                >
                                    <div className="service-icon">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </div>
                                    <h3>Buscador Avanzado</h3>
                                    <p>
                                        Encuentra al especialista ideal
                                        filtrando por especialidad,
                                        calificación, precio o disponibilidad
                                        inmediata.
                                    </p>
                                </div>

                                <div
                                    className="service-card glass-card animate-on-scroll"
                                    style={{ transitionDelay: '300ms' }}
                                >
                                    <div className="service-icon">
                                        <i className="fa-solid fa-user-gear"></i>
                                    </div>
                                    <h3>Perfiles Médicos Premium</h3>
                                    <p>
                                        Descubre el currículum, años de
                                        experiencia, artículos publicados y
                                        opiniones verificadas de cada
                                        especialista antes de agendar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Specialists Section */}
                    <section className="specialists" id="especialistas">
                        <div className="container">
                            <div className="section-header animate-on-scroll">
                                <h2>Nuestros Mejores Especialistas</h2>
                                <p>
                                    Profesionales de la salud altamente
                                    capacitados y listos para atenderte.
                                </p>
                            </div>

                            <div className="specialists-carousel animate-on-scroll">
                                {/* Doctor 1 */}
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <img
                                            src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                                            alt="Médico cardiólogo Dr. Roberto Sánchez - Especialista en cardiología online TuMediBot"
                                            loading="lazy"
                                        />
                                        <div className="doctor-rating">
                                            <i className="fa-solid fa-star"></i>{' '}
                                            4.9
                                        </div>
                                    </div>
                                    <div className="doctor-info">
                                        <span className="specialty-tag">
                                            Cardiología
                                        </span>
                                        <h3>Dr. Roberto Sánchez</h3>
                                        <p>
                                            Especialista en intervenciones
                                            coronarias con más de 15 años de
                                            experiencia.
                                        </p>
                                        <a
                                            href="#"
                                            className="btn btn-outline btn-full"
                                        >
                                            Ver Perfil
                                        </a>
                                    </div>
                                </div>

                                {/* Doctor 2 */}
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <img
                                            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=500&q=80"
                                            alt="Médico dermatóloga Dra. Elena Gómez - Especialista en dermatología online TuMediBot"
                                            loading="lazy"
                                        />
                                        <div className="doctor-rating">
                                            <i className="fa-solid fa-star"></i>{' '}
                                            5.0
                                        </div>
                                    </div>
                                    <div className="doctor-info">
                                        <span className="specialty-tag">
                                            Dermatología
                                        </span>
                                        <h3>Dra. Elena Gómez</h3>
                                        <p>
                                            Experta en dermatología estética y
                                            clínica. Atención pediátrica y
                                            adultos.
                                        </p>
                                        <a
                                            href="#"
                                            className="btn btn-outline btn-full"
                                        >
                                            Ver Perfil
                                        </a>
                                    </div>
                                </div>

                                {/* Doctor 3 */}
                                <div className="doctor-card">
                                    <div className="doctor-image">
                                        <img
                                            src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                                            alt="Médico pediatra Dr. Alejandro Ruiz - Especialista en pediatría online TuMediBot"
                                            loading="lazy"
                                        />
                                        <div className="doctor-rating">
                                            <i className="fa-solid fa-star"></i>{' '}
                                            4.8
                                        </div>
                                    </div>
                                    <div className="doctor-info">
                                        <span className="specialty-tag">
                                            Pediatría
                                        </span>
                                        <h3>Dr. Alejandro Ruiz</h3>
                                        <p>
                                            Cuidado integral del niño sano y
                                            seguimiento de enfermedades
                                            crónicas.
                                        </p>
                                        <a
                                            href="#"
                                            className="btn btn-outline btn-full"
                                        >
                                            Ver Perfil
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <a href="#" className="btn btn-primary">
                                    Ver todos los especialistas{' '}
                                    <i className="fa-solid fa-arrow-right"></i>
                                </a>
                            </div>
                        </div>
                    </section>
                </main>

                <WelcomeFooter />
            </div>
        </>
    );
}
