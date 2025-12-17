import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Comedor({ auth, dailyStats, mealStats, recentActivity }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reporte General del Comedor</h2>}
        >
            <Head title="Reporte Comedor" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Summary Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Daily Stats Table */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Raciones Servidas (Últimos 7 días)</h3>
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cantidad</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dailyStats.map((stat, index) => (
                                            <tr key={index}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{stat.date}</td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-bold">{stat.count}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Meal Type Distribution */}
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Distribución por Tipo de Menú</h3>
                                <div className="space-y-4">
                                    {mealStats.map((stat, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-32 font-medium text-gray-600 capitalize">{stat.tipo_menu}</div>
                                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                                <div
                                                    className="bg-indigo-600 h-4 rounded-full"
                                                    style={{ width: `${(stat.count / mealStats.reduce((a, b) => a + b.count, 0)) * 100}%` }}
                                                ></div>
                                            </div>
                                            <div className="ml-4 font-bold text-gray-800">{stat.count}</div>
                                        </div>
                                    ))}
                                    {mealStats.length === 0 && <p className="text-gray-500">No hay datos de asistencia aún.</p>}
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente en Comedor</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Hora</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estudiante</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Menú</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recentActivity.map((log) => (
                                            <tr key={log.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {new Date(log.fecha_hora_escaneo).toLocaleString()}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm font-medium">
                                                    {log.estudiante ? `${log.estudiante.nombres} ${log.estudiante.apellidos}` : 'Desconocido'}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm capitalize">
                                                    {log.tipo_menu}
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 capitalize">
                                                        {log.estado}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
