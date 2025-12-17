<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Justificacion extends Model
{
    use HasFactory;

    protected $table = 'justificaciones';

    protected $fillable = [
        'usuario_id',
        'fecha_a_justificar',
        'motivo',
        'ruta_archivo',
        'estado',
    ];

    protected $casts = [
        'fecha_a_justificar' => 'date',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
