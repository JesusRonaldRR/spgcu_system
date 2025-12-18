import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import axios from 'axios';

export default function Scanner({ auth }) {
    const [scanResult, setScanResult] = useState(null);
    const [scanError, setScanError] = useState(null);
    const [technicalError, setTechnicalError] = useState(null); // For detailed debugging
    const [isScanning, setIsScanning] = useState(false);
    const [cameras, setCameras] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

    const html5QrCodeRef = useRef(null);
    const lastScannedRef = useRef(null);

    // Get available cameras on mount
    useEffect(() => {
        // SECURITY CHECK: Browsers block camera on HTTP (except localhost)
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            const msg = "⚠️ Error Crítico de Seguridad: El navegador ha bloqueado el acceso a la cámara porque la conexión no es segura (HTTPS).";
            setScanError(msg);
            setTechnicalError("Secure Context Required: window.isSecureContext is false. Camera access is blocked by browser policy on non-localhost HTTP.");
            return;
        }

        initializeCameras();

        return () => {
            stopScannerCleanup();
        };
    }, []);

    const initializeCameras = async () => {
        try {
            // First, try to get permissions implicitly by listing cameras
            const devices = await Html5Qrcode.getCameras();

            if (devices && devices.length) {
                setCameras(devices);
                // Prefer back camera
                const backCam = devices.find(d =>
                    d.label.toLowerCase().includes('back') ||
                    d.label.toLowerCase().includes('trasera') ||
                    d.label.toLowerCase().includes('rear') ||
                    d.label.toLowerCase().includes('environment')
                );
                const defaultCamId = backCam ? backCam.id : devices[0].id;
                setSelectedCamera(defaultCamId);
                setScanError(null);
                return devices; // Return for direct usage
            } else {
                setScanError("No se encontraron cámaras conectadas al dispositivo.");
                setTechnicalError("Html5Qrcode.getCameras() returned empty list. Driver issue or no hardware detected.");
                return [];
            }
        } catch (err) {
            console.error("Error getting cameras:", err);
            handleCameraError(err, "Error al detectar cámaras");
            return [];
        }
    };

    const stopScannerCleanup = async () => {
        if (html5QrCodeRef.current) {
            try {
                if (html5QrCodeRef.current.isScanning) {
                    await html5QrCodeRef.current.stop();
                }
                html5QrCodeRef.current.clear();
            } catch (e) {
                console.error("Error stopping scanner on cleanup:", e);
            }
            html5QrCodeRef.current = null;
        }
    };

    const handleCameraError = (err, context) => {
        const errorStr = err.toString();
        setTechnicalError(`${context}: ${errorStr}`);

        if (errorStr.includes("NotAllowedError") || errorStr.includes("Permission") || errorStr.includes("permission")) {
            setScanError("🚫 Acceso Denegado: Permiso de cámara bloqueado por el navegador/usuario.");
        } else if (errorStr.includes("NotFoundError")) {
            setScanError("📷 No se encontró ninguna cámara.");
        } else if (errorStr.includes("NotReadableError") || errorStr.includes("TrackStartError")) {
            setScanError("⚠️ La cámara está siendo usada por otra aplicación o pestaña. Ciérralas e intenta de nuevo.");
        } else if (errorStr.includes("OverconstrainedError")) {
            setScanError("⚠️ La cámara no soporta la resolución solicitada.");
        } else if (errorStr.includes("SecureContext")) {
            setScanError("🔒 Se requiere HTTPS para usar la cámara.");
        } else {
            setScanError("❌ Error desconocido al acceder a la cámara.");
        }
    };

    const startScanning = async () => {
        setScanError(null);
        setTechnicalError(null);

        let currentCamera = selectedCamera;
        let currentCamerasList = cameras;

        // Auto-recovery if state is empty
        if (!currentCamera || currentCamerasList.length === 0) {
            const devices = await initializeCameras();
            currentCamerasList = devices;
            if (devices.length > 0) {
                // Try to pick back camera again or first one
                const backCam = devices.find(d =>
                    d.label.toLowerCase().includes('back') ||
                    d.label.toLowerCase().includes('trasera')
                );
                currentCamera = backCam ? backCam.id : devices[0].id;
                setSelectedCamera(currentCamera);
            }
        }

        if (!currentCamera) {
            setScanError("No se pudo iniciar la cámara. No se detectaron dispositivos.");
            return;
        }

        // Double check secure context
        if (!window.isSecureContext && window.location.hostname !== 'localhost') {
            setScanError("🔒 HTTPS Requerido. No se puede iniciar la cámara.");
            return;
        }

        try {
            // Ensure any previous instance is stopped
            await stopScannerCleanup();

            const readerElement = document.getElementById('reader');
            if (!readerElement) {
                throw new Error("Elemento DOM 'reader' no encontrado.");
            }

            const html5QrCode = new Html5Qrcode("reader");
            html5QrCodeRef.current = html5QrCode;

            // Use slightly more permissive config
            const config = {
                fps: 10,
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
                videoConstraints: {
                    deviceId: { exact: currentCamera },
                    facingMode: undefined
                }
            };

            await html5QrCode.start(
                { deviceId: { exact: currentCamera } }, // Pass deviceId constraint directly
                config,
                onScanSuccess,
                onScanFailure
            );

            setIsScanning(true);
        } catch (err) {
            console.error("Error starting scanner:", err);
            handleCameraError(err, "Error al iniciar el stream");
            setIsScanning(false);
        }
    };

    const stopScanning = async () => {
        setIsScanning(false); // Update UI immediately
        if (html5QrCodeRef.current) {
            try {
                await html5QrCodeRef.current.stop();
                // html5QrCodeRef.current = null; // Don't null immediately to allow restart? No, better cleanup
            } catch (err) {
                console.error("Error stopping scanner:", err);
            }
        }
    };

    const onScanSuccess = async (decodedText) => {
        // Prevent duplicate scans within 4 seconds
        if (decodedText === lastScannedRef.current) return;
        lastScannedRef.current = decodedText;

        console.log("QR Detected:", decodedText);
        setScanResult(null); // Clear previous result

        try {
            // Play beep sound immediately
            // const audio = new Audio('/sounds/beep.mp3'); // If you have one
            // audio.play().catch(e => {}); 

            const response = await axios.post(route('asistencia.store'), {
                hash_qr: decodedText
            });

            console.log("API Success:", response.data);
            setScanResult(response.data);

        } catch (error) {
            console.error("API Error:", error);
            // Don't stop scanning on logic error, just show it
            setScanError(error.response?.data?.message || "Error al procesar el QR en el servidor.");
        }

        // Reset lock after 3 seconds so same student can scan again later if needed
        setTimeout(() => {
            lastScannedRef.current = null;
            // Optionally clear result/error after delay?
            // setScanResult(null);
            // setScanError(null);
        }, 3000);
    };

    const onScanFailure = (error) => {
        // This fires continuously when no QR is detected. 
        // Do NOT update state here to avoid re-renders.
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
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cámara:</label>
                                    <select
                                        value={selectedCamera || ''}
                                        onChange={(e) => {
                                            setSelectedCamera(e.target.value);
                                            // If scanning, restart needed to switch? Usually yes.
                                            if (isScanning) {
                                                stopScanning().then(() => {
                                                    // Use check to prevent instant restart issues? 
                                                    // Best to force user to click start again or handle auto-restart slightly delayed.
                                                });
                                            }
                                        }}
                                        className="w-full border-gray-300 rounded-lg shadow-sm text-sm"
                                        disabled={isScanning}
                                    >
                                        {cameras.map(cam => (
                                            <option key={cam.id} value={cam.id}>{cam.label || `Cámara ${cam.id}`}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="text-center mb-6">
                                {!isScanning ? (
                                    <div className="flex flex-col items-center gap-2">
                                        <button
                                            onClick={startScanning}
                                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-10 rounded-full text-lg shadow-lg transition-transform transform hover:scale-105"
                                        >
                                            ▶️ Iniciar Escáner
                                        </button>
                                        <p className="text-xs text-gray-400">Asegúrate de dar permisos de cámara</p>
                                    </div>
                                ) : (
                                    <button
                                        onClick={stopScanning}
                                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full text-lg shadow-lg transition-transform"
                                    >
                                        ⏹️ Detener Escáner
                                    </button>
                                )}
                            </div>

                            {/* Errors */}
                            {scanError && (
                                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 text-red-500 text-xl">⚠️</div>
                                        <div className="ml-3 w-full">
                                            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Error de Sistema/Cámara</h3>
                                            <p className="text-red-700 mt-1">{scanError}</p>

                                            {/* Technical Details Toggle */}
                                            {technicalError && (
                                                <div className="mt-3">
                                                    <button
                                                        onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                                                        className="text-xs text-red-600 underline hover:text-red-800"
                                                    >
                                                        {showTechnicalDetails ? "Ocultar detalles técnicos" : "Ver detalles técnicos"}
                                                    </button>
                                                    {showTechnicalDetails && (
                                                        <pre className="mt-2 p-2 bg-gray-800 text-green-400 text-xs rounded overflow-x-auto whitespace-pre-wrap">
                                                            {technicalError}
                                                        </pre>
                                                    )}
                                                </div>
                                            )}

                                            {!window.isSecureContext && window.location.hostname !== 'localhost' && (
                                                <div className="mt-4 bg-white/50 p-3 rounded text-xs text-red-900">
                                                    <strong>Solución para HTTP (No seguro):</strong>
                                                    <ol className="list-decimal ml-4 mt-1 space-y-1">
                                                        <li>Copia esto: chrome://flags/#unsafely-treat-insecure-origin-as-secure</li>
                                                        <li>Pégalo en una nueva pestaña.</li>
                                                        <li>Habilita la opción ("Enabled") y añade la IP de este servidor.</li>
                                                        <li>Reinicia el navegador.</li>
                                                    </ol>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Viewfinder */}
                            <div className="relative mx-auto" style={{ maxWidth: '400px' }}>
                                <div
                                    id="reader"
                                    className={`w-full rounded-xl overflow-hidden border-2 bg-black transition-all ${isScanning ? 'border-green-500 shadow-green-500/50 shadow-xl' : 'border-gray-200 h-64 flex items-center justify-center'}`}
                                >
                                    {!isScanning && (
                                        <div className="text-gray-500 flex flex-col items-center">
                                            <span className="text-4xl mb-2">📷</span>
                                            <span className="text-sm">Cámara apagada</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Result Card */}
                            {scanResult && (
                                <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl text-center relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4 opacity-20 text-6xl">✨</div>

                                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
                                            <span className="text-3xl">✅</span>
                                        </div>

                                        <h4 className="font-bold text-xl uppercase tracking-wider mb-1">Asistencia Registrada</h4>
                                        <h2 className="text-2xl font-black mb-2">{scanResult.student}</h2>
                                        <div className="inline-block px-4 py-1 bg-white/20 rounded-full backdrop-blur-md text-sm font-semibold">
                                            {scanResult.menu}
                                        </div>

                                        {/* Daily History */}
                                        {scanResult.history && scanResult.history.length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/20 text-left">
                                                <p className="text-xs uppercase font-bold opacity-75 mb-2">Historial de Hoy:</p>
                                                <div className="space-y-1.5">
                                                    {scanResult.history.map((record, idx) => (
                                                        <div key={idx} className="flex justify-between items-center text-sm bg-white/10 p-2 rounded">
                                                            <span className="flex items-center gap-2">
                                                                <span>🍽️</span> {record.tipo}
                                                            </span>
                                                            <span className="font-mono opacity-90">{record.hora}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => setScanResult(null)}
                                            className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Manual Input Fallback */}
                            {!isScanning && (
                                <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col items-center">
                                    <p className="text-gray-400 text-xs mb-3 italic">¿El escáner no funciona? Ingresa el código manual:</p>
                                    <div className="flex gap-2 w-full max-w-xs">
                                        <input
                                            type="text"
                                            placeholder="# Código / DNI"
                                            id="manual_code_input"
                                            className="flex-1 text-sm border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') onScanSuccess(e.target.value);
                                            }}
                                        />
                                        <button
                                            onClick={() => {
                                                const val = document.getElementById('manual_code_input').value;
                                                if (val) onScanSuccess(val);
                                            }}
                                            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 border border-gray-300"
                                        >
                                            Procesar
                                        </button>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
