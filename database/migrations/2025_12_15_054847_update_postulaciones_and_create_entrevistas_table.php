<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Create interviews table
        Schema::create('entrevistas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('postulacion_id');
            $table->unsignedBigInteger('psicologo_id')->nullable();
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->string('lugar')->nullable()->default('Consultorio Psicológico UNAM');
            $table->enum('estado', ['pendiente', 'programada', 'completada', 'no_asistio'])->default('pendiente');
            $table->enum('resultado', ['apto', 'no_apto'])->nullable();
            $table->text('observaciones')->nullable();
            $table->timestamps();

            $table->foreign('postulacion_id')->references('id')->on('postulaciones')->onDelete('cascade');
            $table->foreign('psicologo_id')->references('id')->on('usuarios')->onDelete('set null');
        });

        // 2. Update postulaciones status enum
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE postulaciones MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado', 'apto_entrevista', 'entrevista_programada', 'becario') DEFAULT 'pendiente'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrevistas');
        \Illuminate\Support\Facades\DB::statement("ALTER TABLE postulaciones MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente'");
    }
};
