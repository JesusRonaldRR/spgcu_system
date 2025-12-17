<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class StudentUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if student exists
        $student = User::where('email', 'student@unam.edu.pe')->first();

        if (!$student) {
            User::create([
                'nombres' => 'Juan',
                'apellidos' => 'Perez Estudiante',
                'email' => 'student@unam.edu.pe',
                'password' => Hash::make('password'),
                'rol' => 'estudiante',
                'codigo' => '20230001',
                'dni' => '87654321', // Easy DNI for login
                'telefono' => '987654321',
                'estado' => true,
            ]);
            echo "Student user created (DNI: 87654321).\n";
        } else {
            // Update DNI just in case
            $student->dni = '87654321';
            $student->save();
            echo "Student user updated (DNI: 87654321).\n";
        }
    }
}
