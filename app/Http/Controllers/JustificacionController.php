<?php

namespace App\Http\Controllers;

use App\Models\Justificacion;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class JustificacionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $query = Justificacion::with('usuario');

        // Students see only their own
        if (auth()->user()->rol === 'estudiante') {
            $query->where('usuario_id', auth()->id());
        }

        $justificaciones = $query->latest()->get();

        return Inertia::render('Justificaciones/Index', [
            'justificaciones' => $justificaciones,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha_a_justificar' => 'required|date',
            'motivo' => 'required|string|max:500',
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $path = '';
        if ($request->hasFile('archivo')) {
            $path = $request->file('archivo')->store('justificaciones', 'public');
        }

        $justificacion = new Justificacion();
        $justificacion->usuario_id = auth()->id();
        $justificacion->fecha_a_justificar = $request->fecha_a_justificar;
        $justificacion->motivo = $request->motivo;
        $justificacion->ruta_archivo = $path;
        $justificacion->estado = 'pendiente';
        $justificacion->save();

        return back()->with('success', 'Justificación enviada correctamente.');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Justificacion $justificacion)
    {
        if (!in_array(auth()->user()->rol, ['admin', 'administrativo', 'coordinador'])) {
            abort(403);
        }

        $request->validate([
            'estado' => 'required|in:pendiente,aprobado,rechazado',
        ]);

        $justificacion->estado = $request->estado;
        $justificacion->save();

        // Sync with Programaciones if Approved
        if ($request->estado === 'aprobado') {
            // Update all 'falta' or 'programado' for that day to 'justificado'
            \App\Models\ProgramacionComedor::where('usuario_id', $justificacion->usuario_id)
                ->whereHas('menu', function ($q) use ($justificacion) {
                    $q->where('fecha', $justificacion->fecha_a_justificar);
                })
                ->whereIn('estado', ['programado', 'falta'])
                ->update(['estado' => 'justificado']);
        }

        return back()->with('success', 'Justificación actualizada.');
    }
}
