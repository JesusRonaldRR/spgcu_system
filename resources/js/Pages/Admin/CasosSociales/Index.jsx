import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function Index({ auth, casos, usuarios }) {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [selectedCaso, setSelectedCaso] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        usuario_id: '',
        motivo: '',
        fecha_inicio: '',
        fecha_fin: '',
    });

    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);

    // Initialize canvas for signature
    useEffect(() => {
        if (showApproveModal && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
    }, [showApproveModal]);

    const startDrawing = (e) => {
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSigned(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const ctx = canvasRef.current.getContext('2d');
        const rect = canvasRef.current.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => setIsDrawing(false);

    const clearSignature = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setHasSigned(false);
    };

    const handleCreate = (e) => {
        e.preventDefault();
        post(route('admin.casos-sociales.store'), {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            }
        });
    };

    const handleApprove = (e) => {
        e.preventDefault();
        if (!hasSigned) {
            alert('Firma requerida');
            return;
        }

        canvasRef.current.toBlob((blob) => {
            const formData = new FormData();
            formData.append('estado', 'aprobado');
            formData.append('firma_digital', blob, 'firma_jefe.png');
            formData.append('_method', 'PUT');

            router.post(route('admin.casos-sociales.update', selectedCaso.id), formData, {
                onSuccess: () => {
                    setShowApproveModal(false);
                    setSelectedCaso(null);
                    setHasSigned(false);
                }
            });
        }, 'image/png');
    };

    const handleReject = (id) => {
        if (confirm('¿Seguro que desea rechazar este caso?')) {
            router.put(route('admin.casos-sociales.update', id), { estado: 'rechazado' });
        }
    };

    const handleDelete = (id) => {
        if (confirm('¿Eliminar registro?')) {
            router.delete(route('admin.casos-sociales.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Gestión de Casos Sociales</h2>}
        >
            <Head title="Casos Sociales" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <PrimaryButton onClick={() => setShowCreateModal(true)}>
                            Registrar Nuevo Caso
                        </PrimaryButton>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Motivo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Periodo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {casos.map((caso) => (
                                        <tr key={caso.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium">{caso.usuario.apellidos}, {caso.usuario.nombres}</div>
                                                <div className="text-xs text-gray-500">{caso.usuario.codigo}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-sm line-clamp-2" title={caso.motivo}>{caso.motivo}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {caso.fecha_inicio} al {caso.fecha_fin}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase ${
                                                        caso.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                                                        caso.estado === 'rechazado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                        {caso.estado}
                                                    </span>
                                                    {caso.estado === 'aprobado' && (
                                                        <a
                                                            href={route('admin.casos-sociales.firma', caso.id)}
                                                            target="_blank"
                                                            className="text-[10px] text-blue-600 underline font-bold"
                                                        >
                                                            Ver Firma
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {caso.estado === 'pendiente' && (
                                                    <>
                                                        <button
                                                            onClick={() => { setSelectedCaso(caso); setShowApproveModal(true); }}
                                                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                        >
                                                            Aprobar
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(caso.id)}
                                                            className="text-orange-600 hover:text-orange-900 mr-3"
                                                        >
                                                            Rechazar
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(caso.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {casos.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No hay casos sociales registrados.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            <Modal show={showCreateModal} onClose={() => setShowCreateModal(false)}>
                <form onSubmit={handleCreate} className="p-6">
                    <h2 className="text-lg font-bold mb-4">Registrar Caso Social</h2>

                    <div className="space-y-4">
                        <div>
                            <InputLabel value="Estudiante" />
                            <select
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                value={data.usuario_id}
                                onChange={e => setData('usuario_id', e.target.value)}
                                required
                            >
                                <option value="">Seleccione...</option>
                                {usuarios.map(u => (
                                    <option key={u.id} value={u.id}>{u.apellidos}, {u.nombres} ({u.codigo})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <InputLabel value="Motivo / Justificación" />
                            <textarea
                                className="w-full border-gray-300 rounded-md shadow-sm"
                                value={data.motivo}
                                onChange={e => setData('motivo', e.target.value)}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <InputLabel value="Fecha Inicio" />
                                <TextInput type="date" className="w-full" value={data.fecha_inicio} onChange={e => setData('fecha_inicio', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Fecha Fin" />
                                <TextInput type="date" className="w-full" value={data.fecha_fin} onChange={e => setData('fecha_fin', e.target.value)} required />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowCreateModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Approve Modal (with Signature) */}
            <Modal show={showApproveModal} onClose={() => setShowApproveModal(false)}>
                <form onSubmit={handleApprove} className="p-6">
                    <h2 className="text-lg font-bold mb-2 text-indigo-700">Aprobar Caso Social</h2>
                    <p className="text-sm text-gray-600 mb-4">Se requiere la firma del Jefe de Bienestar Universitario para validar este acceso temporal.</p>

                    <div className="border-2 border-gray-300 rounded bg-white">
                        <canvas
                            ref={canvasRef}
                            width={500}
                            height={200}
                            className="w-full cursor-crosshair touch-none"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={stopDrawing}
                        />
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                        <button type="button" onClick={clearSignature} className="text-xs text-red-500 underline">Borrar firma</button>
                        <span className="text-xs text-gray-400 font-mono">ID CASO: {selectedCaso?.id}</span>
                    </div>

                    <div className="mt-8 flex justify-end gap-3">
                        <SecondaryButton onClick={() => setShowApproveModal(false)}>Cancelar</SecondaryButton>
                        <PrimaryButton disabled={!hasSigned}>Firmar y Aprobar</PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
