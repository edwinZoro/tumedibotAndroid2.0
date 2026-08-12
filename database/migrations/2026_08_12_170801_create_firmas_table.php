<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('firmas', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('id_historial');
            $table->foreign('id_historial')
                ->references('id')
                ->on('historial_clinico')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_medico');
            $table->foreign('id_medico')
                ->references('id')
                ->on('medicos')
                ->onDelete('cascade');

            $table->unsignedBigInteger('id_paciente');
            $table->foreign('id_paciente')
                ->references('id')
                ->on('pacientes')
                ->onDelete('cascade');

            $table->longText('logo_medico')->nullable();
            $table->longText('firma_medico')->nullable();
            $table->longText('sello_medico')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('firmas');
    }
};
