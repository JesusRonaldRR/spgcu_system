<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CitaServicio extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'servicio',
        'modalidad',
        'fecha',
        'hora',
        'estado',
        'motivo',
        'admin_notes'
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
