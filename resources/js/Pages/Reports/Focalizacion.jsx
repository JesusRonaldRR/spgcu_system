import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Focalizacion({ auth, postulaciones, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Reporte de Focalización Socioeconómica</h2>}
        >
            <Head title="Reporte Focalización" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-blue-500">
                            <div className="text-gray-500 text-sm font-medium">Total Postulantes</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.total}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-green-500">
                            <div className="text-gray-500 text-sm font-medium">Aprobados</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.aprobados}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-yellow-500">
                            <div className="text-gray-500 text-sm font-medium">Pendientes</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.pendientes}</div>
                        </div>
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border-l-4 border-red-500">
                            <div className="text-gray-500 text-sm font-medium">Rechazados</div>
                            <div className="text-3xl font-bold text-gray-800">{stats.rechazados}</div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-bold mb-4">Listado de Clasificación Socioeconómica</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Puesto</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estudiante</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">DNI / Código</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Puntaje SISFOH</th>
                                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {postulaciones.map((postulacion, index) => (
                                            <tr key={postulacion.id}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="font-bold">#{index + 1}</span>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <p className="text-gray-900 whitespace-no-wrap font-bold">
                                                                {postulacion.usuario.nombres} {postulacion.usuario.apellidos}
                                                            </p>
                                                            <p className="text-gray-500 text-xs">{postulacion.usuario.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{postulacion.usuario.codigo || postulacion.usuario.dni}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="font-bold text-gray-700">{postulacion.puntaje} pts</span>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className={`relative inline-block px-3 py-1 font-semibold leading-tight text-white rounded-full ${postulacion.estado === 'aprobado' ? 'bg-green-500' :
                                                        postulacion.estado === 'rechazado' ? 'bg-red-500' : 'bg-yellow-500'
                                                        }`}>
                                                        <span className="relative capitalize">{postulacion.estado}</span>
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
