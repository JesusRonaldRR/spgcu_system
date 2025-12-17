import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

export default function Scanner({ auth }) {
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const html5QrCodeRef = useRef(null);
    const lastScannedRef = useRef(null);

    // Get available cameras on mount
    useEffect(() => {
        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameras(devices);
                // Prefer back camera
                const backCam = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('trasera'));
                setSelectedCamera(backCam ? backCam.id : devices[0].id);
            }
        }).catch(err => {
            console.error("Error getting cameras:", err);
            setScanError("No se pudo acceder a las cámaras. Verifica los permisos.");
        });

        return () => {
            stopScanning();
        };
    }, []);

    const startScanning = async () => {
        if (!selectedCamera) {
            setScanError("Selecciona una cámara primero.");
            return;
        }

        try {
            const html5QrCode = new Html5Qrcode("reader");
            html5QrCodeRef.current = html5QrCode;

            await html5QrCode.start(
                selectedCamera,
                {
                    fps: 15,
                    qrbox: { width: 280, height: 280 },
                    aspectRatio: 1.0,
                },
                onScanSuccess,
                onScanFailure
            );
            setIsScanning(true);
            setScanError(null);
        } catch (err) {
            console.error("Error starting scanner:", err);
            setScanError("Error al iniciar el escáner. Verifica permisos de cámara.");
        }
    };

    const stopScanning = async () => {
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                html5QrCodeRef.current = null;
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
        setIsScanning(false);
    };

    const onScanSuccess = async (decodedText) => {
        // Prevent duplicate scans
        if (decodedText === lastScannedRef.current) return;
        lastScannedRef.current = decodedText;

        console.log("QR Detected:", decodedText);
        setScanResult(null);
        setScanError(null);

        try {
            const response = await axios.post(route('asistencia.store'), {
                hash_qr: decodedText
            });
            console.log("Response:", response.data);
            setScanResult(response.data);

            // Play success sound (optional)
            try { new Audio('/sounds/success.mp3').play(); } catch (e) { }

        } catch (error) {
            console.error("API Error:", error);
            setScanError(error.response?.data?.message || "Error al procesar el QR.");
        }

        // Reset after 4 seconds
        setTimeout(() => {
            lastScannedRef.current = null;
            setScanResult(null);
            setScanError(null);
        }, 4000);
    };

    const onScanFailure = (error) => {
        // Ignore - this fires constantly when no QR is in frame
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">📷 Escáner de Asistencia</h2>}
        >
            <Head title="Escáner QR" />

            <div className="py-8">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6 text-center">
                            <h3 className="text-2xl font-bold">Control de Asistencia</h3>
                            <p className="text-blue-100 text-sm mt-1">Escanea el QR del estudiante beneficiario</p>
                        </div>

                        <div className="p-6">
                            {/* Camera Selection */}
                            {cameras.length > 0 && (
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Cámara:</label>
                                    <select
                                        value={selectedCamera || ''}
                                        onChange={(e) => setSelectedCamera(e.target.value)}
                                        className="w-full border-gray-300 rounded-lg shadow-sm"
                                        disabled={isScanning}
                                    >
                                        {cameras.map(cam => (
                                            <option key={cam.id} value={cam.id}>{cam.label || `Cámara ${cam.id}`}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Start/Stop Button */}
                            <div className="text-center mb-4">
                                {!isScanning ? (
                                    <button
                                        onClick={startScanning}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all"
                                    >
                                        ▶️ Iniciar Escáner
                                    </button>
                                ) : (
                                    <button
                                        onClick={stopScanning}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-all"
                                    >
                                        ⏹️ Detener Escáner
                                    </button>
                                )}
                            </div>

                            {/* Scanner Container */}
                            <div id="reader" className="w-full rounded-xl overflow-hidden border-4 border-gray-200" style={{ minHeight: isScanning ? '350px' : '0' }}></div>

                            {/* Success Message */}
                            {scanResult && (
                                <div className="mt-6 p-6 bg-gradient-to-r from-green-400 to-emerald-500 text-white rounded-2xl text-center shadow-lg animate-pulse">
                                    <div className="text-5xl mb-2">✅</div>
                                    <h4 className="font-bold text-xl">¡Asistencia Registrada!</h4>
                                    <p className="text-3xl font-bold mt-3">{scanResult.student}</p>
                                    <p className="text-lg opacity-90 uppercase tracking-wider mt-1">{scanResult.menu}</p>

                                    {/* History */}
                                    {scanResult.history && scanResult.history.length > 0 && (
                                        <div className="mt-4 bg-white/20 rounded-lg p-3 text-left">
                                            <h5 className="text-sm font-bold opacity-80 mb-2 uppercase border-b border-white/30 pb-1">Asistencias de Hoy:</h5>
                                            <ul className="space-y-1">
                                                {scanResult.history.map((record, idx) => (
                                                    <li key={idx} className="text-sm flex justify-between">
                                                        <span>🍽️ {record.tipo}</span>
                                                        <span className="font-mono bg-black/20 px-2 rounded">{record.hora}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Error Message */}
                            {scanError && (
                                <div className="mt-6 p-6 bg-gradient-to-r from-red-400 to-rose-500 text-white rounded-2xl text-center shadow-lg">
                                    <div className="text-5xl mb-2">❌</div>
                                    <h4 className="font-bold text-xl">Error</h4>
                                    <p className="mt-2">{scanError}</p>
                                </div>
                            )}

                            {/* Instructions */}
                            {isScanning && !scanResult && !scanError && (
                                <div className="mt-4 text-center text-gray-500 text-sm">
                                    <p>Apunta la cámara al código QR del estudiante...</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
