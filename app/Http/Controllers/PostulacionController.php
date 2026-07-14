<?php

namespace App\Http\Controllers;

use App\Models\Postulacion;
use App\Models\Convocatoria;
use App\Services\FileEncryptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class PostulacionController extends Controller
{
    // Use 'local' for now in sandbox, but ready for 'encrypted_s3'
    private $disk = 'local';

    public function index()
    {
        $query = Postulacion::with(['convocatoria', 'usuario', 'entrevista']);
        $convocatoriasActivas = [];

        if (auth()->user()->rol === 'estudiante') {
            $query->where('usuario_id', auth()->id());

            $convocatoriasActivas = Convocatoria::where('esta_activa', true)
                ->whereDate('fecha_inicio', '<=', now())
                ->whereDate('fecha_fin', '>=', now())
                ->get();
        }

        $postulaciones = $query->latest()->get();

        return Inertia::render('Postulaciones/Index', [
            'postulaciones' => $postulaciones,
            'convocatoriasActivas' => $convocatoriasActivas,
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
                ->whereIn('estado', ['pendiente', 'aprobado', 'apto_entrevista', 'entrevista_programada', 'becario'])
                ->first();
        }

        return Inertia::render('Postulaciones/Create', [
            'convocatorias' => $convocatorias,
            'existingPostulation' => $existingPostulation
        ]);
    }

    private function calculateScore(array $indicadores)
    {
        $puntaje = 0;
        $vivienda = $indicadores['vivienda'] ?? '';
        $puntaje += match ($vivienda) {
            'quinta'    => 20,
            'alquilada' => 15,
            'cedida'    => 10,
            'propia'    => 5,
            default     => 0,
        };
        $salud = $indicadores['salud'] ?? '';
        $puntaje += match ($salud) {
            'cronica'   => 20,
            'frecuente' => 15,
            'estable'   => 10,
            'buena'     => 5,
            default     => 0,
        };
        $alimentacion = $indicadores['alimentacion'] ?? '';
        $puntaje += match ($alimentacion) {
            'deficiente' => 20,
            'irregular'  => 15,
            'completa'   => 10,
            default      => 0,
        };
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
            'ficha_socioeconomica' => 'required|file|mimes:pdf|max:10240',
            'boletas_pago' => 'required|file|mimes:pdf|max:10240',
            'recibo_luz' => 'required|file|mimes:pdf|max:10240',
            'croquis' => 'required|file|mimes:pdf|max:10240',
            'dj_pronabec' => 'required|file|mimes:pdf|max:10240',
            'anexos_adicionales' => 'nullable|array',
            'anexos_adicionales.*.tipo' => 'required_with:anexos_adicionales|string',
            'anexos_adicionales.*.archivo' => 'required_with:anexos_adicionales|file|mimes:pdf|max:10240',
            'indicadores' => 'required|string',
        ]);

        // Backend Validation: Call must be active
        $convocatoria = Convocatoria::findOrFail($request->convocatoria_id);
        if (!$convocatoria->esta_activa || now()->lt($convocatoria->fecha_inicio) || now()->gt($convocatoria->fecha_fin)) {
            return back()->withErrors(['convocatoria_id' => 'La convocatoria seleccionada no se encuentra vigente.']);
        }

        // Backend Validation: One postulation per user per active call
        $existing = Postulacion::where('usuario_id', auth()->id())
            ->where('convocatoria_id', $request->convocatoria_id)
            ->whereIn('estado', ['pendiente', 'aprobado', 'apto_entrevista', 'entrevista_programada', 'becario'])
            ->first();

        if ($existing) {
            return back()->withErrors(['convocatoria_id' => 'Ya cuenta con una postulación activa o en trámite para esta convocatoria.']);
        }

        $archivos = [];

        // Helper to Encrypt and store
        $storeEncrypted = function ($key, $folder) use ($request, &$archivos) {
            if ($request->hasFile($key)) {
                $file = $request->file($key);
                $filename = $key . '_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
                $path = $folder . '/' . $filename;

                FileEncryptionService::encryptAndStore($file, $path, $this->disk);
                $archivos[$key] = $path;
            }
        };

        $storeEncrypted('ficha_socioeconomica', 'postulaciones/fichas');
        $storeEncrypted('boletas_pago', 'postulaciones/boletas');
        $storeEncrypted('recibo_luz', 'postulaciones/recibos');
        $storeEncrypted('croquis', 'postulaciones/croquis');
        $storeEncrypted('dj_pronabec', 'postulaciones/dj');
        $storeEncrypted('firma_digital', 'postulaciones/firmas');

        if ($request->has('anexos_adicionales') && is_array($request->anexos_adicionales)) {
            $archivos['especificos'] = [];
            foreach ($request->anexos_adicionales as $index => $anexo) {
                if ($request->hasFile("anexos_adicionales.{$index}.archivo")) {
                    $file = $request->file("anexos_adicionales.{$index}.archivo");
                    $filename = 'anexo_' . time() . '_' . uniqid() . '.pdf';
                    $path = 'postulaciones/especificos/' . $filename;

                    FileEncryptionService::encryptAndStore($file, $path, $this->disk);

                    $label = $anexo['tipo'] === 'otros' && !empty($anexo['especificacion'])
                        ? 'OTRO: ' . strtoupper($anexo['especificacion'])
                        : strtoupper($anexo['tipo']);

                    $archivos['especificos'][] = ['tipo' => $label, 'path' => $path];
                }
            }
        }

        $postulacion = new Postulacion();
        $postulacion->usuario_id = auth()->id();
        $postulacion->convocatoria_id = $request->convocatoria_id;
        $postulacion->ingreso_familiar = $request->ingreso_familiar;
        $postulacion->numero_miembros = $request->numero_miembros;
        $postulacion->condicion_vivienda = $request->condicion_vivienda;
        $postulacion->fundamentacion = $request->fundamentacion;

        $indicadores = json_decode($request->indicadores, true);
        $postulacion->indicadores_socioeconomicos = $indicadores;
        $postulacion->puntaje = $this->calculateScore($indicadores);

        $postulacion->ruta_archivos = $archivos;
        $postulacion->estado = 'pendiente';
        $postulacion->save();

        return redirect()->route('postulaciones.index')->with('success', 'Postulación enviada correctamente (Archivos Cifrados).');
    }

    /**
     * Download and Decrypt File on the fly.
     */
    public function downloadEncrypted(Request $request)
    {
        $path = $request->query('path');

        // Security: Check if user owns the postulation or is admin
        $postulacion = Postulacion::whereJsonContains('ruta_archivos', $path)
            ->orWhereJsonContains('ruta_archivos->especificos', ['path' => $path]) // Deep search for specific annexes
            ->first();

        if (!$postulacion) {
             // Fallback for deeply nested JSON or other file structures if needed
             // Simple ownership check for this prototype
             abort(404, 'Archivo no encontrado en registros.');
        }

        if (auth()->user()->rol === 'estudiante' && $postulacion->usuario_id !== auth()->id()) {
            abort(403);
        }

        $decryptedContent = FileEncryptionService::decrypt($path, $this->disk);

        if (!$decryptedContent) {
            abort(500, 'Error al descifrar el archivo.');
        }

        $filename = basename($path);
        $extension = pathinfo($path, PATHINFO_EXTENSION);
        $contentType = $extension === 'pdf' ? 'application/pdf' : 'image/jpeg';

        return response($decryptedContent)
            ->header('Content-Type', $contentType)
            ->header('Content-Disposition', 'inline; filename="'.$filename.'"');
    }

    public function update(Request $request, Postulacion $postulacion)
    {
        if (!in_array(auth()->user()->rol, ['admin', 'administrativo', 'coordinador'])) {
            abort(403);
        }

        $request->validate(['estado' => 'required|in:pendiente,aprobado,rechazado,apto_entrevista,entrevista_programada,becario,lista_espera']);

        if ($request->estado === 'becario') {
            $postulacion->aprobarComoBecario();
        } elseif ($request->estado === 'rechazado') {
            $postulacion->rechazar();
        } elseif ($request->estado === 'lista_espera') {
            $postulacion->enviarAListaEspera();
        } else {
            $postulacion->estado = $request->estado;
            $postulacion->save();
        }

        return back()->with('success', 'Estado actualizado correctamente.');
    }

    public function show(Postulacion $postulacion)
    {
        if (auth()->user()->rol === 'estudiante' && $postulacion->usuario_id !== auth()->id()) {
            abort(403);
        }
        $postulacion->load(['usuario', 'convocatoria']);
        return Inertia::render('Postulaciones/Show', ['postulacion' => $postulacion]);
    }
}
