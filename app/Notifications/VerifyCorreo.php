<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\VerifyEmail;

class VerifyCorreo extends VerifyEmail
{
    public function __construct()
    {
        parent::__construct();
    }
}
