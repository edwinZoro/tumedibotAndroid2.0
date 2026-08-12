<?php

use App\Models\Ciudad;
use App\Models\Especialidades;
use App\Models\Medico;
use App\Models\Pais;
use App\Models\State;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Inertia\Testing\AssertableInertia as Assert;

it('renders the doctor profile page', function () {
    // 1. Dynamically create the tables in SQLite in-memory database
    Schema::create('especialidad', function (Blueprint $table) {
        $table->id();
        $table->string('nombre_especialidad');
        $table->timestamps();
    });

    Schema::create('paises', function (Blueprint $table) {
        $table->id();
        $table->string('nombre_paises');
        $table->timestamps();
    });

    Schema::create('states', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedBigInteger('pais_id');
        $table->timestamps();
    });

    Schema::create('ciudades', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->unsignedBigInteger('state_id');
        $table->timestamps();
    });

    Schema::create('medicos', function (Blueprint $table) {
        $table->id();
        $table->string('nombre');
        $table->string('apellido');
        $table->string('second_name')->nullable();
        $table->string('last_name')->nullable();
        $table->string('sexo');
        $table->string('foto')->nullable();
        $table->text('perfil_medico')->nullable();
        $table->text('tratamientos')->nullable();
        $table->string('correo');
        $table->decimal('consultorio_costo', 10, 2)->default(0);
        $table->string('direccion')->nullable();
        $table->string('hospital_clinica')->nullable();
        $table->string('nombre_hos_cli')->nullable();
        $table->string('nmro_hos_cli')->nullable();
        $table->text('horario')->nullable();
        $table->string('telefono')->nullable();
        $table->string('whatsapp')->nullable();
        $table->string('facebook')->nullable();
        $table->string('twitter')->nullable();
        $table->string('linkedin')->nullable();
        $table->string('instagram')->nullable();
        $table->string('usted_es')->nullable();
        $table->integer('experiencia')->default(0);
        $table->string('pagos')->nullable();
        $table->unsignedBigInteger('especialidad_id')->nullable();
        $table->unsignedBigInteger('pais_id')->nullable();
        $table->unsignedBigInteger('estado_id')->nullable();
        $table->unsignedBigInteger('ciudad_id')->nullable();
        $table->timestamps();
    });

    // 2. Insert records using Eloquent
    $especialidad = Especialidades::create([
        'nombre_especialidad' => 'Cardiología',
    ]);

    $pais = Pais::create([
        'nombre_paises' => 'Venezuela',
    ]);

    $estado = State::create([
        'name' => 'Distrito Capital',
        'pais_id' => $pais->id,
    ]);

    $ciudad = Ciudad::create([
        'name' => 'Caracas',
        'state_id' => $estado->id,
    ]);

    $medico = Medico::create([
        'id' => 1,
        'nombre' => 'Simón',
        'apellido' => 'Boada',
        'sexo' => 'MASCULINO',
        'especialidad_id' => $especialidad->id,
        'correo' => 'simon@example.com',
        'consultorio_costo' => 50,
        'horario' => '08:00 - 17:00',
        'telefono' => '123456789',
        'usted_es' => 'Cardiólogo',
        'experiencia' => 15,
        'perfil_medico' => 'Perfil del médico',
        'tratamientos' => 'Tratamientos realizados',
        'pais_id' => $pais->id,
        'estado_id' => $estado->id,
        'ciudad_id' => $ciudad->id,
    ]);

    // 3. Perform request
    $response = $this->get('/medicos/perfil/1');

    // 4. Assert response is successful and renders the Inertia component with correct props
    $response->assertStatus(200);
    $response->assertInertia(fn (Assert $page) => $page
        ->component('medicos/profile-medical')
        ->has('medico')
        ->has('user')
        ->where('medico.id', 1)
        ->where('medico.nombre', 'Simón')
    );
});
