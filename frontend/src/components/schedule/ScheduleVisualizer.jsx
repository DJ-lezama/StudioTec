import React, { useState } from "react"
import {
    addDays,
    format,
    isToday,
    isTomorrow,
    isWithinInterval,
    isYesterday,
    startOfDay,
} from "date-fns"
import { es } from "date-fns/locale"
import { Clock, MoreHorizontal, Users } from "lucide-react"
import AppointmentDetailsOverlay from "./AppointmentOverlay.jsx"

function getGroupLabel(date) {
    const today = startOfDay(new Date())
    const inputDate = startOfDay(date)

    if (isNaN(inputDate.getTime())) {
        return "Fecha Inválida"
    }

    if (isYesterday(inputDate)) return "Ayer"
    if (isToday(inputDate)) return "Hoy"
    if (isTomorrow(inputDate)) return "Mañana"
    if (
        isWithinInterval(inputDate, {
            start: addDays(today, 2),
            end: addDays(today, 7),
        })
    ) {
        return "Próximos 7 días"
    }
    // TODO: Add more granular grouping if needed (e.g., This Week, Next Week)
    // Fallback to Month Year
    return format(inputDate, "MMMM yyyy", { locale: es })
}

function ScheduleVisualizer({ appointments }) {
    const [hiddenGroups, setHiddenGroups] = useState([])
    const [showMenu, setShowMenu] = useState(null)
    const [selectedAppointmentId, setSelectedAppointmentId] = useState(null)

    const grouped = appointments.reduce((acc, appt) => {
        if (
            !appt.requestedDateTime ||
            typeof appt.requestedDateTime.toDate !== "function"
        ) {
            console.warn(
                "Skipping appointment due to missing/invalid requestedDateTime:",
                appt,
            )
            return acc
        }
        const apptDate = appt.requestedDateTime.toDate()
        if (isNaN(apptDate.getTime())) {
            console.warn("Skipping appointment due to invalid date:", appt)
            return acc
        }

        const label = getGroupLabel(apptDate)
        ;(acc[label] = acc[label] || []).push(appt)
        return acc
    }, {})

    for (const label in grouped) {
        grouped[label].sort(
            (a, b) =>
                a.requestedDateTime.toDate() - b.requestedDateTime.toDate(),
        )
    }

    const groupOrder = ["Ayer", "Hoy", "Mañana", "Próximos 7 días"] // TODO: Add other common groups if needed
    const allLabels = Array.from(
        new Set([...groupOrder, ...Object.keys(grouped)]),
    )

    // Basic chronological sort for remaining labels (Todo: can be improved)
    const sortedLabels = allLabels.sort((a, b) => {
        const indexA = groupOrder.indexOf(a)
        const indexB = groupOrder.indexOf(b)
        if (indexA !== -1 && indexB !== -1) return indexA - indexB
        if (indexA !== -1) return -1
        if (indexB !== -1) return 1

        const firstDateA =
            grouped[a]?.[0]?.requestedDateTime?.toDate() || new Date(0)
        const firstDateB =
            grouped[b]?.[0]?.requestedDateTime?.toDate() || new Date(0)
        if (isNaN(firstDateA.getTime())) return 1
        if (isNaN(firstDateB.getTime())) return -1
        return firstDateA - firstDateB
    })

    const hideColumn = (label) => {
        setHiddenGroups((prev) => [...prev, label])
        setShowMenu(null)
    }
    const unhideColumn = (label) => {
        setHiddenGroups((prev) => prev.filter((g) => g !== label))
    }

    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-4">
            {" "}
            <div className="flex gap-4 min-w-fit h-full px-4 py-3">
                {" "}
                {sortedLabels.map((label) => {
                    if (!grouped[label] || hiddenGroups.includes(label))
                        return null

                    const firstApptDate =
                        grouped[label]?.[0]?.requestedDateTime?.toDate()
                    const displayDate =
                        (label === "Hoy" ||
                            label === "Mañana" ||
                            label === "Ayer") &&
                        firstApptDate &&
                        !isNaN(firstApptDate.getTime())
                            ? format(firstApptDate, "EEEE d", { locale: es })
                            : null

                    return (
                        <div
                            key={label}
                            className="w-64 md:w-72 flex-shrink-0 bg-gray-50 rounded-lg border border-gray-200 shadow-sm flex flex-col max-h-[calc(100vh-200px)]"
                        >
                            {/* Column Header */}
                            <div className="flex justify-between items-center px-3 pt-3 pb-2 border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
                                <div>
                                    <h5 className="text-subtitle-s font-semibold text-textMain capitalize">
                                        {label}
                                    </h5>
                                    {displayDate && (
                                        <p className="text-xs text-gray-500 capitalize">
                                            {displayDate}
                                        </p>
                                    )}
                                </div>
                                {/* Hide Column Menu (Optional) */}
                                {
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setShowMenu(
                                                    showMenu === label
                                                        ? null
                                                        : label,
                                                )
                                            }
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            <MoreHorizontal className="w-4 h-4" />
                                        </button>
                                        {showMenu === label && (
                                            <div className="absolute right-0 mt-1 w-24 bg-white shadow-md rounded border border-gray-200 z-20">
                                                <button
                                                    onClick={() =>
                                                        hideColumn(label)
                                                    }
                                                    className="px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 w-full text-left"
                                                >
                                                    Ocultar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                }
                            </div>

                            {/* Appointments in Column */}
                            <div className="space-y-3 overflow-y-auto px-3 py-3 flex-1 custom-scrollbar">
                                {grouped[label]?.map((appointment) => {
                                    const apptTime =
                                        appointment.requestedDateTime?.toDate()
                                    const formattedTime =
                                        apptTime && !isNaN(apptTime.getTime())
                                            ? format(apptTime, "HH:mm", {
                                                  locale: es,
                                              })
                                            : "Hora inválida"

                                    return (
                                        <div
                                            key={appointment.id}
                                            className="bg-white text-textMain p-3 rounded-md border border-gray-200 shadow-sm cursor-pointer hover:border-secondary transition-colors"
                                            onClick={() =>
                                                setSelectedAppointmentId(
                                                    appointment.id,
                                                )
                                            }
                                        >
                                            <p className="font-semibold text-body-m mb-1">
                                                {appointment.serviceName ||
                                                    "Servicio Desconocido"}
                                            </p>
                                            <p className="text-body-xs text-gray-600 flex items-center gap-1 mb-0.5">
                                                <Clock size={12} />{" "}
                                                {formattedTime}
                                                {appointment.duration &&
                                                    ` (${appointment.duration} min)`}{" "}
                                            </p>
                                            <p className="text-body-xs text-gray-600 flex items-center gap-1">
                                                <Users size={12} />{" "}
                                                {appointment.clientName ||
                                                    "Cliente Desconocido"}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
                {/* Hidden Groups Toggle (Optional) */}
                {hiddenGroups.length > 0 && (
                    <div className="flex-shrink-0">
                        <h5 className="text-subtitle-m font-bold text-textMain mb-2">
                            Hidden groups
                        </h5>
                        <ul className="text-textMain/80 text-sm space-y-2">
                            {hiddenGroups.map((g) => (
                                <li
                                    key={g}
                                    className="cursor-pointer hover:underline"
                                    onClick={() => unhideColumn(g)}
                                >
                                    {g}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {selectedAppointmentId && (
                <AppointmentDetailsOverlay
                    appointmentId={selectedAppointmentId}
                    onClose={() => setSelectedAppointmentId(null)}
                />
            )}
        </div>
    )
}

export default ScheduleVisualizer
