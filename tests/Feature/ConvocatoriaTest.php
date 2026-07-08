<?php

namespace Tests\Feature;

use App\Models\Convocatoria;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ConvocatoriaTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_convocatorias_index(): void
    {
        $admin = User::factory()->create(['rol' => 'admin']);

        $response = $this->actingAs($admin)->get(route('admin.convocatorias.index'));

        $response->assertStatus(200);
    }

    public function test_student_cannot_access_convocatorias_index(): void
    {
        $student = User::factory()->create(['rol' => 'estudiante']);

        $response = $this->actingAs($student)->get(route('admin.convocatorias.index'));

        $response->assertStatus(302); // Redirects to dashboard with error
        $response->assertRedirect(route('dashboard'));
    }

    public function test_admin_can_create_convocatoria(): void
    {
        $admin = User::factory()->create(['rol' => 'admin']);

        $response = $this->actingAs($admin)->post(route('admin.convocatorias.store'), [
            'nombre' => 'Convocatoria 2026-I',
            'fecha_inicio' => now()->toDateString(),
            'fecha_fin' => now()->addMonth()->toDateString(),
            'esta_activa' => true,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('convocatorias', ['nombre' => 'Convocatoria 2026-I']);
    }
}
