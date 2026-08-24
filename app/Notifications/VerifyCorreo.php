<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;
use Illuminate\Notifications\Messages\MailMessage;

class VerifyCorreo extends VerifyEmail
{
    public function __construct()
    {
        parent::__construct();
    }

    public function toMail($notifiable): MailMessage
    {
        $url = $this->verificationUrl($notifiable);

        return (new MailMessage)
            ->subject('Verifica tu correo - TuMediBot')
            ->view('emails.verificar_correo', [
                'user' => $notifiable,
                'url' => $url,
            ]);
    }
}
