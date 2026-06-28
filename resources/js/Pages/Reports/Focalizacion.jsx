import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Focalizacion({ auth, postulaciones, stats }) {
    const exportToCSV = () => {
        const headers = ["Puesto", "Estudiante", "DNI", "Email", "Puntaje", "Estado", "Vivienda", "Salud", "Alimentacion", "Dependencia"];
        const rows = postulaciones.map((p, index) => [
            index + 1,
            `"${p.usuario.nombres} ${p.usuario.apellidos}"`,
            p.usuario.dni,
            p.usuario.email,
            p.puntaje,
            p.estado,
            p.indicadores_socioeconomicos?.vivienda || '',
            p.indicadores_socioeconomicos?.salud || '',
            p.indicadores_socioeconomicos?.alimentacion || '',
            p.indicadores_socioeconomicos?.dependencia || ''
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "reporte_focalizacion.csv");
        document.body.appendChild(link);
        link.click();
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Reporte Focalización" />

            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#0f4c9b]/10 rounded-lg">
                        <svg className="w-6 h-6 text-[#0f4c9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m32 2v-2a4 4 0 00-4-4h-5a4 4 0 00-4 4v2m-9-4h.01M9 16h.01" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">Reporte de Focalización</h1>
                        <p className="text-gray-500 text-sm">Clasificación socioeconómica de postulantes</p>
                    </div>
                </div>

                <button
                    onClick={exportToCSV}
                    className="flex items-center px-4 py-2 bg-[#0f4c9b] text-white rounded-lg hover:bg-[#0a3a7a] transition shadow-md font-bold text-sm"
                >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    EXPORTAR CSV
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-blue-500">
                    <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Total Postulantes</div>
                    <div className="text-3xl font-black text-[#1e3a5f]">{stats.total}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-green-500">
                    <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Aprobados</div>
                    <div className="text-3xl font-black text-[#1e3a5f]">{stats.aprobados}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-yellow-500">
                    <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Pendientes</div>
                    <div className="text-3xl font-black text-[#1e3a5f]">{stats.pendientes}</div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm p-6 border-b-4 border-red-500">
                    <div className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">Rechazados</div>
                    <div className="text-3xl font-black text-[#1e3a5f]">{stats.rechazados}</div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-lg font-black text-[#1e3a5f] uppercase tracking-tight">Ranking de Prioridad</h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">Actualizado hoy</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white">
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Puesto</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Estudiante</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">DNI / Código</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Puntaje</th>
                                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Estado</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {postulaciones.map((postulacion, index) => (
                                <tr key={postulacion.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-5">
                                        <span className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-xs ${
                                            index < 3 ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'
                                        }`}>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#1e3a5f] text-sm group-hover:text-[#0f4c9b] transition-colors">
                                                {postulacion.usuario.nombres} {postulacion.usuario.apellidos}
                                            </span>
                                            <span className="text-gray-400 text-[10px] font-medium">{postulacion.usuario.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-gray-600 font-mono text-xs font-bold">
                                            {postulacion.usuario.codigo || postulacion.usuario.dni}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <div className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-black bg-blue-50 text-[#0f4c9b] border border-blue-100">
                                            {postulacion.puntaje}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm ${
                                            postulacion.estado === 'aprobado' || postulacion.estado === 'becario' ? 'bg-green-500 text-white' :
                                            postulacion.estado === 'rechazado' ? 'bg-red-500 text-white' : 'bg-orange-400 text-white'
                                        }`}>
                                            {postulacion.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
