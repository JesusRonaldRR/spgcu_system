import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function Index({ auth, servicios, misSolicitudes }) {
    const [requesting, setRequesting] = useState(null);
    const { data, setData, post, processing, reset } = useForm({
        servicio: '',
        motivo: '',
        modalidad: '' // Init
    });

    const openRequestModal = (servicio) => {
        if (!auth.user.rol === 'admin') { // Admin check just in case, though controller blocks non-beneficiary
            // logic
        }
        setRequesting(servicio);
        setData({
            servicio: servicio.nombre,
            motivo: ''
        });
    };

    const submitRequest = (e) => {
        e.preventDefault();
        post(route('otros-servicios.store'), {
            onSuccess: () => {
                setRequesting(null);
                reset();
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Otros Servicios de Bienestar</h2>}
        >
            <Head title="Otros Servicios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">

                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-teal-500 to-emerald-600 rounded-lg shadow-lg p-6 text-white">
                        <h3 className="text-2xl font-bold mb-2">¡Bienvenido Beneficiario!</h3>
                        <p className="text-teal-100 text-lg">
                            Como beneficiario del Comedor Universitario, tienes acceso exclusivo a estos servicios adicionales.
                        </p>
                    </div>

                    {/* MIS SOLICITUDES SECTION */}
                    {misSolicitudes && misSolicitudes.length > 0 && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Mis Solicitudes Activas</h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Servicio</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Fecha Programada</th>
                                            <th className="px-4 py-2 text-left text-xs font-bold text-gray-500 uppercase">Notas</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {misSolicitudes.map(req => (
                                            <tr key={req.id}>
                                                <td className="px-4 py-2">{req.servicio}</td>
                                                <td className="px-4 py-2">
                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase
                                                        ${req.estado === 'solicitado' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${req.estado === 'programada' ? 'bg-blue-100 text-blue-800' : ''}
                                                        ${req.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                                                        ${req.estado === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                                                    `}>
                                                        {req.estado}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-2 text-sm">
                                                    {req.fecha ? `${req.fecha} ${req.hora || ''}` : <span className="text-gray-400 italic">Por definir</span>}
                                                </td>
                                                <td className="px-4 py-2 text-sm text-gray-600">{req.admin_notes || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* SERVICES GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
                        {servicios.map((servicio) => (
                            <div key={servicio.id} className="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-teal-100 rounded-full p-3">
                                            <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                        </div>
                                        <span className="bg-teal-50 text-teal-700 text-xs px-2 py-1 rounded font-bold uppercase tracking-wider">
                                            {servicio.modalidad}
                                        </span>
                                    </div>

                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{servicio.nombre}</h3>
                                    <p className="text-gray-600 mb-4 h-12 overflow-hidden">{servicio.descripcion}</p>

                                    <div className="border-t border-gray-100 pt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            {servicio.horario}
                                        </div>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            Requisitos: {servicio.requisitos.join(', ')}
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            onClick={() => openRequestModal(servicio)}
                                            className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded transition-colors duration-200 flex items-center justify-center"
                                        >
                                            Solicitar Servicio
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            <Modal show={!!requesting} onClose={() => setRequesting(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">
                        Solicitar {requesting?.nombre}
                    </h2>
                    <form onSubmit={submitRequest}>
                        {requesting?.modalidad === 'Híbrido (Presencial/Virtual)' && (
                            <div className="mb-4">
                                <InputLabel value="Modalidad Preferida" />
                                <select
                                    className="w-full border-gray-300 rounded text-sm mt-1"
                                    value={data.modalidad}
                                    onChange={e => setData('modalidad', e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione...</option>
                                    <option value="Presencial">Presencial</option>
                                    <option value="Virtual">Virtual</option>
                                </select>
                            </div>
                        )}

                        <div className="mb-4">
                            <InputLabel value="Razón / Motivo (Obligatorio)" />
                            <TextInput
                                className="w-full mt-1"
                                placeholder="Describa brevemente la razón de su solicitud..."
                                value={data.motivo}
                                onChange={e => setData('motivo', e.target.value)}
                                required
                            />
                        </div>
                        <p className="text-sm text-gray-500 mb-6">
                            Al solicitar este servicio, un administrativo se pondrá en contacto o asignará una fecha en su calendario.
                        </p>
                        <div className="flex justify-end space-x-2">
                            <SecondaryButton onClick={() => setRequesting(null)}>
                                Cancelar
                            </SecondaryButton>
                            <PrimaryButton disabled={processing}>
                                Confirmar Solicitud
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
