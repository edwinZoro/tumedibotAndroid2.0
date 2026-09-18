<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tabla de auditoría de consentimientos legales.
     *
     * Cumple con los requisitos de trazabilidad exigidos por GDPR (Europa),
     * LGPD (Brasil), LOPD (España) y regulaciones de protección de datos
     * personales de Latinoamérica (Ley 1581/CO, Ley 81/PAN, etc.).
     *
     * Permite saber:
     *  - Quién aceptó (user_id)
     *  - Qué política aceptó (type: terms | privacy | cookies | all)
     *  - Qué versión de la política estaba vigente (policy_version)
     *  - Cuándo la aceptó exactamente (accepted_at)
     *  - Desde qué IP lo hizo (ip_address)
     *  - Con qué dispositivo/navegador (user_agent)
     */
    public function up(): void
    {
        Schema::create('consent_logs', function (Blueprint $table) {
            $table->id();

            // Usuario que dio el consentimiento (NULL si fue eliminado)
            $table->foreignId('user_id')
                ->constrained('users')
                ->cascadeOnDelete();

            // Tipo de política: 'terms', 'privacy', 'cookies', 'all'
            $table->enum('type', ['terms', 'privacy', 'cookies', 'all'])
                ->default('all')
                ->comment('Tipo de política aceptada');

            // Versión del documento de política vigente al momento de la aceptación
            // Formato recomendado: "v1.0", "v2.0", etc.
            $table->string('policy_version', 10)
                ->default('v1.0')
                ->comment('Versión del documento de política al momento de la aceptación');

            // Dirección IP del cliente (IPv4 o IPv6, hasta 45 chars para IPv6 full)
            $table->string('ip_address', 45)
                ->nullable()
                ->comment('IP del usuario al momento de la aceptación');

            // User-Agent del navegador para tener el contexto completo
            $table->text('user_agent')
                ->nullable()
                ->comment('Navegador/dispositivo del usuario');

            // Timestamp exacto de la aceptación (se usa created_at)
            $table->timestamp('accepted_at')
                ->useCurrent()
                ->comment('Fecha y hora exacta de la aceptación del consentimiento');

            // Índices para consultas frecuentes
            $table->index(['user_id', 'type']);
            $table->index('accepted_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consent_logs');
    }
};
