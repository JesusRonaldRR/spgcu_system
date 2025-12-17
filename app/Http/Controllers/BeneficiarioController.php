<?php

namespace App\Http\Controllers;

use App\Models\Postulacion;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BeneficiarioController extends Controller
{
    /**
     * Display the list of beneficiaries (students with estado = 'becario').
     */
    public function index(Request $request)
    {
        $query = Postulacion::where('estado', 'becario')
            ->with(['usuario', 'convocatoria'])
            ->latest();

        // Optional search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('usuario', function ($q) use ($search) {
                $q->where('nombres', 'like', "%{$search}%")
                    ->orWhere('apellidos', 'like', "%{$search}%")
                    ->orWhere('codigo', 'like', "%{$search}%")
                    ->orWhere('dni', 'like', "%{$search}%");
            });
        }

        $beneficiarios = $query->withCount([
            'programacionesComedor as faltas_count' => function ($q) {
                $q->where('estado', 'falta');
            }
        ])->paginate(25);

        return Inertia::render('Admin/Beneficiarios/Index', [
            'beneficiarios' => $beneficiarios,
            'filters' => $request->only(['search']),
        ]);
    }

    /**
     * Export beneficiaries to CSV with improved format.
     */
    /**
     * Export beneficiaries to Excel (HTML format).
     */
    public function export()
    {
        $beneficiarios = Postulacion::where('estado', 'becario')
            ->with(['usuario', 'convocatoria'])
            ->withCount([
                'programacionesComedor as faltas_count' => function ($q) {
                    $q->where('estado', 'falta');
                },
                'programacionesComedor as asistencias_count' => function ($q) {
                    $q->where('estado', 'asistio');
                }
            ])
            ->orderBy('usuario_id', 'asc') // Order by user creation usually matches list
            ->get();

        $filename = 'REPORTE_BENEFICIARIOS_' . date('Y-m-d') . '.xls';

        return response(view('exports.beneficiarios', compact('beneficiarios')))
            ->header('Content-Type', 'application/vnd.ms-excel; charset=utf-8')
            ->header('Content-Disposition', "attachment; filename=\"$filename\"")
            ->header('Pragma', 'no-cache')
            ->header('Expires', '0');
    }

    /**
     * Get faults details for a user.
     */
    public function getFaults($userId)
    {
        $faults = \App\Models\ProgramacionComedor::where('usuario_id', $userId)
            ->where('estado', 'falta')
            ->with('menu')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($faults);
    }

    /**
     * Remove a fault manually.
     */
    public function removeFault($id)
    {
        $fault = \App\Models\ProgramacionComedor::findOrFail($id);

        // Log action (optional)
        // Check permissions (optional middleware handles this)

        // Reset to 'justificado' or delete? User said "quitar falta".
        // Setting to 'justificado' preserves history that they didn't go but it's excused.
        // Deleting implies it never happened. 'justificado' is safer.
        $fault->update(['estado' => 'justificado']);

        return back()->with('success', 'Falta removida (justificada) correctamente.');
    }

    /**
     * Revoke beneficiary status.
     */
    public function destroy($id)
    {
        $postulacion = Postulacion::findOrFail($id);
        $postulacion->estado = 'rechazado';
        $postulacion->save();
        return back()->with('success', 'Beneficio revocado correctamente.');
    }
}
