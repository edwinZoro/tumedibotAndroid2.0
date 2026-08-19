<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('recetas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('id_paciente');
            $table->unsignedBigInteger('id_medico');
            $table->unsignedBigInteger('id_cita_paciente')->nullable();
            $table->string('tipo_receta')->default('simple');
            $table->longText('medicamentos');
            $table->text('indicaciones')->nullable();
            $table->text('diagnostico')->nullable();
            $table->date('proxima_cita')->nullable();
            $table->boolean('compartido')->default(false);
            $table->timestamps();

            $table->foreign('id_paciente')->references('id')->on('pacientes')->onDelete('cascade');
            $table->foreign('id_medico')->references('id')->on('medicos')->onDelete('cascade');
            $table->foreign('id_cita_paciente')->references('id')->on('cita_pacientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('recetas');
    }
};
