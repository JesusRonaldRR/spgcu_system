import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombres: '',
        apellidos: '',
        email: '',
        password: '',
        password_confirmation: '',
        rol: 'estudiante',
        dni: '',
        codigo: '',
        telefono: '',
        // New Fields
        apellido_paterno: '',
        apellido_materno: '',
        sexo: '',
        fecha_nacimiento: '',
        estado_civil: '',
        direccion_actual: '',
        ubigeo_actual: '',
        ubigeo_nacimiento: '',
        nombre_colegio: '',
        tipo_colegio: '',
        anio_termino_colegio: '',
        ubigeo_colegio: '',
        contacto_emergencia_nombre: '',
        contacto_emergencia_telefono: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('admin.users.store'));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Crear Nuevo Usuario</h2>}
        >
            <Head title="Crear Usuario" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Nombres */}
                                    <div>
                                        <InputLabel htmlFor="nombres" value="Nombres" />
                                        <TextInput
                                            id="nombres"
                                            className="mt-1 block w-full"
                                            value={data.nombres}
                                            onChange={(e) => setData('nombres', e.target.value)}
                                            required
                                            isFocused
                                            autoComplete="name"
                                        />
                                        <InputError className="mt-2" message={errors.nombres} />
                                    </div>

                                    {/* Apellidos */}
                                    <div>
                                        <InputLabel htmlFor="apellidos" value="Apellidos" />
                                        <TextInput
                                            id="apellidos"
                                            className="mt-1 block w-full"
                                            value={data.apellidos}
                                            onChange={(e) => setData('apellidos', e.target.value)}
                                            required
                                            autoComplete="family-name"
                                        />
                                        <InputError className="mt-2" message={errors.apellidos} />
                                    </div>

                                    {/* Email */}
                                    <div>
                                        <InputLabel htmlFor="email" value="Correo Electrónico" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            className="mt-1 block w-full"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            required
                                            autoComplete="username"
                                        />
                                        <InputError className="mt-2" message={errors.email} />
                                    </div>

                                    {/* Rol */}
                                    <div>
                                        <InputLabel htmlFor="rol" value="Rol" />
                                        <select
                                            id="rol"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.rol}
                                            onChange={(e) => setData('rol', e.target.value)}
                                            required
                                        >
                                            <option value="estudiante">Estudiante</option>
                                            <option value="admin">Administrador</option>
                                            <option value="coordinador">Coordinador</option>
                                            <option value="administrativo">Administrativo</option>
                                            <option value="cocina">Cocina</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.rol} />
                                    </div>

                                    {/* DNI */}
                                    <div>
                                        <InputLabel htmlFor="dni" value="DNI" />
                                        <TextInput
                                            id="dni"
                                            className="mt-1 block w-full"
                                            value={data.dni}
                                            onChange={(e) => setData('dni', e.target.value)}
                                            maxLength={8}
                                            required
                                        />
                                        <InputError className="mt-2" message={errors.dni} />
                                    </div>

                                    {/* Código */}
                                    <div>
                                        <InputLabel htmlFor="codigo" value="Código Universitario" />
                                        <TextInput
                                            id="codigo"
                                            className="mt-1 block w-full"
                                            value={data.codigo}
                                            onChange={(e) => setData('codigo', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.codigo} />
                                    </div>

                                    {/* Teléfono */}
                                    <div>
                                        <InputLabel htmlFor="telefono" value="Teléfono" />
                                        <TextInput
                                            id="telefono"
                                            className="mt-1 block w-full"
                                            value={data.telefono}
                                            onChange={(e) => setData('telefono', e.target.value)}
                                        />
                                        <InputError className="mt-2" message={errors.telefono} />
                                    </div>
                                </div>

                                {/* SECCIÓN: DATOS PERSONALES DETALLADOS */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Datos Personales Detallados</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <InputLabel htmlFor="apellido_paterno" value="Apellido Paterno" />
                                            <TextInput
                                                id="apellido_paterno"
                                                className="mt-1 block w-full"
                                                value={data.apellido_paterno}
                                                onChange={(e) => setData('apellido_paterno', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="apellido_materno" value="Apellido Materno" />
                                            <TextInput
                                                id="apellido_materno"
                                                className="mt-1 block w-full"
                                                value={data.apellido_materno}
                                                onChange={(e) => setData('apellido_materno', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="sexo" value="Sexo" />
                                            <select
                                                id="sexo"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.sexo}
                                                onChange={(e) => setData('sexo', e.target.value)}
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="M">Masculino</option>
                                                <option value="F">Femenino</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="fecha_nacimiento" value="Año de Nacimiento" />
                                            <TextInput
                                                id="fecha_nacimiento"
                                                type="number"
                                                min="1900"
                                                max={new Date().getFullYear()}
                                                className="mt-1 block w-full"
                                                placeholder="Ej. 2000" // Placeholder as int
                                                // Extract year if date exists, else empty
                                                value={data.fecha_nacimiento ? data.fecha_nacimiento.split('-')[0] : ''}
                                                // Save as YYYY-01-01
                                                onChange={(e) => {
                                                    const year = e.target.value;
                                                    setData('fecha_nacimiento', year ? `${year}-01-01` : '');
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="estado_civil" value="Estado Civil" />
                                            <TextInput
                                                id="estado_civil"
                                                className="mt-1 block w-full"
                                                value={data.estado_civil}
                                                onChange={(e) => setData('estado_civil', e.target.value)}
                                                placeholder="Soltero/a, Casado/a..."
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="ubigeo_nacimiento" value="Lugar de Nacimiento (Ubigeo)" />
                                            <TextInput
                                                id="ubigeo_nacimiento"
                                                className="mt-1 block w-full"
                                                value={data.ubigeo_nacimiento}
                                                onChange={(e) => setData('ubigeo_nacimiento', e.target.value)}
                                                placeholder="Departamento - Provincia - Distrito"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN: UBICACIÓN ACTUAL */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación Actual</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <InputLabel htmlFor="direccion_actual" value="Dirección Actual" />
                                            <TextInput
                                                id="direccion_actual"
                                                className="mt-1 block w-full"
                                                value={data.direccion_actual}
                                                onChange={(e) => setData('direccion_actual', e.target.value)}
                                                placeholder="Av/Jr/Calle #..."
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="ubigeo_actual" value="Ubigeo Actual" />
                                            <TextInput
                                                id="ubigeo_actual"
                                                className="mt-1 block w-full"
                                                value={data.ubigeo_actual}
                                                onChange={(e) => setData('ubigeo_actual', e.target.value)}
                                                placeholder="Departamento - Provincia - Distrito"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN: EDUCACIÓN SECUNDARIA */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Educación Secundaria</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="nombre_colegio" value="Nombre del Colegio" />
                                            <TextInput
                                                id="nombre_colegio"
                                                className="mt-1 block w-full"
                                                value={data.nombre_colegio}
                                                onChange={(e) => setData('nombre_colegio', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="tipo_colegio" value="Tipo de Colegio" />
                                            <select
                                                id="tipo_colegio"
                                                className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                                value={data.tipo_colegio}
                                                onChange={(e) => setData('tipo_colegio', e.target.value)}
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="Nacional">Nacional / Público</option>
                                                <option value="Particular">Particular / Privado</option>
                                            </select>
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="anio_termino_colegio" value="Año de Término" />
                                            <TextInput
                                                id="anio_termino_colegio"
                                                type="number"
                                                className="mt-1 block w-full"
                                                value={data.anio_termino_colegio}
                                                onChange={(e) => setData('anio_termino_colegio', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="ubigeo_colegio" value="Ubicación Colegio" />
                                            <TextInput
                                                id="ubigeo_colegio"
                                                className="mt-1 block w-full"
                                                value={data.ubigeo_colegio}
                                                onChange={(e) => setData('ubigeo_colegio', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN: CONTACTO EMERGENCIA */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto de Emergencia</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="contacto_emergencia_nombre" value="Nombre del Contacto" />
                                            <TextInput
                                                id="contacto_emergencia_nombre"
                                                className="mt-1 block w-full"
                                                value={data.contacto_emergencia_nombre}
                                                onChange={(e) => setData('contacto_emergencia_nombre', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="contacto_emergencia_telefono" value="Teléfono del Contacto" />
                                            <TextInput
                                                id="contacto_emergencia_telefono"
                                                className="mt-1 block w-full"
                                                value={data.contacto_emergencia_telefono}
                                                onChange={(e) => setData('contacto_emergencia_telefono', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Contraseña</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Password */}
                                        <div>
                                            <InputLabel htmlFor="password" value="Contraseña" />
                                            <TextInput
                                                id="password"
                                                type="password"
                                                className="mt-1 block w-full"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <InputError className="mt-2" message={errors.password} />
                                        </div>

                                        {/* Password Confirmation */}
                                        <div>
                                            <InputLabel htmlFor="password_confirmation" value="Confirmar Contraseña" />
                                            <TextInput
                                                id="password_confirmation"
                                                type="password"
                                                className="mt-1 block w-full"
                                                value={data.password_confirmation}
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                required
                                                autoComplete="new-password"
                                            />
                                            <InputError className="mt-2" message={errors.password_confirmation} />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-end mt-4">
                                    <Link
                                        href={route('admin.users.index')}
                                        className="text-gray-600 hover:text-gray-900 mr-4"
                                    >
                                        Cancelar
                                    </Link>
                                    <PrimaryButton className="ml-4" disabled={processing}>
                                        Guardar Usuario
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
