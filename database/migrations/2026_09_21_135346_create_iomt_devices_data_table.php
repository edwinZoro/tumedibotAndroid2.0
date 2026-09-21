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
        Schema::create('iomt_devices_data', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('paciente_id'); // foreign key to pacientes
            $table->string('device_type'); // e.g. tensiometro, oximetro
            $table->text('encrypted_data'); // encrypted JSON
            $table->timestamp('recorded_at')->nullable();
            $table->timestamps();

            $table->foreign('paciente_id')->references('id')->on('pacientes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('iomt_devices_data');
    }
};
