<?php

namespace App\Http\Requests;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'nombres' => ['required', 'string', 'max:255'],
            'apellidos' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', Rule::unique(User::class)->ignore($this->user()->id)],
            'apellido_paterno' => ['nullable', 'string', 'max:255'],
            'apellido_materno' => ['nullable', 'string', 'max:255'],
            'sexo' => ['nullable', 'in:M,F'],
            'fecha_nacimiento' => ['nullable', 'date'],
            'estado_civil' => ['nullable', 'string', 'max:50'],
            'direccion_actual' => ['nullable', 'string', 'max:255'],
            'ubigeo_current' => ['nullable', 'string', 'max:20'],
            'ubigeo_nacimiento' => ['nullable', 'string', 'max:250'],
            'nombre_colegio' => ['nullable', 'string', 'max:255'],
            'tipo_colegio' => ['nullable', 'string', 'max:50'],
            'anio_termino_colegio' => ['nullable', 'integer', 'min:1950', 'max:' . (date('Y'))],
            'telefono' => ['nullable', 'string', 'max:20'],
        ];
    }
}
