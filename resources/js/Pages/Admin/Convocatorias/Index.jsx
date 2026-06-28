import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function Index({ auth, convocatorias }) {
    const [showingModal, setShowingModal] = useState(false);
    const [editingConvocatoria, setEditingConvocatoria] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        nombre: '',
        fecha_inicio: '',
        fecha_fin: '',
        esta_activa: true,
    });

    const openCreateModal = () => {
        setEditingConvocatoria(null);
        reset();
        setShowingModal(true);
    };

    const openEditModal = (convocatoria) => {
        setEditingConvocatoria(convocatoria);
        setData({
            nombre: convocatoria.nombre,
            fecha_inicio: convocatoria.fecha_inicio,
            fecha_fin: convocatoria.fecha_fin,
            esta_activa: !!convocatoria.esta_activa,
        });
        setShowingModal(true);
    };

    const closeModal = () => {
        setShowingModal(false);
        reset();
    };

    const submit = (e) => {
        e.preventDefault();
        if (editingConvocatoria) {
            put(route('admin.convocatorias.update', editingConvocatoria.id), {
                onSuccess: () => closeModal(),
            });
        } else {
            post(route('admin.convocatorias.store'), {
                onSuccess: () => closeModal(),
            });
        }
    };

    const deleteConvocatoria = (id) => {
        if (confirm('¿Estás seguro de que deseas eliminar esta convocatoria?')) {
            destroy(route('admin.convocatorias.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Convocatorias</h2>}
        >
            <Head title="Convocatorias" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">
                        <div className="flex justify-between mb-6">
                            <h3 className="text-lg font-medium text-gray-900">Listado de Convocatorias</h3>
                            <PrimaryButton onClick={openCreateModal}>Nueva Convocatoria</PrimaryButton>
                        </div>

                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {convocatorias.map((convocatoria) => (
                                        <tr key={convocatoria.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{convocatoria.nombre}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{convocatoria.fecha_inicio}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{convocatoria.fecha_fin}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs rounded-full font-bold ${convocatoria.esta_activa ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {convocatoria.esta_activa ? 'ACTIVA' : 'INACTIVA'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <button onClick={() => openEditModal(convocatoria)} className="text-indigo-600 hover:text-indigo-900">Editar</button>
                                                <button onClick={() => deleteConvocatoria(convocatoria.id)} className="text-red-600 hover:text-red-900">Eliminar</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showingModal} onClose={closeModal}>
                <form onSubmit={submit} className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 mb-4">
                        {editingConvocatoria ? 'Editar Convocatoria' : 'Crear Nueva Convocatoria'}
                    </h2>

                    <div className="mb-4">
                        <InputLabel htmlFor="nombre" value="Nombre de la Convocatoria" />
                        <TextInput
                            id="nombre"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.nombre}
                            onChange={(e) => setData('nombre', e.target.value)}
                            required
                        />
                        <InputError message={errors.nombre} className="mt-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <InputLabel htmlFor="fecha_inicio" value="Fecha de Inicio" />
                            <TextInput
                                id="fecha_inicio"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.fecha_inicio}
                                onChange={(e) => setData('fecha_inicio', e.target.value)}
                                required
                            />
                            <InputError message={errors.fecha_inicio} className="mt-2" />
                        </div>
                        <div>
                            <InputLabel htmlFor="fecha_fin" value="Fecha de Fin" />
                            <TextInput
                                id="fecha_fin"
                                type="date"
                                className="mt-1 block w-full"
                                value={data.fecha_fin}
                                onChange={(e) => setData('fecha_fin', e.target.value)}
                                required
                            />
                            <InputError message={errors.fecha_fin} className="mt-2" />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                name="esta_activa"
                                checked={data.esta_activa}
                                onChange={(e) => setData('esta_activa', e.target.checked)}
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-600">¿Está activa para postulaciones?</span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                        <SecondaryButton onClick={closeModal}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>
                            {editingConvocatoria ? 'Actualizar' : 'Crear'}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
