import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Bienvenido - SPGCU" />

            <div className="min-h-screen flex flex-col relative">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 z-0"
                    style={{
                        backgroundImage: "url('https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=1986&auto=format&fit=crop')",
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    <div className="absolute inset-0 bg-[#31436B]/90"></div> {/* Blue tint overlay */}
                </div>

                {/* Header Institucional (Transparent) */}
                <header className="relative z-10 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-white p-2 rounded-full h-14 w-14 flex items-center justify-center text-[#31436B] font-bold text-2xl shadow-lg">
                                U
                            </div>
                            <div>
                                <h1 className="text-xl font-bold leading-tight">UNIVERSIDAD NACIONAL DE MOQUEGUA</h1>
                                <p className="text-sm text-gray-200 tracking-widest">SISTEMA DE COMEDOR UNIVERSITARIO</p>
                            </div>
                        </div>
                        {/* Nav link removed as requested */}
                    </div>
                </header>

                {/* Main Content */}
                <main className="relative z-10 flex-grow flex items-center justify-center px-4 text-center">
                    <div className="max-w-3xl space-y-8 animate-fade-in-up">
                        <h2 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                            Gestión del Comedor Universitario
                        </h2>
                        <p className="text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
                            Plataforma digital para la postulación a becas de comedor, control de asistencia y gestión de beneficiarios.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="px-8 py-4 bg-white text-[#31436B] text-lg font-bold rounded-full shadow-lg hover:bg-gray-100 transform hover:scale-105 transition duration-200"
                                >
                                    Ir al Panel de Control
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="px-8 py-4 bg-[#FF2D20] text-white text-lg font-bold rounded-full shadow-lg hover:bg-[#e61e12] transform hover:scale-105 transition duration-200"
                                    >
                                        Ingresar al Sistema
                                    </Link>
                                    <a
                                        href="https://unam.edu.pe"
                                        target="_blank"
                                        className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg font-bold rounded-full hover:bg-white/10 transition duration-200"
                                    >
                                        Portal Institucional
                                    </a>
                                </>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="relative z-10 py-6 text-center text-white/60 text-sm">
                    <p>© 2025 Universidad Nacional de Moquegua - Dirección de Bienestar Universitario</p>
                </footer>
            </div>
        </>
    );
}
