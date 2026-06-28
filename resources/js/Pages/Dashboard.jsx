import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    const user = auth.user;

    // Module cards configuration by role
    const getModuleCards = () => {
        if (user.rol === 'estudiante') {
            const allModules = [
                // Only for Beneficiaries
                ...(user.is_beneficiary ? [
                    {
                        title: 'MI CÓDIGO QR',
                        subtitle: 'Acceso al Comedor',
                        description: 'Tu código personal para el control de asistencia',
                        href: route('asistencia.my_qr'),
                        color: 'from-green-400 to-teal-500',
                        badge: 'E',
                        badgeColor: 'bg-orange-500',
                        participants: null,
                    },
                    {
                        title: 'HORARIO COMEDOR',
                        subtitle: 'Menú Semanal',
                        description: 'Consulta los platillos y horarios del comedor',
                        href: route('comedor.horario'),
                        color: 'from-amber-400 to-orange-500',
                        badge: 'E',
                        badgeColor: 'bg-orange-500',
                        participants: null,
                    },
                    {
                        title: 'JUSTIFICACIONES',
                        subtitle: 'Inasistencias',
                        description: 'Justifica tus faltas al comedor',
                        href: route('justificaciones.index'),
                        color: 'from-rose-400 to-pink-500',
                        badge: 'E',
                        badgeColor: 'bg-orange-500',
                        participants: null,
                    }
                ] : []),

                // Available to Everyone
                {
                    title: 'POSTULACIONES',
                    subtitle: 'Beca Alimentaria',
                    description: 'Gestiona tus solicitudes de beneficio',
                    href: route('postulaciones.index'),
                    color: 'from-blue-500 to-indigo-600',
                    badge: 'E',
                    badgeColor: 'bg-orange-500',
                    participants: null,
                },
                {
                    title: 'CITAS',
                    subtitle: 'Entrevistas',
                    description: 'Ver cronograma de entrevistas',
                    href: route('citas.index'),
                    color: 'from-violet-400 to-purple-500',
                    badge: 'E',
                    badgeColor: 'bg-orange-500',
                    participants: null,
                },
            ];

            return allModules.sort((a, b) => a.title.localeCompare(b.title)); // Optional sort, or keep predefined order
        }




        if (user.rol === 'admin') {
            return [
                {
                    title: 'GESTIÓN DE USUARIOS',
                    subtitle: 'Administración',
                    description: 'Crear, editar y eliminar usuarios del sistema',
                    href: route('admin.users.index'),
                    color: 'from-red-500 to-rose-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: 'Total usuarios',
                },
                {
                    title: 'POSTULACIONES',
                    subtitle: 'Evaluación',
                    description: 'Revisar y aprobar solicitudes de beca',
                    href: route('postulaciones.index'),
                    color: 'from-teal-500 to-cyan-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: 'Pendientes',
                },
                {
                    title: 'CITAS / ENTREVISTAS',
                    subtitle: 'Programación',
                    description: 'Gestionar entrevistas de postulantes',
                    href: route('citas.index'),
                    color: 'from-indigo-500 to-blue-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: null,
                },
                {
                    title: 'BENEFICIARIOS',
                    subtitle: 'Lista de Becarios',
                    description: 'Ver y exportar lista de beneficiarios',
                    href: route('admin.beneficiarios.index'),
                    color: 'from-emerald-500 to-green-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: null,
                },
                {
                    title: 'MENÚS COMEDOR',
                    subtitle: 'Configuración',
                    description: 'Programar menús y horarios del comedor',
                    href: route('admin.menus.index'),
                    color: 'from-amber-500 to-orange-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: null,
                },
                {
                    title: 'ESCÁNER QR',
                    subtitle: 'Control de Asistencia',
                    description: 'Registrar ingreso de beneficiarios',
                    href: route('asistencia.scanner'),
                    color: 'from-violet-500 to-purple-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: null,
                },
                {
                    title: 'JUSTIFICACIONES',
                    subtitle: 'Revisión',
                    description: 'Aprobar o rechazar justificaciones',
                    href: route('justificaciones.index'),
                    color: 'from-pink-500 to-rose-600',
                    badge: 'A',
                    badgeColor: 'bg-red-500',
                    participants: null,
                },
            ];
        }

        if (user.rol === 'administrativo' || user.rol === 'coordinador') {
            return [
                {
                    title: 'EVALUAR POSTULACIONES',
                    subtitle: 'Bienestar Universitario',
                    description: 'Revisar expedientes y documentación',
                    href: route('postulaciones.index'),
                    color: 'from-orange-500 to-amber-600',
                    badge: 'B',
                    badgeColor: 'bg-blue-500',
                    participants: 'Expedientes',
                },
                {
                    title: 'ESCÁNER QR',
                    subtitle: 'Control de Ingreso',
                    description: 'Registrar asistencia en comedor',
                    href: route('asistencia.scanner'),
                    color: 'from-emerald-500 to-green-600',
                    badge: 'B',
                    badgeColor: 'bg-blue-500',
                    participants: null,
                },
                {
                    title: 'REPORTES',
                    subtitle: 'Focalización',
                    description: 'Generar informes socioeconómicos',
                    href: route('reportes.focalizacion'),
                    color: 'from-sky-500 to-blue-600',
                    badge: 'B',
                    badgeColor: 'bg-blue-500',
                    participants: null,
                },
            ];
        }

        // Cocina role
        if (user.rol === 'cocina') {
            return [
                {
                    title: 'ESCÁNER QR',
                    subtitle: 'Servicio de Comidas',
                    description: 'Verificar beneficiarios en la fila',
                    href: route('asistencia.scanner'),
                    color: 'from-lime-500 to-green-600',
                    badge: 'C',
                    badgeColor: 'bg-green-600',
                    participants: null,
                },
            ];
        }

        return [];
    };

    const moduleCards = getModuleCards();

    return (
        <AuthenticatedLayout user={user}>
            <Head title="Dashboard" />

            {/* Page Title */}
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-[#0f4c9b]/10 rounded-lg">
                        <svg className="w-6 h-6 text-[#0f4c9b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-[#1e3a5f]">
                            {user.rol === 'estudiante' ? 'Mis Módulos' :
                                user.rol === 'admin' ? 'Panel de Administración' :
                                    user.rol === 'administrativo' ? 'Panel de Bienestar' : 'Panel de Control'}
                        </h1>
                        <p className="text-gray-500 text-sm">Bienvenido al sistema de gestión universitaria</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2 text-sm font-medium text-gray-400">
                    <span>Inicio</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="text-[#0f4c9b]">Dashboard</span>
                </div>
            </div>

            {/* Welcome Banner for Students */}
            {user.rol === 'estudiante' && (
                <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f4c9b] rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h2 className="text-3xl font-black mb-2">¡Hola, {user.nombres}! 👋</h2>
                            <p className="text-white/80 text-lg max-w-md">
                                Ya puedes gestionar tus beneficios y servicios del comedor universitario Moquegua.
                            </p>
                            <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                                <span className="bg-white/20 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold border border-white/10">
                                    ESTUDIANTE
                                </span>
                                <span className="bg-orange-500 px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
                                    ACTIVO 2025-I
                                </span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/10 rounded-3xl rotate-12 absolute -top-4 -right-4 blur-2xl"></div>
                            <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 rounded-3xl -rotate-12 backdrop-blur-md flex items-center justify-center shadow-2xl relative z-10 border border-white/30">
                                <span className="text-6xl md:text-7xl drop-shadow-lg">🍚</span>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/5 rounded-full -ml-24 -mb-24"></div>
                </div>
            )}

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {moduleCards.map((card, index) => (
                    <Link
                        key={index}
                        href={card.href}
                        className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
                    >
                        {/* Card Image/Gradient Area */}
                        <div className={`h-40 bg-gradient-to-br ${card.color} relative overflow-hidden`}>
                            {/* Badge */}
                            <div className={`absolute top-3 right-3 w-10 h-10 ${card.badgeColor} rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                                {card.badge}
                            </div>

                            {/* Decorative Pattern */}
                            <div className="absolute inset-0 opacity-20">
                                <div className="absolute top-4 left-4 w-16 h-16 border-2 border-white rounded-lg rotate-12"></div>
                                <div className="absolute bottom-4 right-12 w-8 h-8 bg-white rounded-full"></div>
                            </div>

                            {/* Category Badge */}
                            <div className="absolute bottom-3 left-3">
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow">
                                    "A"
                                </span>
                            </div>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-[#1e3a5f] text-sm leading-tight group-hover:text-[#0f4c9b] transition-colors">
                                    {card.title}
                                </h3>
                                <svg className="w-4 h-4 text-gray-300 group-hover:text-[#0f4c9b] transform translate-x-0 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                                </svg>
                            </div>
                            <p className="text-[#0f4c9b] text-[10px] font-black uppercase tracking-widest mb-3 opacity-70">
                                {card.subtitle}
                            </p>
                            <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                                {card.description}
                            </p>
                            {card.participants && (
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center text-xs text-gray-400">
                                    <svg className="w-3.5 h-3.5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {card.participants}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty State */}
            {moduleCards.length === 0 && (
                <div className="text-center py-16">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Sin módulos disponibles</h3>
                    <p className="text-gray-500">Tu rol de usuario ({user.rol}) no tiene módulos asignados.</p>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
