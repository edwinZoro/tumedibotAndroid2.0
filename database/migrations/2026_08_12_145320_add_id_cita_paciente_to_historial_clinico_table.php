<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('historial_clinico', function (Blueprint $table) {
            // FK a cita_pacientes (citas del panel médico de consultorio)
            $table->unsignedBigInteger('id_cita_paciente')->nullable()->after('id_cita');
            $table->foreign('id_cita_paciente')
                ->references('id')
                ->on('cita_pacientes')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('historial_clinico', function (Blueprint $table) {
            $table->dropForeign(['id_cita_paciente']);
            $table->dropColumn('id_cita_paciente');
        });
    }
};
