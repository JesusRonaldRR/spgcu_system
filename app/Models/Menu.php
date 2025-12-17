<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Menu extends Model
{
    use HasFactory;

    protected $fillable = [
        'fecha',
        'tipo',
        'descripcion',
        'hora_inicio',
        'hora_fin',
    ];

    protected $casts = [
        'fecha' => 'date',
    ];

    public function programaciones()
    {
        return $this->hasMany(ProgramacionComedor::class);
    }
}
