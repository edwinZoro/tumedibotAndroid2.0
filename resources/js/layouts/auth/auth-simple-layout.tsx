import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div
            className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[#0f172a] p-6 md:p-10"
            style={{ fontFamily: "'Outfit', sans-serif" }}
        >
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex items-center gap-2 font-medium"
                        >
                            <AppLogoIcon className="size-7 fill-current text-[#60a5fa]" />
                            <span className="text-xl font-extrabold tracking-tight text-white">
                                TuMedi
                                <span className="text-[#60a5fa]">Bot</span>
                            </span>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium text-white">
                                {title}
                            </h1>
                            <p className="text-center text-sm text-[#cbd5e1]">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
