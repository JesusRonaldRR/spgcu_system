<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Postulacion extends Model
{
    use HasFactory;

    protected $table = 'postulaciones';

    protected $fillable = [
        'usuario_id',
        'convocatoria_id',
        'ingreso_familiar',
        'numero_miembros',
        'condicion_vivienda',
        'ruta_archivos',
        'puntaje',
        'estado',
        'hash_qr',
    ];

    protected $casts = [
        'ruta_archivos' => 'array',
        'ingreso_familiar' => 'decimal:2',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function convocatoria()
    {
        return $this->belongsTo(Convocatoria::class, 'convocatoria_id');
    }

    public function entrevista()
    {
        return $this->hasOne(Entrevista::class);
    }

    public function programacionesComedor()
    {
        return $this->hasMany(ProgramacionComedor::class, 'usuario_id', 'usuario_id');
    }

    // --- Business Logic Methods ---

    public function aprobarComoBecario()
    {
        // Generate Hash if not exists
        if (!$this->hash_qr) {
            $this->hash_qr = hash('sha256', $this->usuario_id . '-' . $this->convocatoria_id . '-' . \Illuminate\Support\Str::random(10));
        }
        $this->estado = 'becario';
        $this->save();

        \Log::info('Postulacion aprobada como becario (Model Method)', ['id' => $this->id]);
    }

    public function rechazar()
    {
        $this->estado = 'rechazado';
        $this->save();

        \Log::info('Postulacion rechazada (Model Method)', ['id' => $this->id]);
    }
}
