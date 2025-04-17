import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AlertTriangle, Filter, Loader2 } from "lucide-react"
import RequestReviewOverlay from "../../components/schedule/AppointmentOverlay.jsx"
import Button from "../../components/common/Button.jsx"
import RequestCardCarousel from "../../components/requests/RequestCardCarousel.jsx"
import { usePendingRequests } from "../../features/booking/hooks/usePendingRequests.js"
import useAuth from "../../features/auth/hooks/useAuth"

const RequestsScreen = () => {
    const { pendingRequests, isLoading, error } = usePendingRequests()
    const { currentUser } = useAuth()

    const [selectedRequest, setSelectedRequest] = useState(null)
    const [filterMode, setFilterMode] = useState("all")

    const navigate = useNavigate()

    const filteredRequests = useMemo(() => {
        if (filterMode === "mine" && currentUser?.uid) {
            return pendingRequests.filter(
                (req) => req.stylistId === currentUser.uid,
            )
        }
        return pendingRequests
    }, [pendingRequests, filterMode, currentUser?.uid])

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
                        {" "}
                        Error al cargar las solicitudes. Por favor, inténtalo de
                        nuevo más tarde.{" "}
                    </span>
                </div>
            )
        }

        if (filteredRequests.length === 0) {
            const message =
                filterMode === "mine"
                    ? "No tienes solicitudes pendientes asignadas a ti."
                    : "¡Buen trabajo! No hay solicitudes pendientes en este momento."
            return (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                    <h2 className="text-h4 font-heading text-textMain mb-2">
                        {filterMode === "mine"
                            ? "Sin Solicitudes Propias"
                            : "Sin Solicitudes Pendientes"}
                    </h2>
                    <p className="text-textMain/70">{message}</p>
                </div>
            )
        }

        return (
            <RequestCardCarousel
                requests={filteredRequests}
                onCardClick={handleReviewClick}
            />
        )
    }

    return (
        <div className="p-6 md:p-8 space-y-6 min-h-screen bg-primaryLight">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                <h1 className="text-h2 font-normal text-textMain">
                    Solicitudes Pendientes
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                    className="self-start sm:self-center"
                >
                    Volver al Panel
                </Button>
            </div>

            {/* Filter Controls */}
            {!isLoading && !error && pendingRequests.length > 0 && (
                <div className="flex items-center gap-2 mb-6 bg-white p-2 rounded-lg shadow-sm border border-gray-100 max-w-md">
                    <Filter
                        size={18}
                        className="text-gray-500 flex-shrink-0 ml-1"
                    />
                    <button
                        onClick={() => setFilterMode("all")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            filterMode === "all"
                                ? "bg-secondary text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Todas ({pendingRequests.length})
                    </button>
                    <button
                        onClick={() => setFilterMode("mine")}
                        className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            filterMode === "mine"
                                ? "bg-secondary text-white shadow-sm"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Mis Solicitudes (
                        {
                            pendingRequests.filter(
                                (req) => req.stylistId === currentUser?.uid,
                            ).length
                        }
                        )
                    </button>
                </div>
            )}

            {renderContent()}

            {/* Overlay for reviewing a selected request */}
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
