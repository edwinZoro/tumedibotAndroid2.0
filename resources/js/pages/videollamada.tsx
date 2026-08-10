import { Head, router } from '@inertiajs/react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { ArrowLeft, Loader2, Video } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';

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
        <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 text-white">
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
    const salir = () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            router.get('/');
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-slate-950">
            <Head title="Videollamada · TuMediBot" />

            <header className="z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-900/80 px-4 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-sky-500 shadow-lg shadow-blue-500/30">
                        <Video className="h-5 w-5 text-white" />
                    </span>
                    <div className="min-w-0">
                        <p className="text-sm font-bold text-white">
                            Videollamada segura
                        </p>
                        <p className="truncate text-[11px] text-slate-400">
                            {rol === 'medico'
                                ? 'Consultando a tu paciente'
                                : 'Consulta con tu médico'}
                            {cita.fecha
                                ? ` · ${cita.fecha}${cita.hora ? ` a las ${cita.hora}` : ''}`
                                : ''}
                        </p>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={salir}
                    className="shrink-0 rounded-xl border-white/15 bg-white/5 text-white hover:bg-white/10"
                >
                    <ArrowLeft className="mr-1.5 h-4 w-4" />
                    Salir
                </Button>
            </header>

            <main className="relative min-h-0 flex-1">
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
                    }}
                    configOverwrite={{
                        prejoinPageEnabled: false,
                        startWithAudioMuted: false,
                        disableDeepLinking: true,
                        enableInsecureRoomNameWarning: false,
                        analytics: {
                            disabled: true,
                        },
                    }}
                    interfaceConfigOverwrite={{
                        DEFAULT_LANGUAGE: 'es',
                        SHOW_CHROME_EXTENSION_BANNER: false,
                    }}
                />
            </main>
        </div>
    );
}
