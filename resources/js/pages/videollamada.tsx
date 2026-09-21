import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { ArrowLeft, Loader2, Video, FileText, StickyNote, Plus, ChevronDown } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { HistorialSheet } from '@/components/medicos/historial-sheet';
import { NotaSheet } from '@/components/medicos/nota-sheet';
import { RecetaSheet } from '@/components/medicos/receta-sheet';
import type { BreadcrumbItem } from '@/types';

interface CitaProp {
    id: number;
    fecha: string | null;
    hora: string | null;
    motivo?: string | null;
}

interface Props {
    rol: 'medico' | 'paciente';
    roomName: string;
    nombreUsuario: string;
    cita: CitaProp;
}

function Cargando() {
    return (
        <div className="flex h-full flex-col items-center justify-center gap-3 bg-slate-950 text-white">
            <Loader2 className="h-10 w-10 animate-spin text-sky-400" />
            <p className="text-sm font-semibold text-slate-300">
                Preparando la videollamada segura...
            </p>
        </div>
    );
}

export default function Videollamada({
    rol,
    roomName,
    nombreUsuario,
    cita,
}: Props) {
    const [historialOpen, setHistorialOpen] = useState(false);
    const [notaOpen, setNotaOpen] = useState(false);
    const [recetaOpen, setRecetaOpen] = useState(false);

    const salir = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.get('/');
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Videollamada', href: '#' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Videollamada · TuMediBot" />

            {/* Barra superior de info + botón salir */}
            <div className="flex shrink-0 items-center justify-between gap-4 border-b border-sidebar-border/70 bg-background px-4 py-2.5">
                <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-md shadow-blue-500/30">
                        <Video className="h-4 w-4 text-white" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground">
                            Videollamada segura
                        </p>
                        <p className="truncate text-[11px] text-muted-foreground">
                            {rol === 'medico'
                                ? 'Consultando a tu paciente'
                                : 'Consulta con tu médico'}
                            {cita.fecha
                                ? ` · ${cita.fecha}${cita.hora ? ` a las ${cita.hora}` : ''}`
                                : ''}
                        </p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    {rol === 'medico' && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="shrink-0 rounded-xl">
                                    <FileText className="mr-1.5 h-4 w-4 text-blue-500" />
                                    Expediente Clínico
                                    <ChevronDown className="ml-1 h-3.5 w-3.5" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem onClick={() => setHistorialOpen(true)}>
                                    <FileText className="mr-2 h-4 w-4 text-emerald-500" />
                                    <span>Historial Clínico</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setRecetaOpen(true)}>
                                    <Plus className="mr-2 h-4 w-4 text-purple-500" />
                                    <span>Nueva Receta</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setNotaOpen(true)}>
                                    <StickyNote className="mr-2 h-4 w-4 text-amber-500" />
                                    <span>Notas Clínicas</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={salir}
                        className="shrink-0 rounded-xl"
                    >
                        <ArrowLeft className="mr-1.5 h-4 w-4" />
                        Salir
                    </Button>
                </div>
            </div>

            {/* Contenedor del iframe — ocupa todo el alto restante */}
            <div className="relative flex-1 overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomName}
                    userInfo={{ displayName: nombreUsuario, email: '' }}
                    lang="es"
                    spinner={Cargando}
                    onReadyToClose={salir}
                    getIFrameRef={(node) => {
                        node.style.height = '100%';
                        node.style.width = '100%';
                        node.style.border = '0';
                        node.style.display = 'block';
                        node.style.position = 'absolute';
                        node.style.inset = '0';
                    }}
                    configOverwrite={{
                        prejoinPageEnabled: false,
                        startWithAudioMuted: false,
                        disableDeepLinking: true,
                        enableInsecureRoomNameWarning: false,
                        disableInitialGUM: false,
                        // Ocultar completamente la pantalla de bienvenida
                        hideConferenceTimer: false,
                        analytics: {
                            disabled: true,
                        },
                    }}
                    interfaceConfigOverwrite={{
                        DEFAULT_LANGUAGE: 'es',
                        SHOW_CHROME_EXTENSION_BANNER: false,
                        // Quitar botones innecesarios de la toolbar
                        TOOLBAR_BUTTONS: [
                            'microphone',
                            'camera',
                            'closedcaptions',
                            'desktop',
                            'fullscreen',
                            'fodeviceselection',
                            'hangup',
                            'chat',
                            'raisehand',
                            'videoquality',
                            'tileview',
                            'participants-pane',
                            'toggle-camera',
                            'shortcuts',
                            'stats',
                        ],
                    }}
                />
            </div>

            {rol === 'medico' && (
                <>
                    <HistorialSheet
                        citaId={cita.id}
                        open={historialOpen}
                        onClose={() => setHistorialOpen(false)}
                    />
                    <NotaSheet
                        citaId={cita.id}
                        open={notaOpen}
                        onClose={() => setNotaOpen(false)}
                    />
                    <RecetaSheet
                        citaId={cita.id}
                        open={recetaOpen}
                        onClose={() => setRecetaOpen(false)}
                    />
                </>
            )}
        </AppLayout>
    );
}
