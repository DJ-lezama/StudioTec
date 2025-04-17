import React from "react"
import { Calendar, X } from "lucide-react"
import Button from "../../components/common/Button"
import CalendarHeader from "./Calendar/CalendarHeader"
import CalendarGrid from "./Calendar/CalendarGrid"
import TimeSlotGrid from "./Calendar/TimeSlotGrid"

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
}) => {
    const availableTimes = [
        "09:00",
        "10:00",
        "11:00",
        "12:00",
        "13:00",
        "14:00",
        "16:00",
        "17:00",
        "18:00",
    ]

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
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Current appointment details */}
                <div className="mb-6 bg-primary/10 p-4 rounded-lg">
                    <p className="font-medium text-textMain">
                        {appointment.service}
                    </p>
                    <p className="text-sm text-textMain/70">
                        <span>
                            Cita actual: {formatDate(appointment.date)} -{" "}
                            {appointment.time}
                        </span>
                    </p>
                    <p className="text-sm text-textMain/70">
                        Estilista: {appointment.stylist}
                    </p>
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

                        <TimeSlotGrid
                            availableTimes={availableTimes}
                            selectedTime={selectedTime}
                            onTimeSelect={onTimeSelect}
                        />
                    </div>
                )}

                {/* Action buttons */}
                <div className="flex justify-end gap-3 mt-4">
                    <Button type="transparent" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="dark"
                        onClick={onSave}
                        disabled={!selectedDate || !selectedTime}
                        className="flex items-center"
                    >
                        <Calendar size={16} className="mr-2" />
                        Confirmar cambio
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default RescheduleModal
