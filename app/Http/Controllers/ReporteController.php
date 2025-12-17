<?php

namespace App\Http\Controllers;

use App\Models\Asistencia;
use App\Models\Postulacion;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ReporteController extends Controller
{
    /**
     * Report for Bienestar Universitario: Focalización
     */
    public function focalizacion()
    {
        // Get all postulations with student data, ordered by score (puntaje)
        $postulaciones = Postulacion::with('estudiante')
            ->orderBy('puntaje', 'desc')
            ->get();

        return Inertia::render('Reports/Focalizacion', [
            'postulaciones' => $postulaciones,
            'stats' => [
                'total' => $postulaciones->count(),
                'aprobados' => $postulaciones->where('estado', 'aprobado')->count(),
                'pendientes' => $postulaciones->where('estado', 'pendiente')->count(),
                'rechazados' => $postulaciones->where('estado', 'rechazado')->count(),
            ]
        ]);
    }

    /**
     * Report for Admin: Comedor Attendance Stats
     */
    public function comedor()
    {
        // Daily attendance count for the last 7 days
        $dailyStats = Asistencia::select(DB::raw('DATE(fecha_hora_escaneo) as date'), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        // Meal type distribution (Total)
        $mealStats = Asistencia::select('tipo_menu', DB::raw('count(*) as count'))
            ->groupBy('tipo_menu')
            ->get();

        // Recent activity
        $recentActivity = Asistencia::with('estudiante')
            ->orderBy('fecha_hora_escaneo', 'desc')
            ->limit(10)
            ->get();

        return Inertia::render('Reports/Comedor', [
            'dailyStats' => $dailyStats,
            'mealStats' => $mealStats,
            'recentActivity' => $recentActivity
        ]);
    }
}
