import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';

export default function Index({ auth, menus, currentStart, currentEnd }) {
    const [showModal, setShowModal] = useState(false);
    const [editingMenu, setEditingMenu] = useState(null);

    const { data, setData, post, patch, processing, reset, errors } = useForm({
        fecha: '',
        tipo: 'almuerzo',
        descripcion: '',
        hora_inicio: '12:00',
        hora_fin: '14:00'
    });

    // Parse current month from props
    const startDateObj = new Date(currentStart + 'T00:00:00');
    const monthName = startDateObj.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();

    // Navigate to different month
    const goToMonth = (offset) => {
        const d = new Date(startDateObj);
        d.setMonth(d.getMonth() + offset);
        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const start = `${year}-${String(month).padStart(2, '0')}-01`;
        const lastDay = new Date(year, month, 0).getDate();
        const end = `${year}-${String(month).padStart(2, '0')}-${lastDay}`;
        router.get(route('admin.menus.index'), { start, end }, { preserveState: true });
    };

    // Build calendar grid
    const calendarDays = useMemo(() => {
        const days = [];
        const firstDayOfMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth(), 1);
        const lastDayOfMonth = new Date(startDateObj.getFullYear(), startDateObj.getMonth() + 1, 0);
        const startDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
        const totalDays = lastDayOfMonth.getDate();

        // Padding for days before month starts
        for (let i = 0; i < startDayOfWeek; i++) {
            days.push({ isEmpty: true });
        }

        // Actual days
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
    }, [menus, currentStart]);

    // Meal type configuration
    const mealConfig = {
        desayuno: { icon: '☕', label: 'Desayuno', bg: 'bg-yellow-100', border: 'border-yellow-400', text: 'text-yellow-800' },
        almuerzo: { icon: '🍽️', label: 'Almuerzo', bg: 'bg-orange-100', border: 'border-orange-400', text: 'text-orange-800' },
        cena: { icon: '🌙', label: 'Cena', bg: 'bg-indigo-100', border: 'border-indigo-400', text: 'text-indigo-800' }
    };

    const mealTimes = {
        desayuno: { inicio: '07:00', fin: '09:00' },
        almuerzo: { inicio: '12:00', fin: '14:00' },
        cena: { inicio: '18:00', fin: '20:00' }
    };

    const openCreateModal = (dateStr) => {
        setEditingMenu(null);
        setData({
            fecha: dateStr,
            tipo: 'almuerzo',
            descripcion: '',
            hora_inicio: '12:00',
            hora_fin: '14:00'
        });
        setShowModal(true);
    };

    const openEditModal = (menu) => {
        setEditingMenu(menu);
        setData({
            fecha: menu.fecha,
            tipo: menu.tipo,
            descripcion: menu.descripcion,
            hora_inicio: menu.hora_inicio ? menu.hora_inicio.substring(0, 5) : '12:00',
            hora_fin: menu.hora_fin ? menu.hora_fin.substring(0, 5) : '14:00'
        });
        setShowModal(true);
    };

    const handleTypeChange = (tipo) => {
        setData({
            ...data,
            tipo,
            hora_inicio: mealTimes[tipo].inicio,
            hora_fin: mealTimes[tipo].fin
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const options = {
            onSuccess: () => {
                setShowModal(false);
                setEditingMenu(null);
                reset();
            }
        };

        if (editingMenu) {
            patch(route('admin.menus.update', editingMenu.id), options);
        } else {
            post(route('admin.menus.store'), options);
        }
    };

    const handleDelete = () => {
        if (confirm('¿Eliminar este menú?')) {
            router.delete(route('admin.menus.destroy', editingMenu.id), {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingMenu(null);
                }
            });
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Menús del Comedor</h2>}
        >
            <Head title="Menús Comedor" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Quick Links */}
                    <div className="bg-white rounded-lg shadow p-4 mb-6 flex justify-between items-center">
                        <div className="flex gap-4">
                            <a href={route('asistencia.today')} className="text-blue-600 font-semibold hover:underline">📋 Lista Asistencia Hoy</a>
                            <span className="text-gray-300">|</span>
                            <a href={route('justificaciones.index')} className="text-pink-600 font-semibold hover:underline">⚠️ Justificaciones</a>
                        </div>
                        <button
                            onClick={() => openCreateModal(todayStr)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700"
                        >
                            + Nuevo Menú
                        </button>
                    </div>

                    {/* Calendar */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-slate-700 text-white p-4 flex justify-between items-center">
                            <button onClick={() => goToMonth(-1)} className="px-3 py-1 hover:bg-white/20 rounded">← Anterior</button>
                            <h2 className="text-xl font-bold">{monthName}</h2>
                            <button onClick={() => goToMonth(1)} className="px-3 py-1 hover:bg-white/20 rounded">Siguiente →</button>
                        </div>

                        {/* Weekdays */}
                        <div className="grid grid-cols-7 bg-gray-100 text-center text-gray-600 text-sm font-semibold py-2">
                            {['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'].map(d => <div key={d}>{d}</div>)}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 border-t">
                            {calendarDays.map((cell, idx) => {
                                const isPast = !cell.isEmpty && cell.date < todayStr;
                                return (
                                    <div
                                        key={idx}
                                        className={`min-h-[120px] border-b border-r p-2 
                                            ${cell.isEmpty ? 'bg-gray-50' : ''} 
                                            ${isPast ? 'bg-gray-100 opacity-60' : 'bg-white hover:bg-blue-50/30 cursor-pointer'}`}
                                        onClick={() => !cell.isEmpty && !isPast && openCreateModal(cell.date)}
                                    >
                                        {!cell.isEmpty && (
                                            <>
                                                <div className={`text-right text-sm font-bold mb-1 ${cell.date === todayStr ? 'text-blue-600' : isPast ? 'text-gray-300' : 'text-gray-400'}`}>
                                                    {cell.day}
                                                </div>
                                                <div className="space-y-1">
                                                    {cell.menus.length === 0 ? (
                                                        <div className="text-xs text-gray-300 italic text-center py-2">Sin servicio</div>
                                                    ) : (
                                                        cell.menus.map(menu => {
                                                            const cfg = mealConfig[menu.tipo] || { icon: '?', label: menu.tipo, bg: 'bg-gray-100', border: 'border-gray-300', text: 'text-gray-700' };
                                                            return (
                                                                <div
                                                                    key={menu.id}
                                                                    onClick={(e) => { e.stopPropagation(); if (!isPast) openEditModal(menu); }}
                                                                    className={`text-xs p-1.5 rounded border-l-4 ${cfg.bg} ${cfg.border} ${cfg.text} ${isPast ? 'cursor-not-allowed' : 'cursor-pointer hover:shadow'}`}
                                                                >
                                                                    <div className="font-semibold">{cfg.icon} {cfg.label}</div>
                                                                    <div className="truncate opacity-70">{menu.descripcion}</div>
                                                                </div>
                                                            );
                                                        })
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">{editingMenu ? 'Editar Menú' : 'Nuevo Menú'}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                                    <input
                                        type="date"
                                        value={data.fecha}
                                        onChange={e => setData('fecha', e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                    <select
                                        value={data.tipo}
                                        onChange={e => handleTypeChange(e.target.value)}
                                        className="w-full border-gray-300 rounded-md shadow-sm"
                                    >
                                        <option value="desayuno">Desayuno</option>
                                        <option value="almuerzo">Almuerzo</option>
                                        <option value="cena">Cena</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={data.descripcion}
                                    onChange={e => setData('descripcion', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm h-20"
                                    placeholder="Ej: Arroz con pollo, ensalada..."
                                />
                                {errors.descripcion && <p className="text-red-500 text-xs mt-1">{errors.descripcion}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Inicio</label>
                                    <input type="time" value={data.hora_inicio} onChange={e => setData('hora_inicio', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Hora Fin</label>
                                    <input type="time" value={data.hora_fin} onChange={e => setData('hora_fin', e.target.value)} className="w-full border-gray-300 rounded-md shadow-sm" />
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                {editingMenu && (
                                    <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200">Eliminar</button>
                                )}
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">Cancelar</button>
                                <button type="submit" disabled={processing} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                                    {editingMenu ? 'Actualizar' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
