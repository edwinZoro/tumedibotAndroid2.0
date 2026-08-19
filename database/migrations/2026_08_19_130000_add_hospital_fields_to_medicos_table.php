<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('medicos', function (Blueprint $table) {
            if (! Schema::hasColumn('medicos', 'logo')) {
                $table->longText('logo')->nullable()->after('name_temp');
            }
            if (! Schema::hasColumn('medicos', 'firma_medico')) {
                $table->longText('firma_medico')->nullable()->after('logo');
            }
            if (! Schema::hasColumn('medicos', 'sello_medico')) {
                $table->longText('sello_medico')->nullable()->after('firma_medico');
            }
            $table->longText('sello_hospital')->nullable()->after('sello_medico');
            $table->text('nombre_hospital')->nullable()->after('sello_hospital');
            $table->text('direccion_hospital')->nullable()->after('nombre_hospital');
        });
    }

    public function down(): void
    {
        Schema::table('medicos', function (Blueprint $table) {
            $table->dropColumn(['sello_hospital', 'nombre_hospital', 'direccion_hospital']);
        });
    }
};
