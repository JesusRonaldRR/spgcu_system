import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';

export default function Horario({ auth, menus, programaciones, programacionesDetalle, startDate, faltasCount = 0, serverDate, serverTime }) {
    const [selectedMenuIds, setSelectedMenuIds] = useState([]);

    // Initialize from props
    useEffect(() => {
        if (programaciones && Array.isArray(programaciones)) {
            setSelectedMenuIds(programaciones.map(id => Number(id)));
        }
    }, [programaciones]);

    // Parse current month
    const startDateObj = new Date(startDate + 'T00:00:00');
    const monthName = startDateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();

    // Build calendar grid
    const calendarDays = useMemo(() => {
        const days = [];
        const firstDay = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
        const lastDay = new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 0);
        const startDayOfWeek = firstDay.getDay();
        const totalDays = lastDay.getDate();

        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ isEmpty: true });
        }

        for (let day = 1; day <= totalDays; day++) {
            const dateStr = `${startDateObj.getFullYear()}-${String(startDateObj.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            days.push({
                isEmpty: false,
                day: day,
                date: dateStr,
                menus: menus[dateStr] || []
            });
        }

        return days;
    }, [menus, startDate]);

    // Meal config
    const mealConfig = {
        desayuno: { icon: '☕', label: 'Desayuno', color: 'bg-yellow-50 border-yellow-300 text-yellow-800' },
        almuerzo: { icon: '🍽️', label: 'Almuerzo', color: 'bg-orange-50 border-orange-300 text-orange-800' },
        cena: { icon: '🌙', label: 'Cena', color: 'bg-indigo-50 border-indigo-300 text-indigo-800' }
    };

    const isMenuExpired = (menu) => {
        if (!serverDate || !serverTime) return false;
        // If date is in the past
        if (menu.fecha < serverDate) return true;
        // If date is today, check time
        if (menu.fecha === serverDate && menu.hora_fin < serverTime) return true;
        return false;
    };

    const toggleSelection = (menu, dateStr) => {
        const id = Number(menu.id);

        if (isMenuExpired(menu)) {
            alert('El horario para este menú ya ha finalizado.');
            return;
        }

        // Count current selections for this date
        const dayMenus = menus[dateStr] || [];
        const currentDaySelections = dayMenus.filter(m => selectedMenuIds.includes(m.id));

        if (selectedMenuIds.includes(id)) {
            // Remove
            setSelectedMenuIds(selectedMenuIds.filter(sid => sid !== id));
        } else {
            // Add - check max 3
            if (currentDaySelections.length >= 3) {
                alert('Máximo 3 comidas por día.');
                return;
            }
            setSelectedMenuIds([...selectedMenuIds, id]);
        }
    };

    const saveDay = (dateStr) => {
        // Prevent saving past days
        if (dateStr < serverDate) {
            alert('No se puede modificar programaciones de días pasados.');
            return;
        }

        const dayMenus = menus[dateStr] || [];
        const selectedForDay = dayMenus.filter(m => selectedMenuIds.includes(m.id)).map(m => m.id);

        router.post(route('menus.programar'), {
            fecha: dateStr,
            menus: selectedForDay
        }, {
            preserveScroll: true,
            onSuccess: () => alert('¡Horario guardado!')
        });
    };

    const handleConfirmar = (menuId, confirmado) => {
        router.post(route('menus.confirmar', menuId), {
            confirmado: confirmado
        }, {
            preserveScroll: true
        });
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Horario del Comedor</h2>}
        >
            <Head title="Horario Comedor" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {auth.user.estado === 'suspendido' && (
                        <div className="bg-red-600 text-white p-4 rounded-lg shadow-lg mb-6 flex items-center animate-pulse">
                            <span className="text-2xl mr-3">🚫</span>
                            <div>
                                <h3 className="font-bold">BENEFICIO SUSPENDIDO</h3>
                                <p className="text-sm opacity-90">Has acumulado 3 o más faltas. Contacta con Bienestar Universitario para regularizar tu situación.</p>
                            </div>
                        </div>
                    )}

                    {/* Info Banner */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center border-l-4 border-green-500">
                        <div className="max-w-xl">
                            <h3 className="text-xl font-bold text-gray-800">📅 Mis Reservas</h3>
                            <p className="text-gray-600 text-sm">
                                Selecciona los menús a los que asistirás.
                                <b> Importante:</b> Para optimizar las raciones de cocina, marca "Confirmar"
                                para asegurar tu plato del día siguiente.
                            </p>
                        </div>
                        <div className="text-center bg-gray-100 p-3 rounded">
                            <div className="text-xs text-gray-500 uppercase">Inasistencias</div>
                            <div className={`text-2xl font-bold ${faltasCount >= 3 ? 'text-red-600' : 'text-red-500'}`}>{faltasCount}/3</div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-700 text-white p-4 text-center">
                            <h2 className="text-xl font-bold">{monthName}</h2>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 bg-gray-100 text-center text-gray-600 text-sm font-semibold py-2">
                            {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(d => <div key={d}>{d}</div>)}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 border-t">
                            {calendarDays.map((cell, idx) => (
                                <div
                                    key={idx}
                                    className={`min-h-[160px] border-b border-r p-2 flex flex-col ${cell.isEmpty ? 'bg-gray-50' : 'bg-white'}`}
                                >
                                    {!cell.isEmpty && (
                                        <>
                                            <div className={`text-right text-sm font-bold mb-1 ${cell.date === todayStr ? 'text-blue-600' : 'text-gray-400'}`}>
                                                {cell.day}
                                            </div>
                                            <div className="flex-grow space-y-2">
                                                {cell.menus.length === 0 ? (
                                                    <div className="text-xs text-gray-300 italic text-center py-3">Sin servicio</div>
                                                ) : (
                                                    cell.menus.map(menu => {
                                                        const isSelected = selectedMenuIds.includes(menu.id);
                                                        const expired = isMenuExpired(menu);
                                                        const detalle = programacionesDetalle?.[menu.id];
                                                        const cfg = mealConfig[menu.tipo] || { icon: '?', label: menu.tipo, color: 'bg-gray-100 border-gray-300 text-gray-700' };

                                                        let itemClasses = `text-[10px] p-1.5 rounded border transition-all flex flex-col `;
                                                        if (expired) {
                                                            itemClasses += `opacity-50 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400 grayscale`;
                                                        } else if (isSelected) {
                                                            itemClasses += `bg-green-100 border-green-500 text-green-900 shadow cursor-pointer`;
                                                        } else {
                                                            itemClasses += `${cfg.color} opacity-60 hover:opacity-100 cursor-pointer`;
                                                        }

                                                        return (
                                                            <div key={menu.id} className="space-y-1">
                                                                <div
                                                                    onClick={() => toggleSelection(menu, cell.date)}
                                                                    className={itemClasses}
                                                                >
                                                                    <div className="flex justify-between items-center w-full">
                                                                        <span className="flex items-center gap-1">
                                                                            <span>{cfg.icon}</span>
                                                                            <span className="font-bold">{cfg.label}</span>
                                                                        </span>
                                                                        {isSelected && <span className="text-green-600 font-bold">✓</span>}
                                                                    </div>
                                                                    <div className="mt-1 text-[9px] text-gray-500 font-medium">
                                                                        {menu.hora_inicio.substring(0, 5)} - {menu.hora_fin.substring(0, 5)}
                                                                    </div>
                                                                    {expired && <div className="text-[8px] uppercase font-black text-red-500 mt-0.5">FINALIZADO</div>}
                                                                </div>

                                                                {/* Confirmation Toggle (Only for current reservations & NOT EXPIRED) */}
                                                                {isSelected && !expired && (
                                                                    <div className="flex items-center justify-between px-1">
                                                                        <span className="text-[8px] font-bold text-indigo-700 uppercase">Confirmar?</span>
                                                                        <button
                                                                            onClick={() => handleConfirmar(menu.id, !detalle?.confirmado)}
                                                                            className={`w-10 h-4 rounded-full relative transition-colors duration-200 ${detalle?.confirmado ? 'bg-indigo-600' : 'bg-gray-300'}`}
                                                                        >
                                                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${detalle?.confirmado ? 'translate-x-6' : 'translate-x-1'}`}></div>
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                            {cell.menus.length > 0 && (
                                                <div className="pt-2 mt-2 border-t flex justify-between items-center">
                                                    {(cell.date >= serverDate) && (
                                                        <button
                                                            onClick={() => saveDay(cell.date)}
                                                            disabled={auth.user.estado === 'suspendido'}
                                                            className={`text-white text-xs px-2 py-1 rounded transition-colors ${auth.user.estado === 'suspendido' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                                        >
                                                            {auth.user.estado === 'suspendido' ? 'Bloqueado' : 'Guardar'}
                                                        </button>
                                                    )}
                                                    {cell.menus.every(m => !selectedMenuIds.includes(m.id)) && (
                                                        <a href={route('justificaciones.index')} className="text-pink-500 text-xs hover:underline">Justificar</a>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
