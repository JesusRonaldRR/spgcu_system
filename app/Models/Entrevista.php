<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entrevista extends Model
{
    use HasFactory;

    protected $fillable = [
        'postulacion_id',
        'psicologo_id',
        'fecha',
        'hora',
        'lugar',
        'tipo',
        'link_reunion',
        'estado',
        'resultado',
        'observaciones',
    ];

    public function postulacion()
    {
        return $this->belongsTo(Postulacion::class);
    }

    public function psicologo()
    {
        return $this->belongsTo(User::class, 'psicologo_id');
    }
}
