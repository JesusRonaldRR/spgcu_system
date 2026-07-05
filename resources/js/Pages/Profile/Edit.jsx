import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = auth.user;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        // Non-editable fields (read only in UI)
        codigo: user.codigo || '',
        dni: user.dni || '',
        apellidos: user.apellidos || '',
        nombres: user.nombres || '',
        apellido_paterno: user.apellido_paterno || '',
        apellido_materno: user.apellido_materno || '',

        // Editable fields
        sexo: user.sexo || 'M',
        estado_civil: user.estado_civil || '',
        ubigeo_colegio: user.ubigeo_colegio || '',
        nombre_colegio: user.nombre_colegio || '',
        tipo_colegio: user.tipo_colegio || '',
        anio_termino_colegio: user.anio_termino_colegio || '',
        ubigeo_actual: user.ubigeo_actual || '',
        direccion_actual: user.direccion_actual || '',
        email: user.email || '',
        telefono: user.telefono || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        ubigeo_nacimiento: user.ubigeo_nacimiento || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const DataRow = ({ label, value, isEditable = false, fieldName, type = "text", options = null }) => {
        return (
            <div className="grid grid-cols-[180px_1fr] border-b border-gray-200">
                <div className="bg-[#1e3a5f] text-white p-2 text-xs font-bold uppercase flex items-center">
                    {label}
                </div>
                <div className={`p-1 flex items-center min-h-[40px] ${isEditable && isEditing ? 'bg-[#f0f7ff]' : 'bg-white'}`}>
                    {isEditing && isEditable ? (
                        options ? (
                            <select
                                className="w-full border-none bg-transparent focus:ring-0 text-sm py-1"
                                value={data[fieldName]}
                                onChange={(e) => setData(fieldName, e.target.value)}
                            >
                                {options.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type={type}
                                className="w-full border-none bg-transparent focus:ring-0 text-sm py-1"
                                value={data[fieldName]}
                                onChange={(e) => setData(fieldName, e.target.value)}
                            />
                        )
                    ) : (
                        <span className="text-sm px-2 text-gray-800 uppercase font-medium">
                            {value || '-'}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    const SectionHeader = ({ title }) => (
        <div className="bg-[#1e3a5f] text-white font-bold text-center py-1 text-sm border-b border-white">
            {title}
        </div>
    );

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil de Estudiante</h2>}
        >
            <Head title="Mi Perfil" />

            <div className="py-6 bg-[#f0f4f8] min-h-screen">
                <div className="max-w-[1400px] mx-auto px-4">

                    <div className="flex justify-center mb-6 space-x-4">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-[#0f4c9b] hover:bg-[#0a3a7a] text-white font-bold py-2 px-8 rounded shadow text-sm uppercase transition"
                            >
                                Editar Datos
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={submit}
                                    disabled={processing}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded shadow text-sm uppercase transition"
                                >
                                    Guardar
                                </button>
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-8 rounded shadow text-sm uppercase transition"
                                >
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>

                    {recentlySuccessful && (
                        <div className="max-w-md mx-auto mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-center text-sm font-bold">
                            ¡Datos actualizados correctamente!
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* LEFT COLUMN */}
                        <div className="bg-white border border-gray-300 rounded overflow-hidden shadow-md">
                            <SectionHeader title="DATOS GENERALES" />
                            <DataRow label="Código" value={user.codigo} />
                            <DataRow label="DNI" value={user.dni} />
                            <DataRow label="APELLIDOS" value={`${user.apellido_paterno} ${user.apellido_materno}`} />
                            <DataRow label="NOMBRES" value={user.nombres} />
                            <DataRow
                                label="SEXO"
                                value={user.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}
                                isEditable
                                fieldName="sexo"
                                options={[{label: 'MASCULINO', value: 'M'}, {label: 'FEMENINO', value: 'F'}]}
                            />
                            <DataRow
                                label="ESTADO CIVIL"
                                value={user.estado_civil}
                                isEditable
                                fieldName="estado_civil"
                                options={[
                                    {label: 'SOLTERO(A)', value: 'SOLTERO(A)'},
                                    {label: 'CASADO(A)', value: 'CASADO(A)'},
                                    {label: 'DIVORCIADO(A)', value: 'DIVORCIADO(A)'},
                                    {label: 'VIUDO(A)', value: 'VIUDO(A)'},
                                ]}
                            />

                            <SectionHeader title="DATOS DE FORMACIÓN BÁSICA" />
                            <DataRow label="UBIGEO Colegio" value={data.ubigeo_colegio} isEditable fieldName="ubigeo_colegio" />
                            <DataRow label="Nombre Colegio" value={data.nombre_colegio} isEditable fieldName="nombre_colegio" />
                            <DataRow
                                label="Tipo Colegio"
                                value={data.tipo_colegio}
                                isEditable
                                fieldName="tipo_colegio"
                                options={[{label: 'P (Público)', value: 'P'}, {label: 'PR (Privado)', value: 'PR'}]}
                            />
                            <DataRow label="Año Término Colegio" value={data.anio_termino_colegio} isEditable fieldName="anio_termino_colegio" type="number" />
                            <DataRow label="Observ. Colegio" value="-" />

                            <SectionHeader title="DATOS DE DOMICILIO ACTUAL" />
                            <div className="grid grid-cols-[180px_1fr] border-b border-gray-200">
                                <div className="bg-[#1e3a5f] text-white p-2 text-xs font-bold uppercase flex items-center">
                                    UBIGEO Actual
                                </div>
                                <div className="p-2 flex items-center bg-[#f0f7ff]">
                                    <button className="bg-orange-400 hover:bg-orange-500 text-white text-[10px] font-bold py-1 px-3 rounded flex items-center uppercase">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                        Editar Ubigeo
                                    </button>
                                </div>
                            </div>
                            <DataRow label="Departamento" value="MOQUEGUA" />
                            <DataRow label="Provincia" value="ILO" />
                            <DataRow label="Distrito" value="ILO" />
                            <DataRow label="Dirección" value={data.direccion_actual} isEditable fieldName="direccion_actual" />
                        </div>

                        {/* RIGHT COLUMN */}
                        <div className="bg-white border border-gray-300 rounded overflow-hidden shadow-md">
                            <SectionHeader title="DATOS PIDE" />
                            <DataRow label="Apellido Paterno" value={user.apellido_paterno} />
                            <DataRow label="Apellido Materno" value={user.apellido_materno} />
                            <DataRow label="Nombres" value={user.nombres} />
                            <DataRow label="UBIGEO" value="MOQUEGUA/ILO/ILO" />
                            <DataRow label="Dirección" value={user.direccion_actual} />
                            <DataRow label="Estado Civil" value={user.estado_civil} />
                            <DataRow label="Restricciones" value="NINGUNA" />
                            <DataRow label="Fecha Consulta" value={new Date().toLocaleString()} />

                            <SectionHeader title="DATOS DE LUGAR NACIMIENTO" />
                            <div className="grid grid-cols-[180px_1fr] border-b border-gray-200">
                                <div className="bg-[#1e3a5f] text-white p-2 text-xs font-bold uppercase flex items-center">
                                    UBIGEO Nacimiento
                                </div>
                                <div className="p-2 flex items-center bg-[#f0f7ff]">
                                    <button className="bg-orange-400 hover:bg-orange-500 text-white text-[10px] font-bold py-1 px-3 rounded flex items-center uppercase">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                        Editar Ubigeo
                                    </button>
                                </div>
                            </div>
                            <DataRow label="Fecha Nacimiento" value={data.fecha_nacimiento} isEditable fieldName="fecha_nacimiento" type="date" />

                            <SectionHeader title="DATOS DE CONTACTO PERSONAL" />
                            <DataRow label="Facebook" value="-" />
                            <DataRow label="Email" value={data.email} isEditable fieldName="email" type="email" />
                            <DataRow label="Teléfono" value={data.telefono} isEditable fieldName="telefono" />

                            <SectionHeader title="DATOS DE PERSONA DE CONTACTO" />
                            <DataRow label="Persona de contacto" value="-" isEditable fieldName="contacto_emergencia_nombre" />
                            <DataRow label="Nombre de contacto" value="-" />
                            <DataRow label="Teléfono de contacto" value="-" isEditable fieldName="contacto_emergencia_telefono" />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
