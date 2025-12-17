<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProgramacionComedor;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class MarcarFaltas extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'comedor:marcar-faltas';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Marca como FALTA las programaciones de comedor vencidas que no registraron asistencia.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $today = Carbon::today()->format('Y-m-d');
        $now = Carbon::now()->format('H:i:s');

        $this->info("Iniciando proceso de marcado de faltas...");
        $this->info("Fecha: $today, Hora límite actual: $now");

        DB::transaction(function () use ($today, $now) {
            // 1. Días anteriores
            $antiguos = ProgramacionComedor::where('estado', 'programado')
                ->whereHas('menu', function ($q) use ($today) {
                    $q->where('fecha', '<', $today);
                })
                ->update(['estado' => 'falta']);

            if ($antiguos > 0) {
                $this->info("Se marcaron $antiguos faltas de días anteriores.");
            }

            // 2. Día actual (turnos vencidos)
            $hoyVencidos = ProgramacionComedor::where('estado', 'programado')
                ->whereHas('menu', function ($q) use ($today, $now) {
                    $q->where('fecha', $today)
                        ->where('hora_fin', '<', $now);
                })
                ->update(['estado' => 'falta']);

            if ($hoyVencidos > 0) {
                $this->info("Se marcaron $hoyVencidos faltas del día de hoy (turnos finalizados).");
            }

            if ($antiguos == 0 && $hoyVencidos == 0) {
                $this->info("No se encontraron programaciones vencidas pendientes.");
            }
        });

        $this->info("Proceso finalizado correctamente.");
    }
}
