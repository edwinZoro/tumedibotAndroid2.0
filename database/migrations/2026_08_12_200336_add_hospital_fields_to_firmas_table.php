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
        Schema::table('firmas', function (Blueprint $table) {
            $table->longText('sello_hospital')->nullable()->after('sello_medico');
            $table->text('nombre_hospital')->nullable()->after('sello_hospital');
            $table->text('direccion_hospital')->nullable()->after('nombre_hospital');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('firmas', function (Blueprint $table) {
            $table->dropColumn(['sello_hospital', 'nombre_hospital', 'direccion_hospital']);
        });
    }
};
