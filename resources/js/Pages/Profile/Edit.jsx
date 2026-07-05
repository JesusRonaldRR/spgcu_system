import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ auth, mustVerifyEmail, status }) {
    const user = auth.user;

    // Form for contact details (blue box fields)
    const { data, setData, patch, errors, processing, recentlySuccessful } = useForm({
        nombres: user.nombres,
        apellidos: user.apellidos,
        email: user.email,
        telefono: user.telefono || '',
    });

    const submitContact = (e) => {
        e.preventDefault();
        patch(route('profile.update'), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Perfil de Estudiante</h2>}
        >
            <Head title="Mi Perfil" />

            <div className="py-8 bg-[#e8f4fc]">
                <div className="max-w-md mx-auto space-y-6">

                    {/* Read-only Identity Section */}
                    <div className="bg-white p-4 shadow-sm rounded-lg border border-gray-200">
                        <h3 className="text-sm font-bold text-[#1e3a5f] uppercase mb-3 border-b pb-1">Datos de Identidad (No editables)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase block">DNI</span>
                                <span className="text-sm font-medium text-gray-800">{user.dni || '-'}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-500 font-bold uppercase block">Código</span>
                                <span className="text-sm font-medium text-gray-800">{user.codigo || '-'}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase block">Apellidos y Nombres</span>
                                <span className="text-sm font-medium text-gray-800 uppercase">{user.apellidos} {user.nombres}</span>
                            </div>
                        </div>
                    </div>

                    <div className="shadow-md rounded-lg overflow-hidden border border-gray-200">
                        {/* Header with Title - matching screenshot */}
                        <div className="bg-[#2d3748] text-white p-3 font-bold">
                            Actualiza tus datos y cambia tu Contraseña
                        </div>

                        <div className="bg-white p-6">

                            {/* Status Message */}
                            {recentlySuccessful && (
                                <div className="mb-4 text-sm font-medium text-green-600">
                                    Datos actualizados correctamente.
                                </div>
                            )}

                            {/* Contact Form */}
                            <form onSubmit={submitContact} className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="email" value="Correo" className="text-gray-600 font-semibold" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full bg-[#f0f7ff] border-gray-300"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="telefono" value="Celular" className="text-gray-600 font-semibold" />
                                    <TextInput
                                        id="telefono"
                                        type="text"
                                        className="mt-1 block w-full bg-[#f0f7ff] border-gray-300"
                                        value={data.telefono}
                                        onChange={(e) => setData('telefono', e.target.value)}
                                    />
                                    <InputError message={errors.telefono} className="mt-2" />
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition"
                                    >
                                        Guardar cambios
                                    </button>
                                </div>
                            </form>

                            <div className="my-6 border-t border-gray-200"></div>

                            {/* Password Section */}
                            <div id="password">
                                <UpdatePasswordForm_Custom />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Custom internal component to match the specific UI from screenshot
function UpdatePasswordForm_Custom() {
    const { data, setData, put, errors, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4">
            <div>
                <InputLabel htmlFor="current_password" value="Contraseña Actual" className="text-gray-600 font-semibold" />
                <TextInput
                    id="current_password"
                    type="password"
                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300"
                    value={data.current_password}
                    onChange={(e) => setData('current_password', e.target.value)}
                    autoComplete="current-password"
                />
                <InputError message={errors.current_password} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="password" value="Nueva Contraseña" className="text-gray-600 font-semibold" />
                <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300"
                    value={data.password}
                    onChange={(e) => setData('password', e.target.value)}
                    autoComplete="new-password"
                />
                <InputError message={errors.password} className="mt-2" />
            </div>

            <div>
                <InputLabel htmlFor="password_confirmation" value="Repite Contraseña" className="text-gray-600 font-semibold" />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300"
                    value={data.password_confirmation}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                    autoComplete="new-password"
                />
                <InputError message={errors.password_confirmation} className="mt-2" />
            </div>

            {recentlySuccessful && (
                <div className="text-sm font-medium text-green-600">
                    Contraseña actualizada correctamente.
                </div>
            )}

            <div>
                <button
                    type="submit"
                    disabled={processing}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-sm transition"
                >
                    Guardar Cambios
                </button>
            </div>
        </form>
    );
}
