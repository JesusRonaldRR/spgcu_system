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
        <div className="min-h-screen flex items-center justify-center p-4 bg-no-repeat bg-cover bg-center relative"
             style={{ backgroundImage: "url('https://admision.unam.edu.pe/view/img/bg-login.jpg')" }}>
            <Head title="Aula Virtual - UNAM" />

            {/* Overlay to improve readability if needed */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

            <div className="z-10 flex flex-col lg:flex-row items-center gap-8 max-w-6xl w-full">

                {/* LOGIN CARD (LEFT) */}
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 border border-gray-100">
                    <div className="flex flex-col items-center mb-8">
                        <img
                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR6vTsczZq7673R3E0QvI7h9Vq7667Vz_YIyg&s"
                            alt="UNAM Logo"
                            className="h-20 mb-2"
                        />
                        <h2 className="text-[#1e3a5f] font-bold text-sm text-center uppercase tracking-tighter">
                            Universidad Nacional de Moquegua
                        </h2>
                        <h1 className="text-xl font-bold text-gray-800 mt-6">Aula Virtual</h1>
                    </div>

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="dni" value="Usuario" className="text-blue-500 font-semibold text-xs mb-1" />
                            <TextInput
                                id="dni"
                                type="text"
                                name="dni"
                                value={data.dni}
                                className="mt-1 block w-full bg-[#e8f0fe] border-none focus:ring-2 focus:ring-blue-400 rounded-lg h-11 px-4 text-gray-700"
                                autoComplete="username"
                                isFocused={true}
                                onChange={(e) => setData('dni', e.target.value)}
                                placeholder="72651532"
                            />
                            <InputError message={errors.dni} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="Clave" className="text-blue-500 font-semibold text-xs mb-1" />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full bg-[#e8f0fe] border-none focus:ring-2 focus:ring-blue-400 rounded-lg h-11 px-4 text-gray-700 pr-10"
                                    autoComplete="current-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="rosalesroca@A269"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 bg-[#0f4c9b] hover:bg-[#0a3a7a] text-white font-bold rounded-full shadow-lg transition-all uppercase text-sm"
                            >
                                Ingresar
                            </button>
                        </div>

                        <div className="text-center">
                            <Link
                                href={route('password.request')}
                                className="text-sm text-blue-600 hover:underline font-medium"
                            >
                                Olvidé mi contraseña
                            </Link>
                        </div>
                    </form>
                </div>

                {/* DIRECTORY CARD (RIGHT) */}
                <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 border border-gray-100 hidden lg:block overflow-hidden">
                    <h3 className="text-gray-800 font-bold text-lg mb-4 uppercase tracking-tight">Directorio Telefónico</h3>

                    <div className="border border-gray-200 rounded-lg">
                        <table className="min-w-full text-xs text-left">
                            <thead className="bg-[#0f4c9b] text-white uppercase">
                                <tr>
                                    <th className="px-4 py-3 border-r border-white/20">Tienes duda sobre...</th>
                                    <th className="px-4 py-3">Comunícate con:</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 border-r border-gray-200 align-top">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>¿No sabes cómo matricularte?</li>
                                            <li>¿Quieres reservar tu matrícula?</li>
                                            <li>¿Algún curso no está habilitado?</li>
                                            <li>¿Perdiste o no recuerdas la clave de acceso a tu sistema de estudiante?</li>
                                            <li>¿Consultas sobre cursos dirigidos?</li>
                                            <li>¿Consultas sobre boletas de notas, ficha de matrícula?</li>
                                            <li>¿Consulta sobre ranking académico quinto superior, tercio superior?</li>
                                        </ul>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <p className="font-bold text-gray-700">Dirección de actividades y servicios académicos</p>
                                        <p className="text-blue-600">dasa@unam.edu.pe</p>
                                        <p className="text-gray-600">ANEXO 302</p>
                                        <p className="text-gray-600">Celular: 953967519</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 border-r border-gray-200 align-top">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>¿No sabes cuál es tu usuario y contraseña de acceso a la Biblioteca Virtual?</li>
                                            <li>¿Quieres saber con qué libros contamos?</li>
                                        </ul>
                                    </td>
                                    <td className="px-4 py-3 align-top">
                                        <p className="text-gray-700">Sede Moquegua 964611430</p>
                                        <p className="text-gray-700">Filial Ilo 989895105</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="px-4 py-3 bg-gray-50 border-r border-gray-200 align-top">
                                        <ul className="list-disc list-inside space-y-1">
                                            <li>¿Tienes dudas sobre tu Horarios de clases?</li>
                                            <li>¿Tienes consultas sobre tus docentes?</li>
                                            <li>¿Tienes dudas sobre tus secciones, turno de clase?</li>
                                        </ul>
                                    </td>
                                    <td className="px-4 py-3 text-[10px] grid grid-cols-2 gap-x-2">
                                        <div>
                                            <p className="font-bold">Con tu Escuela Profesional:</p>
                                            <p>Gestión Pública y Desarrollo Social: 945650473</p>
                                            <p>Ingeniería de Minas: 945647065</p>
                                            <p>Ingeniería Agroindustrial: 945647154</p>
                                            <p>Ingeniería Civil: 923234699</p>
                                            <p>Ingeniería de Sistemas e Informática: 945649660</p>
                                        </div>
                                        <div>
                                            <p>Ingeniería Ambiental: 945647792</p>
                                            <p>Ingeniería Pesquera: 945647542</p>
                                            <p>Administración: 936670981</p>
                                            <p>Medicina: Anexo 606</p>
                                            <p>Derecho: 975703540</p>
                                            <p>Contabilidad: 912374914 (Moquegua), 908892980 (Ilo)</p>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-xs text-gray-500 max-w-xs">
                            <p>¿El sistema de estudiante o aula virtual no funciona bien?</p>
                            <p>¿Tienes problemas con el acceso a tu correo electrónico?</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <div className="bg-gray-100 p-2 rounded">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=https://wa.me/51971894857" alt="WhatsApp QR" />
                            </div>
                            <span className="text-[10px] font-bold mt-1">971894857</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Float Green Dot Decor */}
            <div className="fixed bottom-6 right-6 w-12 h-12 bg-[#25d366] rounded-full shadow-lg border-2 border-white animate-pulse hidden lg:flex items-center justify-center">
                <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </div>

            {/* Footer Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 h-1 bg-[#0f4c9b]"></div>
        </div>
    );
}
