<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BienestarUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if bienestar users exists
        $user = User::where('email', 'bienestar@unam.edu.pe')->first();

        if (!$user) {
            User::create([
                'nombres' => 'Trabajadora',
                'apellidos' => 'Social',
                'email' => 'bienestar@unam.edu.pe',
                'password' => Hash::make('password'),
                'rol' => 'administrativo',
                'dni' => '11112222',
                'telefono' => '999888777',
                'estado' => true,
            ]);
            echo "Bienestar user created (DNI: 11112222).\n";
        } else {
            $user->dni = '11112222';
            $user->rol = 'administrativo';
            $user->save();
            echo "Bienestar user updated (DNI: 11112222).\n";
        }
    }
}
