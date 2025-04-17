import React from "react"
import { Calendar } from "lucide-react"
import Button from "../../../components/common/Button"
import AppointmentCard from "../AppointmentCard"
import AppointmentTable from "../AppointmentTable"
import { useNavigate } from "react-router-dom"

const AppointmentsTab = ({
    upcomingAppointments,
    pastAppointments,
    formatDate,
    onReschedule,
}) => {
    const navigate = useNavigate()

    return (
        <div>
            <h3 className="text-h4 font-heading font-semibold text-textMain mb-6">
                Mis citas
            </h3>

            {upcomingAppointments.length > 0 ? (
                <div className="mb-8">
                    <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                        Próximas citas
                    </h4>
                    <div className="grid gap-4">
                        {upcomingAppointments.map((appointment) => (
                            <AppointmentCard
                                key={appointment.id}
                                appointment={appointment}
                                onReschedule={onReschedule}
                                formatDate={formatDate}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="bg-primary/5 rounded-lg p-6 text-center mb-8">
                    <p className="text-gray-600 mb-4">
                        No tienes citas próximas programadas
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

            {pastAppointments.length > 0 && (
                <div>
                    <h4 className="text-subtitle-m font-medium text-textMain mb-4">
                        Historial de citas
                    </h4>
                    <AppointmentTable
                        appointments={pastAppointments}
                        formatDate={formatDate}
                    />
                </div>
            )}
        </div>
    )
}

export default AppointmentsTab
