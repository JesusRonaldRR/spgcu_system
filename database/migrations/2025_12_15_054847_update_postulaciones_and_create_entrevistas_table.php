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
        if (!Schema::hasTable('entrevistas')) {
            Schema::create('entrevistas', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('postulacion_id');
                $table->unsignedBigInteger('psicologo_id')->nullable();
                $table->date('fecha')->nullable();
                $table->time('hora')->nullable();
                $table->string('lugar')->nullable()->default('Consultorio Psicológico UNAM');
                $table->string('estado')->default('pendiente');
                $table->string('resultado')->nullable();
                $table->text('observaciones')->nullable();
                $table->timestamps();

                $table->foreign('postulacion_id')->references('id')->on('postulaciones')->onDelete('cascade');
                $table->foreign('psicologo_id')->references('id')->on('usuarios')->onDelete('set null');
            });
        }

        // 2. Update postulaciones status enum
        if (config('database.default') === 'mysql') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE postulaciones MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado', 'apto_entrevista', 'entrevista_programada', 'becario') DEFAULT 'pendiente'");
        } else {
            Schema::table('postulaciones', function (Blueprint $table) {
                $table->string('estado')->default('pendiente')->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrevistas');
        if (config('database.default') === 'mysql') {
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE postulaciones MODIFY COLUMN estado ENUM('pendiente', 'aprobado', 'rechazado') DEFAULT 'pendiente'");
        }
    }
};
