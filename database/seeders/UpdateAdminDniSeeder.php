<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\User;

class UpdateAdminDniSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::where('email', 'admin@unam.edu.pe')->first();

        if ($admin) {
            $admin->dni = '12345678';
            $admin->save();
            echo "Admin DNI updated to 12345678.\n";
        } else {
            echo "Admin user not found.\n";
        }
    }
}
