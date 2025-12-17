import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ auth, beneficiarios, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState(null);
    const [faults, setFaults] = useState([]);
    const [loadingFaults, setLoadingFaults] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.beneficiarios.index'), { search }, { preserveState: true });
    };

    const loadFaults = async (beneficiary) => {
        setSelectedBeneficiary(beneficiary);
        setLoadingFaults(true);
        try {
            const response = await fetch(route('admin.beneficiarios.faults', beneficiary.usuario_id));
            if (!response.ok) throw new Error('Error network');
            const data = await response.json();
            setFaults(data);
        } catch (error) {
            console.error(error);
            alert('Error al cargar las inasistencias');
        } finally {
            setLoadingFaults(false);
        }
    };

    const removeFault = (faultId) => {
        if (!confirm('¿Quitar esta falta (marcar como justificada)?')) return;

        router.delete(route('admin.beneficiarios.removeFault', faultId), {
            preserveScroll: true,
            onSuccess: () => {
                // Refresh local list
                setFaults(faults.filter(f => f.id !== faultId));
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Lista de Beneficiarios</h2>}
        >
            <Head title="Beneficiarios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header with Actions */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-700">Estudiantes Becarios Activos</h3>
                            <p className="text-sm text-gray-500">Total: {beneficiarios.total || 0} beneficiarios</p>
                        </div>

                        <div className="flex gap-3 flex-wrap">
                            {/* Search */}
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre, código..."
                                    className="border-gray-300 rounded-l px-3 py-2 text-sm w-64"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button type="submit" className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-r text-sm">🔍</button>
                            </form>

                            {/* Export Button */}
                            <a href={route('admin.beneficiarios.export')} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2">
                                📥 Excel
                            </a>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">DNI / Código</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Carrera</th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Faltas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Convocatoria</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {beneficiarios.data?.length === 0 ? (
                                    <tr><td colSpan="6" className="px-6 py-8 text-center text-gray-500">No hay beneficiarios.</td></tr>
                                ) : beneficiarios.data?.map((b) => (
                                    <tr key={b.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{b.usuario?.apellidos}, {b.usuario?.nombres}</div>
                                            <div className="text-xs text-gray-500">{b.usuario?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            <div>{b.usuario?.codigo}</div>
                                            <div className="text-xs text-gray-500">{b.usuario?.dni}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            <div>{b.usuario?.escuela}</div>
                                            <div className="text-xs text-gray-400">{b.usuario?.facultad}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => loadFaults(b)}
                                                className={`px-3 py-1 rounded-full text-xs font-bold ${b.faltas_count >= 3 ? 'bg-red-100 text-red-700 blink-pulse border border-red-300' : b.faltas_count > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}
                                            >
                                                {b.faltas_count} Faltas
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {b.convocatoria?.nombre}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => { if (confirm('¿Revocar beneficio?')) router.delete(route('admin.beneficiarios.destroy', b.id)); }}
                                                className="text-red-600 hover:text-red-900 font-bold border border-red-200 bg-red-50 hover:bg-red-100 rounded px-2 py-1"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Pagination */}
                        {beneficiarios.last_page > 1 && (
                            <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">Página {beneficiarios.current_page} de {beneficiarios.last_page}</span>
                                <div className="flex gap-2">
                                    {beneficiarios.prev_page_url && <Link href={beneficiarios.prev_page_url} className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-100">← Ant.</Link>}
                                    {beneficiarios.next_page_url && <Link href={beneficiarios.next_page_url} className="px-3 py-1 bg-white border rounded text-sm hover:bg-gray-100">Sig. →</Link>}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal Faltas */}
            {selectedBeneficiary && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                            <h3 className="font-bold text-gray-700">Inasistencias: {selectedBeneficiary.usuario.nombres} {selectedBeneficiary.usuario.apellidos}</h3>
                            <button onClick={() => setSelectedBeneficiary(null)} className="text-gray-400 hover:text-gray-600">✕</button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            {loadingFaults ? (
                                <p className="text-center text-gray-500 py-4">Cargando...</p>
                            ) : faults.length === 0 ? (
                                <p className="text-center text-green-600 py-4 font-bold">¡Este estudiante no tiene faltas registradas!</p>
                            ) : (
                                <ul className="space-y-3">
                                    {faults.map(fault => (
                                        <li key={fault.id} className="border rounded p-3 flex justify-between items-center bg-gray-50">
                                            <div>
                                                <div className="font-bold text-gray-800">{new Date(fault.menu?.fecha || fault.created_at).toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
                                                <div className="text-xs text-gray-500 capitalize">{fault.menu?.tipo || 'Menú desconocido'}</div>
                                            </div>
                                            <button
                                                onClick={() => removeFault(fault.id)}
                                                className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded hover:bg-indigo-200 border border-indigo-300 font-bold"
                                            >
                                                Quitar Falta
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="p-4 border-t bg-gray-50 text-right">
                            <button onClick={() => setSelectedBeneficiary(null)} className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-bold">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
