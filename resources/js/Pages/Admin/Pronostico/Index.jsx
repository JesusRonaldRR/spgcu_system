import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import TextInput from '@/Components/TextInput';

export default function Index({ auth, fecha, pronosticos, totalBecarios }) {

    const handleDateChange = (e) => {
        router.get(route('admin.pronostico.index'), { fecha: e.target.value }, { preserveState: true });
    };

    const Card = ({ title, data, color }) => {
        if (!data) return (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-gray-400">
                <p className="font-bold uppercase">{title}</p>
                <p className="text-xs">Menú no programado</p>
            </div>
        );

        return (
            <div className={`bg-white border-l-8 ${color} rounded-xl shadow-sm p-6`}>
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-lg font-extrabold text-gray-800 uppercase">{title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-1">{data.descripcion}</p>
                    </div>
                    <div className="bg-gray-100 px-3 py-1 rounded-full text-[10px] font-bold text-gray-600">
                        ALGORITMO 60/30/10
                    </div>
                </div>

                <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Reservas (60% weight):</span>
                        <span className="font-bold">{data.reservas}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Est. No Reservados (30% weight):</span>
                        <span className="font-bold">{data.estimado_no_reservados}</span>
                    </div>
                    <div className="flex justify-between text-sm border-t pt-2">
                        <span className="text-gray-600">Buffer Seguridad (10%):</span>
                        <span className="font-bold">{data.buffer}</span>
                    </div>

                    <div className="mt-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="text-xs text-gray-400 uppercase font-bold mb-1 text-center">Demanda Proyectada</div>
                        <div className="text-4xl font-black text-center text-indigo-900">
                            {data.total_proyectado}
                        </div>
                        <div className="text-[10px] text-center text-gray-500 mt-1 italic">
                            Raciones sugeridas para cocina
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Panel de Pronóstico de Raciones</h2>}
        >
            <Head title="Pronóstico de Raciones" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">

                    <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                        <div className="bg-indigo-900 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center">
                            <div className="mr-4">
                                <svg className="w-10 h-10 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs uppercase font-bold text-indigo-200">Población Objetivo</p>
                                <p className="text-2xl font-black">{totalBecarios} <span className="text-sm font-normal">Becarios Activos</span></p>
                            </div>
                        </div>

                        <div className="flex items-center bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                            <label className="mr-3 font-bold text-gray-700">FECHA:</label>
                            <TextInput
                                type="date"
                                value={fecha}
                                onChange={handleDateChange}
                                className="border-none focus:ring-0 font-bold text-indigo-600"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card title="Desayuno" data={pronosticos.desayuno} color="border-orange-400" />
                        <Card title="Almuerzo" data={pronosticos.almuerzo} color="border-green-500" />
                        <Card title="Cena" data={pronosticos.cena} color="border-blue-500" />
                    </div>

                    <div className="mt-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                        <h3 className="text-lg font-bold mb-4 text-gray-800">¿Cómo funciona el Algoritmo 60/30/10?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div>
                                <div className="text-indigo-600 font-black text-xl mb-2">60%</div>
                                <p className="text-sm text-gray-600">
                                    Corresponde a los estudiantes que han <b>confirmado</b> su asistencia. Se asume que el 100% de ellos asistirá.
                                </p>
                            </div>
                            <div>
                                <div className="text-indigo-600 font-black text-xl mb-2">30%</div>
                                <p className="text-sm text-gray-600">
                                    Corresponde al promedio histórico de becarios que <b>no confirmaron</b> pero que suelen asistir al comedor.
                                </p>
                            </div>
                            <div>
                                <div className="text-indigo-600 font-black text-xl mb-2">10%</div>
                                <p className="text-sm text-gray-600">
                                    Es un <b>margen de seguridad</b> aplicado sobre el total estimado para cubrir raciones adicionales o casos sociales.
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
