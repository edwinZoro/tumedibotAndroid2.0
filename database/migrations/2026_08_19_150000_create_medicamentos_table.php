<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('medicamentos', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_comercial');
            $table->string('principio_activo');
            $table->json('presentaciones');
            $table->json('dosis_options');
            $table->json('frecuencia_options');
            $table->json('duracion_options');
            $table->text('indicaciones');
            $table->string('categoria');
            $table->timestamps();

            $table->index('nombre_comercial');
            $table->index('principio_activo');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('medicamentos');
    }
};
