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
        Schema::create('menus', function (Blueprint $table) {
            $table->id();
            $table->date('fecha');
            $table->enum('tipo', ['desayuno', 'almuerzo', 'cena']);
            $table->string('descripcion'); // Ej: "Arroz con pollo, ensalada, refresco"
            $table->time('hora_inicio')->default('07:00:00');
            $table->time('hora_fin')->default('09:00:00');
            $table->timestamps();

            $table->unique(['fecha', 'tipo']); // One menu per meal type per day
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('menus');
    }
};
