<?php

namespace App\Http\Controllers;

use App\Models\Entrevista;
use App\Models\Postulacion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class EntrevistaController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        if ($user->rol === 'estudiante') {
            // Check if student has a postulation ready for interview OR history
            $postulaciones = Postulacion::where('usuario_id', $user->id)
                ->whereIn('estado', ['apto_entrevista', 'entrevista_programada', 'becario', 'rechazado'])
                ->with('entrevista.psicologo')
                ->latest()
                ->get();

            $activePostulacion = $postulaciones->first(function ($p) {
                return in_array($p->estado, ['apto_entrevista', 'entrevista_programada']);
            });

            $history = $postulaciones->filter(function ($p) {
                return $p->entrevista !== null; // Only show where interview existed
            })->values();

            $isBeneficiary = $postulaciones->contains('estado', 'becario');

            return Inertia::render('Citas/Index', [
                'activePostulacion' => $activePostulacion,
                'entrevista' => $activePostulacion ? $activePostulacion->entrevista : null,
                'history' => $history,
                'isBeneficiary' => $isBeneficiary
            ]);
        }

        // Admin/Psicologo view: List all interviews AND pending postulations
        $entrevistas = Entrevista::with(['postulacion.usuario', 'psicologo'])
            ->latest()
            ->get();

        $postulacionesPorProgramar = Postulacion::where('estado', 'apto_entrevista')
            ->with('usuario')
            ->latest()
            ->get();

        // [NEW] Fetch Other Services Requests for Consolidated Admin Panel
        $solicitudesServicios = \App\Models\CitaServicio::with('usuario')->latest()->get();

        return Inertia::render('Citas/Index', [
            'entrevistas' => $entrevistas,
            'postulacionesPorProgramar' => $postulacionesPorProgramar,
            'solicitudesServicios' => $solicitudesServicios // Pass to view
        ]);
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        if ($user->rol === 'estudiante') {
            abort(403, 'Los estudiantes no pueden programar sus propias citas.');
        }

        $request->validate([
            'postulacion_id' => 'required|exists:postulaciones,id',
            'fecha' => 'required|date|after_or_equal:today',
            'hora' => 'required',
            'tipo' => 'required|in:presencial,virtual',
            'link_reunion' => 'nullable|url|required_if:tipo,virtual',
        ]);

        $postulacion = Postulacion::findOrFail($request->postulacion_id);

        if ($postulacion->estado !== 'apto_entrevista') {
            return back()->withErrors(['error' => 'Esta postulación no está lista para entrevista o ya tiene una programada.']);
        }

        $entrevista = Entrevista::create([
            'postulacion_id' => $postulacion->id,
            'psicologo_id' => $user->id, // The admin/user scheduling it is assigned as interviewer for now
            'fecha' => $request->fecha,
            'hora' => $request->hora,
            'tipo' => $request->tipo,
            'link_reunion' => $request->link_reunion,
            'estado' => 'programada',
            'lugar' => $request->tipo === 'virtual' ? 'Plataforma Virtual' : 'Consultorio Bienestar Universitario'
        ]);

        $postulacion->estado = 'entrevista_programada';
        $postulacion->save();

        return back()->with('success', 'Entrevista programada correctamente.');
    }

    public function update(Request $request, Entrevista $entrevista)
    {
        if (auth()->user()->rol === 'estudiante') {
            abort(403);
        }

        if ($entrevista->estado !== 'programada') {
            return back()->withErrors(['error' => 'No se puede modificar una entrevista que ya ha sido finalizada o procesada.']);
        }

        $request->validate([
            'estado' => 'required|in:pendiente,programada,completada,no_asistio',
            'resultado' => 'nullable|in:apto,no_apto',
            'tipo' => 'nullable|in:presencial,virtual',
            'link_reunion' => 'nullable|url',
            'observaciones' => 'nullable|string'
        ]);

        // Only update fields that are actually sent
        $fieldsToUpdate = ['estado', 'resultado', 'observaciones'];
        if ($request->has('tipo')) {
            $fieldsToUpdate[] = 'tipo';
        }
        if ($request->has('link_reunion')) {
            $fieldsToUpdate[] = 'link_reunion';
        }
        if (!$entrevista->postulacion) {
            $entrevista->load('postulacion');
        }

        if (!$entrevista->postulacion) {
            return back()->withErrors(['error' => 'No se encontró la postulación asociada a esta entrevista.']);
        }

        // Sync postulation status based on interview outcome
        try {
            DB::transaction(function () use ($request, $entrevista, $fieldsToUpdate) {
                // 1. Update Entrevista
                $entrevista->update($request->only($fieldsToUpdate));

                // 2. Update Postulacion based on result
                if ($request->resultado === 'apto') {
                    $entrevista->postulacion->aprobarComoBecario();
                } elseif ($request->resultado === 'no_apto') {
                    $entrevista->postulacion->rechazar();
                } elseif ($request->estado === 'no_asistio') {
                    // No-show = Automatic rejection
                    $entrevista->postulacion->rechazar();
                }
            });
            \Log::info('Interview and Postulation updated successfully in transaction');

        } catch (\Exception $e) {
            \Log::error('Error updating interview/postulation: ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return back()->withErrors(['error' => 'Error al procesar la evaluación: ' . $e->getMessage()]);
        }

        return back()->with('success', 'Entrevista actualizada correctamente.');
    }
}
