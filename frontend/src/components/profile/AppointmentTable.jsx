import React from "react"
import Button from "../../components/common/Button"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const AppointmentTable = ({ appointments, onBookSimilar }) => {
    return (
        <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            {" "}
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Servicio
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Estilista
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Acciones
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-textMain">
                                    {appointment.serviceName ||
                                        appointment.service}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                    {appointment.requestedDateTime
                                        ? format(
                                              appointment.requestedDateTime.toDate(),
                                              "P",
                                              { locale: es },
                                          )
                                        : "N/A"}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {appointment.requestedDateTime
                                        ? format(
                                              appointment.requestedDateTime.toDate(),
                                              "p",
                                              { locale: es },
                                          )
                                        : ""}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-600">
                                    {appointment.stylistName ||
                                        appointment.stylist}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span
                                    className={`capitalize inline-block text-xs px-2 py-1 rounded-full ${
                                        appointment.status === "completed"
                                            ? "bg-green-100 text-green-700"
                                            : appointment.status === "rejected"
                                              ? "bg-red-100 text-red-700"
                                              : appointment.status ===
                                                  "cancelled"
                                                ? "bg-gray-100 text-gray-600"
                                                : "bg-yellow-100 text-yellow-700" // Default for older pending etc.
                                    }`}
                                >
                                    {appointment.status || "N/A"}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                {appointment.status === "completed" &&
                                    onBookSimilar && (
                                        <Button
                                            type="transparent"
                                            className="text-xs !text-secondary hover:!underline"
                                            onClick={() =>
                                                onBookSimilar(appointment)
                                            }
                                        >
                                            Reservar similar
                                        </Button>
                                    )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AppointmentTable
