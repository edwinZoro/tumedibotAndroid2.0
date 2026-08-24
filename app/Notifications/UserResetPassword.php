<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UserResetPassword extends Notification
{
    use Queueable;

    public function __construct(
        public string $token
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $url = url('/reset-password/'.$this->token);

        return (new MailMessage)
            ->subject('Restablece tu contraseña - TuMediBot')
            ->view('emails.reset_password', [
                'user' => $notifiable,
                'url' => $url,
            ]);
    }
}
