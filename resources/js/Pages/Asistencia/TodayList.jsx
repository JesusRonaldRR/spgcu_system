import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

export default function TodayList({ auth, date, reservations, serverTime, menus }) {

    // Helper to render a table for a specific meal type
    // title: e.g. "☕ Desayuno"
    // items: Array of reservations or null
    // colorClass: Header color
    // typeKey: 'desayuno' | 'almuerzo' | 'cena' to look up in menus prop
    const renderTable = (title, items, colorClass, typeKey) => {
        // Check if menu is expired
        let isExpired = false;

        // Find menu info from the passed 'menus' prop (keyed by 'tipo')
        // This ensures we have the schedule even if 'items' is empty
        const menuInfo = menus && menus[typeKey] ? menus[typeKey] : null;

        if (menuInfo) {
            // Compare string times directly (HH:mm:ss) works for same day
            if (menuInfo.hora_fin < serverTime) {
                isExpired = true;
            }
        }

        return (
            <div className={`mb-8 ${isExpired ? 'opacity-75' : ''}`}>
                <div className={`flex justify-between items-center px-4 py-2 rounded-t-lg ${colorClass} text-white`}>
                    <h3 className="text-xl font-bold">
                        {title} ({items ? items.length : 0})
                    </h3>
                    {isExpired && (
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase border border-white">
                            Vencido (Cerrado)
                        </span>
                    )}
                </div>
                <div className="bg-white shadow rounded-b-lg overflow-hidden border">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Escuela</th>
                                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Asistencia</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {!items || items.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500 italic">
                                        No hay estudiantes programados.
                                    </td>
                                </tr>
                            ) : (
                                items.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {item.usuario.apellidos}, {item.usuario.nombres}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.usuario.codigo}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {item.usuario.escuela || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <label className={`relative inline-flex items-center ${isExpired ? 'cursor-not-allowed' : 'cursor-pointer'} no-print`}>
                                                <input
                                                    type="checkbox"
                                                    checked={item.estado === 'asistio'}
                                                    disabled={isExpired}
                                                    className="sr-only peer"
                                                    onChange={(e) => {
                                                        const isChecked = e.target.checked;
                                                        if (confirm(`¿Marcar como ${isChecked ? 'ASISTIÓ' : 'NO ASISTIÓ'}?`)) {
                                                            router.post(route('asistencia.toggle', item.id), {
                                                                asistio: isChecked
                                                            }, {
                                                                preserveScroll: true
                                                            });
                                                        }
                                                    }}
                                                />
                                                <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${item.estado === 'asistio' ? 'peer-checked:bg-green-600' : ''}`}></div>
                                                <span className="ml-3 text-sm font-medium text-gray-900">
                                                    {item.estado === 'asistio' ? 'Presente' : 'Ausente'}
                                                </span>
                                            </label>

                                            {/* Status for Print View */}
                                            <span className="hidden print:inline px-2 py-1 border rounded text-xs font-bold">
                                                {item.estado === 'asistio' ? 'ASISTIÓ' : 'NO ASISTIÓ'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de Asistencia del Día</h2>}
        >
            <Head title={`Asistencia ${date}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex justify-between items-center mb-6 no-print">
                        <h2 className="text-2xl font-bold text-gray-700">📅 Asistencia: {date}</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => window.print()}
                                className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
                            >
                                🖨️ Imprimir
                            </button>
                            <a
                                href={route('asistencia.exportar')}
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                📥 Exportar Excel
                            </a>
                            <button
                                onClick={() => {
                                    if (confirm('¿Está seguro de procesar las faltas?\n\nSe marcarán como FALTA todos los estudiantes programados hasta ahora que no hayan asistido.')) {
                                        router.post(route('asistencia.procesar-faltas'));
                                    }
                                }}
                                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                                ⚠️ Procesar Faltas
                            </button>
                        </div>
                    </div>

                    {renderTable('☕ Desayuno', reservations.desayuno, 'bg-yellow-500', 'desayuno')}
                    {renderTable('🍽️ Almuerzo', reservations.almuerzo, 'bg-orange-500', 'almuerzo')}
                    {renderTable('🌙 Cena', reservations.cena, 'bg-indigo-600', 'cena')}

                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print { display: none; }
                    body { -webkit-print-color-adjust: exact; }
                }
            `}</style>
        </AuthenticatedLayout>
    );
}
