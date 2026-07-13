import React, { useState, useCallback, ChangeEvent } from 'react';
import { router, usePage, Link, Head } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import { perfil_medico, calendar_view } from '@/routes';
import medicos from '@/routes/medicos';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Search as SearchIcon,
    Shield,
    MapPin,
    Phone,
    MessageCircle,
    Calendar,
    Eye,
} from 'lucide-react';

// =========================================================================
// CUSTOM DEBOUNCE UTILITY (Type-safe, self-contained)
// =========================================================================
function debounce<T extends (...args: any[]) => void>(
    func: T,
    wait: number,
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null;
    return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// =========================================================================
// INTERFACES DE TYPESCRIPT
// =========================================================================
interface Especialidad {
    id: number;
    nombre_especialidad: string;
}

interface Pais {
    id: number;
    nombre_paises: string;
}

interface Estado {
    id: number;
    name: string;
}

interface Ciudad {
    id: number;
    name: string;
}

interface Medico {
    id: number;
    nombre: string;
    apellido: string;
    sexo: 'MASCULINO' | 'FEMENINO';
    foto: string;
    consultorio_costo: string | number;
    telefono: string;
    whatsapp?: string;
    especialidad?: Especialidad;
    pais?: Pais;
    estado?: Estado;
    ciudad?: Ciudad;
}

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedData<T> {
    data: T[];
    links: PaginationLink[];
}

interface SearchFilters {
    nombre?: string;
    apellido?: string;
    especialidad?: string;
    precio?: string;
    estado?: string;
    municipio?: string;
    ciudad?: string;
    [key: string]: string | undefined;
}

interface SearchProps {
    listaMedico: PaginatedData<Medico>;
    especialidades: Especialidad[];
    paises: Pais[];
    estados: Estado[];
    ciudades: Ciudad[];
    filters: SearchFilters;
}

export default function Search({
    listaMedico,
    especialidades,
    paises,
    estados,
    ciudades,
    filters,
}: SearchProps) {
    // Acceder a las propiedades globales compartidas de Inertia
    const { auth } = usePage<{
        auth: { user: { id: number } | null };
    }>().props;

    // Estado para mostrar/ocultar filtros en móvil
    const [showFilters, setShowFilters] = useState(false);

    // Estado local para el formulario
    const [searchQuery, setSearchQuery] = useState<Required<SearchFilters>>({
        nombre: filters.nombre || '',
        apellido: filters.apellido || '',
        especialidad: filters.especialidad || '',
        precio: filters.precio || '',
        estado: filters.estado || '', // pais_id
        municipio: filters.municipio || '', // estado_id
        ciudad: filters.ciudad || '', // ciudad_id
    });

    // Función que ejecuta la petición HTTP de Inertia
    const triggerSearch = (updatedFilters: SearchFilters): void => {
        const cleanFilters = Object.keys(updatedFilters).reduce<
            Record<string, string>
        >((acc, key) => {
            if (updatedFilters[key]) {
                acc[key] = updatedFilters[key]!;
            }
            return acc;
        }, {});

        router.get(window.location.pathname, cleanFilters, {
            preserveState: true,
            replace: true,
        });
    };

    // Debounce para evitar llamadas excesivas al escribir (300ms)
    const debouncedSearch = useCallback(
        debounce(
            (updatedFilters: SearchFilters) => triggerSearch(updatedFilters),
            300,
        ),
        [],
    );

    // Manejador para inputs de texto
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const updated = { ...searchQuery, [name]: value };
        setSearchQuery(updated);
        debouncedSearch(updated);
    };

    // Manejadores específicos para los selects
    const handleEspecialidadChange = (value: string): void => {
        const val = value === 'all' ? '' : value;
        const updated = { ...searchQuery, especialidad: val };
        setSearchQuery(updated);
        triggerSearch(updated);
    };

    const handlePaisChange = (value: string): void => {
        const val = value === 'all' ? '' : value;
        const updated = {
            ...searchQuery,
            estado: val,
            municipio: '',
            ciudad: '',
        };
        setSearchQuery(updated);
        triggerSearch(updated);
    };

    const handleEstadoChange = (value: string): void => {
        const val = value === 'all' ? '' : value;
        const updated = { ...searchQuery, municipio: val, ciudad: '' };
        setSearchQuery(updated);
        triggerSearch(updated);
    };

    const handleCiudadChange = (value: string): void => {
        const val = value === 'all' ? '' : value;
        const updated = { ...searchQuery, ciudad: val };
        setSearchQuery(updated);
        triggerSearch(updated);
    };

    const getFlagCode = (paisNombre: string | undefined): string => {
        if (!paisNombre) return 'default';
        const flags: Record<string, string> = {
            ARGENTINA: 'ar',
            BOLIVIA: 'bo',
            CHILE: 'cl',
            COLOMBIA: 'co',
            'COSTA RICA': 'cr',
            CUBA: 'cu',
            DOMINICANA: 'do',
            ECUADOR: 'ec',
            'EL SALVADOR': 'sv',
            ESPAÑA: 'es',
            GUATEMALA: 'gt',
            HONDURAS: 'hn',
            MEXICO: 'mx',
            NICARAGUA: 'ni',
            PANAMA: 'pa',
            PARAGUAY: 'py',
            PERU: 'pe',
            'PUERTO RICO': 'pr',
            URUGUAY: 'uy',
            VENEZUELA: 've',
        };
        return flags[paisNombre] || 'default';
    };

    return (
        <>
            <Head title="Encontrar Médicos - TuMediBot" />

            <div className="min-h-screen space-y-8 bg-background p-6 text-foreground md:p-8">
                {/* Header Title with Welcome gradient */}
                <div className="space-y-2">
                    <h1 className="font-sans text-4xl font-extrabold tracking-tight md:text-5xl">
                        Encontrar{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-sky-400 bg-clip-text text-transparent">
                            Médicos
                        </span>
                    </h1>
                    <p className="hidden text-sm text-muted-foreground md:block md:text-base">
                        Busca y agenda citas con los mejores especialistas de la
                        salud. Filtra por nombre, especialidad o ubicación.
                    </p>
                </div>

                {/* Search Filters Card */}
                <Card className="rounded-2xl border-border bg-card/80 p-6 shadow-2xl backdrop-blur-md dark:border-white/10 dark:bg-[#1e293b]/50">
                    <CardHeader className="mb-6 p-0">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-sky-500">
                            <SearchIcon className="size-5" />
                            Filtros de Búsqueda Avanzada
                        </CardTitle>
                        <CardDescription className="text-xs text-muted-foreground">
                            Los resultados se actualizan automáticamente según
                            los criterios que selecciones.
                        </CardDescription>
                        <button
                            type="button"
                            onClick={() => setShowFilters(!showFilters)}
                            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-input px-4 py-2 text-sm font-medium text-foreground md:hidden dark:border-white/10 dark:bg-slate-950/40"
                        >
                            <SearchIcon className="size-4" />
                            {showFilters
                                ? 'Ocultar filtros'
                                : 'Mostrar filtros'}
                        </button>
                    </CardHeader>

                    <CardContent
                        className={`p-0 ${showFilters ? 'block' : 'hidden'} md:block`}
                    >
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
                            {/* Nombre Input */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label
                                    htmlFor="nombre"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Nombre
                                </Label>
                                <div className="relative">
                                    <Input
                                        type="text"
                                        name="nombre"
                                        id="nombre"
                                        value={searchQuery.nombre}
                                        onChange={handleInputChange}
                                        placeholder="Ej: Simón"
                                        className="h-9 border-border bg-input text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-slate-950/40"
                                    />
                                </div>
                            </div>

                            {/* Apellido Input */}
                            <div className="space-y-1.5 md:col-span-1">
                                <Label
                                    htmlFor="apellido"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Apellido
                                </Label>
                                <Input
                                    type="text"
                                    name="apellido"
                                    id="apellido"
                                    value={searchQuery.apellido}
                                    onChange={handleInputChange}
                                    placeholder="Ej: Boada"
                                    className="h-9 border-border bg-input text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-slate-950/40"
                                />
                            </div>

                            {/* Especialidad Select */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label
                                    htmlFor="especialidad"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Especialidad
                                </Label>
                                <Select
                                    value={searchQuery.especialidad || 'all'}
                                    onValueChange={handleEspecialidadChange}
                                >
                                    <SelectTrigger
                                        id="especialidad"
                                        className="h-9 w-full border-border bg-input text-foreground dark:border-white/10 dark:bg-slate-950/40"
                                    >
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-popover text-popover-foreground dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
                                        <SelectItem value="all">
                                            Todas las especialidades
                                        </SelectItem>
                                        {especialidades.map((es) => (
                                            <SelectItem
                                                key={es.id}
                                                value={es.id.toString()}
                                            >
                                                {es.nombre_especialidad}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Precio Input */}
                            <div className="space-y-1.5 md:col-span-1">
                                <Label
                                    htmlFor="precio"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Precio($)
                                </Label>
                                <Input
                                    type="text"
                                    name="precio"
                                    id="precio"
                                    value={searchQuery.precio}
                                    onChange={handleInputChange}
                                    placeholder="Ej: 20"
                                    className="h-9 border-border bg-input text-foreground placeholder:text-muted-foreground dark:border-white/10 dark:bg-slate-950/40"
                                />
                            </div>

                            {/* Pais Select */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label
                                    htmlFor="pais"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    País
                                </Label>
                                <Select
                                    value={searchQuery.estado || 'all'}
                                    onValueChange={handlePaisChange}
                                >
                                    <SelectTrigger
                                        id="pais"
                                        className="h-9 w-full border-border bg-input text-foreground dark:border-white/10 dark:bg-slate-950/40"
                                    >
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-popover text-popover-foreground dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
                                        <SelectItem value="all">
                                            Todos los países
                                        </SelectItem>
                                        {paises.map((p) => (
                                            <SelectItem
                                                key={p.id}
                                                value={p.id.toString()}
                                            >
                                                {p.nombre_paises}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Estado Select */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label
                                    htmlFor="estado"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Estado
                                </Label>
                                <Select
                                    value={searchQuery.municipio || 'all'}
                                    onValueChange={handleEstadoChange}
                                    disabled={!searchQuery.estado}
                                >
                                    <SelectTrigger
                                        id="estado"
                                        className="h-9 w-full border-border bg-input text-foreground disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/40"
                                    >
                                        <SelectValue placeholder="Todos" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-popover text-popover-foreground dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
                                        <SelectItem value="all">
                                            Todos los estados
                                        </SelectItem>
                                        {estados.map((e) => (
                                            <SelectItem
                                                key={e.id}
                                                value={e.id.toString()}
                                            >
                                                {e.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ciudad Select */}
                            <div className="space-y-1.5 md:col-span-2">
                                <Label
                                    htmlFor="ciudad"
                                    className="text-xs font-medium text-muted-foreground"
                                >
                                    Ciudad
                                </Label>
                                <Select
                                    value={searchQuery.ciudad || 'all'}
                                    onValueChange={handleCiudadChange}
                                    disabled={!searchQuery.municipio}
                                >
                                    <SelectTrigger
                                        id="ciudad"
                                        className="h-9 w-full border-border bg-input text-foreground disabled:opacity-50 dark:border-white/10 dark:bg-slate-950/40"
                                    >
                                        <SelectValue placeholder="Todas" />
                                    </SelectTrigger>
                                    <SelectContent className="border-border bg-popover text-popover-foreground dark:border-white/10 dark:bg-slate-900 dark:text-slate-100">
                                        <SelectItem value="all">
                                            Todas las ciudades
                                        </SelectItem>
                                        {ciudades.map((c) => (
                                            <SelectItem
                                                key={c.id}
                                                value={c.id.toString()}
                                            >
                                                {c.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Doctor Cards Responsive Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {listaMedico.data.map((lista) => {
                        const isMasculino = lista.sexo === 'MASCULINO';
                        const flag = getFlagCode(lista.pais?.nombre_paises);
                        const displayPrefix =
                            lista.especialidad?.nombre_especialidad ===
                                'ENFERMERÍA'
                                ? isMasculino
                                    ? 'Lcdo. '
                                    : 'Lcda. '
                                : isMasculino
                                    ? 'Dr. '
                                    : 'Dra. ';

                        const capNombre =
                            lista.nombre.charAt(0).toUpperCase() +
                            lista.nombre.slice(1);
                        const capApellido =
                            lista.apellido.charAt(0).toUpperCase() +
                            lista.apellido.slice(1);

                        return (
                            <Card
                                key={lista.id}
                                className="group flex flex-col justify-between gap-0 overflow-hidden rounded-2xl border-border bg-card py-0 shadow-lg shadow-black/10 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:border-sky-500/50 hover:bg-accent dark:border-white/10 dark:bg-[#1e293b]/40 dark:shadow-black/40 dark:hover:border-sky-500/50 dark:hover:bg-[#1e293b]/70"
                            >
                                {/* Photo Container at the Top */}
                                <div className="relative h-72 w-full overflow-hidden bg-muted dark:bg-slate-950">
                                    <img
                                        src={`/imagen/${lista.foto}`}
                                        alt={`${displayPrefix}${capNombre} ${capApellido}`}
                                        className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />

                                    {/* Country Badge on Top-Left */}
                                    {flag !== 'default' && (
                                        <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-border bg-background/80 px-2 py-1 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-[#0f172a]/80">
                                            <img
                                                alt={`Bandera ${lista.pais?.nombre_paises}`}
                                                src={`/banderitas/${flag}.png`}
                                                className="h-3.5 w-4 rounded-xs object-cover"
                                            />
                                            <span className="text-[10px] font-semibold tracking-wider text-foreground dark:text-slate-200">
                                                {lista.pais?.nombre_paises}
                                            </span>
                                        </div>
                                    )}

                                    {/* Cost/Consulta floating on Top-Right */}
                                    <div className="absolute top-3 right-3 rounded-lg bg-emerald-600/90 px-2.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md">
                                        ${lista.consultorio_costo}
                                    </div>
                                </div>

                                {/* Doctor Details below the photo */}
                                <CardContent className="flex flex-1 flex-col justify-between space-y-4 p-5">
                                    <div className="space-y-2">
                                        {/* Specialty Tag */}
                                        <div className="flex items-center gap-1 text-sky-500">
                                            <Shield className="size-3.5 shrink-0" />
                                            <span className="text-xs font-semibold tracking-wider uppercase">
                                                {
                                                    lista.especialidad
                                                        ?.nombre_especialidad
                                                }
                                            </span>
                                        </div>

                                        {/* Doctor Name */}
                                        <h3 className="text-lg leading-tight font-bold text-card-foreground transition-colors group-hover:text-sky-500 dark:text-slate-100 dark:group-hover:text-sky-500">
                                            {displayPrefix}
                                            {capNombre} {capApellido}
                                        </h3>
                                    </div>

                                    {/* Location and Info rows */}
                                    <div className="space-y-3 border-t border-border pt-3 text-sm text-foreground/80 dark:border-white/5 dark:text-slate-300">
                                        {/* Location */}
                                        <div className="flex items-start gap-2">
                                            <MapPin className="mt-0.5 size-4 shrink-0 text-rose-400" />
                                            <span>
                                                {lista.estado?.name},{' '}
                                                {lista.ciudad?.name}
                                            </span>
                                        </div>

                                        {/* Phone */}
                                        <div className="flex items-center gap-2">
                                            <Phone className="size-4 shrink-0 text-amber-400" />
                                            <span>{lista.telefono}</span>
                                        </div>

                                        {/* WhatsApp */}
                                        {lista.whatsapp && (
                                            <div className="flex items-center gap-2 font-medium text-emerald-600 dark:text-emerald-400">
                                                <MessageCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                                                <span>{lista.whatsapp}</span>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>

                                {/* Interactive Actions in Footer */}
                                <CardFooter className="grid grid-cols-2 gap-3 p-5 pt-0">
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-[#1e293b]/40 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-white"
                                    >
                                        <Link
                                            href={perfil_medico([
                                                lista.id,
                                                lista.nombre,
                                                lista.apellido,
                                                lista.especialidad
                                                    ?.nombre_especialidad || '',
                                            ])}
                                        >
                                            <Eye className="mr-1 size-3.5" />
                                            Perfil
                                        </Link>
                                    </Button>

                                    <Button
                                        asChild
                                        size="sm"
                                        className="w-full bg-gradient-to-r from-blue-600 to-sky-500 font-semibold text-white shadow-lg shadow-blue-500/20 hover:from-blue-500 hover:to-sky-400"
                                    >
                                        <Link
                                            href={calendar_view([
                                                lista.id,
                                                auth?.user?.id || 0,
                                            ])}
                                        >
                                            <Calendar className="mr-1 size-3.5" />
                                            Cita
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        );
                    })}
                </div>

                {/* Dynamic Pagination Controls */}
                <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5">
                    {listaMedico.links.map((link, index) => (
                        <Link
                            key={index}
                            href={link.url || '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={cn(
                                'rounded-lg border px-3 py-1.5 text-xs transition-all duration-200 select-none',
                                link.active
                                    ? 'border-blue-600 bg-blue-600 font-semibold text-white shadow-lg shadow-blue-500/30'
                                    : 'border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground dark:border-white/10 dark:bg-slate-800/40 dark:text-slate-300 dark:hover:bg-slate-800/80 dark:hover:text-white',
                                !link.url &&
                                'pointer-events-none cursor-not-allowed opacity-40',
                            )}
                            preserveState
                        />
                    ))}
                </div>
            </div>
        </>
    );
}
