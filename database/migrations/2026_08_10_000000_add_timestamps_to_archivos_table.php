<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Agrega los timestamps a la tabla archivos para conocer la fecha real
     * de subida y rellena los registros existentes con la fecha en la que
     * se otorgó el acceso (otorgado_en) o con la fecha actual.
     */
    public function up(): void
    {
        Schema::table('archivos', function (Blueprint $table) {
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();
        });

        DB::statement('
            UPDATE archivos a
            LEFT JOIN (
                SELECT archivo_id, MIN(otorgado_en) AS f
                FROM archivo_medico_acceso
                GROUP BY archivo_id
            ) t ON t.archivo_id = a.id
            SET a.created_at = COALESCE(t.f, NOW()),
                a.updated_at = COALESCE(t.f, NOW())
        ');
    }

    public function down(): void
    {
        Schema::table('archivos', function (Blueprint $table) {
            $table->dropColumn(['created_at', 'updated_at']);
        });
    }
};
