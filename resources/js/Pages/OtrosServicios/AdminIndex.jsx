import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';

export default function AdminIndex({ auth, solicitudes }) {
    const [scheduling, setScheduling] = useState(null);
    const { data, setData, patch, processing, reset } = useForm({
        fecha: '',
        hora: '',
        estado: '',
        admin_notes: ''
    });

    const openScheduleModal = (item) => {
        setScheduling(item);
        setData({
            fecha: item.fecha || '',
            hora: item.hora || '',
            estado: item.estado || 'programada',
            admin_notes: item.admin_notes || ''
        });
    };

    const submitSchedule = (e) => {
        e.preventDefault();
        patch(route('admin.otros-servicios.update', scheduling.id), {
            onSuccess: () => {
                setScheduling(null);
                reset();
                alert('Solicitud actualizada correctamente.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Otros Servicios</h2>}
        >
            <Head title="Admin Otros Servicios" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        <h3 className="text-lg font-bold text-gray-900 mb-6">Solicitudes de Servicios</h3>

                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estudiante</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Servicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Programación</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {solicitudes.map(item => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {item.usuario?.nombres} {item.usuario?.apellidos}
                                                </div>
                                                <div className="text-xs text-gray-500">{item.usuario?.codigo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                <span className="font-semibold">{item.servicio}</span>
                                                {item.motivo && <p className="text-xs text-gray-500 mt-1 italic">"{item.motivo}"</p>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase
                                                    ${item.estado === 'solicitado' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                    ${item.estado === 'programada' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${item.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                                                    ${item.estado === 'cancelada' ? 'bg-red-100 text-red-800' : ''}
                                                `}>
                                                    {item.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                {item.fecha ? (
                                                    <div>
                                                        {item.fecha} <br />
                                                        <span className="text-xs text-gray-500">{item.hora}</span>
                                                    </div>
                                                ) : <span className="text-gray-400">-</span>}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <button
                                                    onClick={() => openScheduleModal(item)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-bold text-sm"
                                                >
                                                    Gestionar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {solicitudes.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                                No hay solicitudes pendientes.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Schedule Modal */}
            <Modal show={!!scheduling} onClose={() => setScheduling(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Gestionar Solicitud</h2>
                    {scheduling && (
                        <form onSubmit={submitSchedule}>
                            <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                                <p><strong>Servicio:</strong> {scheduling.servicio}</p>
                                <p><strong>Estudiante:</strong> {scheduling.usuario?.nombres} {scheduling.usuario?.apellidos}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Fecha" />
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        value={data.fecha}
                                        onChange={e => setData('fecha', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Hora" />
                                    <TextInput
                                        type="time"
                                        className="w-full"
                                        value={data.hora}
                                        onChange={e => setData('hora', e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <InputLabel value="Estado" />
                                <select
                                    className="w-full border-gray-300 rounded text-sm"
                                    value={data.estado}
                                    onChange={e => setData('estado', e.target.value)}
                                >
                                    <option value="solicitado">Solicitado (Pendiente)</option>
                                    <option value="programada">Programada</option>
                                    <option value="completada">Completada (Atendido)</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <InputLabel value="Notas Administrativas" />
                                <textarea
                                    className="w-full border-gray-300 rounded text-sm h-20"
                                    value={data.admin_notes}
                                    onChange={e => setData('admin_notes', e.target.value)}
                                    placeholder="Detalles para el estudiante..."
                                ></textarea>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <SecondaryButton onClick={() => setScheduling(null)}>Cancelar</SecondaryButton>
                                <PrimaryButton disabled={processing}>Guardar Cambios</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
