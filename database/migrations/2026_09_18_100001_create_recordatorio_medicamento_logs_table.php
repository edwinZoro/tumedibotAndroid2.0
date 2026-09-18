<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recordatorio_medicamento_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('recordatorio_id')
                ->constrained('recordatorio_medicamentos')
                ->cascadeOnDelete();

            // Cuándo se envió el recordatorio (para evitar duplicados)
            $table->timestamp('enviado_en')->useCurrent();

            // Qué canales se usaron
            $table->boolean('email_enviado')->default(false);
            $table->boolean('notif_interna')->default(false);

            // Dosis programada para este envío
            $table->time('hora_dosis');

            $table->index(['recordatorio_id', 'enviado_en']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recordatorio_medicamento_logs');
    }
};
