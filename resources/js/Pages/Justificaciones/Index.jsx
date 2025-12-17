import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { useState } from 'react';

export default function Index({ auth, justificaciones }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        fecha_a_justificar: '',
        motivo: '',
        archivo: null,
    });

    const [showForm, setShowForm] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('justificaciones.store'), {
            onSuccess: () => {
                reset();
                setShowForm(false);
            },
        });
    };

    const handleStatusChange = (id, newStatus) => {
        if (!confirm(`¿Confirmar cambio de estado a "${newStatus.toUpperCase()}"?`)) return;

        router.patch(route('justificaciones.update', id), {
            estado: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => {
                alert(`Justificación ${newStatus === 'aprobado' ? 'aprobada' : 'rechazada'} exitosamente.`);
            }
        });
    };

    const isStudent = auth.user.rol === 'estudiante';

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Justificaciones</h2>}
        >
            <Head title="Justificaciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    {/* Header Actions */}
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-gray-700">
                            {isStudent ? 'Mis Justificaciones' : 'Gestión de Justificaciones'}
                        </h3>
                        {isStudent && (
                            <button
                                onClick={() => setShowForm(!showForm)}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow"
                            >
                                {showForm ? 'Cancelar' : '+ Nueva Justificación'}
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Form Column (Only visible if showForm or if it's separate page, here inline) */}
                        {showForm && isStudent && (
                            <div className="lg:col-span-1">
                                <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg">
                                    <h4 className="text-md font-bold text-gray-800 mb-4 border-b pb-2">Solicitar Justificación</h4>

                                    <div className="mb-4">
                                        <InputLabel htmlFor="fecha" value="Fecha a Justificar" />
                                        <TextInput
                                            id="fecha"
                                            type="date"
                                            className="mt-1 block w-full"
                                            value={data.fecha_a_justificar}
                                            onChange={(e) => setData('fecha_a_justificar', e.target.value)}
                                        />
                                        {errors.fecha_a_justificar && <p className="text-red-500 text-sm mt-1">{errors.fecha_a_justificar}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel htmlFor="motivo" value="Motivo" />
                                        <textarea
                                            id="motivo"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            rows="4"
                                            value={data.motivo}
                                            onChange={(e) => setData('motivo', e.target.value)}
                                        ></textarea>
                                        {errors.motivo && <p className="text-red-500 text-sm mt-1">{errors.motivo}</p>}
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel htmlFor="archivo" value="Certificado / Evidencia (PDF/IMG)" />
                                        <input
                                            type="file"
                                            id="archivo"
                                            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                            onChange={(e) => setData('archivo', e.target.files[0])}
                                        />
                                        {errors.archivo && <p className="text-red-500 text-sm mt-1">{errors.archivo}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <PrimaryButton disabled={processing} className="w-full justify-center">
                                            Enviar Solicitud
                                        </PrimaryButton>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* List Column */}
                        <div className={`${showForm && isStudent ? 'lg:col-span-2' : 'lg:col-span-3'} bg-white shadow-sm sm:rounded-lg overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                            {!isStudent && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Evidencia</th>
                                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Estado</th>
                                            {!isStudent && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {justificaciones.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">No hay justificaciones registradas.</td>
                                            </tr>
                                        ) : justificaciones.map((just) => (
                                            <tr key={just.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                    {just.fecha_a_justificar}
                                                </td>
                                                {!isStudent && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {just.usuario?.nombres} <br />
                                                        <span className="text-gray-500 text-xs">{just.usuario?.codigo}</span>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                                    {just.motivo}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    {just.ruta_archivo ? (
                                                        <a href={`/storage/${just.ruta_archivo}`} target="_blank" className="text-blue-600 hover:underline text-sm font-medium">Ver Archivo</a>
                                                    ) : (
                                                        <span className="text-gray-400 text-xs">Sin archivo</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                        ${just.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                            just.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                        {just.estado.toUpperCase()}
                                                    </span>
                                                </td>
                                                {!isStudent && (
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {just.estado === 'pendiente' && (
                                                            <div className="flex justify-end space-x-2">
                                                                <button
                                                                    onClick={() => handleStatusChange(just.id, 'aprobado')}
                                                                    className="text-green-600 hover:text-green-900 bg-green-50 px-2 py-1 rounded"
                                                                >
                                                                    Aprobar
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(just.id, 'rechazado')}
                                                                    className="text-red-600 hover:text-red-900 bg-red-50 px-2 py-1 rounded"
                                                                >
                                                                    Rechazar
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                )}
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
