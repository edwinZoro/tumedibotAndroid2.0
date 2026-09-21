import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    FileText,
    FolderLock,
    Home,
    LifeBuoy,
    Pill,
    Search,
    Stethoscope,
    UserPlus,
    UserRound,
    Users,
    CreditCard,
    Activity,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, soydoctor } from '@/routes';
import {
    archivosCompartidos,
    area,
    citas as citasMedico,
    pacientes as pacientesMedico,
    report,
} from '@/routes/medicos';
import { archivos, citas, datosMedicos, medicamentos } from '@/routes/pacientes';
import type { NavItem } from '@/types';

export function AppSidebar() {
    const { can, unreadNotifications } = usePage().props;
    const hasFactura = can?.hasFactura ?? false;
    const unreadCount = (unreadNotifications as number) ?? 0;
    const mainNavItems: NavItem[] = [
        {
            title: 'Buscar Médicos',
            href: dashboard(), // Principal y Buscar Médicos llevan al mismo sitio (buscador)
            icon: Search,
        },
        {
            title: 'Paciente',
            href: '#',
            icon: UserRound,
            items: [
                {
                    title: 'Datos Médicos',
                    href: datosMedicos(),
                    icon: FileText,
                }, // Estatura, peso, info médica
                {
                    title: 'Mis Archivos',
                    href: archivos(),
                    icon: FolderLock,
                }, // Exámenes y Rayos X subidos por él
                { title: 'Mis Citas', href: citas(), icon: Calendar },
                { title: 'Mis Medicamentos', href: medicamentos(), icon: Pill },
                { title: 'Monitoreo IoMT', href: '/paciente/monitoreo-iomt', icon: Activity },
            ],
        },
        {
            title: 'Médicos',
            href: '#',
            icon: Stethoscope,
            // Oculta todo el grupo si no tiene factura
            hidden: !hasFactura,
            items: [
                { title: 'Área Médico', href: area(), icon: UserRound },
                {
                    title: 'Mis Pacientes',
                    href: pacientesMedico(),
                    icon: Users,
                },
                {
                    title: 'Citas (Agenda)',
                    href: citasMedico(),
                    icon: Calendar,
                },
                {
                    title: 'Archivos Compartidos',
                    href: archivosCompartidos(),
                    icon: FolderLock,
                },
                { title: 'Reportar Pagos', href: report(), icon: CreditCard },
                { title: 'Monitorización IoMT', href: '/medico/monitorizacion-iomt', icon: Activity },
                { title: 'Soporte Técnico', href: '#', icon: LifeBuoy },
            ],
        },
        {
            title: 'Soy Doctor',
            href: soydoctor(), // Planes de pago y datos de facturación
            icon: UserPlus,
            hidden: hasFactura, // 👈 Se oculta si ya tiene factura
        },
        {
            title: 'Notificaciones',
            href: '/notificaciones',
            icon: Bell,
            badge: unreadCount > 0 ? unreadCount : undefined,
        },
    ];
    // Filtrar los items visibles
    const visibleItems = mainNavItems.filter((item) => !item.hidden);
    const footerNavItems: NavItem[] = [];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={visibleItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
