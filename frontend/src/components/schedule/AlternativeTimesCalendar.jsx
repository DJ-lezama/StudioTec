import React, { useEffect, useState } from "react"
import { AlertTriangle, Clock, Loader2 } from "lucide-react"
import { getAvailableSlotsForDay } from "../../features/availability/services/availabilityService"
import { format } from "date-fns"
import Button from "../common/Button.jsx"

const AlternativeTimesCalendar = ({
    onSelectAlternative,
    onCancel,
    stylistId,
    serviceDuration,
}) => {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [step, setStep] = useState(1)

    const [availableSlots, setAvailableSlots] = useState([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [slotsError, setSlotsError] = useState(null)

    useEffect(() => {
        if (
            step === 2 &&
            selectedDate &&
            stylistId &&
            typeof serviceDuration === "number" &&
            serviceDuration > 0
        ) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true)
                setSlotsError(null)
                setAvailableSlots([])
                if (isNaN(selectedDate.getTime())) {
                    throw new Error("Invalid date selected")
                }
                try {
                    const fetchedSlots = await getAvailableSlotsForDay(
                        stylistId,
                        selectedDate,
                        serviceDuration,
                    )
                    setAvailableSlots(fetchedSlots)
                } catch (error) {
                    console.error("Error fetching slots for suggestion:", error)
                    setSlotsError("Error al cargar horarios.")
                    setAvailableSlots([])
                } finally {
                    setIsLoadingSlots(false)
                }
            }
            fetchSlots().then((r) => r)
        } else {
            setAvailableSlots([])
            setIsLoadingSlots(false)
            setSlotsError(null)
        }
    }, [step, selectedDate, stylistId, serviceDuration])

    const getDaysInMonth = (year, month) =>
        new Date(year, month + 1, 0).getDate()

    const getFirstDayOfMonth = (year, month) =>
        new Date(year, month, 1).getDay()

    const months = [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
    ]

    const days = ["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sá"]

    const prevMonth = () => {
        setCurrentMonth((prev) => {
            const prevMonth = new Date(prev)
            prevMonth.setMonth(prev.getMonth() - 1)
            return prevMonth
        })
    }

    const nextMonth = () => {
        setCurrentMonth((prev) => {
            const nextMonth = new Date(prev)
            nextMonth.setMonth(prev.getMonth() + 1)
            return nextMonth
        })
    }

    const formatDateToSpanish = (date) =>
        date
            ? `${date.getDate()} de ${months[date.getMonth()]} de ${date.getFullYear()}`
            : ""

    const handleDateSelect = (day) => {
        if (day) {
            const date = new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth(),
                day,
            )
            if (!isNaN(date.getTime())) {
                setSelectedDate(date)
                setSelectedTime(null)
                setStep(2)
            }
        }
    }

    const handleTimeSelect = (time) => {
        setSelectedTime(time)
        setSlotsError(null)
    }

    const handleConfirm = () => {
        if (selectedDate && selectedTime && !isNaN(selectedDate.getTime())) {
            const dateString = format(selectedDate, "yyyy-MM-dd")
            onSelectAlternative({
                date: dateString,
                time: selectedTime,
                formatted: `${formatDateToSpanish(selectedDate)} a las ${selectedTime}`,
            })
        } else {
            console.warn("Confirm clicked without valid date/time selected.")
            // TODO: Optionally show user feedback here
        }
    }

    const handleBack = () => {
        if (step === 2) {
            setStep(1)
            setSelectedTime(null)
            setSlotsError(null)
        } else {
            onCancel()
        }
    }

    const renderCalendar = () => {
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth()
        const daysInMonth = getDaysInMonth(year, month)
        const firstDay = getFirstDayOfMonth(year, month)

        const today = new Date()
        const calendarDays = []

        for (let i = 0; i < firstDay; i++) {
            calendarDays.push(<div key={`empty-${i}`} className="h-8 w-8" />)
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day)
            const isToday =
                date.getDate() === today.getDate() &&
                date.getMonth() === today.getMonth() &&
                date.getFullYear() === today.getFullYear()
            const isPast = date < new Date(today.setHours(0, 0, 0, 0))

            calendarDays.push(
                <button
                    key={day}
                    onClick={() => !isPast && handleDateSelect(day)}
                    disabled={isPast}
                    className={`h-8 w-8 rounded-full flex items-center justify-center text-sm
            ${isPast ? "text-gray-300 cursor-not-allowed" : "cursor-pointer hover:bg-secondary/10"}
            ${isToday ? "border border-secondary text-secondary" : ""}
            ${
                selectedDate &&
                selectedDate.getDate() === day &&
                selectedDate.getMonth() === month &&
                selectedDate.getFullYear() === year
                    ? "bg-secondary text-white"
                    : ""
            }`}
                >
                    {day}
                </button>,
            )
        }

        return calendarDays
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden w-full">
            <div className="bg-secondary text-white p-2 flex items-center justify-between">
                <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <h3 className="text-sm font-medium">
                        {step === 1 ? "Seleccionar fecha" : "Seleccionar hora"}
                    </h3>
                </div>
                {step === 2 && (
                    <button
                        onClick={() => setStep(1)}
                        className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded"
                    >
                        Cambiar fecha
                    </button>
                )}
            </div>

            {step === 1 && (
                <div className="p-2">
                    {/* Month Navigation */}
                    <div className="flex justify-between items-center mb-2">
                        <button
                            onClick={prevMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium">
                            {months[currentMonth.getMonth()]}{" "}
                            {currentMonth.getFullYear()}
                        </span>
                        <button
                            onClick={nextMonth}
                            className="p-1 hover:bg-gray-100 rounded-full"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Days of the week */}
                    <div className="grid grid-cols-7 gap-1 mb-1">
                        {days.map((day) => (
                            <div
                                key={day}
                                className="h-8 w-8 flex items-center justify-center text-xs text-gray-500"
                            >
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-1">
                        {renderCalendar()}
                    </div>
                </div>
            )}
            {/* Time Selector */}
            {step === 2 && (
                <div className="p-3">
                    <div className="mb-3">
                        <p className="text-xs text-textMain/70">
                            {" "}
                            Fecha seleccionada:{" "}
                        </p>
                        <p className="text-sm font-medium">
                            {" "}
                            {formatDateToSpanish(selectedDate)}{" "}
                        </p>
                    </div>

                    {/* Slot Loading/Error/Display */}
                    {isLoadingSlots && (
                        <div className="flex items-center text-gray-500 py-4 justify-center">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Cargando horarios...
                        </div>
                    )}
                    {slotsError && !isLoadingSlots && (
                        <div className="text-red-600 text-sm flex items-center justify-center py-4 bg-red-50 border border-red-200 rounded p-2">
                            <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />{" "}
                            {slotsError}
                        </div>
                    )}
                    {!isLoadingSlots &&
                        !slotsError &&
                        (availableSlots.length === 0 ? (
                            <p className="text-sm text-gray-500 italic text-center py-4">
                                No hay horarios disponibles para sugerir en esta
                                fecha.
                            </p>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {availableSlots.map((slot) => (
                                    <button
                                        key={slot.time}
                                        onClick={() =>
                                            slot.isAvailable &&
                                            handleTimeSelect(slot.time)
                                        }
                                        disabled={!slot.isAvailable}
                                        title={
                                            !slot.isAvailable
                                                ? slot.reason || "No disponible"
                                                : `Sugerir ${slot.time}`
                                        }
                                        className={`py-2 px-1 rounded text-sm flex items-center justify-center transition-colors border focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary ${
                                            selectedTime === slot.time
                                                ? "bg-secondary text-white border-secondary ring-2 ring-offset-1 ring-secondary"
                                                : slot.isAvailable
                                                  ? "bg-white border-gray-300 hover:border-primary hover:bg-primary/5 text-textMain"
                                                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed line-through"
                                        }`}
                                    >
                                        <Clock className="w-3 h-3 mr-1 opacity-80" />
                                        <span>{slot.time}</span>
                                    </button>
                                ))}
                            </div>
                        ))}
                </div>
            )}
            {/* Action Buttons */}
            <div className="border-t p-2 flex justify-between">
                <Button type="transparent" size="sm" onClick={handleBack}>
                    {step === 1 ? "Cancelar" : "Volver"}
                </Button>
                {step === 2 && (
                    <Button
                        type="dark"
                        size="sm"
                        onClick={handleConfirm}
                        disabled={
                            !selectedTime || isLoadingSlots || !!slotsError
                        }
                    >
                        Confirmar Hora
                    </Button>
                )}
            </div>
        </div>
    )
}

export default AlternativeTimesCalendar
