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
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('apellido_paterno')->nullable()->after('apellidos');
            $table->string('apellido_materno')->nullable()->after('apellido_paterno');
            $table->enum('sexo', ['M', 'F'])->nullable()->after('nombres');
            $table->date('fecha_nacimiento')->nullable()->after('sexo');
            $table->string('estado_civil')->nullable()->after('fecha_nacimiento');

            // Ubication / Contact
            $table->string('direccion_actual')->nullable()->after('telefono');
            $table->string('ubigeo_actual')->nullable()->after('direccion_actual'); // Could be a concatenation like "DEP/PROV/DIST"
            $table->string('ubigeo_nacimiento')->nullable()->after('fecha_nacimiento');

            // Education
            $table->string('nombre_colegio')->nullable()->after('ubigeo_actual');
            $table->string('tipo_colegio')->nullable()->after('nombre_colegio'); // Publico/Privado
            $table->year('anio_termino_colegio')->nullable()->after('tipo_colegio');
            $table->string('ubigeo_colegio')->nullable()->after('nombre_colegio');

            // Emergency Contact
            $table->string('contacto_emergencia_nombre')->nullable();
            $table->string('contacto_emergencia_telefono')->nullable();

            // Extra info from screenshot
            $table->string('datos_pide')->nullable(); // JSON or text if needed specifically
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn([
                'apellido_paterno',
                'apellido_materno',
                'sexo',
                'fecha_nacimiento',
                'estado_civil',
                'direccion_actual',
                'ubigeo_actual',
                'ubigeo_nacimiento',
                'nombre_colegio',
                'tipo_colegio',
                'anio_termino_colegio',
                'ubigeo_colegio',
                'contacto_emergencia_nombre',
                'contacto_emergencia_telefono',
                'datos_pide'
            ]);
        });
    }
};
