<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class WordPressWelcomeMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombre;
    public string $username;
    public string $password;
    public string $loginUrl;

    public function __construct(
        string $nombre,
        string $username,
        string $password,
        string $loginUrl
    ) {
        $this->nombre = $nombre;
        $this->username = $username;
        $this->password = $password;
        $this->loginUrl = $loginUrl;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: '¡Bienvenido(a) a TuMediBot Noticias!',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.wordpress_welcome',
            with: [
                'nombre' => $this->nombre,
                'username' => $this->username,
                'password' => $this->password,
                'loginUrl' => $this->loginUrl,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
