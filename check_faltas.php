<?php

use App\Models\ProgramacionComedor;
use Carbon\Carbon;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$today = Carbon::today()->format('Y-m-d');
$now = Carbon::now()->format('H:i:s');

// Buscar programaciones de DIAS ANTERIORES que sigan como 'programado'
$pendientesAntiguos = ProgramacionComedor::where('estado', 'programado')
    ->whereHas('menu', function ($q) use ($today) {
        $q->where('fecha', '<', $today);
    })
    ->count();

// Buscar programaciones de HOY que ya pasaron su hora y sigan como 'programado'
$pendientesHoy = ProgramacionComedor::where('estado', 'programado')
    ->whereHas('menu', function ($q) use ($today, $now) {
        $q->where('fecha', $today)
            ->where('hora_fin', '<', $now);
    })
    ->count();

echo "=== REPORTE DE FALTAS PENDIENTES ===\n";
echo "Faltas de días anteriores sin procesar: $pendientesAntiguos\n";
echo "Faltas de hoy (turno vencido) sin procesar: $pendientesHoy\n";
echo "---------------------------------------\n";
echo "Total a marcar como FALTA: " . ($pendientesAntiguos + $pendientesHoy) . "\n";
