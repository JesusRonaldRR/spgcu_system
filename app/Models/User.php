<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'usuarios';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nombres',
        'apellidos',
        'email',
        'password',
        'rol',
        'codigo',
        'dni',
        'telefono',
        'estado',
        'apellido_paterno',
        'apellido_materno',
        'sexo',
        'fecha_nacimiento',
        'estado_civil',
        'direccion_actual',
        'ubigeo_actual',
        'ubigeo_nacimiento',
        'nombre_colegio',
        'tipo_colegio',
        'anio_termino_colegio',
        'ubigeo_colegio',
        'contacto_emergencia_nombre',
        'contacto_emergencia_telefono',
        'datos_pide',
        'escuela',
        'facultad',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function postulaciones()
    {
        return $this->hasMany(Postulacion::class, 'usuario_id');
    }

    public function justificaciones()
    {
        return $this->hasMany(Justificacion::class, 'usuario_id');
    }

    public function programacionesComedor()
    {
        return $this->hasMany(ProgramacionComedor::class, 'usuario_id');
    }
}
