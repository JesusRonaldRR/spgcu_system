<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PostulacionController;
use App\Http\Controllers\JustificacionController;
use App\Http\Controllers\CasoSocialController;
use App\Http\Controllers\AsistenciaController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\ConvocatoriaController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\OtrosServiciosController;
use App\Http\Controllers\ReporteController;
use App\Http\Controllers\PronosticoController;
use App\Http\Controllers\EntrevistaController;
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
    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/password', \App\Http\Controllers\ProfilePasswordController::class)->name('profile.password');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Beneficiary Access Group
    Route::get('/otros-servicios', [OtrosServiciosController::class, 'index'])->name('otros-servicios.index');
    Route::post('/otros-servicios', [OtrosServiciosController::class, 'store'])->name('otros-servicios.store');

    // Modules accessible by Students/Staff
    Route::get('/mi-qr', [AsistenciaController::class, 'myQr'])->name('asistencia.my_qr');

    Route::get('/postulaciones/archivo/ver', [PostulacionController::class, 'downloadEncrypted'])->name('postulaciones.ver-archivo');
    Route::resource('postulaciones', PostulacionController::class)->parameters(['postulaciones' => 'postulacion']);

    Route::get('/justificaciones/{justificacion}/archivo', [JustificacionController::class, 'downloadEncrypted'])->name('justificaciones.ver-archivo');
    Route::resource('justificaciones', JustificacionController::class)->parameters(['justificaciones' => 'justificacion']);

    Route::resource('citas', EntrevistaController::class)->parameters(['citas' => 'entrevista']);
    Route::put('/citas/{entrevista}', [EntrevistaController::class, 'update'])->name('citas.update.put');

    Route::get('/comedor/horario', [MenuController::class, 'index'])->name('comedor.horario');
    Route::post('/comedor/programar', [MenuController::class, 'programar'])->name('menus.programar');
    Route::post('/comedor/confirmar/{menuId}', [MenuController::class, 'confirmar'])->name('menus.confirmar');

    // -----------------------------------------------------------------------------
    // ADMIN / STAFF ONLY PANEL
    // -----------------------------------------------------------------------------
    Route::middleware(['role:admin,administrativo,coordinador,cocina'])->group(function () {

        // Admin: Users
        Route::resource('admin/users', AdminUserController::class)->names('admin.users');

        // Admin: Convocatorias
        Route::get('/admin/convocatorias', [ConvocatoriaController::class, 'index'])->name('admin.convocatorias.index');
        Route::post('/admin/convocatorias', [ConvocatoriaController::class, 'store'])->name('admin.convocatorias.store');
        Route::put('/admin/convocatorias/{convocatoria}', [ConvocatoriaController::class, 'update'])->name('admin.convocatorias.update');
        Route::delete('/admin/convocatorias/{convocatoria}', [ConvocatoriaController::class, 'destroy'])->name('admin.convocatorias.destroy');

        // Admin: Menus
        Route::get('/admin/menus', [MenuController::class, 'adminIndex'])->name('admin.menus.index');
        Route::post('/admin/menus', [MenuController::class, 'store'])->name('admin.menus.store');
        Route::patch('/admin/menus/{menu}', [MenuController::class, 'update'])->name('admin.menus.update');
        Route::delete('/admin/menus/{menu}', [MenuController::class, 'destroy'])->name('admin.menus.destroy');

        // Admin: Beneficiarios
        Route::get('/admin/beneficiarios', [\App\Http\Controllers\BeneficiarioController::class, 'index'])->name('admin.beneficiarios.index');
        Route::get('/admin/beneficiarios/export', [\App\Http\Controllers\BeneficiarioController::class, 'export'])->name('admin.beneficiarios.export');
        Route::delete('/admin/beneficiarios/{id}', [\App\Http\Controllers\BeneficiarioController::class, 'destroy'])->name('admin.beneficiarios.destroy');
        Route::get('/admin/beneficiarios/{userId}/faltas', [\App\Http\Controllers\BeneficiarioController::class, 'getFaults'])->name('admin.beneficiarios.faults');
        Route::delete('/admin/beneficiarios/faltas/{id}', [\App\Http\Controllers\BeneficiarioController::class, 'removeFault'])->name('admin.beneficiarios.removeFault');

        // Admin: Asistencia Scanner
        Route::get('/escanear', [AsistenciaController::class, 'scanner'])->name('asistencia.scanner');
        Route::get('/asistencia/hoy', [AsistenciaController::class, 'todayList'])->name('asistencia.today');
        Route::get('/asistencia/exportar', [AsistenciaController::class, 'exportar'])->name('asistencia.exportar');
        Route::post('/api/asistencia', [AsistenciaController::class, 'store'])->name('asistencia.store');
        Route::post('/api/asistencia/{programacion}/toggle', [AsistenciaController::class, 'toggleAttendance'])->name('asistencia.toggle');
        Route::post('/asistencia/procesar-faltas', [AsistenciaController::class, 'procesarFaltas'])->name('asistencia.procesar-faltas');
    });

    // Kitchen Personnel Specific Access (Limited to Scanner and Pronostico)
    Route::middleware(['role:cocina'])->group(function () {
        Route::get('/cocina/escanear', [AsistenciaController::class, 'scanner'])->name('cocina.asistencia.scanner');
        Route::post('/api/asistencia/cocina', [AsistenciaController::class, 'store'])->name('cocina.asistencia.store');
        Route::get('/cocina/pronostico', [PronosticoController::class, 'index'])->name('cocina.pronostico.index');
    });

    // Admin: Otros Servicios Scheduler & Reports (Restore correct roles)
    Route::middleware(['role:admin,administrativo,coordinador'])->group(function () {
        Route::get('/admin/otros-servicios', [OtrosServiciosController::class, 'adminIndex'])->name('admin.otros-servicios.index');
        Route::patch('/admin/otros-servicios/{id}', [OtrosServiciosController::class, 'update'])->name('admin.otros-servicios.update');
        Route::delete('/admin/otros-servicios/{id}', [OtrosServiciosController::class, 'destroy'])->name('admin.otros-servicios.destroy');

        Route::get('/reportes/focalizacion', [ReporteController::class, 'focalizacion'])->name('reportes.focalizacion');
        Route::get('/reportes/comedor', [ReporteController::class, 'comedor'])->name('reportes.comedor');
        Route::get('admin/pronostico', [PronosticoController::class, 'index'])->name('admin.pronostico.index');

        Route::get('admin/casos-sociales/{casoSocial}/firma', [CasoSocialController::class, 'downloadFirma'])->name('admin.casos-sociales.firma');
        Route::resource('admin/casos-sociales', CasoSocialController::class)->names('admin.casos-sociales');
    });
});

require __DIR__ . '/auth.php';
