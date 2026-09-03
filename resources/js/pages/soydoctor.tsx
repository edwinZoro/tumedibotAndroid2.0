import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';

const plans = [
    {
        name: 'Andromeda',
        price: 25,
        period: '/Al mes',
        gradient: 'from-blue-600 to-blue-400',
        shadow: 'shadow-blue-500/10',
        border: 'hover:border-blue-500/50',
        features: [
            'Llenar Perfil Médico',
            'Agregar 1 foto a Perfil',
            'Enlaces de redes sociales',
            'Números de Teléfono',
            'Números de Whatsapp',
            'Dirección De Consultorio',
            'Crear, Editar y eliminar perfil',
            'Ver/Descargar Facturas',
            'Habilitar Área Médico',
            'Habilitar Chat de Soporte',
            'Aparecer en listados de busqueda',
            'Configurar Calendario de Citas',
        ],
        icon: (
            <path
                fillRule="evenodd"
                d="M1.475 9C2.702 10.84 4.779 12.871 8 15c3.221-2.129 5.298-4.16 6.525-6H12a.5.5 0 0 1-.464-.314l-1.457-3.642-1.598 5.593a.5.5 0 0 1-.945.049L5.889 6.568l-1.473 2.21A.5.5 0 0 1 4 9H1.475ZM.879 8C-2.426 1.68 4.41-2 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C11.59-2 18.426 1.68 15.12 8h-2.783l-1.874-4.686a.5.5 0 0 0-.945.049L7.921 8.956 6.464 5.314a.5.5 0 0 0-.88-.091L3.732 8H.88Z"
            />
        ),
    },
    {
        name: 'Fenix',
        price: 135,
        period: '/6 meses',
        gradient: 'from-amber-500 to-orange-500',
        shadow: 'shadow-amber-500/10',
        border: 'hover:border-amber-500/50',
        save: 15,
        features: [
            'Llenar Perfil Médico',
            'Agregar 1 foto a Perfil',
            'Enlaces de redes sociales',
            'Números de Teléfono',
            'Números de Whatsapp',
            'Dirección De Consultorio',
            'Crear, Editar y eliminar perfil',
            'Ver/Descargar Facturas',
            'Habilitar Área Médico',
            'Habilitar Chat de Soporte',
            'Aparecer en listados de busqueda',
            'Configurar Calendario de Citas',
        ],
        icon: (
            <>
                <path d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278z" />
                <path d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
            </>
        ),
    },
    {
        name: 'Pegasus',
        price: 270,
        period: '/1 año',
        gradient: 'from-purple-600 to-violet-500',
        shadow: 'shadow-purple-500/10',
        border: 'hover:border-purple-500/50',
        save: 30,
        popular: true,
        features: [
            'Llenar Perfil Médico',
            'Agregar 1 foto a Perfil',
            'Enlaces de redes sociales',
            'Números de Teléfono',
            'Números de Whatsapp',
            'Dirección De Consultorio',
            'Crear, Editar y eliminar perfil',
            'Ver/Descargar Facturas',
            'Habilitar Área Médico',
            'Habilitar Chat de Soporte',
            'Aparecer en listados de busqueda',
            'Configurar Calendario de Citas',
        ],
        icon: (
            <path
                fillRule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0zm-.5 5a.5.5 0 0 1 1 0v1.5H10a.5.5 0 0 1 0 1H8.5V9a.5.5 0 0 1-1 0V7.5H6a.5.5 0 0 1 0-1h1.5V5z"
            />
        ),
    },
];

export default function SoyDoctor() {
    return (
        <>
            <Head title="Soy Doctor - TuMediBot" />

            <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 md:py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Pricing Header */}
                    <div className="mx-auto mb-4 max-w-4xl text-center">
                        <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-5xl font-bold tracking-tight text-transparent md:text-6xl">
                            Precios
                        </h1>
                        <Separator className="mx-auto mt-4 mb-6 w-24" />
                        <p className="mx-auto max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground">
                            El procedimiento de pago en{' '}
                            <strong className="text-foreground">
                                tumedibot.com
                            </strong>{' '}
                            es muy simple. Sólo observe los precios de los
                            planes y escoja el que más se adapte a su
                            presupuesto.
                        </p>
                        <Badge
                            variant="secondary"
                            className="mt-4 border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                className="mr-1.5"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
                            </svg>
                            Ninguno de los precios incluye impuesto
                        </Badge>
                    </div>

                    {/* Plans Grid */}
                    <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
                        {plans.map((plan) => (
                            <Card
                                key={plan.name}
                                className={
                                    `group relative flex flex-col overflow-hidden border transition-all duration-500 ${plan.border} ` +
                                    (plan.popular
                                        ? 'scale-105 border-purple-500/50 shadow-xl ring-1 shadow-purple-500/10 ring-purple-500/20'
                                        : 'shadow-lg hover:shadow-xl')
                                }
                            >
                                {plan.popular && (
                                    <div className="absolute top-0 right-0">
                                        <div className="relative">
                                            <div className="absolute -top-1 right-4 z-10">
                                                <Badge className="bg-gradient-to-r from-purple-600 to-violet-500 px-3 py-1 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg">
                                                    Más Popular
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Header with gradient */}
                                <CardHeader
                                    className={
                                        `bg-gradient-to-r p-5 text-white ${plan.gradient} ` +
                                        (plan.popular ? 'pb-6' : '')
                                    }
                                >
                                    <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            {plan.icon}
                                        </svg>
                                        {plan.name}
                                    </CardTitle>

                                    {/* Price */}
                                    <div className="mt-3 flex items-baseline gap-1">
                                        <span className="text-4xl font-black">
                                            ${plan.price}
                                        </span>
                                        <span className="text-sm font-medium text-white/70">
                                            {plan.period}
                                        </span>
                                    </div>
                                </CardHeader>

                                {/* Features */}
                                <CardContent className="flex-grow space-y-1.5 p-5">
                                    {plan.features.map((feature, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 text-sm"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="14"
                                                height="14"
                                                fill="currentColor"
                                                className="shrink-0 text-emerald-500"
                                                viewBox="0 0 16 16"
                                            >
                                                <path d="M13.485 1.929a1 1 0 0 1 1.414 1.414l-7 7a1 1 0 0 1-1.414 0l-3.5-3.5a1 1 0 1 1 1.414-1.414L7 8.586l5.485-5.485a1 1 0 0 1 0 0z" />
                                            </svg>
                                            <span className="text-muted-foreground">
                                                {feature}
                                            </span>
                                        </div>
                                    ))}
                                </CardContent>

                                {/* Footer */}
                                <CardFooter className="flex-col gap-3 border-t border-border p-5">
                                    {plan.save && (
                                        <Badge
                                            variant="secondary"
                                            className="w-full justify-center bg-emerald-500/10 py-1 text-sm font-bold text-emerald-600 dark:text-emerald-400"
                                        >
                                            Ahorre ${plan.save}
                                        </Badge>
                                    )}
                                    <Button
                                        asChild
                                        className={
                                            'w-full font-bold transition-all duration-300 hover:scale-105 ' +
                                            (plan.popular
                                                ? 'bg-gradient-to-r from-purple-600 to-violet-500 text-white shadow-lg shadow-purple-500/20 hover:from-purple-500 hover:to-violet-400'
                                                : '')
                                        }
                                        variant={
                                            plan.popular ? 'default' : 'outline'
                                        }
                                    >
                                        <Link
                                            href={`/billing-plan/${plan.name.toLowerCase()}`}
                                        >
                                            Comprar
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>

                    {/* Trial Card */}
                    <div className="mx-auto mt-16 max-w-3xl">
                        <Card className="group overflow-hidden border-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-500 hover:shadow-blue-900/20">
                            <CardHeader className="relative border-b border-white/10 p-6 text-center">
                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                                <CardTitle className="relative flex items-center justify-center gap-3 text-lg font-semibold text-white">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        className="text-emerald-400"
                                        viewBox="0 0 16 16"
                                    >
                                        <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 3.5v1c0 .276.244.5.545.5h10.91c.3 0 .545-.224.545-.5v-1c0-.276-.244-.5-.546-.5H2.545c-.3 0-.545.224-.545.5zm6.5 5a.5.5 0 0 0-1 0V10H6a.5.5 0 0 0 0 1h1.5v1.5a.5.5 0 0 0 1 0V11H10a.5.5 0 0 0 0-1H8.5V8.5z" />
                                    </svg>
                                    Período de Prueba para especialistas médicos
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6 text-justify text-sm text-slate-300 md:text-base">
                                <p className="leading-relaxed font-semibold">
                                    En tumedibot.com otorgamos la posibilidad de
                                    suscribirse gratuitamente durante un período
                                    de prueba de{' '}
                                    <strong className="text-emerald-400">
                                        3 meses
                                    </strong>
                                    . Si quiere hacer uso de este beneficio
                                    notifique por chat la siguiente información:
                                </p>
                                <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                                    <ul className="space-y-2 text-left text-sm font-medium text-slate-200">
                                        {[
                                            'La frase: Quiero Mis tres Meses Gratis.',
                                            'Correo de usuario.',
                                            'Se pedirá información para corroborar que usted es médico.',
                                        ].map((item, i) => (
                                            <li
                                                key={i}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs text-emerald-400">
                                                    {i + 1}
                                                </span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <p className="text-sm leading-relaxed text-slate-400">
                                    De negar la solicitud es porque consideramos
                                    que usted no es un médico. En este caso
                                    envíenos un correo para estudiar su caso.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
