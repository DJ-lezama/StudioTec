import React from "react"
import Button from "../common/Button.jsx"
import { CalendarOff } from "lucide-react"

const SchedulePreview = ({ appointments, onClick }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between min-h-[300px] lg:min-h-full border border-gray-200">
            <div>
                <h2 className="text-h4 font-heading font-semibold text-textMain mb-4">
                    Próximas citas
                </h2>

                {appointments && appointments.length > 0 ? (
                    <div className="space-y-2 max-h-[calc(100vh-400px)] lg:max-h-[44rem] overflow-y-auto pr-1 custom-scrollbar">
                        {appointments.map((appt, index) => (
                            <div
                                key={index}
                                className="bg-secondary/90 text-white p-3 rounded-md shadow-sm"
                            >
                                <p className="font-bold text-sm">
                                    {appt.serviceName || appt.service}
                                </p>
                                <p className="text-xs opacity-90">
                                    {appt.requestedDateTime
                                        ?.toDate()
                                        ?.toLocaleTimeString("es-MX", {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: false,
                                        }) || "Hora no disp."}{" "}
                                    - {appt.clientName || "Cliente Desc."}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 text-gray-500">
                        <CalendarOff className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm">
                            No tienes citas próximas confirmadas.
                        </p>
                    </div>
                )}
            </div>

            <Button type="dark" onClick={onClick} className="mt-4 w-full">
                Ver agenda completa
            </Button>
        </div>
    )
}

export default SchedulePreview
