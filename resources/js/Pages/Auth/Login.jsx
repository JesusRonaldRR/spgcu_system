import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        dni: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <Head title="Aula Virtual - UNAM" />

            {/* LADO IZQUIERDO: ILUSTRACIÓN (Oculto en móvil, visible en md+) */}
            <div className="hidden md:flex md:w-1/2 bg-[#f0f4f8] items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img
                        src="/images/login-illustration.png"
                        alt="Comedor Universitario"
                        className="w-full h-auto drop-shadow-xl rounded-lg"
                    />
                    <h2 className="mt-8 text-2xl font-bold text-[#1e3a5f]">Sistema de Gestión del Comedor</h2>
                    <p className="mt-4 text-gray-600">
                        Bienvenido al portal de postulación y gestión del comedor de la Universidad Nacional de Moquegua.
                    </p>
                </div>
            </div>

            {/* LADO DERECHO: FORMULARIO */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white">
                <div className="w-full max-w-md">
                    {/* Header con Logo */}
                    <div className="flex flex-col items-center mb-10">
                        <img
                            src="/images/unam-logo.jfif"
                            alt="UNAM Logo"
                            className="h-24 mb-4 object-contain"
                        />
                        <div className="text-center">
                            <h2 className="text-[#1e3a5f] font-bold text-sm uppercase tracking-wider">
                                Universidad Nacional de Moquegua
                            </h2>
                            <h1 className="text-3xl font-extrabold text-gray-800 mt-2">Aula Virtual</h1>
                            <p className="text-gray-500 mt-1">Ingresa tus credenciales para continuar</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-6">
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600 text-center bg-green-50 p-3 rounded-lg border border-green-100">
                                {status}
                            </div>
                        )}

                        <div>
                            <InputLabel htmlFor="dni" value="Usuario (DNI)" className="text-gray-700 font-semibold mb-1" />
                            <TextInput
                                id="dni"
                                type="text"
                                name="dni"
                                value={data.dni}
                                className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12 px-4 text-gray-700 transition-all"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('dni', e.target.value)}
                                placeholder="Ingresa tu DNI"
                                maxLength={8}
                            />
                            <InputError message={errors.dni} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-semibold mb-1" />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12 px-4 text-gray-700 pr-12 transition-all"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.477 0 0012 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-600">Recordarme</span>
                            </label>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#0f4c9b] hover:bg-[#0a3a7a] text-white font-bold rounded-lg shadow-lg transition-all uppercase text-sm active:scale-95 disabled:opacity-70"
                            >
                                Iniciar Sesión
                            </button>
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                ¿No tienes una cuenta?{' '}
                                <Link
                                    href={route('register')}
                                    className="text-[#0f4c9b] font-bold hover:underline"
                                >
                                    Regístrate aquí
                                </Link>
                            </p>
                        </div>
                    </form>

                    {/* Footer con info de soporte */}
                    <div className="mt-12 pt-6 border-t border-gray-100 flex items-center justify-center space-x-4">
                        <a href="https://wa.me/51971894857" target="_blank" className="text-gray-400 hover:text-[#25d366] transition-colors">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </a>
                        <span className="text-xs text-gray-400">© 2024 UNAM - Bienestar Universitario</span>
                    </div>
                </div>
            </div>

            {/* Barra superior/inferior decorativa solo en móvil */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-1 bg-[#0f4c9b]"></div>
        </div>
    );
}
