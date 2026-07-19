<?php

namespace Tests\Feature;

use App\Models\Convocatoria;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PostulacionScoreTest extends TestCase
{
    use RefreshDatabase;

    public function test_score_is_calculated_on_store()
    {
        Storage::fake('public');

        $user = User::factory()->create(['rol' => 'estudiante']);
        $convocatoria = Convocatoria::create([
            'nombre' => 'Test Convocatoria',
            'fecha_inicio' => now()->subDay(),
            'fecha_fin' => now()->addDay(),
            'esta_activa' => true,
        ]);

        $indicadores = [
            'vivienda' => 'quinta',      // 20
            'salud' => 'cronica',       // 20
            'alimentacion' => 'deficiente', // 20
            'dependencia' => 'total'     // 20
        ];

        $response = $this->actingAs($user)->post(route('postulaciones.store'), [
            'convocatoria_id' => $convocatoria->id,
            'ingreso_familiar' => 500,
            'numero_miembros' => 5,
            'condicion_vivienda' => 'quinta',
            'fundamentacion' => 'Necesito la beca.',
            'ficha_socioeconomica' => UploadedFile::fake()->create('ficha.pdf', 100),
            'boletas_pago' => UploadedFile::fake()->create('boletas.pdf', 100),
            'recibo_luz' => UploadedFile::fake()->create('recibo.pdf', 100),
            'croquis' => UploadedFile::fake()->create('croquis.pdf', 100),
            'dj_pronabec' => UploadedFile::fake()->create('dj.pdf', 100),
            'firma_digital' => UploadedFile::fake()->image('firma.png'),
            'indicadores' => json_encode($indicadores),
        ]);

        if ($response->status() !== 302) {
            dump($response->exception?->getMessage());
        }

        $response->assertRedirect(route('postulaciones.index'));

        $this->assertDatabaseHas('postulaciones', [
            'usuario_id' => $user->id,
            'puntaje' => 80, // 20 + 20 + 20 + 20
        ]);
    }

    public function test_score_calculation_with_different_values()
    {
        Storage::fake('public');

        $user = User::factory()->create(['rol' => 'estudiante']);
        $convocatoria = Convocatoria::create([
            'nombre' => 'Test Convocatoria 2',
            'fecha_inicio' => now()->subDay(),
            'fecha_fin' => now()->addDay(),
            'esta_activa' => true,
        ]);

        $indicadores = [
            'vivienda' => 'propia',      // 5
            'salud' => 'buena',         // 5
            'alimentacion' => 'completa', // 10
            'dependencia' => 'independiente' // 10
        ];

        $response = $this->actingAs($user)->post(route('postulaciones.store'), [
            'convocatoria_id' => $convocatoria->id,
            'ingreso_familiar' => 2000,
            'numero_miembros' => 2,
            'condicion_vivienda' => 'propia',
            'fundamentacion' => 'Solicito la beca.',
            'ficha_socioeconomica' => UploadedFile::fake()->create('ficha.pdf', 100),
            'boletas_pago' => UploadedFile::fake()->create('boletas.pdf', 100),
            'recibo_luz' => UploadedFile::fake()->create('recibo.pdf', 100),
            'croquis' => UploadedFile::fake()->create('croquis.pdf', 100),
            'dj_pronabec' => UploadedFile::fake()->create('dj.pdf', 100),
            'firma_digital' => UploadedFile::fake()->image('firma.png'),
            'indicadores' => json_encode($indicadores),
        ]);

        $response->assertRedirect(route('postulaciones.index'));

        $this->assertDatabaseHas('postulaciones', [
            'usuario_id' => $user->id,
            'puntaje' => 30, // 5 + 5 + 10 + 10
        ]);
    }
}
