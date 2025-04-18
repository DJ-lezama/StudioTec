import React, { useEffect, useState } from "react"
import { AlertTriangle, Calendar, Loader2, X } from "lucide-react"
import Button from "../../components/common/Button"
import CalendarHeader from "./calendar/CalendarHeader"
import CalendarGrid from "./calendar/CalendarGrid"
import TimeSlotGrid from "./calendar/TimeSlotGrid"
import { getAvailableSlotsForDay } from "../../features/availability/services/availabilityService"

const RescheduleModal = ({
    appointment,
    onClose,
    onSave,
    formatDate,
    currentMonth,
    onPrevMonth,
    onNextMonth,
    selectedDate,
    selectedTime,
    onDateClick,
    onTimeSelect,
    getDaysInMonth,
    getFirstDayOfMonth,
    isToday,
    isPastDate,
    isSaving = false,
}) => {
    const [availableSlots, setAvailableSlots] = useState([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [slotsError, setSlotsError] = useState(null)

    const stylistId = appointment?.stylistId
    const serviceDuration = appointment?.duration

    useEffect(() => {
        setAvailableSlots([])
        setSlotsError(null)

        if (!selectedDate || !stylistId || !serviceDuration) {
            setIsLoadingSlots(false)
            return
        }

        if (typeof serviceDuration !== "number" || serviceDuration <= 0) {
            console.error(
                "Invalid service duration for rescheduling:",
                serviceDuration,
            )
            setSlotsError("Duración de servicio inválida.")
            setIsLoadingSlots(false)
            return
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true)
            setSlotsError(null)
            try {
                const fetchedSlots = await getAvailableSlotsForDay(
                    stylistId,
                    selectedDate,
                    serviceDuration,
                )
                setAvailableSlots(fetchedSlots)
                if (fetchedSlots.filter((s) => s.isAvailable).length === 0) {
                    setSlotsError("No hay horarios disponibles en esta fecha.")
                }
            } catch (error) {
                console.error("Error fetching slots for reschedule:", error)
                setSlotsError("Error al cargar horarios disponibles.")
                setAvailableSlots([])
            } finally {
                setIsLoadingSlots(false)
            }
        }

        fetchSlots().then((r) => r)
    }, [selectedDate, stylistId, serviceDuration])

    const availableTimeStrings = availableSlots
        .filter((slot) => slot.isAvailable)
        .map((slot) => slot.time)

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4 relative max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-h5 font-heading font-semibold text-textMain">
                        Reprogramar cita
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-textMain"
                        disabled={isSaving}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Current appointment details */}
                <div className="mb-6 bg-primary/10 p-4 rounded-lg">
                    <p className="font-medium text-textMain">
                        {appointment?.serviceName}
                    </p>
                    <p className="text-sm text-textMain/70">
                        <span>
                            Cita actual:{" "}
                            {formatDate(appointment?.requestedDateTime) ||
                                "No especificada"}
                        </span>
                    </p>
                    <p className="text-sm text-textMain/70">
                        Estilista: {appointment?.stylistName}
                    </p>
                    {serviceDuration && (
                        <p className="text-sm text-textMain/70">
                            Duración: {serviceDuration} min
                        </p>
                    )}
                </div>

                {/* Calendar section */}
                <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-subtitle-s font-medium text-textMain">
                            Selecciona nueva fecha
                        </h4>
                    </div>
                    <CalendarHeader
                        currentMonth={currentMonth}
                        onPrevMonth={onPrevMonth}
                        onNextMonth={onNextMonth}
                    />
                    <CalendarGrid
                        currentMonth={currentMonth}
                        selectedDate={selectedDate}
                        onDateClick={onDateClick}
                        getDaysInMonth={getDaysInMonth}
                        getFirstDayOfMonth={getFirstDayOfMonth}
                        isToday={isToday}
                        isPastDate={isPastDate}
                    />
                </div>

                {/* Time slots */}
                {selectedDate && (
                    <div className="mb-6">
                        <h4 className="text-subtitle-s font-medium text-textMain mb-3">
                            Horarios disponibles para{" "}
                            {selectedDate.toLocaleDateString("es-MX", {
                                day: "numeric",
                                month: "long",
                            })}
                        </h4>

                        {/* Loading State */}
                        {isLoadingSlots && (
                            <div className="flex items-center justify-center text-gray-500 py-4">
                                <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                                Cargando horarios...
                            </div>
                        )}

                        {/* Error State */}
                        {slotsError && !isLoadingSlots && (
                            <div className="text-red-600 text-sm flex items-center justify-center py-2 bg-red-50 p-2 rounded border border-red-200">
                                <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />{" "}
                                {slotsError}
                            </div>
                        )}

                        {/* Time Grid */}
                        {!isLoadingSlots &&
                            !slotsError &&
                            availableTimeStrings.length > 0 && (
                                <TimeSlotGrid
                                    availableTimes={availableTimeStrings}
                                    selectedTime={selectedTime}
                                    onTimeSelect={onTimeSelect}
                                />
                            )}
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-4 border-t pt-4">
                    <Button
                        type="transparent"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="dark"
                        onClick={onSave}
                        disabled={
                            !selectedDate ||
                            !selectedTime ||
                            isLoadingSlots ||
                            isSaving
                        }
                        className="flex items-center justify-center min-w-[150px]"
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4 mr-2" />{" "}
                                Guardando...
                            </>
                        ) : (
                            <>
                                <Calendar size={16} className="mr-2" />{" "}
                                Confirmar cambio
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RescheduleModal
