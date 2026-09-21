// resources/js/pages/crypto.tsx
import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Copy, CheckCircle, AlertCircle, X, Coins } from 'lucide-react';
import Footer from '@/components/footer';

// ─── Datos de criptomonedas ──────────────────────────────────────────────
const cryptos = [
  {
    id: 'usdt-tron',
    title: 'Deposita USDT en la red Tron',
    color: 'red',
    bgGradient: 'from-red-500 to-rose-600',
    image: '/crypto/IMG-20250125-WA0006.jpg',
    address: 'TLhyQnNenJZRUVsU2isaqprU1jivWQ8eHb',
  },
  {
    id: 'usdt-bep20',
    title: 'Deposita USDT en la red Bep20',
    color: 'green',
    bgGradient: 'from-emerald-500 to-teal-600',
    image: '/crypto/IMG-20250125-WA0007.jpg',
    address: '0x7717f3e2887e858102053f6e49f74c262b2a52cb',
  },
  {
    id: 'btc-bitcoin',
    title: 'Deposita BTC en la red Bitcoin',
    color: 'orange',
    bgGradient: 'from-orange-500 to-amber-600',
    image: '/crypto/IMG-20250125-WA0008.jpg',
    address: '1EtumQ6NmgKNScCjmxdEqrdcNwPd9XKYVv',
  },
  {
    id: 'btc-bep20',
    title: 'Deposita BTC en la red Bep20',
    color: 'green',
    bgGradient: 'from-emerald-500 to-teal-600',
    image: '/crypto/IMG-20250125-WA0009.jpg',
    address: '0x7717f3e2887e858102053f6e49f74c262b2a52cb',
  },
];

// ─── Componente Snackbar ─────────────────────────────────────────────────
interface SnackbarState {
  open: boolean;
  message: string;
  type: 'success' | 'error';
}

const Snackbar = ({ open, message, type, onClose }: SnackbarState & { onClose: () => void }) => {
  if (!open) return null;

  const bgColor = type === 'success' ? 'bg-emerald-600' : 'bg-rose-600';

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center gap-3 rounded-xl px-5 py-3 text-white shadow-2xl backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-bottom-4">
      <div className={`${bgColor} rounded-full p-1`}>
        {type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
      </div>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={onClose}
        className="rounded-full p-1 hover:bg-white/20 transition-colors"
        aria-label="Cerrar"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

// ─── Props ───────────────────────────────────────────────────────────────
interface Props {
  planPrecio?: number;
  tituloPlan?: string;
}

// ─── Componente principal ────────────────────────────────────────────────
export default function CryptoPayment({ planPrecio = 0, tituloPlan = '' }: Props) {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    type: 'success',
  });

  // Calcular total con IVA (16%)
  const totalConIva = planPrecio > 0 ? (planPrecio * 1.16).toFixed(2) : null;

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setSnackbar({ open: true, message: '¡Dirección copiada!', type: 'success' });
      setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
    } catch {
      setSnackbar({ open: true, message: 'Error al copiar la dirección', type: 'error' });
      setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
    }
  };

  const copyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setSnackbar({ open: true, message: '¡Email copiado!', type: 'success' });
      setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
    } catch {
      setSnackbar({ open: true, message: 'Error al copiar el email', type: 'error' });
      setTimeout(() => setSnackbar((prev) => ({ ...prev, open: false })), 3000);
    }
  };

  return (
    <>
      <Head title="Pagar con Crypto - TuMediBot" />

      <div className="flex min-h-screen flex-col justify-between bg-gradient-to-b from-background to-muted/30 pt-8 md:pt-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* Encabezado */}
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-5xl">
              Direcciones Crypto
            </h1>
            <Separator className="mx-auto mt-4 mb-6 w-24" />
            <div className="rounded-lg border-l-4 border-rose-500 bg-rose-50/70 p-4 text-left text-sm text-rose-800 dark:border-rose-400 dark:bg-rose-950/30 dark:text-rose-300">
              <p className="flex items-start gap-2">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500 dark:text-rose-400" />
                <span>
                  <strong className="font-semibold">Advertencia:</strong>{' '}
                  No depositar ningún tipo de NFT en ninguna de las direcciones.
                  Considere que depositar en una red o dirección errónea puede
                  llevarlo a perder su dinero.
                </span>
              </p>
            </div>
          </div>

          {/* ─── Nueva sección: Pago por Binance ────────────────────────── */}
          <div className="mb-10">
            <Card className="overflow-hidden border border-amber-200/60 bg-white/80 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl dark:border-amber-800/40 dark:bg-slate-900/50">
              <CardHeader className="bg-gradient-to-r from-amber-400 to-orange-500 p-5 text-white">
                <CardTitle className="flex flex-col gap-1">
                  <span className="flex items-center gap-2 text-base font-bold tracking-wide">
                    <Coins className="h-5 w-5 shrink-0" />
                    Paga con Binance BPay
                  </span>
                  {totalConIva && (
                    <span className="mt-1 flex items-baseline gap-1 text-sm font-medium text-white/90">
                      el total de:
                      <span className="ml-1 text-2xl font-extrabold tracking-tight text-white drop-shadow">
                        ${totalConIva}
                      </span>
                      <span className="text-xs font-normal text-white/75">
                        (IVA 16% incluido)
                      </span>
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-4 p-5">
                <p className="text-center text-sm text-slate-600 dark:text-slate-300">
                  Realiza tu pago a través de Binance utilizando el siguiente email:
                </p>
                <div className="w-full rounded-lg bg-slate-800 p-3 font-mono text-xs break-all text-amber-300 dark:bg-slate-700/80 dark:text-amber-200">
                  edwinboada444@gmail.com
                </div>
                <Button
                  onClick={() => copyEmail('edwinboada444@gmail.com')}
                  variant="default"
                  className="w-full gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md hover:from-amber-400 hover:to-orange-500 dark:from-amber-600 dark:to-orange-700 dark:hover:from-amber-500 dark:hover:to-orange-600"
                >
                  <Copy className="h-4 w-4" />
                  Copiar Email
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Grid de tarjetas */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
            {cryptos.map((crypto) => (
              <Card
                key={crypto.id}
                className="group overflow-hidden border border-slate-200/80 bg-white/80 shadow-lg backdrop-blur-sm transition-all duration-300 hover:shadow-xl hover:scale-[1.02] dark:border-slate-800/60 dark:bg-slate-900/50"
              >
                <CardHeader
                  className={`bg-gradient-to-r p-4 text-white ${crypto.bgGradient}`}
                >
                  <CardTitle className="text-base font-bold tracking-wide">
                    {crypto.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center space-y-4 p-5">
                  <div className="w-full max-w-[200px] rounded-lg border border-slate-200/60 bg-white p-2 shadow-sm dark:border-slate-700/60 dark:bg-slate-800/50">
                    <img
                      src={crypto.image}
                      alt={crypto.title}
                      className="h-auto w-full object-contain"
                    />
                  </div>

                  <div className="w-full rounded-lg bg-slate-100 p-3 font-mono text-xs break-all text-slate-800 dark:bg-slate-800/70 dark:text-slate-200">
                    {crypto.address}
                  </div>

                  <Button
                    onClick={() => copyAddress(crypto.address)}
                    variant="default"
                    className="w-full gap-2 bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-md hover:from-slate-600 hover:to-slate-800 dark:from-slate-600 dark:to-slate-800 dark:hover:from-slate-500 dark:hover:to-slate-700"
                  >
                    <Copy className="h-4 w-4" />
                    Copiar Dirección
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Badge informativo adicional */}
          <div className="mt-12 text-center">
            <Badge
              variant="secondary"
              className="border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-sm font-medium text-amber-600 dark:text-amber-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                fill="currentColor"
                className="mr-1.5"
                viewBox="0 0 16 16"
              >
                <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5z" />
              </svg>
              Las transacciones se reflejan en el historial una vez confirmadas
            </Badge>
          </div>
        </div>

        <Footer />
      </div>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        message={snackbar.message}
        type={snackbar.type}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
}
