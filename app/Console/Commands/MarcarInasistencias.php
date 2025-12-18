<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\ProgramacionComedor;
use App\Models\Menu;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MarcarInasistencias extends Command
{
    protected $signature = 'comedor:marcar-inasistencias {--realtime : Procesa menus que ya terminaron HOY}';
    protected $description = 'Procesa las reservas pasadas: perdona si asistió al menos una vez, marca falta si no asistió a nada.';

    public function handle()
    {
        $realtimeMode = $this->option('realtime');

        if ($realtimeMode) {
            $this->info("Modo en tiempo real: Procesando menus terminados HOY.");
            $this->processEndedMenusToday();
        } else {
            // Standard Mode: Process yesterday (full day)
            $targetDate = Carbon::yesterday();
            $dateStr = $targetDate->format('Y-m-d');
            $this->info("Procesando inasistencias para: {$dateStr}");
            $this->processFullDay($dateStr, $targetDate);
        }

        return Command::SUCCESS;
    }

    /**
     * Process menus that have ended TODAY (realtime mode).
     * For each menu where hora_fin < NOW, mark 'programado' as 'falta'.
     */
    private function processEndedMenusToday()
    {
        $now = Carbon::now();
        $todayDate = $now->toDateString();
        $currentTime = $now->format('H:i:s');

        // Find all menus for TODAY where hora_fin has passed
        $endedMenus = Menu::whereDate('fecha', $todayDate)
            ->where('hora_fin', '<', $currentTime)
            ->get();

        if ($endedMenus->isEmpty()) {
            $this->info("No hay menus terminados para procesar.");
            return;
        }

        foreach ($endedMenus as $menu) {
            $this->info("Procesando menu terminado: {$menu->tipo} ({$menu->hora_inicio} - {$menu->hora_fin})");

            // Find all 'programado' reservations for this specific menu
            $pending = ProgramacionComedor::where('menu_id', $menu->id)
                ->where('estado', 'programado')
                ->get();

            foreach ($pending as $programacion) {
                $programacion->estado = 'falta';
                $programacion->save();
                $this->warn("  User {$programacion->usuario_id}: Marcado FALTA para {$menu->tipo}.");
            }
        }

        // Check suspensions for affected users
        $affectedUserIds = ProgramacionComedor::whereIn('menu_id', $endedMenus->pluck('id'))
            ->where('estado', 'falta')
            ->distinct()
            ->pluck('usuario_id');

        $this->checkSuspensions($affectedUserIds);
    }

    /**
     * Process a full day (used for previous days, runs at night/morning after day ends).
     */
    private function processFullDay($dateStr, $targetDate)
    {
        $userIds = ProgramacionComedor::where('estado', 'programado')
            ->whereHas('menu', function ($q) use ($targetDate) {
                $q->whereDate('fecha', $targetDate);
            })
            ->distinct()
            ->pluck('usuario_id');

        foreach ($userIds as $userId) {
            $this->processUserDay($userId, $dateStr);
        }

        $this->checkSuspensions($userIds);
    }

    private function processUserDay($userId, $dateStr)
    {
        // Check if they attended AT LEAST ONE meal this day
        $attendedCount = ProgramacionComedor::where('usuario_id', $userId)
            ->where('estado', 'asistio')
            ->whereHas('menu', function ($q) use ($dateStr) {
                $q->whereDate('fecha', $dateStr);
            })
            ->count();

        // Target both 'programado' (not yet processed) and 'falta' (marked by realtime today)
        $unattendedQuery = ProgramacionComedor::where('usuario_id', $userId)
            ->whereIn('estado', ['programado', 'falta'])
            ->whereHas('menu', function ($q) use ($dateStr) {
                $q->whereDate('fecha', $dateStr);
            });

        if ($attendedCount > 0) {
            // FORGIVE: If they attended once, we clean up the rest of the day (no fault)
            $cleaned = $unattendedQuery->delete();
            if ($cleaned > 0) {
                $this->info("User {$userId}: Asistió {$attendedCount} veces. Se perdonaron {$cleaned} inasistencias del día {$dateStr}.");
            }
        } else {
            // ABSENT: If they attended ZERO meals but HAD reservations, mark as 'falta'
            $updated = $unattendedQuery->update(['estado' => 'falta']);
            if ($updated > 0) {
                $this->warn("User {$userId}: NO asistió a nada. Se marcaron {$updated} FALTAS para el día {$dateStr}.");
            }
        }
    }

    private function checkSuspensions($userIds)
    {
        foreach ($userIds as $userId) {
            $user = User::find($userId);
            if (!$user)
                continue;

            // Count total accumulated faults
            $faults = ProgramacionComedor::where('usuario_id', $userId)
                ->where('estado', 'falta')
                ->count();

            if ($faults >= 3) {
                if ($user->estado !== 'suspendido') {
                    $user->estado = 'suspendido';
                    $user->save();
                    $this->error("User #{$userId} ({$user->codigo}): SUSPENDIDO por acumular {$faults} faltas.");
                    Log::warning("User #{$userId} suspended automatically by system due to {$faults} faults.");
                } else {
                    $this->info("User #{$userId}: Ya se encuentra suspendido ({$faults} faltas).");
                }
            } else {
                $this->info("User #{$userId}: Tiene {$faults} faltas acumuladas.");
            }
        }
    }
}
