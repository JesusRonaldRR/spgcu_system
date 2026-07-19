<?php

namespace App\Http\Controllers;

use App\Models\Justificacion;
use App\Services\FileEncryptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class JustificacionController extends Controller
{
    private $disk = 'local';

    public function index()
    {
        $query = Justificacion::with('usuario');
        if (auth()->user()->rol === 'estudiante') {
            $query->where('usuario_id', auth()->id());
        }
        $justificaciones = $query->latest()->get();

        return Inertia::render('Justificaciones/Index', [
            'justificaciones' => $justificaciones,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fecha_a_justificar' => 'required|date',
            'motivo' => 'required|string|max:500',
            'archivo' => 'required|file|mimes:pdf,jpg,jpeg,png|max:5120',
        ]);

        $path = '';
        if ($request->hasFile('archivo')) {
            $file = $request->file('archivo');
            $filename = 'justificacion_' . time() . '_' . auth()->id() . '.' . $file->getClientOriginalExtension();
            $path = 'justificaciones/' . $filename;

            FileEncryptionService::encryptAndStore($file, $path, $this->disk);
        }

        $justificacion = new Justificacion();
        $justificacion->usuario_id = auth()->id();
        $justificacion->fecha_a_justificar = $request->fecha_a_justificar;
        $justificacion->motivo = $request->motivo;
        $justificacion->ruta_archivo = $path;
        $justificacion->estado = 'pendiente';
        $justificacion->save();

        return back()->with('success', 'Justificación enviada correctamente (Cifrada).');
    }

    public function downloadEncrypted(Justificacion $justificacion)
    {
        // Security check
        if (auth()->user()->rol === 'estudiante' && $justificacion->usuario_id !== auth()->id()) {
            abort(403);
        }

        if (!$justificacion->ruta_archivo) {
            abort(404);
        }

        $decryptedContent = FileEncryptionService::decrypt($justificacion->ruta_archivo, $this->disk);

        if (!$decryptedContent) {
            abort(500, 'Error al descifrar el archivo.');
        }

        $filename = basename($justificacion->ruta_archivo);
        $extension = pathinfo($justificacion->ruta_archivo, PATHINFO_EXTENSION);
        $contentType = in_array($extension, ['jpg', 'jpeg', 'png']) ? 'image/jpeg' : 'application/pdf';

        return response($decryptedContent)
            ->header('Content-Type', $contentType)
            ->header('Content-Disposition', 'inline; filename="'.$filename.'"');
    }

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

        if ($request->estado === 'aprobado') {
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
