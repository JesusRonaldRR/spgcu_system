<?php

namespace App\Http\Controllers;

use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ConvocatoriaController extends Controller
{
    public function index()
    {
        $convocatorias = Convocatoria::latest()->get();
        return Inertia::render('Admin/Convocatorias/Index', [
            'convocatorias' => $convocatorias
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'esta_activa' => 'required|boolean',
        ]);

        Convocatoria::create($validated);

        return back()->with('success', 'Convocatoria creada correctamente.');
    }

    public function update(Request $request, Convocatoria $convocatoria)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
            'esta_activa' => 'required|boolean',
        ]);

        $convocatoria->update($validated);

        return back()->with('success', 'Convocatoria actualizada correctamente.');
    }

    public function destroy(Convocatoria $convocatoria)
    {
        if ($convocatoria->postulaciones()->count() > 0) {
            return back()->withErrors(['error' => 'No se puede eliminar una convocatoria que ya tiene postulaciones.']);
        }

        $convocatoria->delete();

        return back()->with('success', 'Convocatoria eliminada correctamente.');
    }
}
