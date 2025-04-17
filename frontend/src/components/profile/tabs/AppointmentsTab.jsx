import React from "react"
import { AlertTriangle, Calendar, Loader2 } from "lucide-react"
import Button from "../../../components/common/Button"
import AppointmentCard from "../AppointmentCard"
import AppointmentTable from "../AppointmentTable"
import { useNavigate } from "react-router-dom"

const AppointmentsTab = ({
    allAppointments,
    isLoading,
    error,
    formatDate,
    onReschedule,
    onAcceptSuggestion,
    onDeclineSuggestion,
    actionLoading,
}) => {
    const navigate = useNavigate()

    const now = new Date()
    const upcomingAppointments = allAppointments
        .filter((apt) => {
            const apptDate = apt.requestedDateTime?.toDate()
            return (
                apptDate &&
                apptDate >= now &&
                ["pending", "accepted", "suggestion_made"].includes(apt.status)
            )
        })
        .sort(
            (a, b) =>
                a.requestedDateTime.toDate() - b.requestedDateTime.toDate(),
        )

    const pastAppointments = allAppointments
        .filter((apt) => {
            const apptDate = apt.requestedDateTime?.toDate()
            return (
                !apptDate ||
                apptDate < now ||
                ["completed", "rejected", "cancelled"].includes(apt.status)
            )
        })
        .sort(
            (a, b) =>
                b.requestedDateTime.toDate() - a.requestedDateTime.toDate(),
        )

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center p-10 text-gray-600">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                    <span>Cargando tus citas...</span>
                </div>
            )
        }

        if (error) {
            return (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
            )
        }

        return (
            <>
                {/* Upcoming Appointments */}
                <div className="mb-8">
                    <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                        Próximas Citas y Pendientes
                    </h4>
                    {upcomingAppointments.length > 0 ? (
                        <div className="grid gap-4">
                            {upcomingAppointments.map((appointment) => (
                                <AppointmentCard
                                    key={appointment.id}
                                    appointment={appointment}
                                    formatDate={formatDate}
                                    onReschedule={onReschedule}
                                    onAcceptSuggestion={onAcceptSuggestion}
                                    onDeclineSuggestion={onDeclineSuggestion}
                                    actionLoading={
                                        actionLoading.id === appointment.id
                                            ? actionLoading.type
                                            : null
                                    }
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-primary/5 rounded-lg p-6 text-center">
                            <p className="text-gray-600 mb-4">
                                No tienes citas próximas o pendientes.
                            </p>
                            <Button
                                type="dark"
                                onClick={() => navigate("/agendar")}
                                className="flex items-center mx-auto"
                            >
                                <Calendar size={16} className="mr-2" />
                                Agendar una cita
                            </Button>
                        </div>
                    )}
                </div>

                {/* Past Appointments */}
                {pastAppointments.length > 0 && (
                    <div>
                        <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                            Historial de Citas
                        </h4>
                        <AppointmentTable
                            appointments={pastAppointments}
                            formatDate={formatDate}
                        />
                    </div>
                )}
            </>
        )
    }

    return (
        <div>
            <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                Mis Citas
            </h3>
            {renderContent()}
        </div>
    )
}

export default AppointmentsTab
