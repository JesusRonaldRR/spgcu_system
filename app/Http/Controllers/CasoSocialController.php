<?php

namespace App\Http\Controllers;

use App\Models\CasoSocial;
use App\Models\User;
use App\Services\FileEncryptionService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class CasoSocialController extends Controller
{
    private $disk = 'local';

    public function index()
    {
        $casos = CasoSocial::with('usuario', 'aprobador')->latest()->get();
        $usuarios = User::where('rol', 'estudiante')->orderBy('apellidos')->get(['id', 'nombres', 'apellidos', 'codigo']);

        return Inertia::render('Admin/CasosSociales/Index', [
            'casos' => $casos,
            'usuarios' => $usuarios
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'usuario_id' => 'required|exists:usuarios,id',
            'motivo' => 'required|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'required|date|after_or_equal:fecha_inicio',
        ]);

        CasoSocial::create($request->all());

        return back()->with('success', 'Caso social registrado correctamente.');
    }

    public function update(Request $request, CasoSocial $casoSocial)
    {
        $request->validate([
            'estado' => 'required|in:aprobado,rechazado',
            'firma_digital' => 'required_if:estado,aprobado|file|mimes:jpg,jpeg,png|max:2048'
        ]);

        if ($request->estado === 'aprobado') {
            $file = $request->file('firma_digital');
            $filename = 'firma_jefe_' . time() . '_' . $casoSocial->id . '.png';
            $path = 'firmas_autoridad/' . $filename;

            FileEncryptionService::encryptAndStore($file, $path, $this->disk);

            $casoSocial->update([
                'estado' => 'aprobado',
                'firma_jefe' => $path,
                'aprobado_por' => auth()->id()
            ]);
        } else {
            $casoSocial->update(['estado' => 'rechazado']);
        }

        return back()->with('success', 'Caso social actualizado con firma cifrada.');
    }

    public function downloadFirma(CasoSocial $casoSocial)
    {
        if (!in_array(auth()->user()->rol, ['admin', 'administrativo', 'coordinador'])) {
            abort(403);
        }

        if (!$casoSocial->firma_jefe) {
            abort(404);
        }

        $decryptedContent = FileEncryptionService::decrypt($casoSocial->firma_jefe, $this->disk);

        return response($decryptedContent)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'inline; filename="firma_jefe.png"');
    }

    public function destroy(CasoSocial $casoSocial)
    {
        if ($casoSocial->firma_jefe) {
            Storage::disk($this->disk)->delete($casoSocial->firma_jefe);
        }
        $casoSocial->delete();
        return back()->with('success', 'Registro eliminado.');
    }
}
