import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';

export default function PasswordUpdate({ auth }) {
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
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Seguridad de la Cuenta</h2>}
        >
            <Head title="Cambiar Contraseña" />

            <div className="py-12 bg-[#e8f4fc] min-h-screen">
                <div className="max-w-md mx-auto bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
                    <div className="bg-[#2d3748] text-white p-4 font-bold text-lg">
                        Actualiza tus datos y cambia tu Contraseña
                    </div>
                    <div className="p-8 space-y-6">
                        {/* Status Message */}
                        {recentlySuccessful && (
                            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative text-sm font-bold uppercase mb-4">
                                ¡Contraseña actualizada correctamente!
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <InputLabel htmlFor="current_password" value="Contraseña Actual" className="text-gray-600 font-bold" />
                                <TextInput
                                    id="current_password"
                                    type="password"
                                    className="w-full mt-1 bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    value={data.current_password}
                                    onChange={(e) => setData('current_password', e.target.value)}
                                    autoComplete="current-password"
                                />
                                <InputError message={errors.current_password} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="password" value="Nueva Contraseña" className="text-gray-600 font-bold" />
                                <TextInput
                                    id="password"
                                    type="password"
                                    className="w-full mt-1 bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Repite Contraseña" className="text-gray-600 font-bold" />
                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    className="w-full mt-1 bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    autoComplete="new-password"
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded transition shadow-md uppercase text-sm w-full"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
