import { Link } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    Home,
    LifeBuoy,
    Search,
    Stethoscope,
    UserPlus,
    UserRound,
    Users,
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
import medicos, { area } from '@/routes/medicos';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Principal',
        href: dashboard(),
        icon: Home,
    },
    {
        title: 'Citas',
        href: '#',
        icon: Calendar,
    },
    {
        title: 'Médicos',
        href: '#',
        icon: Stethoscope,
        items: [
            { title: 'Área Médico', href: area(), icon: UserRound },
            { title: 'Pacientes', href: '#', icon: Users },
            { title: 'Citas', href: '#', icon: Calendar },
            { title: 'Soporte Técnico', href: '#', icon: LifeBuoy },
        ],
    },
    {
        title: 'Buscar Médicos',
        href: dashboard(),
        icon: Search,
    },
    {
        title: 'Soy Doctor',
        href: soydoctor(),
        icon: UserPlus,
    },
    {
        title: 'Notificaciones',
        href: '#',
        icon: Bell,
    },
];

const footerNavItems: NavItem[] = [];

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
