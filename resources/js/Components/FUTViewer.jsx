import { Link } from '@inertiajs/react';

export default function FUTViewer({ postulacion }) {
    if (!postulacion) return null;

    const user = postulacion.usuario;
    const today = new Date(postulacion.created_at);
    const dateString = `MOQUEGUA, ${today.getDate()} DE ${today.toLocaleString('es-ES', { month: 'long' }).toUpperCase()} DEL ${today.getFullYear()}`;

    const parseFiles = (data) => {
        if (!data) return {};
        // If already an object (Laravel cast), return as-is
        if (typeof data === 'object' && !Array.isArray(data)) {
            return data;
        }
        // If string, try to parse
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch (e) {
                console.error('Error parsing files:', e);
                return {};
            }
        }
        return {};
    };

    const files = parseFiles(postulacion.ruta_archivos);
    const anexosAdicionales = (files.especificos || []);
    if (files.especifico && !Array.isArray(files.especifico)) {
        anexosAdicionales.push(files.especifico);
    }

    const SectionHeader = ({ number, title }) => (
        <div className="bg-gray-200 border-y border-gray-400 px-2 py-1 font-bold text-sm text-gray-800 uppercase mt-4">
            {number}. {title}
        </div>
    );

    const TextInput = ({ value }) => (
        <div className="w-full border border-gray-300 rounded bg-gray-50 p-2 text-sm uppercase text-gray-700">
            {value || '-'}
        </div>
    );

    const ReadOnlyRow = ({ label, fileKey }) => {
        const path = files[fileKey];
        return (
            <div className="mb-4">
                <div className="block font-medium text-sm text-gray-700 mb-1">
                    {label}
                </div>
                <div className="flex items-center">
                    {path ? (
                        <a
                            href={`/storage/${path}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                            Ver Documento
                        </a>
                    ) : (
                        <span className="text-red-500 italic text-sm">No adjuntado</span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white p-6 relative text-sm">
            {/* FUT Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="w-1/4">
                    <div className="font-bold text-indigo-900 text-2xl tracking-tighter">UNAM</div>
                    <div className="text-xs text-gray-600">UNIVERSIDAD NACIONAL DE MOQUEGUA</div>
                </div>
                <div className="w-1/2 text-center">
                    <h1 className="font-extrabold text-xl text-gray-900 uppercase">Formulario Único de Trámite (FUT)</h1>
                    <p className="text-xs text-red-600 font-bold mt-1">N° REGISTRO: {postulacion.id.toString().padStart(6, '0')}</p>
                </div>
                <div className="w-1/4 border border-gray-400 rounded-lg h-24 flex items-center justify-center bg-gray-50 text-center p-2 relative">
                    <span className="text-gray-400 text-xs font-bold z-0">SELLO DE RECEPCIÓN</span>
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-80 rotate-12">
                        <span className={`border-4 font-black p-1 rounded text-lg uppercase transform ${postulacion.estado === 'aprobado' ? 'border-green-600 text-green-600' :
                            postulacion.estado === 'rechazado' ? 'border-red-600 text-red-600' : 'border-gray-400 text-gray-400'
                            }`}>
                            {postulacion.estado}
                        </span>
                    </div>
                </div>
            </div>

            <SectionHeader number="I" title="SOLICITO" />
            <div className="p-2">
                <TextInput value="ACCESO A BECA SERVICIO COMEDOR UNIVERSITARIO" />
            </div>

            <SectionHeader number="II" title="DEPENDENCIA O AUTORIDAD A QUIEN SE DIRIGE LA SOLICITUD" />
            <div className="p-2">
                <TextInput value="DIRECCIÓN DE BIENESTAR UNIVERSITARIO (DBU)" />
            </div>

            <SectionHeader number="III" title="DATOS DEL SOLICITANTE" />
            <div className="p-2 grid grid-cols-12 gap-2">
                <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                    <label className="text-xs font-bold block text-gray-500">APELLIDO PATERNO</label>
                    <div className="uppercase font-medium">{user.apellido_paterno || (user.apellidos ? user.apellidos.split(' ')[0] : '')}</div>
                </div>
                <div className="col-span-12 md:col-span-4 border p-2 bg-gray-50">
                    <label className="text-xs font-bold block text-gray-500">APELLIDO MATERNO</label>
                    <div className="uppercase font-medium">{user.apellido_materno || (user.apellidos ? user.apellidos.split(' ')[1] : '') || '-'}</div>
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
                <div className="col-span-12 md:col-span-6 border p-2 bg-gray-50">
                    <label className="text-xs font-bold block text-gray-500">EMAIL</label>
                    <div className="font-medium truncate">{user.email}</div>
                </div>
            </div>

            <SectionHeader number="IV" title="DIRECCIÓN" />
            <div className="p-2">
                <div className="border p-2 bg-gray-50">
                    <label className="text-xs font-bold block text-gray-500">DOMICILIO ACTUAL</label>
                    <div className="uppercase font-medium">{user.direccion_actual || 'No registrado'}</div>
                </div>
            </div>

            <SectionHeader number="V" title="FUNDAMENTACIÓN DE LA SOLICITUD" />
            <div className="p-2">
                <div className="w-full border border-gray-300 rounded bg-gray-50 p-3 h-32 text-justify uppercase text-sm overflow-y-auto">
                    {postulacion.fundamentacion || 'SOLICITO: ACCEDER A LA BECA DEL SERVICIO DE COMEDOR UNIVERSITARIO PARA EL PERIODO ACADÉMICO 2025-I, DEBIDO A MI SITUACIÓN SOCIOECONÓMICA PRECARIA.'}
                </div>
            </div>

            {/* VI. ANEXOS OBLIGATORIOS */}
            <SectionHeader number="VI" title="ANEXOS OBLIGATORIOS (VERIFICACIÓN)" />
            <div className="p-4 bg-gray-50 border border-gray-200 mt-2 rounded grid grid-cols-1 md:grid-cols-2 gap-4">
                <ReadOnlyRow label="1. Ficha Socioeconómica" fileKey="ficha_socioeconomica" />
                <ReadOnlyRow label="2. Boletas de Pago" fileKey="boletas_pago" />
                <ReadOnlyRow label="3. Recibo de Luz" fileKey="recibo_luz" />
                <ReadOnlyRow label="4. Croquis" fileKey="croquis" />
                <ReadOnlyRow label="5. DJ PRONABEC" fileKey="dj_pronabec" />
            </div>

            {/* VII. ANEXOS ADICIONALES */}
            {anexosAdicionales.length > 0 && (
                <>
                    <SectionHeader number="VII" title="ANEXOS ADICIONALES" />
                    <div className="p-4 bg-gray-50 border border-gray-200 mt-2 rounded">
                        {anexosAdicionales.map((anexo, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-gray-200 py-2 last:border-0">
                                <div>
                                    <span className="font-bold text-gray-700 block">Anexo #{idx + 1}</span>
                                    <span className="text-xs text-gray-500 uppercase">{anexo.tipo}</span>
                                </div>
                                <a
                                    href={`/storage/${anexo.path}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 font-bold text-sm underline"
                                >
                                    Ver Documento
                                </a>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* FIRMA DIGITAL */}
            <SectionHeader number="VIII" title="FIRMA DEL SOLICITANTE" />
            <div className="p-4 mt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Signature Image */}
                    <div className="flex flex-col items-center">
                        <div className="border border-gray-400 p-2 bg-white">
                            {files.firma_digital ? (
                                <img
                                    src={`/storage/${files.firma_digital}`}
                                    alt="Firma Digital"
                                    className="h-32 object-contain"
                                />
                            ) : (
                                <div className="h-32 w-64 flex items-center justify-center text-gray-400 italic">No firmó digitalmente</div>
                            )}
                        </div>
                        <div className="border-t border-gray-400 mt-2 w-48 pt-1 text-center">
                            <div className="text-xs text-gray-500">FIRMA REGISTRADA</div>
                        </div>
                    </div>

                    {/* Date and Place */}
                    <div className="flex flex-col justify-center">
                        <div className="border-t border-gray-400 pt-4 text-center">
                            <div className="font-bold text-gray-800 uppercase text-lg">{dateString}</div>
                            <div className="text-xs text-gray-500 mt-1">LUGAR Y FECHA DE ENVÍO</div>
                        </div>
                        <div className="border-t border-gray-400 pt-4 mt-4 text-center">
                            <div className="font-bold text-gray-800 uppercase">{user.nombres} {user.apellidos}</div>
                            <div className="text-xs text-gray-500 mt-1">DNI: {user.dni}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
