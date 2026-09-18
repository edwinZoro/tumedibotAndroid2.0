<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recordatorio_medicamentos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('paciente_id')
                ->constrained('pacientes')
                ->cascadeOnDelete();

            // El medicamento puede venir del catálogo O ser escrito libremente
            $table->foreignId('medicamento_id')
                ->nullable()
                ->constrained('medicamentos')
                ->nullOnDelete();

            // Nombre libre si no está en el catálogo
            $table->string('nombre_libre')->nullable();

            // Detalles del medicamento seleccionado/escrito
            $table->string('presentacion')->nullable();   // "Tabletas 500 mg"
            $table->string('dosis');                      // "1 tableta", "5 ml"

            // Frecuencia: cuántas horas entre dosis
            // 4 = cada 4h, 6 = cada 6h, 8 = cada 8h, 12 = cada 12h, 24 = una vez al día
            $table->unsignedTinyInteger('intervalo_horas'); // 4,6,8,12,24,48...

            // Primera dosis del día (hora de inicio del ciclo)
            $table->time('hora_inicio');                  // "08:00"

            // Para recordatorios semanales: días específicos (null = todos los días)
            $table->json('dias_semana')->nullable();       // ["lunes","miercoles","viernes"]

            // Período del tratamiento
            $table->date('fecha_inicio');
            $table->date('fecha_fin')->nullable();         // null = indefinido

            // Preferencias de notificación
            $table->boolean('email_recordatorio')->default(true);

            // Notas del paciente
            $table->text('notas')->nullable();

            // Estado
            $table->boolean('activo')->default(true);

            $table->timestamps();

            // Índices de búsqueda rápida
            $table->index(['paciente_id', 'activo']);
            $table->index('fecha_fin');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recordatorio_medicamentos');
    }
};
