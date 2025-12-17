<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Convocatoria extends Model
{
    use HasFactory;

    protected $table = 'convocatorias';

    protected $fillable = [
        'nombre',
        'fecha_inicio',
        'fecha_fin',
        'esta_activa',
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
        'esta_activa' => 'boolean',
    ];

    public function postulaciones()
    {
        return $this->hasMany(Postulacion::class, 'convocatoria_id');
    }
}
