import { useEffect, useState } from 'react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nombres: '',
        apellidos: '',
        dni: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        return () => {
            reset('password', 'password_confirmation');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <Head title="Registro de Usuario - UNAM" />

            {/* LADO IZQUIERDO: ILUSTRACIÓN */}
            <div className="hidden md:flex md:w-1/2 bg-[#f0f4f8] items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img
                        src="/images/login-illustration.png"
                        alt="Registro Comedor Universitario"
                        className="w-full h-auto drop-shadow-xl rounded-lg"
                    />
                    <h2 className="mt-8 text-2xl font-bold text-[#1e3a5f]">Únete al Comedor Universitario</h2>
                    <p className="mt-4 text-gray-600">
                        Regístrate para acceder a los beneficios del comedor y gestionar tus postulaciones de manera sencilla.
                    </p>
                </div>
            </div>

            {/* LADO DERECHO: FORMULARIO */}
            <div className="flex-1 flex items-center justify-center p-6 md:p-12 bg-white overflow-y-auto">
                <div className="w-full max-w-md my-8">
                    {/* Header con Logo */}
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src="/images/unam-logo.jfif"
                            alt="UNAM Logo"
                            className="h-20 mb-4 object-contain"
                        />
                        <div className="text-center">
                            <h2 className="text-[#1e3a5f] font-bold text-xs uppercase tracking-wider">
                                Universidad Nacional de Moquegua
                            </h2>
                            <h1 className="text-2xl font-extrabold text-gray-800 mt-1">Crear Cuenta</h1>
                            <p className="text-gray-500 mt-1 text-sm">Completa tus datos para empezar</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="nombres" value="Nombres" className="text-gray-700 font-semibold mb-1" />
                                <TextInput
                                    id="nombres"
                                    name="nombres"
                                    value={data.nombres}
                                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                    autoComplete="given-name"
                                    isFocused={true}
                                    onChange={(e) => setData('nombres', e.target.value)}
                                    required
                                />
                                <InputError message={errors.nombres} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="apellidos" value="Apellidos" className="text-gray-700 font-semibold mb-1" />
                                <TextInput
                                    id="apellidos"
                                    name="apellidos"
                                    value={data.apellidos}
                                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                    autoComplete="family-name"
                                    onChange={(e) => setData('apellidos', e.target.value)}
                                    required
                                />
                                <InputError message={errors.apellidos} className="mt-2" />
                            </div>
                        </div>

                        <div>
                            <InputLabel htmlFor="dni" value="DNI" className="text-gray-700 font-semibold mb-1" />
                            <TextInput
                                id="dni"
                                name="dni"
                                value={data.dni}
                                className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                autoComplete="off"
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 8);
                                    setData('dni', val);
                                }}
                                required
                                maxLength={8}
                                placeholder="8 dígitos"
                            />
                            <InputError message={errors.dni} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-semibold mb-1" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="ejemplo@unam.edu.pe"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-semibold mb-1" />
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Confirmar" className="text-gray-700 font-semibold mb-1" />
                                <TextInput
                                    id="password_confirmation"
                                    type={showPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full bg-[#f0f7ff] border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-11 px-4 text-gray-700 transition-all shadow-sm"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    required
                                />
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>
                        </div>

                        <div className="flex items-center mt-2">
                            <input
                                type="checkbox"
                                id="show_password"
                                checked={showPassword}
                                onChange={() => setShowPassword(!showPassword)}
                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                            />
                            <label htmlFor="show_password" size="sm" className="ml-2 text-sm text-gray-600 cursor-pointer">
                                Mostrar contraseñas
                            </label>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#0f4c9b] hover:bg-[#0a3a7a] text-white font-bold rounded-lg shadow-lg transition-all uppercase text-sm active:scale-95 disabled:opacity-70"
                            >
                                Crear Cuenta
                            </button>
                        </div>

                        <div className="pt-4 text-center">
                            <p className="text-gray-600 text-sm">
                                ¿Ya tienes una cuenta?{' '}
                                <Link
                                    href={route('login')}
                                    className="text-[#0f4c9b] font-bold hover:underline"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {/* Barra superior/inferior decorativa solo en móvil */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-1 bg-[#0f4c9b]"></div>
        </div>
    );
}
