import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <Head title="Recuperar Contraseña - UNAM" />

            {/* LADO IZQUIERDO: ILUSTRACIÓN */}
            <div className="hidden md:flex md:w-1/2 bg-[#f0f4f8] items-center justify-center p-12">
                <div className="max-w-md text-center">
                    <img
                        src="/images/login-illustration.png"
                        alt="Recuperar Acceso"
                        className="w-full h-auto drop-shadow-xl rounded-lg"
                    />
                    <h2 className="mt-8 text-2xl font-bold text-[#1e3a5f]">¿Olvidaste tu contraseña?</h2>
                    <p className="mt-4 text-gray-600">
                        No te preocupes. Ingresa tu correo electrónico y te enviaremos un enlace para que puedas restablecerla y volver a acceder al sistema.
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
                            <h1 className="text-3xl font-extrabold text-gray-800 mt-2">Recuperar Acceso</h1>
                            <p className="text-gray-500 mt-1">Ingresa tu correo para continuar</p>
                        </div>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={submit} className="space-y-6">
                        {status && (
                            <div className="mb-4 font-medium text-sm text-green-600 text-center bg-green-50 p-4 rounded-lg border border-green-100 shadow-sm">
                                {status}
                            </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                            <p className="text-sm text-blue-800 leading-relaxed">
                                Se enviará un enlace de restablecimiento a tu dirección de correo electrónico institucional o personal registrada.
                            </p>
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-semibold mb-1" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full bg-gray-50 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg h-12 px-4 text-gray-700 transition-all"
                                isFocused={true}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="ejemplo@unam.edu.pe"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3.5 bg-[#0f4c9b] hover:bg-[#0a3a7a] text-white font-bold rounded-lg shadow-lg transition-all uppercase text-sm active:scale-95 disabled:opacity-70"
                            >
                                Enviar Enlace de Recuperación
                            </button>
                        </div>

                        <div className="pt-4 text-center">
                            <Link
                                href={route('login')}
                                className="text-gray-600 text-sm hover:text-[#0f4c9b] font-medium flex items-center justify-center transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                                </svg>
                                Volver al inicio de sesión
                            </Link>
                        </div>
                    </form>

                    {/* Footer con info de soporte */}
                    <div className="mt-12 pt-6 border-t border-gray-100 text-center">
                        <span className="text-xs text-gray-400">© 2026 UNAM - Bienestar Universitario</span>
                    </div>
                </div>
            </div>

            {/* Barra superior/inferior decorativa solo en móvil */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-1 bg-[#0f4c9b]"></div>
        </div>
    );
}
