<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('cita_pacientes', function (Blueprint $table) {
            $table->boolean('recordatorio_3d_enviado')->default(false)->after('estado_cita');
            $table->boolean('recordatorio_1d_enviado')->default(false)->after('recordatorio_3d_enviado');
            $table->boolean('recordatorio_3h_enviado')->default(false)->after('recordatorio_1d_enviado');
        });
    }

    public function down(): void
    {
        Schema::table('cita_pacientes', function (Blueprint $table) {
            $table->dropColumn(['recordatorio_3d_enviado', 'recordatorio_1d_enviado', 'recordatorio_3h_enviado']);
        });
    }
};
