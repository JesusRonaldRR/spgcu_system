import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import { useState } from 'react';

export default function Index({ auth, postulacion, activePostulacion, entrevista, entrevistas, postulacionesPorProgramar, history, isBeneficiary, solicitudesServicios }) {
    const isStudent = auth.user.rol === 'estudiante';

    // --- STUDENT LOGIC ---
    // No more self-scheduling logic needed

    // --- ADMIN LOGIC ---
    // 1. Evaluation State
    const [evaluating, setEvaluating] = useState(null);
    const [showDetails, setShowDetails] = useState(false);
    const { data: evalData, setData: setEvalData, put: putEval, processing: evalProcessing, errors: evalErrors, reset: resetEval } = useForm({
        estado: 'programada',
        resultado: '',
        tipo: 'presencial',
        link_reunion: '',
        observaciones: ''
    });

    const openEvaluationModal = (item) => {
        setEvaluating(item);
        setEvalData({
            estado: item.estado || 'programada',
            resultado: item.resultado || '',
            tipo: item.tipo || 'presencial',
            link_reunion: item.link_reunion || '',
            observaciones: item.observaciones || ''
        });
    };

    const submitEvaluation = (e) => {
        e.preventDefault();
        putEval(route('citas.update.put', evaluating.id), {
            onSuccess: () => {
                setEvaluating(null);
                resetEval();
            }
        });
    };

    // 2. Scheduling State (For Admins to schedule 'apto_entrevista' postulations)
    const [scheduling, setScheduling] = useState(null); // Postulation being scheduled
    const { data: schedData, setData: setSchedData, post: postSched, processing: schedProcessing, errors: schedErrors, reset: resetSched } = useForm({
        postulacion_id: '',
        fecha: '',
        hora: '',
        tipo: '',
        link_reunion: ''
    });

    const openSchedulingModal = (postulacion) => {
        setScheduling(postulacion);
        setSchedData({
            postulacion_id: postulacion.id,
            fecha: '',
            hora: '',
            tipo: '',
            link_reunion: ''
        });
    };

    const submitScheduling = (e) => {
        e.preventDefault();
        postSched(route('citas.store'), {
            onSuccess: () => {
                setScheduling(null);
                resetSched();
                alert('Entrevista programada con éxito.');
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Módulo de Citas Psicológicas</h2>}
        >
            <Head title="Citas" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6">

                        {/* ---------------- STUDENT VIEW ---------------- */}
                        {isStudent && (
                            <div className="space-y-8">
                                {/* 1. Active Process Status */}
                                {activePostulacion ? (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-indigo-700 border-b pb-2">Mi Proceso Actual</h3>

                                        {entrevista ? (
                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 shadow-sm">
                                                <div className="flex items-center justify-between mb-4">
                                                    <h4 className="font-bold text-xl text-blue-900">Entrevista Programada</h4>
                                                    <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase
                                                        ${entrevista.estado === 'programada' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                        ${entrevista.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                                                    `}>
                                                        {entrevista.estado.replace('_', ' ')}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <p className="text-sm text-gray-500 uppercase tracking-wide">Fecha y Hora</p>
                                                        <p className="text-lg font-semibold text-gray-800">{entrevista.fecha} - {entrevista.hora}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500 uppercase tracking-wide">Lugar / Modalidad</p>
                                                        <div className="flex flex-col">
                                                            <span className="capitalize font-semibold text-gray-800">{entrevista.tipo}</span>
                                                            <span className="text-gray-600 text-sm">{entrevista.lugar}</span>
                                                            {entrevista.tipo === 'virtual' && entrevista.link_reunion && (
                                                                <a
                                                                    href={entrevista.link_reunion}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="mt-2 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 transition w-max"
                                                                >
                                                                    Unirse a Reunión
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-6 pt-4 border-t border-blue-200 text-sm text-blue-800 flex items-start">
                                                    <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    Recuerde asistir puntualmente. Si no puede asistir, comuníquese con Bienestar Universitario con anticipación.
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12 bg-indigo-50 rounded-lg border-2 border-dashed border-indigo-200">
                                                <div className="bg-indigo-100 rounded-full p-3 w-16 h-16 mx-auto flex items-center justify-center mb-4">
                                                    <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                </div>
                                                <h3 className="mt-2 text-lg font-bold text-gray-900">Esperando Programación</h3>
                                                <p className="mt-1 text-gray-600 max-w-md mx-auto">
                                                    Su documentación ha sido revisada y aprobada correctamente. Un administrativo se pondrá en contacto pronto para programar su entrevista psicológica.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : isBeneficiary ? (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center shadow-sm">
                                        <div className="bg-green-100 rounded-full p-4 w-20 h-20 mx-auto flex items-center justify-center mb-4">
                                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-green-800 mb-2">¡Felicitaciones!</h2>
                                        <p className="text-green-700 text-lg mb-6">Usted ha completado el proceso satisfactoriamente y es beneficiario del Comedor Universitario.</p>

                                        <div className="flex flex-wrap justify-center gap-4">
                                            <a href={route('comedor.horario')} className="inline-flex items-center px-6 py-3 bg-green-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-green-700 active:bg-green-900 focus:outline-none focus:border-green-900 focus:ring ring-green-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-lg">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                Ver Horarios Comedor
                                            </a>
                                            <a href={route('otros-servicios.index')} className="inline-flex items-center px-6 py-3 bg-teal-600 border border-transparent rounded-md font-semibold text-white uppercase tracking-widest hover:bg-teal-700 active:bg-teal-900 focus:outline-none focus:border-teal-900 focus:ring ring-teal-300 disabled:opacity-25 transition ease-in-out duration-150 shadow-lg">
                                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                Otros Servicios
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                                        <p className="text-gray-500">No tiene procesos activos en este momento.</p>
                                    </div>
                                )}

                                {/* 2. History Section (Always shown if exists) */}
                                {history && history.length > 0 && (
                                    <div className="mt-12">
                                        <h3 className="text-lg font-bold mb-4 text-gray-700 border-b pb-2">Historial de Entrevistas</h3>
                                        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modalidad</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resultado</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {history.map((hist) => (
                                                        <tr key={hist.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                {hist.entrevista?.fecha}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                                                                {hist.entrevista?.tipo}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs rounded-full font-bold
                                                                    ${hist.entrevista?.estado === 'completada' ? 'bg-green-100 text-green-800' : ''}
                                                                    ${hist.entrevista?.estado === 'no_asistio' ? 'bg-red-100 text-red-800' : ''}
                                                                    ${hist.entrevista?.estado === 'programada' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                                `}>
                                                                    {hist.entrevista?.estado?.replace('_', ' ').toUpperCase()}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {hist.entrevista?.resultado ? (
                                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold
                                                                        ${hist.entrevista.resultado === 'apto' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'}
                                                                    `}>
                                                                        {hist.entrevista.resultado.toUpperCase()}
                                                                    </span>
                                                                ) : '-'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ---------------- ADMIN VIEW ---------------- */}
                        {!isStudent && (
                            <div className="space-y-8">

                                {/* 1. Lista de Pendientes por Programar */}
                                {postulacionesPorProgramar && postulacionesPorProgramar.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-bold mb-4 text-orange-600 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            Solicitudes Pendientes de Entrevista
                                        </h3>
                                        <div className="bg-orange-50 rounded-lg overflow-hidden border border-orange-200">
                                            <table className="min-w-full divide-y divide-orange-200">
                                                <thead className="bg-orange-100">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-orange-800 uppercase">Estudiante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-orange-800 uppercase">Código</th>
                                                        <th className="px-6 py-3 text-right text-xs font-bold text-orange-800 uppercase">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-orange-200">
                                                    {postulacionesPorProgramar.map(postulacion => (
                                                        <tr key={postulacion.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{postulacion.usuario.nombres} {postulacion.usuario.apellidos}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{postulacion.usuario.codigo}</td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <button
                                                                    onClick={() => openSchedulingModal(postulacion)}
                                                                    className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-1 px-3 rounded text-xs shadow"
                                                                >
                                                                    Programar Cita
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

                                {/* NEW: Solicitudes de Otros Servicios (Consolidated) */}
                                {solicitudesServicios && (
                                    <div className="mt-8 pt-8 border-t border-gray-200">
                                        <h3 className="text-lg font-bold mb-4 text-teal-700 flex items-center">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                            Solicitudes de Otros Servicios
                                        </h3>
                                        <OtrosServiciosTable items={solicitudesServicios} />
                                    </div>
                                )}

                                {/* 2. Evaluaciones Pendientes (Programadas) */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-indigo-700 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Entrevistas Programadas (Pendientes de Evaluación)
                                    </h3>
                                    {entrevistas.filter(e => e.estado === 'programada').length === 0 ? (
                                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 mb-8">
                                            No hay entrevistas pendientes de evaluación.
                                        </div>
                                    ) : (
                                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg shadow-sm mb-8">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-indigo-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase">Estudiante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase">Fecha/Hora</th>
                                                        <th className="px-6 py-3 text-left text-xs font-bold text-indigo-800 uppercase">Modalidad</th>
                                                        <th className="px-6 py-3 text-right text-xs font-bold text-indigo-800 uppercase">Acción</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {entrevistas.filter(e => e.estado === 'programada').map((item) => (
                                                        <tr key={item.id} className="hover:bg-indigo-50 transition">
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-bold text-gray-900">{item.postulacion.usuario.nombres}</div>
                                                                <div className="text-xs text-gray-500">{item.postulacion.usuario.codigo}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                                                                {item.fecha} <br /><span className="text-gray-500 text-xs font-medium">{item.hora}</span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                                                {item.tipo}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <button
                                                                    onClick={() => openEvaluationModal(item)}
                                                                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded text-xs shadow"
                                                                >
                                                                    Evaluar
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>

                                {/* 3. Historial de Evaluaciones */}
                                <div>
                                    <h3 className="text-lg font-bold mb-4 text-gray-600">Historial de Entrevistas</h3>
                                    {entrevistas.filter(e => e.estado !== 'programada').length === 0 ? (
                                        <p className="text-gray-500 italic">No hay historial.</p>
                                    ) : (
                                        <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estudiante</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Resultado</th>
                                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Detalles</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {entrevistas.filter(e => e.estado !== 'programada').map((item) => (
                                                        <tr key={item.id}>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <div className="text-sm font-bold">{item.postulacion.usuario.nombres}</div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                {item.fecha}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 py-1 text-xs rounded-full font-bold
                                                                    ${item.estado === 'completada' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {item.estado === 'no_asistio' ? 'NO ASISTIÓ' : 'COMPLETADA'}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                {item.estado === 'no_asistio' ? (
                                                                    <span className="text-xs text-red-500 font-bold">RECHAZADO</span>
                                                                ) : (
                                                                    <span className={`px-2 py-1 text-xs rounded-full font-bold
                                                                        ${item.resultado === 'apto' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                                                        {item.resultado ? item.resultado.toUpperCase() : '-'}
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                                <button
                                                                    onClick={() => openEvaluationModal(item)}
                                                                    className="text-gray-500 hover:text-gray-700 text-xs underline"
                                                                >
                                                                    Ver Ficha
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Evaluation Modal (Admin) */}
            <Modal show={!!evaluating} onClose={() => setEvaluating(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Evaluar Entrevista</h2>
                    {evaluating && (
                        <form onSubmit={submitEvaluation}>
                            <div className="mb-4">
                                <InputLabel value="Estudiante" />
                                <div className="text-gray-700 bg-gray-50 p-2 rounded border">
                                    {evaluating.postulacion.usuario.nombres} {evaluating.postulacion.usuario.apellidos}
                                </div>
                            </div>

                            {/* SECCIÓN 1: Contexto de la Entrevista (Lectura) */}
                            <div className="mb-6 border-b pb-4 bg-gray-50 -mx-6 px-6 pt-4 rounded-t-lg mt-[-24px]">
                                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">1. Detalles de la Cita Programada</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-xs text-gray-500 block">Modalidad</span>
                                        <span className="font-medium capitalize text-gray-900">{evalData.tipo}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-gray-500 block">Fecha y Hora</span>
                                        <span className="font-medium text-gray-900">{evaluating.fecha} - {evaluating.hora}</span>
                                    </div>

                                    {evalData.tipo === 'virtual' && (
                                        <div className="col-span-2 mt-2">
                                            <span className="text-xs text-gray-500 block">Link de Reunión</span>
                                            <a href={evalData.link_reunion} target="_blank" className="text-indigo-600 underline break-all text-sm">
                                                {evalData.link_reunion || 'No configurado'}
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* SECCIÓN 2: Confirmación de Asistencia */}
                            <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
                                <h4 className="text-sm font-bold text-blue-800 mb-2">2. Confirmación de Asistencia</h4>
                                <InputLabel value="¿El estudiante asistió a la entrevista?" className="mb-1" />
                                <select
                                    className="w-full border-gray-300 rounded text-base font-medium"
                                    value={evalData.estado}
                                    onChange={e => setEvalData('estado', e.target.value)}
                                >
                                    <option value="programada">-- Seleccione --</option>
                                    <option value="completada">SÍ, asistió</option>
                                    <option value="no_asistio">NO asistió</option>
                                </select>
                                <InputError message={evalErrors.estado} className="mt-2" />
                            </div>

                            {/* SECCIÓN 3: Evaluación (Solo si asistió) */}
                            {evalData.estado === 'completada' && (
                                <div className="space-y-4 animate-fade-in-down">
                                    <h4 className="text-sm font-bold text-green-700">3. Evaluación del Postulante</h4>

                                    <div className="mb-4">
                                        <InputLabel value="Resultado (Dictamen)" />
                                        <select
                                            className="w-full border-gray-300 rounded text-sm bg-indigo-50 font-bold text-indigo-900"
                                            value={evalData.resultado}
                                            onChange={e => setEvalData('resultado', e.target.value)}
                                            required={evalData.estado === 'completada'}
                                        >
                                            <option value="" disabled>Seleccione un resultado...</option>
                                            <option value="apto">APTO (Aprobado)</option>
                                            <option value="no_apto">NO APTO (Rechazado)</option>
                                        </select>
                                        <InputError message={evalErrors.resultado} className="mt-2" />
                                        <p className="text-xs text-gray-500 mt-1">Si selecciona 'APTO', el estudiante pasará a ser BECARIO.</p>
                                    </div>

                                    <div className="mb-4">
                                        <InputLabel value="Observaciones / Comentarios" />
                                        <textarea
                                            className="w-full border-gray-300 rounded text-sm h-24"
                                            value={evalData.observaciones}
                                            onChange={e => setEvalData('observaciones', e.target.value)}
                                            placeholder="Ingrese detalles sobre la entrevista..."
                                        ></textarea>
                                        <InputError message={evalErrors.observaciones} className="mt-2" />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-6 border-t pt-4">
                                <SecondaryButton onClick={() => setEvaluating(null)}>Cancelar</SecondaryButton>
                                <PrimaryButton type="submit" disabled={evalProcessing}>Guardar Finalizar</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>

            {/* Scheduling Modal (Admin) */}
            <Modal show={!!scheduling} onClose={() => setScheduling(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Programar Entrevista</h2>
                    {scheduling && (
                        <form onSubmit={submitScheduling}>
                            <div className="mb-4">
                                <InputLabel value="Postulante" />
                                <div className="text-gray-700 bg-gray-50 p-2 rounded border">
                                    {scheduling.usuario.nombres} {scheduling.usuario.apellidos}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Fecha" />
                                    <TextInput
                                        type="date"
                                        className="w-full"
                                        value={schedData.fecha}
                                        onChange={e => setSchedData('fecha', e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Hora" />
                                    <TextInput
                                        type="time"
                                        className="w-full"
                                        value={schedData.hora}
                                        onChange={e => setSchedData('hora', e.target.value)}
                                        required
                                    />
                                    <InputError message={schedErrors.hora} className="mt-2" />
                                </div>
                            </div>

                            <InputError message={schedErrors.fecha} className="mt-2" />
                            <InputError message={schedErrors.postulacion_id} className="mt-2" />

                            <div className="mb-4">
                                <InputLabel value="Tipo de Entrevista" />
                                <select
                                    className="w-full border-gray-300 rounded text-sm"
                                    value={schedData.tipo}
                                    onChange={e => setSchedData('tipo', e.target.value)}
                                    required
                                >
                                    <option value="" disabled>Seleccione modalidad...</option>
                                    <option value="presencial">Presencial</option>
                                    <option value="virtual">Virtual</option>
                                </select>
                                <InputError message={schedErrors.tipo} className="mt-2" />
                            </div>

                            {schedData.tipo === 'virtual' && (
                                <div className="mb-4">
                                    <InputLabel value="Enlace de Reunión" />
                                    <TextInput
                                        type="url"
                                        className="w-full"
                                        placeholder="https://meet.google.com/..."
                                        value={schedData.link_reunion}
                                        onChange={e => setSchedData('link_reunion', e.target.value)}
                                        required
                                    />
                                    <InputError message={schedErrors.link_reunion} className="mt-2" />
                                </div>
                            )}

                            <div className="flex justify-end space-x-2 mt-6">
                                <SecondaryButton onClick={() => setScheduling(null)}>Cancelar</SecondaryButton>
                                <PrimaryButton type="submit" disabled={schedProcessing}>Programar Cita</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </AuthenticatedLayout >
    );
}

function OtrosServiciosTable({ items }) {
    const [managing, setManaging] = useState(null);
    const { data, setData, patch, processing, errors, reset } = useForm({
        fecha: '',
        hora: '',
        estado: '',
        admin_notes: ''
    });

    const openModal = (item) => {
        setManaging(item);
        setData({
            fecha: item.fecha || '',
            hora: item.hora || '',
            estado: item.estado || 'programada',
            admin_notes: item.admin_notes || ''
        });
    };

    const submit = (e) => {
        e.preventDefault();
        patch(route('admin.otros-servicios.update', managing.id), {
            onSuccess: () => {
                setManaging(null);
                reset();
                alert('Servicio actualizado correctamente.');
            }
        });
    };

    return (
        <>
            <div className="bg-teal-50 rounded-lg overflow-hidden border border-teal-200">
                <table className="min-w-full divide-y divide-teal-200">
                    <thead className="bg-teal-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-bold text-teal-800 uppercase">Estudiante</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-teal-800 uppercase">Servicio / Detalle</th>
                            <th className="px-6 py-3 text-left text-xs font-bold text-teal-800 uppercase">Estado</th>
                            <th className="px-6 py-3 text-right text-xs font-bold text-teal-800 uppercase">Acción</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-teal-200">
                        {items.length === 0 ? (
                            <tr><td colSpan="4" className="px-6 py-4 text-center text-teal-600">No hay solicitudes activas.</td></tr>
                        ) : (
                            items.map(item => (
                                <tr key={item.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="font-bold">{item.usuario?.nombres} {item.usuario?.apellidos}</div>
                                        <div className="text-xs text-gray-500">{item.usuario?.codigo}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        <div className="font-bold">{item.servicio}</div>
                                        {item.modalidad && <span className="text-xs bg-gray-100 px-1 rounded block w-max mt-1">{item.modalidad}</span>}
                                        <div className="text-xs text-gray-500 italic truncate max-w-xs mt-1">{item.motivo}</div>
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
                                        {item.fecha && <div className="text-xs text-teal-700 font-bold mt-1">{item.fecha} {item.hora}</div>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button onClick={() => openModal(item)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-1 px-3 rounded text-xs shadow">
                                            Gestionar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Managing Service */}
            <Modal show={!!managing} onClose={() => setManaging(null)} maxWidth="md">
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Gestionar Servicio</h2>
                    {managing && (
                        <form onSubmit={submit}>
                            <div className="mb-4 text-sm bg-gray-50 p-3 rounded">
                                <p><strong>Servicio:</strong> {managing.servicio}</p>
                                <p><strong>Motivo:</strong> {managing.motivo}</p>
                                {managing.modalidad && <p><strong>Modalidad Pref:</strong> {managing.modalidad}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <InputLabel value="Fecha" />
                                    <TextInput type="date" className="w-full" value={data.fecha} onChange={e => setData('fecha', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel value="Hora" />
                                    <TextInput type="time" className="w-full" value={data.hora} onChange={e => setData('hora', e.target.value)} />
                                </div>
                            </div>

                            <div className="mb-4">
                                <InputLabel value="Estado" />
                                <select className="w-full border-gray-300 rounded text-sm" value={data.estado} onChange={e => setData('estado', e.target.value)}>
                                    <option value="solicitado">Solicitado</option>
                                    <option value="programada">Programada</option>
                                    <option value="completada">Completada</option>
                                    <option value="cancelada">Cancelada</option>
                                </select>
                            </div>

                            <div className="flex justify-end space-x-2 mt-6">
                                <SecondaryButton onClick={() => setManaging(null)}>Cancelar</SecondaryButton>
                                <PrimaryButton disabled={processing}>Guardar</PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </Modal>
        </>
    );
}
