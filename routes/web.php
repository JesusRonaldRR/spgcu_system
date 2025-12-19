<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Beneficiary Access Group
    Route::get('/otros-servicios', [\App\Http\Controllers\OtrosServiciosController::class, 'index'])->name('otros-servicios.index');
    Route::post('/otros-servicios', [\App\Http\Controllers\OtrosServiciosController::class, 'store'])->name('otros-servicios.store');

    // Modules accessible by Students/Staff (Logic inside controller or specific middleware needed if strictly separated)
    Route::get('/mi-qr', [App\Http\Controllers\AsistenciaController::class, 'myQr'])->name('asistencia.my_qr');
    Route::resource('postulaciones', \App\Http\Controllers\PostulacionController::class)->parameters(['postulaciones' => 'postulacion']);
    Route::resource('justificaciones', \App\Http\Controllers\JustificacionController::class)->parameters(['justificaciones' => 'justificacion']);
    Route::resource('citas', \App\Http\Controllers\EntrevistaController::class)->parameters(['citas' => 'entrevista']);
    Route::put('/citas/{entrevista}', [\App\Http\Controllers\EntrevistaController::class, 'update'])->name('citas.update.put');
    Route::get('/comedor/horario', [\App\Http\Controllers\MenuController::class, 'index'])->name('comedor.horario');
    Route::post('/comedor/programar', [\App\Http\Controllers\MenuController::class, 'programar'])->name('menus.programar');

    // -----------------------------------------------------------------------------
    // ADMIN / STAFF ONLY PANEL
    // -----------------------------------------------------------------------------
    Route::middleware(['role:admin,administrativo,coordinador'])->group(function () {

        // Admin: Users
        Route::resource('admin/users', \App\Http\Controllers\AdminUserController::class)->names('admin.users');

        // Admin: Menus
        Route::get('/admin/menus', [\App\Http\Controllers\MenuController::class, 'adminIndex'])->name('admin.menus.index');
        Route::post('/admin/menus', [\App\Http\Controllers\MenuController::class, 'store'])->name('admin.menus.store');
        Route::patch('/admin/menus/{menu}', [\App\Http\Controllers\MenuController::class, 'update'])->name('admin.menus.update');
        Route::delete('/admin/menus/{menu}', [\App\Http\Controllers\MenuController::class, 'destroy'])->name('admin.menus.destroy');

        // Admin: Beneficiarios
        Route::get('/admin/beneficiarios', [\App\Http\Controllers\BeneficiarioController::class, 'index'])->name('admin.beneficiarios.index');
        Route::get('/admin/beneficiarios/export', [\App\Http\Controllers\BeneficiarioController::class, 'export'])->name('admin.beneficiarios.export');
        Route::delete('/admin/beneficiarios/{id}', [\App\Http\Controllers\BeneficiarioController::class, 'destroy'])->name('admin.beneficiarios.destroy');
        Route::get('/admin/beneficiarios/{userId}/faltas', [\App\Http\Controllers\BeneficiarioController::class, 'getFaults'])->name('admin.beneficiarios.faults');
        Route::delete('/admin/beneficiarios/faltas/{id}', [\App\Http\Controllers\BeneficiarioController::class, 'removeFault'])->name('admin.beneficiarios.removeFault');

        // Admin: Asistencia Scanner
        Route::get('/escanear', [App\Http\Controllers\AsistenciaController::class, 'scanner'])->name('asistencia.scanner');
        Route::get('/asistencia/hoy', [App\Http\Controllers\AsistenciaController::class, 'todayList'])->name('asistencia.today');
        Route::get('/asistencia/exportar', [App\Http\Controllers\AsistenciaController::class, 'exportar'])->name('asistencia.exportar');
        Route::post('/api/asistencia', [App\Http\Controllers\AsistenciaController::class, 'store'])->name('asistencia.store');
        Route::post('/api/asistencia/{programacion}/toggle', [App\Http\Controllers\AsistenciaController::class, 'toggleAttendance'])->name('asistencia.toggle');
        Route::post('/asistencia/procesar-faltas', [App\Http\Controllers\AsistenciaController::class, 'procesarFaltas'])->name('asistencia.procesar-faltas');

        // Admin: Otros Servicios Scheduler
        Route::get('/admin/otros-servicios', [\App\Http\Controllers\OtrosServiciosController::class, 'adminIndex'])->name('admin.otros-servicios.index');
        Route::patch('/admin/otros-servicios/{id}', [\App\Http\Controllers\OtrosServiciosController::class, 'update'])->name('admin.otros-servicios.update');
        Route::delete('/admin/otros-servicios/{id}', [\App\Http\Controllers\OtrosServiciosController::class, 'destroy'])->name('admin.otros-servicios.destroy');

        // Admin: Reportes
        Route::get('/reportes/focalizacion', [\App\Http\Controllers\ReporteController::class, 'focalizacion'])->name('reportes.focalizacion');
        Route::get('/reportes/comedor', [\App\Http\Controllers\ReporteController::class, 'comedor'])->name('reportes.comedor');
    });
});

require __DIR__ . '/auth.php';
