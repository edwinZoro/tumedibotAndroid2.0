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
        Schema::table('cita_pacientes', function (Blueprint $table) {
            $table->date('fecha')->nullable()->after('id_medico');
            $table->time('hora')->nullable()->after('fecha');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cita_pacientes', function (Blueprint $table) {
            $table->dropColumn(['fecha', 'hora']);
        });
    }
};
