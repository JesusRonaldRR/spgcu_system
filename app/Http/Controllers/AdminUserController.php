<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::orderBy('id', 'desc')->paginate(10);

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255', // Kept for backward compat, or auto-generated
            'email' => 'required|string|email|max:255|unique:' . User::class,
            'password' => 'required|confirmed|min:8',
            'rol' => 'required|string|in:admin,coordinador,administrativo,estudiante,cocina',
            'dni' => 'required|string|digits:8|unique:' . User::class,
            'codigo' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',

            // New Profile Fields
            'apellido_paterno' => 'nullable|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'sexo' => 'nullable|in:M,F',
            'fecha_nacimiento' => 'nullable|date',
            'estado_civil' => 'nullable|string|max:50',
            'direccion_actual' => 'nullable|string|max:500',
            'ubigeo_actual' => 'nullable|string|max:20',
            'ubigeo_nacimiento' => 'nullable|string|max:20',
            'nombre_colegio' => 'nullable|string|max:255',
            'tipo_colegio' => 'nullable|string|max:50',
            'anio_termino_colegio' => 'nullable|integer|digits:4',
            'ubigeo_colegio' => 'nullable|string|max:20',
            'contacto_emergencia_nombre' => 'nullable|string|max:255',
            'contacto_emergencia_telefono' => 'nullable|string|max:20',
        ]);

        User::create([
            'nombres' => $request->nombres,
            'apellidos' => $request->apellidos,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'rol' => $request->rol,
            'dni' => $request->dni,
            'codigo' => $request->codigo,
            'telefono' => $request->telefono,
            'estado' => true,

            // New Fields
            'apellido_paterno' => $request->apellido_paterno,
            'apellido_materno' => $request->apellido_materno,
            'sexo' => $request->sexo,
            'fecha_nacimiento' => $request->fecha_nacimiento,
            'estado_civil' => $request->estado_civil,
            'direccion_actual' => $request->direccion_actual,
            'ubigeo_actual' => $request->ubigeo_actual,
            'ubigeo_nacimiento' => $request->ubigeo_nacimiento,
            'nombre_colegio' => $request->nombre_colegio,
            'tipo_colegio' => $request->tipo_colegio,
            'anio_termino_colegio' => $request->anio_termino_colegio,
            'ubigeo_colegio' => $request->ubigeo_colegio,
            'contacto_emergencia_nombre' => $request->contacto_emergencia_nombre,
            'contacto_emergencia_telefono' => $request->contacto_emergencia_telefono,
        ]);

        return redirect()->route('admin.users.index')->with('success', 'Usuario creado exitosamente.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, User $user)
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellidos' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(User::class)->ignore($user->id)],
            'rol' => 'required|string|in:admin,coordinador,administrativo,estudiante,cocina',
            'dni' => ['required', 'string', 'digits:8', Rule::unique(User::class)->ignore($user->id)],
            'codigo' => 'nullable|string|max:20',
            'telefono' => 'nullable|string|max:20',
            'password' => 'nullable|confirmed|min:8',

            // New Profile Fields
            'apellido_paterno' => 'nullable|string|max:255',
            'apellido_materno' => 'nullable|string|max:255',
            'sexo' => 'nullable|in:M,F',
            'fecha_nacimiento' => 'nullable|date',
            'estado_civil' => 'nullable|string|max:50',
            'direccion_actual' => 'nullable|string|max:500',
            'ubigeo_actual' => 'nullable|string|max:20',
            'ubigeo_nacimiento' => 'nullable|string|max:20',
            'nombre_colegio' => 'nullable|string|max:255',
            'tipo_colegio' => 'nullable|string|max:50',
            'anio_termino_colegio' => 'nullable|integer|digits:4',
            'ubigeo_colegio' => 'nullable|string|max:20',
            'contacto_emergencia_nombre' => 'nullable|string|max:255',
            'contacto_emergencia_telefono' => 'nullable|string|max:20',
        ]);

        $user->fill($request->except('password'));

        if ($request->filled('password')) {
            $user->password = Hash::make($request->password);
        }

        $user->save();

        return redirect()->route('admin.users.index')->with('success', 'Usuario actualizado exitosamente.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.users.index')->with('success', 'Usuario eliminado exitosamente.');
    }
}
