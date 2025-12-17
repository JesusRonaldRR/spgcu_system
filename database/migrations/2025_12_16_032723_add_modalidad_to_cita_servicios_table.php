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
        Schema::table('cita_servicios', function (Blueprint $table) {
            $table->string('modalidad')->nullable()->after('servicio'); // Presencial, Virtual
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('cita_servicios', function (Blueprint $table) {
            $table->dropColumn('modalidad');
        });
    }
};
