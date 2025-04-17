import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Loader2 } from "lucide-react"
import RequestReviewOverlay from "../../components/ScheduleVisualizer/AppointmentOverlay.jsx"
import Button from "../../components/common/Button.jsx"
import RequestCardCarousel from "../../components/RequestsVisualizer/RequestCardCarousel.jsx"
import { usePendingRequests } from "../../features/booking/hooks/usePendingRequests.js"

const RequestsScreen = () => {
    const { pendingRequests, isLoading, error } = usePendingRequests()

    const [selectedRequest, setSelectedRequest] = useState(null)

    const navigate = useNavigate()

    const handleReviewClick = (request) => {
        setSelectedRequest(request)
    }

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-10 text-center text-gray-600">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                    <span>Cargando solicitudes...</span>
                </div>
            )
        }

        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>
                        Error al cargar las solicitudes. Por favor, inténtalo de
                        nuevo más tarde.
                    </span>
                </div>
            )
        }

        if (pendingRequests.length === 0) {
            return (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                    <h2 className="text-h4 font-heading text-textMain mb-2">
                        No hay solicitudes pendientes
                    </h2>
                    <p className="text-textMain/70">
                        ¡Buen trabajo! Has revisado todas las solicitudes.
                    </p>
                </div>
            )
        }

        return (
            <RequestCardCarousel
                requests={pendingRequests}
                onCardClick={handleReviewClick}
            />
        )
    }

    return (
        <div className="p-8 space-y-6 min-h-screen bg-primaryLight">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-h2 font-normal text-textMain">
                    Solicitudes Pendientes
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al panel
                </Button>
            </div>

            {renderContent()}

            {selectedRequest && (
                <RequestReviewOverlay
                    appointmentId={selectedRequest.id}
                    onClose={() => setSelectedRequest(null)}
                />
            )}
        </div>
    )
}

export default RequestsScreen
