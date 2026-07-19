<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use App\Models\ProgramacionComedor;
use App\Models\Postulacion;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class PronosticoController extends Controller
{
    public function index(Request $request)
    {
        $fecha = $request->input('fecha', Carbon::tomorrow()->format('Y-m-d'));

        // 1. Get Menus for that date
        $menus = Menu::whereDate('fecha', $fecha)->get();

        // 2. Get total number of active beneficiaries
        $totalBecarios = Postulacion::where('estado', 'becario')->count();

        $pronosticos = [];

        foreach (['desayuno', 'almuerzo', 'cena'] as $tipo) {
            $menu = $menus->where('tipo', $tipo)->first();

            if ($menu) {
                // A. CONFIRMADOS (60% weights this - Formula uses 100% of confirmed)
                $confirmados = ProgramacionComedor::where('menu_id', $menu->id)
                    ->where('confirmado', true)
                    ->count();

                // RESERVADOS NO CONFIRMADOS (Still expected but less weight in real forecast, but here we treat them as 'regular' unconfirmed)
                $reservadosNoConfirmados = ProgramacionComedor::where('menu_id', $menu->id)
                    ->where('confirmado', false)
                    ->count();

                // B. ESTIMADO NO CONFIRMADOS (30% weight)
                // We take (Total Becarios - Confirmados) and assume 30% will show up
                $noConfirmados = max(0, $totalBecarios - $confirmados);
                $estimadoNoConfirmados = round($noConfirmados * 0.30);

                // C. CALCULO FINAL: (Confirmados * 1.0) + (NoConfirmados * 0.30)
                // Then we apply a 10% safety buffer to the total
                $base = $confirmados + $estimadoNoConfirmados;
                $buffer = round($base * 0.10);

                $totalProyectado = $base + $buffer;

                $pronosticos[$tipo] = [
                    'menu_id' => $menu->id,
                    'descripcion' => $menu->descripcion,
                    'reservas' => $confirmados, // Shown as confirmed in UI
                    'estimado_no_reservados' => $estimadoNoConfirmados,
                    'buffer' => $buffer,
                    'total_proyectado' => $totalProyectado,
                    'limite_raciones' => $totalBecarios
                ];
            } else {
                $pronosticos[$tipo] = null;
            }
        }

        return Inertia::render('Admin/Pronostico/Index', [
            'fecha' => $fecha,
            'pronosticos' => $pronosticos,
            'totalBecarios' => $totalBecarios
        ]);
    }
}
