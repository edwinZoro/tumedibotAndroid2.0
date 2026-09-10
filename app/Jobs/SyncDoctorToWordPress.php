<?php

namespace App\Jobs;

use App\Models\Medico;
use App\Services\WordPressService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SyncDoctorToWordPress implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $medico;

    /**
     * Create a new job instance.
     *
     * @param Medico $medico
     * @return void
     */
    public function __construct(Medico $medico)
    {
        $this->medico = $medico;
    }

    /**
     * Execute the job.
     *
     * @param WordPressService $wpService
     * @return void
     */
    public function handle(WordPressService $wpService)
    {
        Log::info('Running SyncDoctorToWordPress Job', ['medico_id' => $this->medico->id]);

        $email = $this->medico->correo;
        $firstName = $this->medico->nombre ?? '';
        $lastName = $this->medico->apellido ?? '';
        
        // WP usernames cannot have spaces, usually we can use part of email or first.last
        $usernameParts = explode('@', $email);
        $username = $usernameParts[0] . rand(10, 99); // Ensure uniqueness slightly

        $wpService->createAuthor($email, $username, $firstName, $lastName);
    }
}
