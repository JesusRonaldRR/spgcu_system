import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, router } from '@inertiajs/react'; // Added router
import { useState, useRef, useEffect } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal'; // New
import SecondaryButton from '@/Components/SecondaryButton'; // New

export default function Create({ auth, convocatorias, existingPostulation }) { // Added prop
    const user = auth.user;

    const today = new Date();
    const dateString = `MOQUEGUA, ${today.getDate()} DE ${today.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} DEL ${today.getFullYear()}`;

    // Modal state
    const [showExistingModal, setShowExistingModal] = useState(!!existingPostulation);

    // State for signature pad
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSigned, setHasSigned] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        convocatoria_id: convocatorias.length > 0 ? convocatorias[0].id : '',
        ingreso_familiar: '',
        numero_miembros: '',
        condicion_vivienda: 'propia',
        fundamentacion: 'SOLICITO: ACCEDER A LA BECA DEL SERVICIO DE COMEDOR UNIVERSITARIO PARA EL PERIODO ACADÉMICO 2025-I, DEBIDO A MI SITUACIÓN SOCIOECONÓMICA PRECARIA.',
        ficha_socioeconomica: null,
        boletas_pago: null,
        recibo_luz: null,
        croquis: null,
        dj_pronabec: null,
        firma_digital: null,
        anexos_adicionales: [] // Added initialization
    });

    const specificCaseOptions = [
        { id: 'orfandad', label: 'ORFANDAD (Acta de defunción)' },
        { id: 'carga_familiar', label: 'CARGA FAMILIAR (DNI cónyuge/hijos)' },
        { id: 'foraneo', label: 'ESTUDIANTE FORÁNEO (Recibo/Contrato alquiler)' },
        { id: 'discapacidad', label: 'DISCAPACIDAD (Carnet CONADIS)' },
        { id: 'independiente', label: 'TRABAJO INDEPENDIENTE (DJ de ingresos)' },
        { id: 'judicial', label: 'PROBLEMÁTICA FAMILIAR (Denuncia/Demanda/Separación)' },
        { id: 'otros', label: 'OTROS (Especificar)' },
    ];

    // Initialize canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.lineCap = 'round';
        }
    }, []);

    const getCoordinates = (e) => {
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        if (e.touches) {
            return {
                x: (e.touches[0].clientX - rect.left) * scaleX,
                y: (e.touches[0].clientY - rect.top) * scaleY
            };
        }
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const startDrawing = (e) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.beginPath();
        ctx.moveTo(x, y);
        setIsDrawing(true);
        setHasSigned(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        e.preventDefault();
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { x, y } = getCoordinates(e);
        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const clearSignature = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasSigned(false);
        setData('firma_digital', null);
    };

    const validatePDF = (file) => {
        if (!file) return false;
        return file.type === 'application/pdf';
    };

    const handleMandatoryFileChange = (id, file) => {
        if (!file) return;
        if (!validatePDF(file)) {
            alert('⚠️ FORMATO NO PERMITIDO\n\nSolo se aceptan archivos PDF.\n\nEl archivo "' + file.name + '" no es un PDF válido.');
            return;
        }
        setData(id, file);
    };

    const addAnexoAdicional = () => {
        setData('anexos_adicionales', [...data.anexos_adicionales, { tipo: '', especificacion: '', archivo: null }]);
    };

    const removeAnexoAdicional = (index) => {
        setData('anexos_adicionales', data.anexos_adicionales.filter((_, i) => i !== index));
    };

    const updateAnexoAdicional = (index, field, value) => {
        const updated = [...data.anexos_adicionales];
        if (field === 'archivo') {
            if (value && !validatePDF(value)) {
                alert('⚠️ FORMATO NO PERMITIDO\n\nSolo se aceptan archivos PDF.\n\nEl archivo "' + value.name + '" no es un PDF válido.');
                return;
            }
        }
        updated[index][field] = value;
        setData('anexos_adicionales', updated);
    };

    const submit = (e) => {
        e.preventDefault();

        if (!hasSigned) {
            alert('⚠️ FIRMA REQUERIDA\n\nDebe firmar el formulario antes de enviarlo.');
            return;
        }

        // Convert signature canvas to blob
        const canvas = canvasRef.current;
        canvas.toBlob((blob) => {
            const firmaFile = new File([blob], 'firma_digital.jpg', { type: 'image/jpeg' });

            // Build FormData manually to ensure all files are included
            const formData = new FormData();
            formData.append('convocatoria_id', data.convocatoria_id);
            formData.append('ingreso_familiar', data.ingreso_familiar);
            formData.append('numero_miembros', data.numero_miembros);
            formData.append('condicion_vivienda', data.condicion_vivienda);
            formData.append('fundamentacion', data.fundamentacion);

            // Append mandatory files
            if (data.ficha_socioeconomica) formData.append('ficha_socioeconomica', data.ficha_socioeconomica);
            if (data.boletas_pago) formData.append('boletas_pago', data.boletas_pago);
            if (data.recibo_luz) formData.append('recibo_luz', data.recibo_luz);
            if (data.croquis) formData.append('croquis', data.croquis);
            if (data.dj_pronabec) formData.append('dj_pronabec', data.dj_pronabec);

            // Append signature
            formData.append('firma_digital', firmaFile);

            // Append additional annexes (if any)
            data.anexos_adicionales.forEach((anexo, idx) => {
                if (anexo.tipo) formData.append(`anexos_adicionales[${idx}][tipo]`, anexo.tipo);
                if (anexo.especificacion) formData.append(`anexos_adicionales[${idx}][especificacion]`, anexo.especificacion);
                if (anexo.archivo) formData.append(`anexos_adicionales[${idx}][archivo]`, anexo.archivo);
            });

            // Submit using router.post with FormData
            router.post(route('postulaciones.store'), formData, {
                forceFormData: true,
                onError: (errors) => {
                    console.error('Submission errors:', errors);
                    // Show user-friendly error message
                    const errorMessages = Object.entries(errors)
                        .map(([field, message]) => `• ${field}: ${message}`)
                        .join('\n');
                    alert('❌ ERROR AL ENVIAR FUT\n\nPor favor corrija los siguientes campos:\n\n' + errorMessages);
                }
            });
        }, 'image/jpeg', 0.95);
    };

    const SectionHeader = ({ number, title }) => (
        <div className="bg-gray-200 border-y border-gray-400 px-2 py-1 font-bold text-sm text-gray-800 uppercase mt-4">
            {number}. {title}
        </div>
    );

    const FileUploadRow = ({ label, id, error, sublabel }) => (
        <div className="mb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-1">
                <div className="block font-medium text-sm text-gray-700">
                    <span className="text-red-500 mr-1">*</span>
                    {label}
                </div>
                {sublabel && <span className="text-xs text-gray-500 italic">{sublabel}</span>}
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    id={id}
                    onChange={(e) => handleMandatoryFileChange(id, e.target.files[0])}
                    accept="application/pdf"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-gray-50 focus:outline-none p-1"
                />
                {data[id] && (
                    <span className="text-green-600 text-xs font-bold whitespace-nowrap flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        {data[id].name}
                    </span>
                )}
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mesa de Partes Virtual</h2>}
        >
            <Head title="FUT - Comedor" />

            <div className="py-12 bg-gray-100">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="bg-white shadow-2xl p-8 min-h-screen border border-gray-300 relative text-sm">

                        {/* FUT Header */}
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-1/4">
                                <div className="font-bold text-indigo-900 text-2xl tracking-tighter">UNAM</div>
                                <div className="text-xs text-gray-600">UNIVERSIDAD NACIONAL DE MOQUEGUA</div>
                            </div>
                            <div className="w-1/2 text-center">
                                <h1 className="font-extrabold text-xl text-gray-900 uppercase">Formulario Único de Trámite (FUT)</h1>
                            </div>
                            <div className="w-1/4 border border-gray-400 rounded-lg h-24 flex items-center justify-center bg-gray-50 text-center p-2">
                                <span className="text-gray-400 text-xs font-bold">ESPACIO RESERVADO PARA SELLO DE RECEPCIÓN</span>
                            </div>
                        </div>

                        <SectionHeader number="I" title="SOLICITO" />
                        <div className="p-2">
                            <TextInput value="ACCESO A BECA SERVICIO COMEDOR UNIVERSITARIO" className="w-full uppercase font-bold bg-gray-50" disabled />
                        </div>

                        <SectionHeader number="II" title="DEPENDENCIA O AUTORIDAD A QUIEN SE DIRIGE LA SOLICITUD" />
                        <div className="p-2">
                            <TextInput value="DIRECCIÓN DE BIENESTAR UNIVERSITARIO (DBU)" className="w-full uppercase font-bold bg-gray-50" disabled />
                        </div>

                        <SectionHeader number="III" title="DATOS DEL SOLICITANTE" />
                        <div className="p-2 grid grid-cols-12 gap-2">
                            <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">APELLIDO PATERNO</label>
                                <div className="uppercase font-medium">{user.apellido_paterno || user.apellidos?.split(' ')[0] || '-'}</div>
                            </div>
                            <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">APELLIDO MATERNO</label>
                                <div className="uppercase font-medium">{user.apellido_materno || (user.apellidos?.split(' ')[1]) || '-'}</div>
                            </div>
                            <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">NOMBRES</label>
                                <div className="uppercase font-medium">{user.nombres}</div>
                            </div>
                            <div className="col-span-12 md:col-span-3 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">DNI</label>
                                <div className="uppercase font-medium">{user.dni}</div>
                            </div>
                            <div className="col-span-12 md:col-span-3 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">TELÉFONO</label>
                                <div className="uppercase font-medium">{user.telefono || '-'}</div>
                            </div>
                            <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">EMAIL</label>
                                <div className="font-medium truncate">{user.email}</div>
                            </div>
                            <div className="col-span-12 md:col-span-4 border p-2 bg-white">
                                <label className="text-xs font-bold block text-gray-500">INGRESO FAMILIAR (S/.)</label>
                                <TextInput
                                    type="number"
                                    step="0.01"
                                    value={data.ingreso_familiar}
                                    onChange={(e) => setData('ingreso_familiar', e.target.value)}
                                    className="w-full text-sm p-1 mt-1 border-gray-300"
                                    placeholder="Ej. 1200.00"
                                />
                            </div>
                            <div className="col-span-12 md:col-span-4 border p-2 bg-white">
                                <label className="text-xs font-bold block text-gray-500">CARGA FAMILIAR (N°)</label>
                                <TextInput
                                    type="number"
                                    value={data.numero_miembros}
                                    onChange={(e) => setData('numero_miembros', e.target.value)}
                                    className="w-full text-sm p-1 mt-1 border-gray-300"
                                    placeholder="Ej. 4"
                                />
                            </div>
                        </div>

                        <SectionHeader number="IV" title="DIRECCIÓN" />
                        <div className="p-2">
                            <div className="border p-2 bg-gray-50">
                                <label className="text-xs font-bold block text-gray-500">DOMICILIO ACTUAL</label>
                                <div className="uppercase font-medium">{user.direccion_actual || 'NO REGISTRADO EN PERFIL'}</div>
                            </div>
                        </div>

                        <SectionHeader number="V" title="FUNDAMENTACIÓN DE LA SOLICITUD" />
                        <div className="p-2">
                            <textarea
                                className="w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm h-32 p-3 text-justify uppercase text-sm"
                                value={data.fundamentacion}
                                onChange={(e) => setData('fundamentacion', e.target.value)}
                            ></textarea>
                            {errors.fundamentacion && <p className="text-red-500 text-xs">{errors.fundamentacion}</p>}
                        </div>

                        {/* VI. ANEXOS OBLIGATORIOS */}
                        <SectionHeader number="VI" title="ANEXOS (DOCUMENTOS OBLIGATORIOS) - Solo PDF" />
                        <div className="p-4 bg-gray-50 border border-gray-200 mt-2 rounded">
                            <FileUploadRow label="1. Ficha Socioeconómica Impresa (Firmada)" id="ficha_socioeconomica" error={errors.ficha_socioeconomica} />
                            <FileUploadRow label="2. Boletas de Pago (Padres/Estudiante)" id="boletas_pago" error={errors.boletas_pago} />
                            <FileUploadRow label="3. Recibo de Luz (Max 3 meses)" id="recibo_luz" error={errors.recibo_luz} />
                            <FileUploadRow label="4. Croquis de Domicilio Actual (Detallado)" id="croquis" error={errors.croquis} />
                            <FileUploadRow label="5. Declaración Jurada PRONABEC" id="dj_pronabec" sublabel="(De no contar con otro beneficio)" error={errors.dj_pronabec} />
                        </div>

                        {/* VII. ANEXOS ADICIONALES (MÚLTIPLES) */}
                        <SectionHeader number="VII" title="ANEXOS ADICIONALES (CASOS ESPECÍFICOS) - Solo PDF" />
                        <div className="p-4 bg-gray-50 border border-gray-200 mt-2 rounded">
                            <p className="mb-4 text-xs text-gray-600">Si aplica a alguna situación específica, agregue los documentos correspondientes:</p>

                            {data.anexos_adicionales.map((anexo, index) => (
                                <div key={index} className="border border-blue-200 rounded p-4 mb-4 bg-blue-50 relative">
                                    <button
                                        type="button"
                                        onClick={() => removeAnexoAdicional(index)}
                                        className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-lg"
                                        title="Eliminar anexo"
                                    >
                                        &times;
                                    </button>
                                    <h5 className="font-bold text-blue-800 mb-3">Anexo Adicional #{index + 1}</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                        <div>
                                            <InputLabel value="Tipo de Documento" />
                                            <select
                                                className="w-full border-gray-300 rounded text-sm"
                                                value={anexo.tipo}
                                                onChange={(e) => updateAnexoAdicional(index, 'tipo', e.target.value)}
                                            >
                                                <option value="">-- Seleccionar --</option>
                                                {specificCaseOptions.map(opt => (
                                                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                                                ))}
                                            </select>
                                        </div>
                                        {anexo.tipo === 'otros' && (
                                            <div>
                                                <InputLabel value="Especifique" />
                                                <TextInput
                                                    value={anexo.especificacion}
                                                    onChange={(e) => updateAnexoAdicional(index, 'especificacion', e.target.value)}
                                                    className="w-full"
                                                    placeholder="Ej. Constancia de..."
                                                />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <InputLabel value="Archivo (PDF)" />
                                        <input
                                            type="file"
                                            onChange={(e) => updateAnexoAdicional(index, 'archivo', e.target.files[0])}
                                            accept="application/pdf"
                                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded cursor-pointer bg-white p-1"
                                        />
                                        {anexo.archivo && (
                                            <span className="text-green-600 text-xs font-bold flex items-center mt-1">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                {anexo.archivo.name}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={addAnexoAdicional}
                                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-blue-400 rounded-lg text-blue-600 font-bold hover:bg-blue-100 transition"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                Agregar Anexo Adicional
                            </button>
                        </div>

                        {/* FIRMA DIGITAL */}
                        <SectionHeader number="VIII" title="FIRMA DEL SOLICITANTE" />
                        <div className="p-4 mt-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Signature Pad */}
                                <div>
                                    <p className="text-xs text-gray-600 mb-2">Firme en el recuadro usando el mouse o dedo (en dispositivos táctiles):</p>
                                    <div className="border-2 border-gray-400 rounded-lg overflow-hidden bg-white relative">
                                        <canvas
                                            ref={canvasRef}
                                            width={400}
                                            height={150}
                                            className="w-full h-32 cursor-crosshair touch-none"
                                            onMouseDown={startDrawing}
                                            onMouseMove={draw}
                                            onMouseUp={stopDrawing}
                                            onMouseLeave={stopDrawing}
                                            onTouchStart={startDrawing}
                                            onTouchMove={draw}
                                            onTouchEnd={stopDrawing}
                                        />
                                        {!hasSigned && (
                                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                                <span className="text-gray-300 text-lg font-bold">FIRME AQUÍ</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={clearSignature}
                                        className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
                                    >
                                        Limpiar Firma
                                    </button>
                                    {hasSigned && (
                                        <p className="text-green-600 text-xs mt-1 flex items-center">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                            Firma registrada
                                        </p>
                                    )}
                                </div>

                                {/* Date and Place */}
                                <div className="flex flex-col justify-center">
                                    <div className="border-t border-gray-400 pt-4 text-center">
                                        <div className="font-bold text-gray-800 uppercase text-lg">{dateString}</div>
                                        <div className="text-xs text-gray-500 mt-1">LUGAR Y FECHA</div>
                                    </div>
                                    <div className="border-t border-gray-400 pt-4 mt-4 text-center">
                                        <div className="font-bold text-gray-800 uppercase">{user.nombres} {user.apellidos}</div>
                                        <div className="text-xs text-gray-500 mt-1">DNI: {user.dni}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex justify-end space-x-4">
                            <PrimaryButton className="px-8 py-3 text-lg" disabled={processing || convocatorias.length === 0}>
                                {processing ? 'Enviando Trámite...' : 'ENVIAR FUT'}
                            </PrimaryButton>
                        </div>

                    </form>
                </div>
            </div>
            <Modal show={showExistingModal} maxWidth="md" closeable={false}>
                <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 border-b pb-2 flex items-center text-yellow-600">
                        <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        AVISO IMPORTANTE
                    </h2>
                    <p className="mt-4 text-sm text-gray-700">
                        Estimado estudiante, el sistema detecta que <strong>YA HA REALIZADO UNA POSTULACIÓN</strong> para la convocatoria vigente.
                    </p>
                    <p className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                        No es necesario que vuelva a enviar su documentación. Si desea verificar el estado de su trámite, diríjase a la sección "Mis Postulaciones".
                    </p>
                    <div className="mt-8 flex justify-end space-x-3">
                        <SecondaryButton onClick={() => router.visit(route('dashboard'))}>
                            Volver al Inicio
                        </SecondaryButton>
                        <PrimaryButton onClick={() => router.visit(route('postulaciones.index'))}>
                            Ver Mis Postulaciones
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
