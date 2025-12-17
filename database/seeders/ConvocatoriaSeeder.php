<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ConvocatoriaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('convocatorias')->insert([
            'nombre' => 'Comedor Universitario 2025-I',
            'fecha_inicio' => now(),
            'fecha_fin' => now()->addMonths(6),
            'esta_activa' => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        echo "Active Convocatoria seeded.\n";
    }
}
