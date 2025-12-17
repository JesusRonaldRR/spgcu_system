<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramacionComedor extends Model
{
    use HasFactory;

    protected $table = 'programaciones_comedor';

    protected $fillable = [
        'usuario_id',
        'menu_id',
        'estado', // 'programado', 'asistio', 'falta', 'justificado'
    ];

    public function menu()
    {
        return $this->belongsTo(Menu::class);
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
