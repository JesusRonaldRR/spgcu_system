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
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4 relative overflow-hidden">
            <Head title="Iniciar Sesión" />

            {/* Decorative Background Shapes */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
                {/* Top right teal shape */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-teal-400 opacity-20 rounded-full blur-3xl"></div>
                {/* Bottom left blue shape */}
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-blue-500 opacity-15 rounded-full blur-3xl"></div>
                {/* Geometric accents */}
                <svg className="absolute bottom-20 left-10 w-32 h-32 text-gray-300 opacity-50" viewBox="0 0 100 100">
                    <polygon points="50,5 95,97.5 5,97.5" fill="none" stroke="currentColor" strokeWidth="2" />
                </svg>
                <svg className="absolute top-32 right-20 w-24 h-24 text-teal-300 opacity-40" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                </svg>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8 z-10 relative">
                {/* Logo */}
                <div className="flex flex-col items-center mb-6">
                    <div className="mb-3">
                        <svg viewBox="0 0 80 80" className="w-20 h-20">
                            {/* UNAM-style logo */}
                            <defs>
                                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#14b8a6" />
                                    <stop offset="100%" stopColor="#1e3a5f" />
                                </linearGradient>
                            </defs>
                            {/* U shape */}
                            <path
                                d="M15 15 L15 50 Q15 65 40 65 Q65 65 65 50 L65 15 L55 15 L55 48 Q55 55 40 55 Q25 55 25 48 L25 15 Z"
                                fill="url(#logoGradient)"
                            />
                            {/* Accent dot */}
                            <circle cx="60" cy="25" r="8" fill="#14b8a6" />
                        </svg>
                    </div>
                    <span className="text-2xl font-bold text-[#1e3a5f] tracking-wide">UNAM</span>
                    <p className="text-sm text-gray-600 mt-1 text-center">Universidad Nacional de Moquegua</p>
                </div>

                {/* Title */}
                <h1 className="text-center text-lg font-semibold text-[#1e3a5f] mb-6 border-t pt-4">
                    Sistema de Comedor Universitario
                </h1>

                {/* Login Form */}
                <form onSubmit={submit} className="space-y-4">
                    {status && (
                        <div className="mb-4 font-medium text-sm text-green-600 text-center bg-green-50 p-2 rounded">
                            {status}
                        </div>
                    )}

                    {/* DNI Field */}
                    <div>
                        <InputLabel htmlFor="dni" value="Usuario" className="text-gray-600 text-sm font-medium mb-1" />
                        <TextInput
                            id="dni"
                            type="text"
                            name="dni"
                            value={data.dni}
                            className="mt-1 block w-full bg-blue-50 border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg text-gray-700 h-11 px-4 placeholder-gray-400"
                            autoComplete="username"
                            isFocused={true}
                            onChange={(e) => setData('dni', e.target.value)}
                            placeholder="72651532"
                            maxLength={8}
                        />
                        <InputError message={errors.dni} className="mt-2" />
                    </div>

                    {/* Password Field */}
                    <div>
                        <InputLabel htmlFor="password" value="Clave" className="text-gray-600 text-sm font-medium mb-1" />
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                className="mt-1 block w-full bg-blue-50 border border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-lg text-gray-700 h-11 px-4 pr-12 placeholder-gray-400"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="••••••••••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showPassword ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 3.157l-1.414-1.414A9.75 9.75 0 0021.25 12a9.74 9.74 0 00-2.813-4.18 9.744 9.744 0 00-6.437-2.57 9.7 9.7 0 00-4.17.916L6.17 4.506a11.25 11.25 0 0116.506 8.047zM12 5.25c.988 0 1.946.149 2.857.422l-1.525 1.525A4.5 4.5 0 007.5 12c0 .316.032.625.094.921l-1.525 1.525A6.748 6.748 0 0112 5.25z" />
                                        <path d="M12 10.5a1.5 1.5 0 011.5 1.5l-3 3a1.5 1.5 0 013-4.5z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                        <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                        <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2" />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {processing ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ingresando...
                                </span>
                            ) : (
                                'Ingresar'
                            )}
                        </button>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-center mt-4">
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors"
                            >
                                Olvidé mi contraseña
                            </Link>
                        )}
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="fixed bottom-0 w-full py-3 text-center text-gray-500 text-xs bg-white/70 backdrop-blur-sm border-t border-gray-200">
                © 2025 Universidad Nacional de Moquegua - Sistema de Comedor Universitario
            </div>

            {/* WhatsApp-style floating button (optional decorative) */}
            <div className="fixed bottom-16 right-6 z-20">
                <div className="w-14 h-14 bg-green-500 rounded-full shadow-lg flex items-center justify-center cursor-pointer hover:bg-green-600 transition-colors">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
