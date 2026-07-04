<?php

namespace App\Http\Controllers;

use App\Models\Postulacion;
use App\Models\Convocatoria;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostulacionController extends Controller
{
    public function index()
    {
        $query = Postulacion::with(['convocatoria', 'usuario', 'entrevista']);

        if (auth()->user()->rol === 'estudiante') {
            $query->where('usuario_id', auth()->id());
        }

        $postulaciones = $query->latest()->get();

        return Inertia::render('Postulaciones/Index', [
            'postulaciones' => $postulaciones,
        ]);
    }

    public function create()
    {
        $convocatorias = Convocatoria::where('esta_activa', true)
            ->whereDate('fecha_inicio', '<=', now())
            ->whereDate('fecha_fin', '>=', now())
            ->get();

        $existingPostulation = null;
        if ($convocatorias->isNotEmpty()) {
            $existingPostulation = Postulacion::where('usuario_id', auth()->id())
                ->whereIn('convocatoria_id', $convocatorias->pluck('id'))
                // Only block if active or approved-like state. Rejected can retry.
                ->whereIn('estado', ['pendiente', 'aprobado', 'apto_entrevista', 'entrevista_programada', 'becario'])
                ->first();
        }

        return Inertia::render('Postulaciones/Create', [
            'convocatorias' => $convocatorias,
            'existingPostulation' => $existingPostulation
        ]);
    }

    /**
     * Calcula el puntaje socioeconómico basado en los indicadores.
     * Basado en la rúbrica oficial de la UNAM.
     */
    private function calculateScore(array $indicadores)
    {
        $puntaje = 0;

        // 1. Vivienda
        $vivienda = $indicadores['vivienda'] ?? '';
        $puntaje += match ($vivienda) {
            'quinta'    => 20,
            'alquilada' => 15,
            'cedida'    => 10,
            'propia'    => 5,
            default     => 0,
        };

        // 2. Salud
        $salud = $indicadores['salud'] ?? '';
        $puntaje += match ($salud) {
            'cronica'   => 20,
            'frecuente' => 15,
            'estable'   => 10,
            'buena'     => 5,
            default     => 0,
        };

        // 3. Alimentación
        $alimentacion = $indicadores['alimentacion'] ?? '';
        $puntaje += match ($alimentacion) {
            'deficiente' => 20,
            'irregular'  => 15,
            'completa'   => 10,
            default      => 0,
        };

        // 4. Dependencia
        $dependencia = $indicadores['dependencia'] ?? '';
        $puntaje += match ($dependencia) {
            'total'         => 20,
            'parcial'       => 15,
            'independiente' => 10,
            default         => 0,
        };

        return $puntaje;
    }

    public function store(Request $request)
    {
        $request->validate([
            'convocatoria_id' => 'required|exists:convocatorias,id',
            'ingreso_familiar' => 'required|numeric|min:0',
            'numero_miembros' => 'required|integer|min:1',
            'condicion_vivienda' => 'required|string',
            'fundamentacion' => 'required|string|max:5000',
            'firma_digital' => 'required|file|mimes:jpg,jpeg,png,webp|max:10240',
            // Obligatorios
            'ficha_socioeconomica' => 'required|file|mimes:pdf|max:10240',
            'boletas_pago' => 'required|file|mimes:pdf|max:10240',
            'recibo_luz' => 'required|file|mimes:pdf|max:10240',
            'croquis' => 'required|file|mimes:pdf|max:10240',
            'dj_pronabec' => 'required|file|mimes:pdf|max:10240',
            // New Array Validation
            'anexos_adicionales' => 'nullable|array',
            'anexos_adicionales.*.tipo' => 'required_with:anexos_adicionales|string',
            'anexos_adicionales.*.especificacion' => 'nullable|string',
            'anexos_adicionales.*.archivo' => 'required_with:anexos_adicionales|file|mimes:pdf|max:10240',
            'indicadores' => 'required|string', // Comes as JSON string from React
        ]);

        $convocatoria = Convocatoria::findOrFail($request->convocatoria_id);
        $now = now();
        if ($now < $convocatoria->fecha_inicio || $now > $convocatoria->fecha_fin) {
            return back()->withErrors(['convocatoria_id' => 'La convocatoria no está vigente en este momento.']);
        }

        // Check for existing active postulation. Re-postulation allowed if previous was 'rechazado'.
        $existing = Postulacion::where('usuario_id', auth()->id())
            ->where('convocatoria_id', $request->convocatoria_id)
            ->whereIn('estado', ['pendiente', 'aprobado', 'apto_entrevista', 'entrevista_programada', 'becario'])
            ->first();

        if ($existing) {
            return back()->withErrors(['convocatoria_id' => 'Ya tienes una postulación activa para esta convocatoria.']);
        }

        $archivos = [];

        // Helper to store file
        $storeFile = function ($key, $folder) use ($request, &$archivos) {
            if ($request->hasFile($key)) {
                $path = $request->file($key)->store($folder, 'public');
                $archivos[$key] = $path;
            }
        };

        $storeFile('ficha_socioeconomica', 'postulaciones/fichas');
        $storeFile('boletas_pago', 'postulaciones/boletas');
        $storeFile('recibo_luz', 'postulaciones/recibos');
        $storeFile('croquis', 'postulaciones/croquis');
        $storeFile('dj_pronabec', 'postulaciones/dj');
        $storeFile('firma_digital', 'postulaciones/firmas');

        // Hanlde Additional Attachments (Array)
        if ($request->has('anexos_adicionales') && is_array($request->anexos_adicionales)) {
            $archivos['especificos'] = [];
            foreach ($request->anexos_adicionales as $index => $anexo) {
                if (isset($anexo['archivo']) && $request->hasFile("anexos_adicionales.{$index}.archivo")) {
                    $file = $request->file("anexos_adicionales.{$index}.archivo");
                    $path = $file->store('postulaciones/especificos', 'public');

                    $label = $anexo['tipo'] === 'otros' && !empty($anexo['especificacion'])
                        ? 'OTRO: ' . strtoupper($anexo['especificacion'])
                        : strtoupper($anexo['tipo']);

                    $archivos['especificos'][] = [
                        'tipo' => $label,
                        'path' => $path
                    ];
                }
            }
        }
        // Legacy single specific support (keep for fallback if needed, or remove if fully migrated)
        // logic...

        $postulacion = new Postulacion();
        $postulacion->usuario_id = auth()->id();
        $postulacion->convocatoria_id = $request->convocatoria_id;

        $postulacion->ingreso_familiar = $request->ingreso_familiar;
        $postulacion->numero_miembros = $request->numero_miembros;
        $postulacion->condicion_vivienda = $request->condicion_vivienda;
        $postulacion->fundamentacion = $request->fundamentacion;

        if ($request->has('indicadores')) {
            $indicadores = json_decode($request->indicadores, true);
            $postulacion->indicadores_socioeconomicos = $indicadores;
            $postulacion->puntaje = $this->calculateScore($indicadores);
        }

        $postulacion->ruta_archivos = $archivos; // Eloquent will handle JSON encoding due to 'array' cast
        $postulacion->estado = 'pendiente';
        $postulacion->save();

        return redirect()->route('postulaciones.index')->with('success', 'Postulación enviada correctamente.');
    }

    public function update(Request $request, Postulacion $postulacion)
    {
        if (!in_array(auth()->user()->rol, ['admin', 'administrativo', 'coordinador'])) {
            abort(403);
        }

        $request->validate([
            'estado' => 'required|in:pendiente,aprobado,rechazado,apto_entrevista,entrevista_programada,becario',
        ]);

        // Specific logic via Model Methods for consistency
        if ($request->estado === 'becario') {
            $postulacion->aprobarComoBecario();
        } elseif ($request->estado === 'rechazado') {
            $postulacion->rechazar();
        } else {
            // General update for other states
            $postulacion->estado = $request->estado;
            $postulacion->puntaje = $request->input('puntaje', 0);
            $postulacion->save();
        }

        return back()->with('success', 'Estado actualizado correctamente.');
    }

    public function show(Postulacion $postulacion)
    {
        // Allow access to own postulation or admins
        if (auth()->user()->rol === 'estudiante' && $postulacion->usuario_id !== auth()->id()) {
            abort(403);
        }
        if (auth()->user()->rol !== 'estudiante' && !in_array(auth()->user()->rol, ['admin', 'administrativo', 'coordinador'])) {
            abort(403);
        }

        $postulacion->load(['usuario', 'convocatoria']);

        return Inertia::render('Postulaciones/Show', [
            'postulacion' => $postulacion,
        ]);
    }
}
