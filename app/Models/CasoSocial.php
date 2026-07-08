<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CasoSocial extends Model
{
    use HasFactory;

    protected $table = 'casos_sociales';

    protected $fillable = [
        'usuario_id',
        'motivo',
        'fecha_inicio',
        'fecha_fin',
        'estado',
        'firma_jefe',
        'aprobado_por'
    ];

    protected $casts = [
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function aprobador()
    {
        return $this->belongsTo(User::class, 'aprobado_por');
    }
}
