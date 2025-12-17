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
        // Tabla: convocatorias
        Schema::create('convocatorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->date('fecha_inicio');
            $table->date('fecha_fin');
            $table->boolean('esta_activa')->default(true);
            $table->timestamps();
        });

        // Tabla: postulaciones
        Schema::create('postulaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->unsignedBigInteger('convocatoria_id');
            $table->decimal('ingreso_familiar', 10, 2);
            $table->integer('numero_miembros');
            $table->string('condicion_vivienda');
            $table->json('ruta_archivos')->nullable(); // Rutas de PDFs
            $table->integer('puntaje')->default(0);
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');
            $table->string('hash_qr')->nullable()->unique();
            $table->timestamps();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            $table->foreign('convocatoria_id')->references('id')->on('convocatorias')->onDelete('cascade');
        });

        // Tabla: asistencias
        Schema::create('asistencias', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->dateTime('fecha_hora_escaneo');
            $table->enum('tipo_menu', ['desayuno', 'almuerzo', 'cena']);
            $table->enum('estado', ['presente', 'tarde', 'rechazado']);
            $table->timestamps();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
        });

        // Tabla: justificaciones
        Schema::create('justificaciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('usuario_id');
            $table->date('fecha_a_justificar');
            $table->text('motivo');
            $table->string('ruta_archivo'); // PDF/Img
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');
            $table->timestamps();

            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('justificaciones');
        Schema::dropIfExists('asistencias');
        Schema::dropIfExists('postulaciones');
        Schema::dropIfExists('convocatorias');
    }
};
