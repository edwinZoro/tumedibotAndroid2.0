<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Amplía el campo 'privacy' de usuarios para almacenar timestamps ISO 8601.
     * Un timestamp ISO completo con zona horaria ocupa hasta 35 caracteres.
     * Ejemplo: "2026-09-18T11:59:05+00:00"
     */
    public function up(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY privacy VARCHAR(35) NOT NULL");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE users MODIFY privacy VARCHAR(25) NOT NULL");
        }
    }
};
