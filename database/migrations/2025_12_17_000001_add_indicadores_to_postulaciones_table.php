<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('postulaciones', function (Blueprint $table) {
            $table->json('indicadores_socioeconomicos')->nullable()->after('condicion_vivienda');
        });
    }

    public function down(): void
    {
        Schema::table('postulaciones', function (Blueprint $table) {
            $table->dropColumn('indicadores_socioeconomicos');
        });
    }
};
