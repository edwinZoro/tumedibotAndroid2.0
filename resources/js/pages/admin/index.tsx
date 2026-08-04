import { Head, Link, router } from '@inertiajs/react';
import {
    Users,
    Stethoscope,
    FileText,
    Receipt,
    Search,
    Pencil,
    ArrowLeft,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { edit as editFacturaRoute } from '@/routes/admin/facturas';
import { edit as editMedicoRoute } from '@/routes/admin/medicos';
import { edit as editReporteRoute } from '@/routes/admin/reportes';
import { edit as editUsuarioRoute } from '@/routes/admin/users';

// ─── Utilidades ──────────────────────────────────────────────────────────────
function debounce<T extends (...args: never[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: ReturnType<typeof setTimeout> | null = null;

    return (...args: Parameters<T>) => {
        if (timeout) {
            clearTimeout(timeout);
        }

        timeout = setTimeout(() => func(...args), wait);
    };
}

const formatDate = (dateString?: string | null) => {
    if (!dateString) {
        return '—';
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
        return '—';
    }

    return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const capitalize = (str?: string | null) => {
    if (!str) {
        return '—';
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
};

const planLabel = (plan?: string | null) => {
    switch (plan) {
        case 'andromeda':
            return 'Andrómeda';
        case 'fenix':
            return 'Fénix';
        case 'pegasus':
            return 'Pegaso';
        default:
            return plan ? capitalize(plan) : '—';
    }
};

// ─── Tipos ───────────────────────────────────────────────────────────────────
interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    from: number;
    to: number;
    links: PaginationLink[];
    prev_page_url: string | null;
    next_page_url: string | null;
}

interface Usuario {
    id: number;
    name: string;
    email: string;
    pagos: string | null;
    privacy: string | null;
    created_at: string;
}

interface Especialidad {
    id: number;
    nombre_especialidad: string;
}

interface Medico {
    id: number;
    nombre: string;
    apellido: string;
    correo: string;
    sexo: string;
    telefono: string | null;
    especialidad_id: number | null;
    user_id: number | null;
    created_at: string;
    especialidad?: Especialidad | null;
}

interface Factura {
    id: number;
    nombre: string;
    apellido: string;
    celular: string;
    ci_rif: string;
    plan: string | null;
    user_id: number | null;
    created_at: string;
}

interface Reporte {
    id: number;
    transaccion_id: string;
    banco_emisor: string;
    banco_receptor: string;
    nmro_referencia: string;
    monto_pagado: string;
    metodo_transaccion: string;
    estado: string;
    factura_id: number | null;
    fecha_transaccion: string;
}

interface Props {
    adminName: string;
    tab: 'users' | 'medicos' | 'facturas' | 'reportes';
    search: string;
    users: Paginated<Usuario>;
    medicos: Paginated<Medico>;
    facturas: Paginated<Factura>;
    reportes: Paginated<Reporte>;
}

const TABS = [
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'medicos', label: 'Médicos', icon: Stethoscope },
    { id: 'facturas', label: 'Facturas', icon: FileText },
    { id: 'reportes', label: 'Reportes', icon: Receipt },
] as const;

// ─── Componente ──────────────────────────────────────────────────────────────
export default function AdminIndex({
    adminName,
    tab,
    search,
    users,
    medicos,
    facturas,
    reportes,
}: Props) {
    const [searchInput, setSearchInput] = useState(search);

    const activeTab = useMemo(
        () => (TABS.some((t) => t.id === tab) ? tab : 'users'),
        [tab],
    );

    const runSearch = useCallback(
        (value: string) => {
            router.get(
                '/admin',
                { tab: activeTab, search: value || undefined },
                {
                    preserveState: true,
                    replace: true,
                },
            );
        },
        [activeTab],
    );

    const debouncedSearch = useMemo(
        () => debounce((value: string) => runSearch(value), 300),
        [runSearch],
    );

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
        debouncedSearch(value);
    };

    const switchTab = (id: (typeof TABS)[number]['id']) => {
        setSearchInput('');
        router.get(
            '/admin',
            { tab: id },
            {
                preserveState: true,
                replace: true,
            },
        );
    };

    const changePage = (url: string | null) => {
        if (!url) {
            return;
        }

        router.get(url, {}, { preserveState: true, replace: true });
    };

    const current = useMemo(() => {
        switch (activeTab) {
            case 'users':
                return users;
            case 'medicos':
                return medicos;
            case 'facturas':
                return facturas;
            default:
                return reportes;
        }
    }, [activeTab, users, medicos, facturas, reportes]);

    const renderPagination = () => {
        if (!current || current.last_page <= 1) {
            return null;
        }

        return (
            <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-4">
                <p className="text-sm text-muted-foreground">
                    Mostrando {current.from ?? 0}–{current.to ?? 0} de{' '}
                    {current.total}
                </p>
                <div className="flex items-center gap-1">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!current.prev_page_url}
                        onClick={() => changePage(current.prev_page_url)}
                    >
                        Anterior
                    </Button>
                    {current.links
                        .filter((l) => /^\d+$/.test(l.label))
                        .map((link) => (
                            <Button
                                key={link.label}
                                size="sm"
                                variant={link.active ? 'default' : 'outline'}
                                onClick={() => changePage(link.url)}
                                className={
                                    link.active ? 'bg-blue-600 text-white' : ''
                                }
                            >
                                {link.label}
                            </Button>
                        ))}
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={!current.next_page_url}
                        onClick={() => changePage(current.next_page_url)}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        );
    };

    const renderTable = () => {
        switch (activeTab) {
            case 'users':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Pagos</TableHead>
                                <TableHead>Registro</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground italic"
                                    >
                                        No se encontraron usuarios.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                users.data.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="font-medium">
                                            {u.id}
                                        </TableCell>
                                        <TableCell>{u.name}</TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {u.email}
                                        </TableCell>
                                        <TableCell>{u.pagos ?? '—'}</TableCell>
                                        <TableCell>
                                            {formatDate(u.created_at)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={
                                                        editUsuarioRoute(u.id)
                                                            .url
                                                    }
                                                >
                                                    <Pencil className="size-3.5" />{' '}
                                                    Editar
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                );
            case 'medicos':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Nombre</TableHead>
                                <TableHead>Correo</TableHead>
                                <TableHead>Teléfono</TableHead>
                                <TableHead>Especialidad</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {medicos.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground italic"
                                    >
                                        No se encontraron médicos.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                medicos.data.map((m) => (
                                    <TableRow key={m.id}>
                                        <TableCell className="font-medium">
                                            {m.id}
                                        </TableCell>
                                        <TableCell>
                                            {capitalize(m.nombre)}{' '}
                                            {capitalize(m.apellido)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {m.correo}
                                        </TableCell>
                                        <TableCell>
                                            {m.telefono ?? '—'}
                                        </TableCell>
                                        <TableCell>
                                            {m.especialidad
                                                ?.nombre_especialidad ?? '—'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={
                                                        editMedicoRoute(m.id)
                                                            .url
                                                    }
                                                >
                                                    <Pencil className="size-3.5" />{' '}
                                                    Editar
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                );
            case 'facturas':
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Cédula / RIF</TableHead>
                                <TableHead>Celular</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {facturas.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={6}
                                        className="py-8 text-center text-muted-foreground italic"
                                    >
                                        No se encontraron facturas.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                facturas.data.map((f) => (
                                    <TableRow key={f.id}>
                                        <TableCell className="font-medium">
                                            {f.id}
                                        </TableCell>
                                        <TableCell>
                                            {capitalize(f.nombre)}{' '}
                                            {capitalize(f.apellido)}
                                        </TableCell>
                                        <TableCell className="text-muted-foreground">
                                            {f.ci_rif}
                                        </TableCell>
                                        <TableCell>{f.celular}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">
                                                {planLabel(f.plan)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={
                                                        editFacturaRoute(f.id)
                                                            .url
                                                    }
                                                >
                                                    <Pencil className="size-3.5" />{' '}
                                                    Editar
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                );
            case 'reportes':
            default:
                return (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Transacción</TableHead>
                                <TableHead>Banco Emisor</TableHead>
                                <TableHead>Referencia</TableHead>
                                <TableHead>Monto</TableHead>
                                <TableHead>Estado</TableHead>
                                <TableHead className="text-right">
                                    Acciones
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportes.data.length === 0 ? (
                                <TableRow>
                                    <TableCell
                                        colSpan={7}
                                        className="py-8 text-center text-muted-foreground italic"
                                    >
                                        No se encontraron reportes de pago.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                reportes.data.map((r) => (
                                    <TableRow key={r.id}>
                                        <TableCell className="font-medium">
                                            {r.id}
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {r.transaccion_id}
                                        </TableCell>
                                        <TableCell>{r.banco_emisor}</TableCell>
                                        <TableCell className="font-mono text-xs">
                                            {r.nmro_referencia}
                                        </TableCell>
                                        <TableCell className="font-semibold">
                                            ${r.monto_pagado}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    r.estado?.toLowerCase() ===
                                                    'procesando'
                                                        ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-400'
                                                        : 'border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-900/50 dark:bg-emerald-900/20 dark:text-emerald-400'
                                                }
                                            >
                                                {r.estado?.toUpperCase() || '—'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                asChild
                                                size="sm"
                                                variant="outline"
                                            >
                                                <Link
                                                    href={
                                                        editReporteRoute(r.id)
                                                            .url
                                                    }
                                                >
                                                    <Pencil className="size-3.5" />{' '}
                                                    Editar
                                                </Link>
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                );
        }
    };

    return (
        <>
            <Head title="Administración" />

            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            Panel de Administración
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                            Bienvenido, {adminName}. Gestiona usuarios, médicos,
                            facturas y reportes de pago.
                        </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex flex-wrap items-center gap-2">
                            {TABS.map(({ id, label, icon: Icon }) => (
                                <Button
                                    key={id}
                                    variant={
                                        activeTab === id ? 'default' : 'outline'
                                    }
                                    className={
                                        activeTab === id
                                            ? 'bg-blue-600 text-white'
                                            : ''
                                    }
                                    onClick={() => switchTab(id)}
                                >
                                    <Icon className="size-4" /> {label}
                                </Button>
                            ))}
                        </div>

                        <div className="relative">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                value={searchInput}
                                onChange={handleSearchChange}
                                placeholder="Buscar por id, nombre, correo, cédula, referencia o ticket..."
                                className="pl-9"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <div className="overflow-x-auto">
                        {renderTable()}
                        {renderPagination()}
                    </div>
                </Card>

                <div>
                    <Button asChild variant="outline">
                        <Link href={dashboard().url}>
                            <ArrowLeft className="size-4" /> Volver al inicio
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

AdminIndex.layout = {
    breadcrumbs: [
        {
            title: 'Administración',
            href: '/admin',
        },
    ],
};
