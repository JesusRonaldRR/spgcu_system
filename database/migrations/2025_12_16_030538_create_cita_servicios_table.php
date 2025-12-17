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
        Schema::create('cita_servicios', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('servicio'); // e.g., 'Nutrición', 'Pediatría'
            $table->date('fecha')->nullable();
            $table->time('hora')->nullable();
            $table->enum('estado', ['solicitado', 'programada', 'completada', 'cancelada'])->default('solicitado');
            $table->string('motivo')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cita_servicios');
    }
};
