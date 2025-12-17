<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        \App\Models\User::factory()->create([
            'nombres' => 'Admin',
            'apellidos' => 'Sistema',
            'email' => 'admin@unam.edu.pe',
            'password' => Hash::make('password'),
            'rol' => 'admin',
            'dni' => '00000000',
            'estado' => true,
        ]);

        echo "Admin User created: admin@unam.edu.pe / password\n";
    }
}
