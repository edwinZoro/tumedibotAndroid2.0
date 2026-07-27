import { Link, usePage } from '@inertiajs/react';
import {
    Bell,
    Calendar,
    FileText,
    FolderLock,
    Home,
    LifeBuoy,
    Search,
    Stethoscope,
    UserPlus,
    UserRound,
    Users,
    CreditCard
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
import { area, report } from '@/routes/medicos';
// Nota: Puedes ajustar o importar tus rutas reales para paciente aquí cuando las tengas definidas
// import { misCitas, misDatos, misArchivos } from '@/routes/pacientes';
import type { NavItem } from '@/types';

export function AppSidebar() {
  const { can } = usePage().props;
  const hasFactura = can?.hasFactura ?? false;
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
              { title: 'Datos Médicos', href: '#', icon: FileText }, // Estatura, peso, info médica
              { title: 'Mis Archivos', href: '#', icon: FolderLock }, // Exámenes y Rayos X subidos por él
              { title: 'Mis Citas', href: '#', icon: Calendar }, // Aquí apuntará a la vista de citas del paciente
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
                  { title: 'Mis Pacientes', href: '#', icon: Users },
                  { title: 'Citas (Agenda)', href: '#', icon: Calendar },
                  { title: 'Reportar Pagos', href: report(), icon: CreditCard },
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
          href: '#',
          icon: Bell,
      },
  ];
  // Filtrar los items visibles
  const visibleItems = mainNavItems.filter(item => !item.hidden);
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
