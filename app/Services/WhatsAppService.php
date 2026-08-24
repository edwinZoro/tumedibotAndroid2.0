<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsAppService
{
    private string $accessToken;

    private string $phoneNumberId;

    private string $apiVersion;

    private bool $enabled;

    public function __construct()
    {
        $this->accessToken = config('services.whatsapp.access_token', '');
        $this->phoneNumberId = config('services.whatsapp.phone_number_id', '');
        $this->apiVersion = config('services.whatsapp.api_version', 'v18.0');
        $this->enabled = config('services.whatsapp.enabled', false);
    }

    public function isEnabled(): bool
    {
        return $this->enabled && $this->accessToken !== '' && $this->phoneNumberId !== '';
    }

    public function sendTemplateMessage(string $to, string $templateName, array $components = []): array
    {
        if (! $this->isEnabled()) {
            Log::info('WhatsApp: servicio no configurado, mensaje no enviado.', [
                'to' => $to,
                'template' => $templateName,
            ]);

            return ['success' => false, 'reason' => 'not_configured'];
        }

        $phone = $this->normalizePhone($to);

        if ($phone === '') {
            Log::warning('WhatsApp: número de teléfono inválido.', ['original' => $to]);

            return ['success' => false, 'reason' => 'invalid_phone'];
        }

        $body = [
            'messaging_product' => 'whatsapp',
            'to' => $phone,
            'type' => 'template',
            'template' => [
                'name' => $templateName,
                'language' => ['code' => 'es'],
            ],
        ];

        if (! empty($components)) {
            $body['template']['components'] = $components;
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->post("https://graph.facebook.com/{$this->apiVersion}/{$this->phoneNumberId}/messages", $body);

            if ($response->successful()) {
                Log::info('WhatsApp: mensaje enviado.', [
                    'to' => $phone,
                    'template' => $templateName,
                    'response' => $response->json(),
                ]);

                return ['success' => true, 'response' => $response->json()];
            }

            Log::error('WhatsApp: error al enviar mensaje.', [
                'to' => $phone,
                'template' => $templateName,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return ['success' => false, 'error' => $response->json()];
        } catch (\Exception $e) {
            Log::error('WhatsApp: excepción al enviar mensaje.', [
                'to' => $phone,
                'template' => $templateName,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    public function sendTextMessage(string $to, string $message): array
    {
        if (! $this->isEnabled()) {
            Log::info('WhatsApp: servicio no configurado, mensaje de texto no enviado.', [
                'to' => $to,
                'message' => $message,
            ]);

            return ['success' => false, 'reason' => 'not_configured'];
        }

        $phone = $this->normalizePhone($to);

        if ($phone === '') {
            return ['success' => false, 'reason' => 'invalid_phone'];
        }

        try {
            $response = Http::withToken($this->accessToken)
                ->post("https://graph.facebook.com/{$this->apiVersion}/{$this->phoneNumberId}/messages", [
                    'messaging_product' => 'whatsapp',
                    'to' => $phone,
                    'type' => 'text',
                    'text' => ['body' => $message],
                ]);

            if ($response->successful()) {
                Log::info('WhatsApp: mensaje de texto enviado.', [
                    'to' => $phone,
                    'response' => $response->json(),
                ]);

                return ['success' => true, 'response' => $response->json()];
            }

            Log::error('WhatsApp: error al enviar texto.', [
                'to' => $phone,
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            return ['success' => false, 'error' => $response->json()];
        } catch (\Exception $e) {
            Log::error('WhatsApp: excepción al enviar texto.', [
                'to' => $phone,
                'error' => $e->getMessage(),
            ]);

            return ['success' => false, 'error' => $e->getMessage()];
        }
    }

    private function normalizePhone(string $phone): string
    {
        $digits = preg_replace('/\D/', '', $phone);

        if (strlen($digits) < 10) {
            return '';
        }

        return $digits;
    }
}
