<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Postulacion;

class OtrosServiciosController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Check if user is a current beneficiary
        $isBeneficiary = Postulacion::where('usuario_id', $user->id)
            ->where('estado', 'becario')
            ->exists();

        if (!$isBeneficiary && $user->rol === 'estudiante') {
            return redirect()->route('dashboard')->withErrors(['error' => 'Acceso restringido a beneficiarios.']);
        }

        // Fetch User's requests
        $misSolicitudes = \App\Models\CitaServicio::where('usuario_id', $user->id)->latest()->get();

        // Invented services configuration
        $servicios = [
            [
                'id' => 1,
                'nombre' => 'Pediatría',
                'descripcion' => 'Atención médica pediátrica para hijos de estudiantes. Disponible solo presencialmente en el Centro de Salud Universitario.',
                'modalidad' => 'Presencial',
                'horario' => 'Lunes a Viernes, 8:00 AM - 1:00 PM',
                'requisitos' => ['DNI del menor', 'Carnet de vacunación']
            ],
            [
                'id' => 2,
                'nombre' => 'Asesoría Nutricional',
                'descripcion' => 'Evaluación y plan nutricional personalizado para estudiantes beneficiarios del comedor.',
                'modalidad' => 'Híbrido (Presencial/Virtual)',
                'horario' => 'Martes y Jueves, 2:00 PM - 5:00 PM',
                'requisitos' => ['Solicitud previa']
            ],
            [
                'id' => 3,
                'nombre' => 'Apoyo Psicológico Extraordinario',
                'descripcion' => 'Sesiones de terapia adicionales para manejo de estrés académico.',
                'modalidad' => 'Virtual',
                'horario' => 'Previa cita',
                'requisitos' => ['Ser beneficiario activo']
            ],
            [
                'id' => 4,
                'nombre' => 'Taller de Habilidades Blandas',
                'descripcion' => 'Talleres mensuales para desarrollo de liderazgo y comunicación.',
                'modalidad' => 'Presencial',
                'horario' => 'Sábados 9:00 AM',
                'requisitos' => ['Inscripción formulario']
            ]
        ];

        return Inertia::render('OtrosServicios/Index', [
            'servicios' => $servicios,
            'misSolicitudes' => $misSolicitudes
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'servicio' => 'required|string',
            'motivo' => 'required|string|max:255', // Now required
            'modalidad' => 'nullable|string|in:Presencial,Virtual'
        ]);

        \App\Models\CitaServicio::create([
            'usuario_id' => auth()->id(),
            'servicio' => $request->servicio,
            'modalidad' => $request->modalidad, // Save Modality
            'motivo' => $request->motivo,
            'estado' => 'solicitado'
        ]);

        return back()->with('success', 'Servicio solicitado correctamente. Espere la programación.');
    }

    // --- ADMIN METHODS ---

    public function adminIndex()
    {
        // Admins only
        $solicitudes = \App\Models\CitaServicio::with('usuario')->latest()->get();
        return Inertia::render('OtrosServicios/AdminIndex', [
            'solicitudes' => $solicitudes
        ]);
    }

    public function update(Request $request, $id)
    {
        $cita = \App\Models\CitaServicio::findOrFail($id);

        $request->validate([
            'fecha' => 'nullable|date',
            'hora' => 'nullable',
            'estado' => 'required|in:solicitado,programada,completada,cancelada',
            'admin_notes' => 'nullable|string'
        ]);

        $cita->update($request->all());

        return back()->with('success', 'Solicitud actualizada correctamente.');
    }

    public function destroy($id)
    {
        $cita = \App\Models\CitaServicio::findOrFail($id);
        $cita->delete();
        return back()->with('success', 'Solicitud eliminada.');
    }
}
