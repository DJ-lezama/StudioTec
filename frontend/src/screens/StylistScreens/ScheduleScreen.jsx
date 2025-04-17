import React from "react"
import { useNavigate } from "react-router-dom"
import useAuth from "../../features/auth/hooks/useAuth"
import { useAcceptedAppointments } from "../../features/booking/hooks/useAcceptedAppointments"
import ScheduleVisualizer from "../../components/schedule/ScheduleVisualizer"
import Button from "../../components/common/Button"
import { AlertTriangle, Loader2 } from "lucide-react"

const ScheduleScreen = () => {
    const navigate = useNavigate()
    const { currentUser } = useAuth()

    const { acceptedAppointments, isLoading, error } = useAcceptedAppointments(
        currentUser?.uid,
    )

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-10 text-gray-600">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                    <span>Cargando agenda...</span>
                </div>
            )
        }

        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>Error al cargar la agenda: {error.message}</span>
                </div>
            )
        }

        if (acceptedAppointments.length === 0) {
            return (
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-500">
                        No tienes citas confirmadas en tu agenda.
                    </p>
                </div>
            )
        }

        return <ScheduleVisualizer appointments={acceptedAppointments} />
    }

    return (
        <div className="p-6 md:p-8 space-y-6 min-h-screen bg-primaryLight">
            <div className="flex items-center justify-between">
                <h1 className="text-h3 font-heading font-bold text-textMain">
                    Agenda Confirmada
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al Panel
                </Button>
            </div>
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
                {renderContent()}
            </div>
        </div>
    )
}

export default ScheduleScreen
