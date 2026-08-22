import type { ReactNode } from 'react';
import AuthLayoutTemplate from '@/layouts/auth/auth-simple-layout';
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

export default function AuthLayout({
    title = '',
    description = '',
    children,
}: {
    title?: ReactNode;
    description?: string;
    children: React.ReactNode;
}) {
    return (
        <GoogleReCaptchaProvider
            reCaptchaKey={import.meta.env.VITE_GOOGLE_RECAPTCHA_SITE_KEY}
        >
            <AuthLayoutTemplate title={title} description={description}>
                {children}
            </AuthLayoutTemplate>
        </GoogleReCaptchaProvider>
    );
}
