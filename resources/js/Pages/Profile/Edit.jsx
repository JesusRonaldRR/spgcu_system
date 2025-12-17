import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = auth.user;
    const [isEditing, setIsEditing] = useState(false);

    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nombres: user.nombres,
        apellidos: user.apellidos,
        apellido_paterno: user.apellido_paterno || '',
        apellido_materno: user.apellido_materno || '',
        email: user.email,
        sexo: user.sexo || 'M',
        estado_civil: user.estado_civil || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        telefono: user.telefono || '',
        dni: user.dni || '',
        codigo: user.codigo || '',

        // Location
        direccion_actual: user.direccion_actual || '',
        ubigeo_actual: user.ubigeo_actual || '',
        ubigeo_nacimiento: user.ubigeo_nacimiento || '',

        // Education
        nombre_colegio: user.nombre_colegio || '',
        tipo_colegio: user.tipo_colegio || '',
        anio_termino_colegio: user.anio_termino_colegio || '',
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            onSuccess: () => setIsEditing(false),
        });
    };

    const ReadOnlyField = ({ label, value }) => (
        <div className="border border-gray-300">
            <div className="bg-[#1e3a5f] text-white px-3 py-1 font-bold text-xs uppercase text-right w-full">
                {label}
            </div>
            <div className="bg-white px-3 py-2 text-sm text-gray-800 min-h-[30px] font-medium uppercase border-t border-gray-300">
                {value || '-'}
            </div>
        </div>
    );

    // Grid layout for read-only view matching screenshot
    // Using simple HTML table-like structure via CSS grid
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil de Estudiante</h2>}
        >
            <Head title="Mi Perfil" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Header with Title and Edit Button */}
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-xl font-bold text-[#1e3a5f]">Datos Personales</h3>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-1px-4 rounded shadow text-sm px-4"
                        >
                            {isEditing ? 'Cancelar Edición' : 'Editar'}
                        </button>
                    </div>

                    {status === 'profile-updated' && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                            <span className="block sm:inline">Perfil actualizado correctamente.</span>
                        </div>
                    )}

                    {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column: General & Address */}
                            <div className="space-y-6">
                                {/* Datos Generales Table Style */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos Generales
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Código</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900">{user.codigo}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">DNI</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900">{user.dni}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r uppercase">Apellidos</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.apellidos} {user.apellido_paterno} {user.apellido_materno}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r uppercase">Nombres</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.nombres}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r uppercase">Sexo</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.sexo === 'M' ? 'MASCULINO' : 'FEMENINO'}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r uppercase">Estado Civil</div>
                                        <div className="bg-white p-2 text-sm text-gray-900 uppercase">{user.estado_civil}</div>
                                    </div>
                                </div>

                                {/* Formacion Basica */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos de Formación Básica
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">UBIGEO Colegio</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900">{user.ubigeo_colegio}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Nombre Colegio</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.nombre_colegio}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Tipo Colegio</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.tipo_colegio}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r">Año Término</div>
                                        <div className="bg-white p-2 text-sm text-gray-900">{user.anio_termino_colegio}</div>
                                    </div>
                                </div>

                                {/* Domicilio Actual */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos de Domicilio Actual
                                    </div>
                                    <div className="grid grid-cols-[140px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">UBIGEO Actual</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900">{user.ubigeo_actual}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Dirección</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.direccion_actual}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r">Referencia</div>
                                        <div className="bg-white p-2 text-sm text-gray-900">-</div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: PIDE Details */}
                            <div className="space-y-6">
                                {/* Datos PIDE */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos Adicionales
                                    </div>
                                    <div className="grid grid-cols-[160px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Apellido Paterno</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.apellido_paterno}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Apellido Materno</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.apellido_materno}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Nombres</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900 uppercase">{user.nombres}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r">Fecha Nacimiento</div>
                                        <div className="bg-white p-2 text-sm text-gray-900">{user.fecha_nacimiento}</div>
                                    </div>
                                </div>

                                {/* Lugar Nacimiento */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos de Lugar Nacimiento
                                    </div>
                                    <div className="grid grid-cols-[160px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r">UBIGEO Nacimiento</div>
                                        <div className="bg-white p-2 text-sm text-gray-900 uppercase">{user.ubigeo_nacimiento}</div>
                                    </div>
                                </div>

                                {/* Contacto Personal */}
                                <div className="border border-[#1e3a5f] rounded-t-lg overflow-hidden">
                                    <div className="bg-[#1e3a5f] text-white font-bold text-center py-2">
                                        Datos de contacto personal
                                    </div>
                                    <div className="grid grid-cols-[160px_1fr]">
                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-b border-white border-r">Email</div>
                                        <div className="bg-white p-2 text-sm border-b text-gray-900">{user.email}</div>

                                        <div className="bg-[#1e3a5f] text-white p-2 text-sm font-bold border-white border-r">Teléfono</div>
                                        <div className="bg-white p-2 text-sm text-gray-900">{user.telefono}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* EDIT FORM */
                        <form onSubmit={submit} className="bg-white p-6 rounded-lg shadow-lg">
                            <h3 className="text-lg font-bold text-[#1e3a5f] mb-4 border-b pb-2">Editar Información</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Apellidos Detallados */}
                                <div>
                                    <InputLabel htmlFor="apellido_paterno" value="Apellido Paterno" />
                                    <TextInput id="apellido_paterno" className="mt-1 block w-full" value={data.apellido_paterno} onChange={(e) => setData('apellido_paterno', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="apellido_materno" value="Apellido Materno" />
                                    <TextInput id="apellido_materno" className="mt-1 block w-full" value={data.apellido_materno} onChange={(e) => setData('apellido_materno', e.target.value)} />
                                </div>

                                {/* Nombres & Sexo */}
                                <div>
                                    <InputLabel htmlFor="nombres" value="Nombres" />
                                    <TextInput id="nombres" className="mt-1 block w-full bg-gray-100" value={data.nombres} disabled />
                                </div>
                                <div>
                                    <InputLabel htmlFor="sexo" value="Sexo" />
                                    <select
                                        id="sexo"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.sexo}
                                        onChange={(e) => setData('sexo', e.target.value)}
                                    >
                                        <option value="M">Masculino</option>
                                        <option value="F">Femenino</option>
                                    </select>
                                </div>

                                {/* Fecha Nacimiento & Estado Civil */}
                                <div>
                                    <InputLabel htmlFor="fecha_nacimiento" value="Fecha de Nacimiento" />
                                    <TextInput type="date" id="fecha_nacimiento" className="mt-1 block w-full" value={data.fecha_nacimiento} onChange={(e) => setData('fecha_nacimiento', e.target.value)} />
                                </div>
                                <div>
                                    <InputLabel htmlFor="estado_civil" value="Estado Civil" />
                                    <select
                                        id="estado_civil"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.estado_civil}
                                        onChange={(e) => setData('estado_civil', e.target.value)}
                                    >
                                        <option value="">Seleccione</option>
                                        <option value="SOLTERO">SOLTERO</option>
                                        <option value="CASADO">CASADO</option>
                                        <option value="DIVORCIADO">DIVORCIADO</option>
                                        <option value="VIUDO">VIUDO</option>
                                    </select>
                                </div>

                                {/* Contacto */}
                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput type="email" id="email" className="mt-1 block w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} required />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>
                                <div>
                                    <InputLabel htmlFor="telefono" value="Teléfono / Celular" />
                                    <TextInput id="telefono" className="mt-1 block w-full" value={data.telefono} onChange={(e) => setData('telefono', e.target.value)} />
                                </div>

                                {/* Ubicacion */}
                                <div className="col-span-2">
                                    <h4 className="font-bold text-gray-700 mt-2 mb-2">Domicilio Actual</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="direccion_actual" value="Dirección" />
                                            <TextInput id="direccion_actual" className="mt-1 block w-full" value={data.direccion_actual} onChange={(e) => setData('direccion_actual', e.target.value)} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="ubigeo_actual" value="UBIGEO (Dep/Prov/Dist)" />
                                            <TextInput id="ubigeo_actual" className="mt-1 block w-full" value={data.ubigeo_actual} onChange={(e) => setData('ubigeo_actual', e.target.value)} placeholder="MOQUEGUA/ILO/ILO" />
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div className="col-span-2">
                                    <h4 className="font-bold text-gray-700 mt-2 mb-2">Educación Básica</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel htmlFor="nombre_colegio" value="Nombre Colegio" />
                                            <TextInput id="nombre_colegio" className="mt-1 block w-full" value={data.nombre_colegio} onChange={(e) => setData('nombre_colegio', e.target.value)} />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="tipo_colegio" value="Tipo (Publico/Privado)" />
                                            <select
                                                id="tipo_colegio"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.tipo_colegio}
                                                onChange={(e) => setData('tipo_colegio', e.target.value)}
                                            >
                                                <option value="">Seleccione</option>
                                                <option value="PUBLICO">PUBLICO</option>
                                                <option value="PRIVADO">PRIVADO</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="anio_termino_colegio" value="Año Término" />
                                            <TextInput type="number" id="anio_termino_colegio" className="mt-1 block w-full" value={data.anio_termino_colegio} onChange={(e) => setData('anio_termino_colegio', e.target.value)} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end mt-6 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="text-gray-600 hover:text-gray-900"
                                >
                                    Cancelar
                                </button>
                                <PrimaryButton disabled={processing}>
                                    Guardar Cambios
                                </PrimaryButton>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
