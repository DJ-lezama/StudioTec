import React from "react"
import Button from "../../components/common/Button"

const AppointmentCard = ({ appointment, onReschedule, formatDate }) => {
    return (
        <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="flex-1">
                <p className="font-semibold text-textMain">
                    {appointment.service}
                </p>
                <div className="mt-1 flex flex-wrap gap-x-4 text-sm text-textMain/70">
                    <span>
                        {formatDate(appointment.date)} - {appointment.time}
                    </span>
                    <span>• {appointment.stylist}</span>
                </div>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-2">
                <Button type="transparent" className="text-sm">
                    Ver detalles
                </Button>
                <Button
                    type="dark"
                    className="text-sm"
                    onClick={() => onReschedule(appointment)}
                >
                    Reprogramar
                </Button>
            </div>
        </div>
    )
}

export default AppointmentCard
