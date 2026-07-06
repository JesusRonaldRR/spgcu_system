import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { QRCodeCanvas } from 'qrcode.react';

export default function MyQR({ auth, hasPostulation, qrHash, user, activeMenu }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Mi Código QR</h2>}
        >
            <Head title="Mi QR" />

            <div className="py-8">
                <div className="max-w-lg mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {hasPostulation && qrHash ? (
                            <>
                                {/* Header */}
                                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-6 text-center">
                                    <h3 className="text-xl font-bold">{user.nombres} {user.apellidos}</h3>
                                    <p className="text-emerald-100 text-sm mt-1">
                                        {user.codigo ? `Código: ${user.codigo}` : `DNI: ${user.dni}`}
                                    </p>
                                </div>

                                {/* QR Code */}
                                <div className="p-8 flex justify-center bg-gray-50">
                                    <div className="bg-white p-4 rounded-2xl shadow-lg border-4 border-emerald-500">
                                        <QRCodeCanvas
                                            value={qrHash}
                                            size={280}
                                            level={"H"}
                                            includeMargin={true}
                                            bgColor="#ffffff"
                                            fgColor="#1f2937"
                                        />
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div className="p-6 text-center space-y-4">
                                    <p className="text-gray-600">
                                        Presenta este código QR en el comedor universitario para registrar tu asistencia.
                                    </p>

                                    <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
                                        <span className="font-bold">⚠️ Importante:</span> Este código es personal e intransferible.
                                    </div>

                                    <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg p-3 text-sm">
                                        <span className="font-bold">💡 Tip:</span> Sube el brillo de tu pantalla al máximo para facilitar el escaneo.
                                    </div>

                                    {activeMenu && (
                                        <div className="bg-green-600 text-white rounded-xl p-4 shadow-lg animate-bounce mt-4">
                                            <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Servicio Activo</div>
                                            <div className="text-2xl font-black">{activeMenu.tipo.toUpperCase()}</div>
                                            <div className="text-[10px] font-bold mt-1">
                                                DISPONIBLE HASTA LAS {activeMenu.hora_fin.substring(0, 5)}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="p-12 text-center">
                                <div className="text-6xl mb-4">🚫</div>
                                <h3 className="text-xl font-bold text-gray-700 mb-2">No tienes un QR activo</h3>
                                <p className="text-gray-500">
                                    Debes postular a una convocatoria y ser <strong className="text-emerald-600">aprobado como beneficiario</strong> para obtener tu código QR.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
