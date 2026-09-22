<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WordPressService
{
    protected string $baseUrl;
    protected string $apiUrl;
    protected string $apiUser;
    protected string $apiPassword;

    public function __construct()
    {
        // Use configured URL, ensuring it ends without trailing slash and appends /wp-json/wp/v2
        $this->baseUrl = rtrim(env('WP_API_URL', 'https://noticias.tumedibot.com/wp'), '/');
        $this->apiUrl = $this->baseUrl . '/wp-json/wp/v2';
        $this->apiUser = env('WP_API_USER', 'admin');
        $this->apiPassword = env('WP_API_PASSWORD', 'm3C0 of3C oEW4 hbWK yOYr QJUo');
    }

    /**
     * Create a user in WordPress with the 'author' role.
     *
     * @param string $email
     * @param string $username
     * @param string $firstName
     * @param string $lastName
     * @return array|null
     */
    public function createAuthor(string $email, string $username, string $firstName, string $lastName): ?array
    {
        try {
            // Generate a random password since WP will send them an email to reset/login
            $randomPassword = bin2hex(random_bytes(12));

            $response = Http::withBasicAuth($this->apiUser, $this->apiPassword)
                ->post("{$this->apiUrl}/users", [
                    'username'   => $username,
                    'name'       => trim($firstName . ' ' . $lastName),
                    'first_name' => $firstName,
                    'last_name'  => $lastName,
                    'email'      => $email,
                    'password'   => $randomPassword,
                    'roles'      => ['contributor'],
                ]);

            if ($response->successful()) {
                Log::info('WordPress User Created Successfully', ['email' => $email, 'wp_id' => $response->json('id')]);

                // Enviar el correo de bienvenida usando Laravel Mail
                $loginUrl = $this->baseUrl . '/wp-login.php';
                \Illuminate\Support\Facades\Mail::to($email)->send(
                    new \App\Mail\WordPressWelcomeMail($firstName, $username, $randomPassword, $loginUrl)
                );

                return $response->json();
            }

            Log::error('WordPress User Creation Failed', [
                'email'   => $email,
                'status'  => $response->status(),
                'message' => $response->body()
            ]);

            return null;
        } catch (\Exception $e) {
            Log::error('WordPress API Exception', [
                'message' => $e->getMessage(),
                'email'   => $email
            ]);
            return null;
        }
    }
}
