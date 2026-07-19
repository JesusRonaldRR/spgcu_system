<?php

namespace App\Http\Controllers;

use App\Models\Menu;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class MenuController extends Controller
{
    /**
     * Admin/Administrativo: Display menu calendar for management.
     */
    public function adminIndex(Request $request)
    {
        // Default to current month
        $start = $request->input('start', Carbon::now()->startOfMonth()->format('Y-m-d'));
        $end = $request->input('end', Carbon::now()->endOfMonth()->format('Y-m-d'));

        // Fetch menus and group by date
        $menusRaw = Menu::whereBetween('fecha', [$start, $end])
            ->orderBy('fecha')
            ->get();

        // Custom sort in PHP to avoid SQLite FIELD() incompatibility
        $tipoOrder = ['desayuno' => 1, 'almuerzo' => 2, 'cena' => 3];
        $menusRaw = $menusRaw->sort(function ($a, $b) use ($tipoOrder) {
            if ($a->fecha->equalTo($b->fecha)) {
                return $tipoOrder[$a->tipo] <=> $tipoOrder[$b->tipo];
            }
            return $a->fecha <=> $b->fecha;
        });

        // Convert to array grouped by date string
        $menus = [];
        foreach ($menusRaw as $menu) {
            $dateKey = Carbon::parse($menu->fecha)->format('Y-m-d');
            if (!isset($menus[$dateKey])) {
                $menus[$dateKey] = [];
            }
            $menus[$dateKey][] = [
                'id' => $menu->id,
                'tipo' => $menu->tipo,
                'descripcion' => $menu->descripcion,
                'hora_inicio' => $menu->hora_inicio,
                'hora_fin' => $menu->hora_fin,
                'fecha' => $dateKey,
            ];
        }

        return Inertia::render('Admin/Menus/Index', [
            'menus' => $menus,
            'currentStart' => $start,
            'currentEnd' => $end
        ]);
    }

    /**
     * Student: Display meal schedule for beneficiaries.
     */
    public function index()
    {
        $user = auth()->user();
        $start = Carbon::today();
        $end = Carbon::today()->addDays(30); // Show a month ahead

        $menusRaw = Menu::whereBetween('fecha', [$start, $end])
            ->orderBy('fecha')
            ->get();

        // Custom sort in PHP to avoid SQLite FIELD() incompatibility
        $tipoOrder = ['desayuno' => 1, 'almuerzo' => 2, 'cena' => 3];
        $menusRaw = $menusRaw->sort(function ($a, $b) use ($tipoOrder) {
            if ($a->fecha->equalTo($b->fecha)) {
                return $tipoOrder[$a->tipo] <=> $tipoOrder[$b->tipo];
            }
            return $a->fecha <=> $b->fecha;
        });

        // Convert to array grouped by date string
        $menus = [];
        foreach ($menusRaw as $menu) {
            $dateKey = Carbon::parse($menu->fecha)->format('Y-m-d');
            if (!isset($menus[$dateKey])) {
                $menus[$dateKey] = [];
            }
            $menus[$dateKey][] = [
                'id' => $menu->id,
                'tipo' => $menu->tipo,
                'descripcion' => $menu->descripcion,
                'hora_inicio' => $menu->hora_inicio,
                'hora_fin' => $menu->hora_fin,
                'fecha' => $dateKey,
            ];
        }

        // Check if student is beneficiary (automatically subscribed to all)
        $isBeneficiary = \App\Models\Postulacion::where('usuario_id', $user->id)
            ->where('estado', 'becario')
            ->exists();

        // Get user's existing reservations (pluck ID only for selection logic)
        $programacionesIds = \App\Models\ProgramacionComedor::where('usuario_id', $user->id)
            ->whereHas('menu', function ($q) use ($start, $end) {
                $q->whereBetween('fecha', [$start, $end]);
            })->pluck('menu_id')->toArray();

        // Get detailed reservations for confirmation states
        $programacionesDetalle = \App\Models\ProgramacionComedor::where('usuario_id', $user->id)
            ->whereHas('menu', function ($q) use ($start, $end) {
                $q->whereBetween('fecha', [$start, $end]);
            })->get(['menu_id', 'confirmado', 'estado'])->keyBy('menu_id');

        // If they are a beneficiary, ensure all today/future menus are in the list (Auto-Subscription)
        if ($isBeneficiary && $user->rol === 'estudiante') {
            $allMenus = \App\Models\Menu::whereBetween('fecha', [$start, $end])->get();
            foreach ($allMenus as $menu) {
                if (!in_array($menu->id, $programacionesIds)) {
                    // Create auto-subscription
                    \App\Models\ProgramacionComedor::firstOrCreate([
                        'usuario_id' => $user->id,
                        'menu_id' => $menu->id,
                    ], [
                        'estado' => 'programado'
                    ]);
                    $programacionesIds[] = $menu->id;
                }
            }
        }

        // Count absences for this user
        $faltasCount = \App\Models\ProgramacionComedor::where('usuario_id', $user->id)
            ->where('estado', 'falta')
            ->count();

        return Inertia::render('Comedor/Horario', [
            'menus' => $menus,
            'programaciones' => $programacionesIds,
            'programacionesDetalle' => $programacionesDetalle,
            'startDate' => $start->format('Y-m-d'),
            'endDate' => $end->format('Y-m-d'),
            'faltasCount' => $faltasCount,
            'serverDate' => Carbon::now()->format('Y-m-d'),
            'serverTime' => Carbon::now()->format('H:i:s'),
        ]);
    }

    /**
     * Confirm/Unconfirm attendance for a specific menu.
     */
    public function confirmar(Request $request, $menuId)
    {
        $user = auth()->user();
        $reservation = \App\Models\ProgramacionComedor::where('usuario_id', $user->id)
            ->where('menu_id', $menuId)
            ->firstOrFail();

        $reservation->update([
            'confirmado' => $request->input('confirmado', true)
        ]);

        return back()->with('success', 'Confirmación actualizada.');
    }

    /**
     * Store a newly created menu.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fecha' => 'required|date|after_or_equal:today',
            'tipo' => 'required|in:desayuno,almuerzo,cena',
            'descripcion' => 'required|string|max:500',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
        ], [
            'fecha.after_or_equal' => 'No se pueden asignar menús a fechas pasadas.',
        ]);

        Menu::updateOrCreate(
            ['fecha' => $request->fecha, 'tipo' => $request->tipo],
            [
                'descripcion' => $request->descripcion,
                'hora_inicio' => $request->hora_inicio,
                'hora_fin' => $request->hora_fin,
            ]
        );

        return back()->with('success', 'Menú guardado correctamente.');
    }

    /**
     * Update the specified menu.
     */
    public function update(Request $request, Menu $menu)
    {
        $now = Carbon::now();
        if (
            $menu->fecha->format('Y-m-d') < $now->format('Y-m-d') ||
            ($menu->fecha->format('Y-m-d') === $now->format('Y-m-d') && $menu->hora_fin < $now->format('H:i:s'))
        ) {
            return back()->withErrors(['error' => 'No se puede modificar un menú que ya ha expirado.']);
        }

        $request->validate([
            'descripcion' => 'required|string|max:500',
            'hora_inicio' => 'required',
            'hora_fin' => 'required',
        ]);

        $menu->update($request->only(['descripcion', 'hora_inicio', 'hora_fin']));

        return back()->with('success', 'Menú actualizado.');
    }

    /**
     * Remove the specified menu.
     */
    public function destroy(Menu $menu)
    {
        $now = Carbon::now();
        if (
            $menu->fecha->format('Y-m-d') < $now->format('Y-m-d') ||
            ($menu->fecha->format('Y-m-d') === $now->format('Y-m-d') && $menu->hora_fin < $now->format('H:i:s'))
        ) {
            return back()->withErrors(['error' => 'No se puede eliminar un menú que ya ha expirado o está en curso.']);
        }

        $menu->delete();
        return back()->with('success', 'Menú eliminado.');
    }

    /**
     * Student: Save meal reservations.
     */
    public function programar(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'fecha' => 'required|date',
            'menus' => 'present|array',
            'menus.*' => 'exists:menus,id',
        ]);

        if ($user->estado === 'suspendido') {
            return back()->withErrors(['error' => 'Tu cuenta se encuentra suspendida por exceso de faltas.']);
        }

        if (count($request->menus) > 3) {
            return back()->withErrors(['menus' => 'Máximo 3 comidas por día.']);
        }

        // Get existing reservations for this date
        $existing = \App\Models\ProgramacionComedor::where('usuario_id', $user->id)
            ->whereHas('menu', function ($q) use ($request) {
                $q->where('fecha', $request->fecha);
            })->get();

        $selectedIds = $request->menus;

        $now = Carbon::now();
        $today = $now->format('Y-m-d');
        $currentTime = $now->format('H:i:s');

        // Remove unselected (only if still 'programado' AND NOT EXPIRED)
        foreach ($existing as $reservation) {
            $menu = $reservation->menu;
            $isExpired = ($menu->fecha->format('Y-m-d') < $today) ||
                ($menu->fecha->format('Y-m-d') === $today && $menu->hora_fin < $currentTime);

            if (!in_array($reservation->menu_id, $selectedIds) && $reservation->estado === 'programado') {
                if ($isExpired) {
                    return back()->withErrors(['menus' => "No puedes modificar una reserva que ya ha finalizado ({$menu->tipo})."]);
                }
                $reservation->delete();
            }
        }

        // Add new
        foreach ($selectedIds as $menuId) {
            if (!$existing->contains('menu_id', $menuId)) {
                $menu = Menu::findOrFail($menuId);
                $isExpired = ($menu->fecha->format('Y-m-d') < $today) ||
                    ($menu->fecha->format('Y-m-d') === $today && $menu->hora_fin < $currentTime);

                if ($isExpired) {
                    return back()->withErrors(['menus' => "No puedes reservar un menú que ya ha finalizado ({$menu->tipo})."]);
                }

                \App\Models\ProgramacionComedor::create([
                    'usuario_id' => $user->id,
                    'menu_id' => $menuId,
                    'estado' => 'programado'
                ]);
            }
        }

        return back()->with('success', 'Programación actualizada.');
    }
}
