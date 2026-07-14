import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import FUTViewer from '@/Components/FUTViewer';

export default function Index({ auth, postulaciones, convocatoriasActivas }) {
    const isAdmin = ['admin', 'administrativo', 'coordinador'].includes(auth.user.rol);
    const [viewingPostulation, setViewingPostulation] = useState(null);
    const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
    const [processing, setProcessing] = useState(false);

    const handleVote = (id, estado) => {
        if (!confirm(`¿Estás seguro de marcar esta postulación como ${estado.replace(/_/g, ' ').toUpperCase()}?`)) return;

        setProcessing(true);
        router.patch(route('postulaciones.update', id), { estado }, {
            preserveScroll: true,
            onSuccess: () => {
                setProcessing(false);
            },
            onError: (errors) => {
                setProcessing(false);
                console.error('Error updating postulation:', errors);
                alert('Error al actualizar la postulación. Verifique la consola.');
            }
        });
    };

    const StatusBadge = ({ status }) => {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800',
            aprobado: 'bg-green-100 text-green-800',
            rechazado: 'bg-red-100 text-red-800',
            apto_entrevista: 'bg-blue-100 text-blue-800',
            entrevista_programada: 'bg-purple-100 text-purple-800',
            becario: 'bg-teal-100 text-teal-800 border border-teal-200',
            lista_espera: 'bg-orange-100 text-orange-800',
        };
        return (
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${colors[status] || 'bg-gray-100'}`}>
                {status.replace(/_/g, ' ').toUpperCase()}
            </span>
        );
    };

    // Filter Logic
    const pendingPostulations = postulaciones.filter(p => p.estado === 'pendiente');
    const historyPostulations = postulaciones.filter(p => p.estado !== 'pendiente');

    const displayedPostulations = isAdmin
        ? (activeTab === 'pending' ? pendingPostulations : historyPostulations)
        : postulaciones; // Students see all

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Postulaciones</h2>}
        >
            <Head title="Postulaciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Student View: Active Convocatorias or Warning */}
                    {auth.user.rol === 'estudiante' && (
                        <div className="mb-8">
                            {convocatoriasActivas.length > 0 ? (
                                <div className="space-y-4">
                                    {convocatoriasActivas.map(convocatoria => (
                                        <div key={convocatoria.id} className="bg-white border-l-4 border-blue-600 shadow-sm rounded-lg p-6 flex flex-col md:flex-row md:items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800 uppercase">Convocatoria: {convocatoria.nombre}</h3>
                                                <p className="text-sm text-gray-600">
                                                    Vigencia: <span className="font-semibold">{new Date(convocatoria.fecha_inicio).toLocaleDateString()}</span> hasta <span className="font-semibold">{new Date(convocatoria.fecha_fin).toLocaleDateString()}</span>
                                                </p>
                                            </div>
                                            <div className="mt-4 md:mt-0">
                                                <Link
                                                    href={route('postulaciones.create')}
                                                    className="inline-flex items-center px-6 py-3 bg-[#1e3a5f] hover:bg-[#0f4c9b] text-white font-bold rounded-lg shadow transition uppercase text-sm"
                                                >
                                                    Iniciar postulación
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-white shadow-sm border rounded-lg p-12 flex flex-col items-center justify-center text-center">
                                    <div className="w-24 h-24 mb-6 text-yellow-500">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-3xl font-bold text-orange-500 mb-4 uppercase">¡Advertencia!</h2>
                                    <p className="text-gray-700 text-lg max-w-2xl">
                                        ¡El Calendario Académico se encuentra cerrado para su sede ILO!, comunicarse con su Escuela Profesional
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Tabs for Admin */}
                    {isAdmin && (
                        <div className="mb-4 border-b border-gray-200">
                            <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                                <li className="mr-2">
                                    <button
                                        onClick={() => setActiveTab('pending')}
                                        className={`inline-block p-4 rounded-t-lg ${activeTab === 'pending'
                                            ? 'text-blue-600 border-b-2 border-blue-600 active bg-gray-50'
                                            : 'border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                                    >
                                        Por Revisar ({pendingPostulations.length})
                                    </button>
                                </li>
                                <li className="mr-2">
                                    <button
                                        onClick={() => setActiveTab('history')}
                                        className={`inline-block p-4 rounded-t-lg ${activeTab === 'history'
                                            ? 'text-blue-600 border-b-2 border-blue-600 active bg-gray-50'
                                            : 'border-b-2 border-transparent hover:text-gray-600 hover:border-gray-300'}`}
                                    >
                                        Historial ({historyPostulations.length})
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 overflow-x-auto">
                            {displayedPostulations.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    {isAdmin && activeTab === 'pending'
                                        ? '¡Excelente! No hay postulaciones pendientes de revisión.'
                                        : 'No hay postulaciones registradas.'}
                                </div>
                            ) : (
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Convocatoria</th>
                                            {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estudiante</th>}
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Puntaje</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {displayedPostulations.map((postulacion) => (
                                            <tr key={postulacion.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(postulacion.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{postulacion.convocatoria?.nombre}</div>
                                                </td>
                                                {isAdmin && (
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="text-sm font-medium text-gray-900">{postulacion.usuario?.nombres}</div>
                                                        <div className="text-sm text-gray-500">{postulacion.usuario?.codigo}</div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-bold bg-blue-100 text-blue-800">
                                                        {postulacion.puntaje} pts
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <StatusBadge status={postulacion.estado} />
                                                    {postulacion.estado === 'entrevista_programada' && postulacion.entrevista && (
                                                        <div className="mt-2 text-xs text-left bg-blue-50 p-2 rounded border border-blue-200">
                                                            <div className="font-bold text-blue-800 mb-1">Cita Programada:</div>
                                                            <div>📅 {postulacion.entrevista.fecha}</div>
                                                            <div>⏰ {postulacion.entrevista.hora}</div>
                                                            <div className="capitalize">📍 {postulacion.entrevista.tipo}</div>
                                                            {postulacion.entrevista.tipo === 'virtual' && postulacion.entrevista.link_reunion && (
                                                                <a href={postulacion.entrevista.link_reunion} target="_blank" className="text-blue-600 underline block mt-1">Ver Link</a>
                                                            )}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {isAdmin ? (
                                                        <div className="flex justify-end space-x-2">
                                                            <button
                                                                onClick={() => setViewingPostulation(postulacion)}
                                                                className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1 rounded shadow flex items-center"
                                                            >
                                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                                Ver FUT
                                                            </button>
                                                            {/* Only show Approve/Reject in Pending Tab */}
                                                            {postulacion.estado === 'pendiente' && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleVote(postulacion.id, 'apto_entrevista')}
                                                                        className="text-white hover:bg-green-700 bg-green-600 px-3 py-1 rounded shadow"
                                                                        title="Aprobar (Apto para Entrevista)"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleVote(postulacion.id, 'lista_espera')}
                                                                        className="text-white hover:bg-orange-700 bg-orange-600 px-3 py-1 rounded shadow"
                                                                        title="Mover a Lista de Espera"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleVote(postulacion.id, 'rechazado')}
                                                                        className="text-white hover:bg-red-700 bg-red-600 px-3 py-1 rounded shadow"
                                                                        title="Rechazar"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                                    </button>
                                                                </>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => setViewingPostulation(postulacion)}
                                                            className="text-blue-600 hover:underline"
                                                        >
                                                            Ver mi FUT
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* FUT Viewer Modal */}
            <Modal show={!!viewingPostulation} onClose={() => setViewingPostulation(null)} maxWidth="5xl">
                <div className="relative">
                    {/* Close button inside modal (top-right) */}
                    <button
                        onClick={() => setViewingPostulation(null)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 z-50 text-2xl font-bold"
                    >
                        &times;
                    </button>

                    <div className="max-h-[90vh] overflow-y-auto rounded-lg">
                        <FUTViewer postulacion={viewingPostulation} />
                        <div className="p-4 bg-gray-100 flex justify-end border-t">
                            <SecondaryButton onClick={() => setViewingPostulation(null)}>
                                Cerrar Vista Previa
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
