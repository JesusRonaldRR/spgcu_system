<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Postulacion;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AsistenciaController extends Controller
{
    /**
     * Display the scanner view (for dining staff).
     */
    public function scanner()
    {
        // Only allow authorized roles (e.g., admin, cocina)
        // This middleware check should be handled in routes, but good to keep in mind
        return Inertia::render('Asistencia/Scanner');
    }

    /**
     * Display the student's QR code view.
     */
    public function myQr(Request $request)
    {
        $user = $request->user();

        // Find the active approved postulation for this user (must be becario)
        $postulacion = Postulacion::where('usuario_id', $user->id)
            ->where('estado', 'becario')
            ->whereHas('convocatoria', function ($query) {
                $query->where('esta_activa', true);
            })
            ->first();

        // Find if there is an active menu right now
        $now = Carbon::now();
        $currentTime = $now->format('H:i:s');
        $activeMenu = \App\Models\Menu::where('fecha', $now->toDateString())
            ->where('hora_inicio', '<=', $currentTime)
            ->where('hora_fin', '>=', $currentTime)
            ->first();

        return Inertia::render('Asistencia/MyQR', [
            'hasPostulation' => (bool) $postulacion,
            'qrHash' => $postulacion ? $postulacion->hash_qr : null,
            'user' => $user->only('nombres', 'apellidos', 'codigo', 'dni'),
            'activeMenu' => $activeMenu,
            'serverTime' => $currentTime
        ]);
    }

    /**
     * Store a new attendance record via QR scan.
     */
    public function store(Request $request)
    {
        $request->validate([
            'hash_qr' => 'required|string',
        ]);

        $hash = $request->input('hash_qr');

        // 1. Find the postulation associated with this hash (must be becario)
        $postulacion = Postulacion::where('hash_qr', $hash)
            ->where('estado', 'becario')
            ->with('usuario')
            ->first();

        if (!$postulacion) {
            return response()->json(['message' => 'Código QR inválido o estudiante no es beneficiario.'], 404);
        }

        // 2. Find Active Menu for NOW
        $now = Carbon::now();
        $currentTime = $now->format('H:i:s');
        $todayDate = $now->toDateString();

        // Check if there is a menu active at this moment
        $menuActivo = \App\Models\Menu::where('fecha', $todayDate)
            ->where('hora_inicio', '<=', $currentTime)
            ->where('hora_fin', '>=', $currentTime)
            ->first();

        if (!$menuActivo) {
             return response()->json(['message' => 'No hay servicio de comedor activo en este horario.'], 403);
        }

        // Check if student has a reservation or auto-create it (as per requirement: "automatically subscribed")
        $programacion = \App\Models\ProgramacionComedor::where('usuario_id', $postulacion->usuario_id)
            ->where('menu_id', $menuActivo->id)
            ->first();

        if (!$programacion) {
            // Auto-subscribe student since they are a beneficiary and scanning during the window
            $programacion = \App\Models\ProgramacionComedor::create([
                'usuario_id' => $postulacion->usuario_id,
                'menu_id' => $menuActivo->id,
                'estado' => 'programado'
            ]);
        }

        if ($programacion->estado === 'asistio') {
            return response()->json(['message' => "Ya registró asistencia para " . ucfirst($programacion->menu->tipo) . "."], 409);
        }

        // 3. Record attendance
        \Illuminate\Support\Facades\DB::transaction(function () use ($postulacion, $now, $programacion) {
            Asistencia::create([
                'usuario_id' => $postulacion->usuario_id,
                'fecha_hora_escaneo' => $now,
                'tipo_menu' => $programacion->menu->tipo,
                'estado' => 'presente',
            ]);

            $programacion->estado = 'asistio';
            $programacion->save();
        });

        // 4. Fetch today's confirmed attendance for this user
        $todayAttendance = Asistencia::where('usuario_id', $postulacion->usuario_id)
            ->whereDate('fecha_hora_escaneo', $todayDate)
            ->orderBy('fecha_hora_escaneo', 'asc')
            ->get()
            ->map(function ($record) {
                return [
                    'tipo' => ucfirst($record->tipo_menu),
                    'hora' => Carbon::parse($record->fecha_hora_escaneo)->format('H:i A'),
                ];
            });

        return response()->json([
            'message' => 'Asistencia registrada correctamente.',
            'student' => $postulacion->usuario->nombres . ' ' . $postulacion->usuario->apellidos,
            'menu' => ucfirst($programacion->menu->tipo),
            'history' => $todayAttendance
        ]);


    }
    /**
     * Show the list of scheduled students for today.
     */
    public function todayList()
    {
        $today = Carbon::today();

        $reservations = \App\Models\ProgramacionComedor::with(['usuario', 'menu'])
            ->whereHas('menu', function ($q) use ($today) {
                $q->whereDate('fecha', $today);
            })
            ->get()
            ->groupBy(function ($item) {
                return $item->menu->tipo;
            });

        // Fetch all menus for today to check expiration times even if no students are scheduled
        $menus = \App\Models\Menu::whereDate('fecha', $today)->get()->keyBy('tipo');

        return Inertia::render('Asistencia/TodayList', [
            'date' => $today->format('d/m/Y'),
            'serverTime' => Carbon::now()->format('H:i:s'),
            'reservations' => $reservations,
            'menus' => $menus,
        ]);
    }

    /**
     * Toggle attendance status manually (for admin list).
     */
    public function toggleAttendance(Request $request, $programacionId)
    {
        $programacion = \App\Models\ProgramacionComedor::with('menu')->findOrFail($programacionId);
        $asistio = $request->input('asistio'); // true or false

        \Illuminate\Support\Facades\DB::transaction(function () use ($programacion, $asistio) {
            if ($asistio) {
                // Mark as attended
                if ($programacion->estado !== 'asistio') {
                    $programacion->estado = 'asistio';
                    $programacion->save();

                    // Create attendance record if not exists
                    Asistencia::firstOrCreate([
                        'usuario_id' => $programacion->usuario_id,
                        'fecha_hora_escaneo' => Carbon::now(), // Use current time for manual mark
                        'tipo_menu' => $programacion->menu->tipo,
                    ], [
                        'estado' => 'presente', // Must be a valid enum value
                    ]);
                }
            } else {
                // Mark as not attended (revert to programado)
                // Only allowed if it was 'asistio'
                if ($programacion->estado === 'asistio') {
                    $programacion->estado = 'programado';
                    $programacion->save();

                    // Remove attendance record for this day/menu
                    // We need to be careful to match the right one
                    // We find one that matches user, date, and type
                    Asistencia::where('usuario_id', $programacion->usuario_id)
                        ->whereDate('fecha_hora_escaneo', $programacion->menu->fecha)
                        ->where('tipo_menu', $programacion->menu->tipo)
                        ->delete();
                }
            }
        });

        return back()->with('success', 'Estado de asistencia actualizado.');
    }

    /**
     * Export today's attendance to Excel (HTML Table).
     */
    public function exportar()
    {
        $today = Carbon::today();

        $reservations = \App\Models\ProgramacionComedor::with(['usuario', 'menu'])
            ->whereHas('menu', function ($q) use ($today) {
                $q->whereDate('fecha', $today);
            })
            ->orderBy('menu_id')
            ->get();

        $filename = 'ASISTENCIA_' . $today->format('Y_m_d') . '.xls';

        $headers = [
            'Content-Type' => 'application/vnd.ms-excel; charset=UTF-8',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            'Pragma' => 'no-cache',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($reservations, $today) {
            echo '<html><head><meta charset="UTF-8"></head><body>';
            echo '<h2>Lista de Asistencia - ' . $today->format('d/m/Y') . '</h2>';
            echo '<table border="1" cellpadding="5">';
            echo '<tr style="background:#ddd;"><th>Estudiante</th><th>Código</th><th>Escuela</th><th>Menú</th><th>Estado</th></tr>';

            foreach ($reservations as $r) {
                $estado = strtoupper($r->estado);
                $color = $r->estado === 'asistio' ? '#c6efce' : ($r->estado === 'falta' ? '#ffc7ce' : '#fff');
                echo "<tr style='background:{$color};'>";
                echo "<td>{$r->usuario->apellidos}, {$r->usuario->nombres}</td>";
                echo "<td>{$r->usuario->codigo}</td>";
                echo "<td>" . ($r->usuario->escuela ?? '-') . "</td>";
                echo "<td>" . ucfirst($r->menu->tipo) . "</td>";
                echo "<td><b>{$estado}</b></td>";
                echo "</tr>";
            }

            echo '</table></body></html>';
        }, 200, $headers);
    }
    /**
     * Process faults manually.
     */
    public function procesarFaltas()
    {
        try {
            \Illuminate\Support\Facades\Artisan::call('comedor:marcar-inasistencias', ['--realtime' => true]);
            $output = \Illuminate\Support\Facades\Artisan::output();
            return back()->with('success', 'Proceso de faltas ejecutado correctamente (Real-time).');
        } catch (\Exception $e) {
            return back()->withErrors(['message' => 'Error al procesar faltas: ' . $e->getMessage()]);
        }
    }
}
