import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import PrimaryButton from '@/Components/PrimaryButton';
import { router } from '@inertiajs/react';

// ... inside the component, before return
const [showExistingModal, setShowExistingModal] = useState(!!existingPostulation);

const redirectToStatus = () => {
    router.visit(route('postulaciones.index'));
};

const redirectToDashboard = () => {
    router.visit(route('dashboard'));
};

// ... inside render, at the top level (e.g. inside AuthenticatedLayout)
<Modal show={showExistingModal} maxWidth="md">
    <div className="p-6">
        <h2 className="text-lg font-medium text-gray-900 border-b pb-2">
            ⚠️ Ya has realizado una postulación
        </h2>
        <p className="mt-4 text-sm text-gray-600">
            Se ha detectado que ya tienes una postulación registrada para la convocatoria vigente (<strong>{convoName}</strong>).
            <br /><br />
            No es necesario que vuelvas a llenar el formulario. Puedes ver el estado de tu trámite en "Mis Postulaciones".
        </p>
        <div className="mt-6 flex justify-end space-x-3">
            <SecondaryButton onClick={redirectToDashboard}>
                Volver al Inicio
            </SecondaryButton>
            <PrimaryButton onClick={redirectToStatus}>
                Ver Mis Postulaciones
            </PrimaryButton>
        </div>
    </div>
</Modal>
