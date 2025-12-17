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
        Schema::table('entrevistas', function (Blueprint $table) {
            $table->enum('tipo', ['presencial', 'virtual'])->default('presencial')->after('lugar');
            $table->string('link_reunion')->nullable()->after('tipo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('entrevistas', function (Blueprint $table) {
            $table->dropColumn(['tipo', 'link_reunion']);
        });
    }
};
