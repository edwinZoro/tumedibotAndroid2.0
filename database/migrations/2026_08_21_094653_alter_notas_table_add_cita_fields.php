<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('notas', function (Blueprint $table) {
            $table->unsignedBigInteger('id_cita_paciente')->nullable()->after('id_historial');
            $table->unsignedBigInteger('id_medico')->nullable()->after('id_cita_paciente');
            $table->unsignedBigInteger('id_paciente')->nullable()->after('id_medico');
            $table->boolean('compartido')->default(false)->after('contenido');
            $table->timestamps();

            $table->foreign('id_cita_paciente')->references('id')->on('cita_pacientes')->onDelete('cascade');
            $table->foreign('id_medico')->references('id')->on('medicos')->onDelete('cascade');
            $table->foreign('id_paciente')->references('id')->on('pacientes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::table('notas', function (Blueprint $table) {
            $table->dropForeign(['id_cita_paciente']);
            $table->dropForeign(['id_medico']);
            $table->dropForeign(['id_paciente']);
            $table->dropColumn(['id_cita_paciente', 'id_medico', 'id_paciente', 'compartido', 'created_at', 'updated_at']);
        });
    }
};
