import type { Auth } from '@/types/auth';

declare global {
    interface Window {
        LHC_API?: {
            args: Record<string, unknown>;
        };
    }
}

declare module 'react' {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    export interface InertiaConfig {
        sharedPageProps: {
            name: string;
            auth: Auth;
            can: {
                hasFactura: boolean;
                administration: boolean;
            };
            sidebarOpen: boolean;
            [key: string]: unknown;
        };
    }
}
