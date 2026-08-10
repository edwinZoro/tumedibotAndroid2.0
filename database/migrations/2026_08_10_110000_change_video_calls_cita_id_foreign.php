<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * La app crea sus citas en la tabla `cita_pacientes`, no en la tabla
     * legada `citas`. Por eso la FK de `video_calls.cita_id` debe apuntar
     * a `cita_pacientes` para poder asociar cada videollamada a una cita real.
     */
    public function up(): void
    {
        Schema::table('video_calls', function (Blueprint $table) {
            $table->dropForeign('video_calls_cita_id_foreign');

            $table->foreign('cita_id')
                ->references('id')
                ->on('cita_pacientes')
                ->onDelete('cascade');

            $table->unique('cita_id');
        });
    }

    public function down(): void
    {
        Schema::table('video_calls', function (Blueprint $table) {
            $table->dropUnique(['cita_id']);
            $table->dropForeign(['cita_id']);

            $table->foreign('cita_id')
                ->references('id')
                ->on('citas')
                ->onDelete('cascade');
        });
    }
};
