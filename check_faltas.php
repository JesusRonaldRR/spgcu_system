<?php

use App\Models\ProgramacionComedor;
use Carbon\Carbon;

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$today = Carbon::today()->format('Y-m-d');
$now = Carbon::now()->format('H:i:s');

// 1. Días anteriores: Todo lo que esté 'programado' y sea de fecha < hoy es falta
$queryAntiguos = ProgramacionComedor::where('estado', 'programado')
    ->whereHas('menu', function ($q) use ($today) {
        $q->where('fecha', '<', $today);
    });

$pendientesAntiguos = (clone $queryAntiguos)->count();
$queryAntiguos->update(['estado' => 'falta']);

// 2. Hoy: Todo lo que esté 'programado' y su hora_fin ya pasó
$queryHoy = ProgramacionComedor::where('estado', 'programado')
    ->whereHas('menu', function ($q) use ($today, $now) {
        $q->where('fecha', $today)
            ->where('hora_fin', '<', $now);
    });

$pendientesHoy = (clone $queryHoy)->count();
$queryHoy->update(['estado' => 'falta']);

echo "=== PROCESADOR DE INASISTENCIAS AUTOMÁTICO ===\n";
echo "Faltas de días anteriores procesadas: $pendientesAntiguos\n";
echo "Faltas del día de hoy (turnos vencidos) procesadas: $pendientesHoy\n";
echo "----------------------------------------------\n";
echo "Total de inasistencias registradas: " . ($pendientesAntiguos + $pendientesHoy) . "\n";
echo "Fecha/Hora de ejecución: " . Carbon::now()->toDateTimeString() . "\n";
