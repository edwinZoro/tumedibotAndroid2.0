<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MensajeDoctorMail extends Mailable
{
    use Queueable, SerializesModels;

    public string $nombre;

    public string $email;

    public string $phone;

    public string $mensaje;

    public string $medicoNombre;

    public function __construct(
        string $nombre,
        string $email,
        string $phone,
        string $mensaje,
        string $medicoNombre = 'Doctor'
    ) {
        $this->nombre = $nombre;
        $this->email = $email;
        $this->phone = $phone;
        $this->mensaje = $mensaje;
        $this->medicoNombre = $medicoNombre;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Nuevo mensaje de paciente: {$this->nombre} · TuMediBot",
            replyTo: [
                new Address($this->email, $this->nombre),
            ],
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.mensaje_doctor',
            with: [
                'nombre' => $this->nombre,
                'email' => $this->email,
                'phone' => $this->phone,
                'mensaje' => $this->mensaje,
                'medicoNombre' => $this->medicoNombre,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
