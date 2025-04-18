import React, { useRef, useState } from "react"
import { AlertCircle, Plus, Trash2 } from "lucide-react"
import Button from "../../common/Button"
import { isValidTime, parseInterval } from "../../../utils/timeUtils"

const daysOfWeek = [
    { key: "monday", label: "Lunes" },
    { key: "tuesday", label: "Martes" },
    { key: "wednesday", label: "Miércoles" },
    { key: "thursday", label: "Jueves" },
    { key: "friday", label: "Viernes" },
    { key: "saturday", label: "Sábado" },
    { key: "sunday", label: "Domingo" },
]

const TimeRangeInput = ({
    dayKey,
    index,
    interval,
    onRemoveInterval,
    onIntervalChange,
}) => {
    const { start, end, error: initialError } = parseInterval(interval)
    const [startTime, setStartTime] = useState(start)
    const [endTime, setEndTime] = useState(end)
    const [validationError, setValidationError] = useState(initialError)

    React.useEffect(() => {
        const {
            start: newStart,
            end: newEnd,
            error: newError,
        } = parseInterval(interval)
        setStartTime(newStart)
        setEndTime(newEnd)
        setValidationError(newError)
    }, [interval])

    const handleTimeChange = (type, value) => {
        let currentStart = type === "start" ? value : startTime
        let currentEnd = type === "end" ? value : endTime
        let error = null

        if (!isValidTime(currentStart) || !isValidTime(currentEnd)) {
            error = "Hora inválida."
        } else if (currentEnd <= currentStart) {
            error = "Fin debe ser posterior al inicio."
        }

        setValidationError(error)
        if (type === "start") setStartTime(value)
        else setEndTime(value)

        onIntervalChange(dayKey, index, `${currentStart}-${currentEnd}`, error)
    }

    return (
        <div className="flex items-center gap-2 mb-2 relative pl-4">
            {validationError && (
                <AlertCircle
                    size={14}
                    className="absolute left-[-5px] top-2.5 text-red-500"
                    title={validationError}
                />
            )}
            <input
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className={`w-auto px-2 py-1 border rounded text-sm ${
                    validationError ? "border-red-400" : "border-gray-300"
                } focus:ring-1 focus:ring-primary focus:border-primary`}
                aria-label={`Hora de inicio para intervalo ${index + 1}`}
            />
            <span className="text-gray-500">-</span>
            <input
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className={`w-auto px-2 py-1 border rounded text-sm ${
                    validationError ? "border-red-400" : "border-gray-300"
                } focus:ring-1 focus:ring-primary focus:border-primary`}
                aria-label={`Hora de fin para intervalo ${index + 1}`}
                min={startTime}
            />
            <button
                type="button"
                onClick={() => onRemoveInterval(dayKey, index)}
                className="text-red-500 hover:text-red-700 p-1"
                aria-label={`Eliminar intervalo ${index + 1}`}
                title="Eliminar intervalo"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}

const WorkingHoursEditor = ({ hours, onChange }) => {
    const lastActiveHoursRef = useRef({})

    const triggerChange = (dayKey, newIntervalsForDay) => {
        const newState = { ...hours, [dayKey]: newIntervalsForDay }
        onChange(newState)
    }

    const handleToggleDay = (dayKey, isChecked) => {
        const currentDayHours = hours[dayKey]

        if (!isChecked) {
            if (Array.isArray(currentDayHours)) {
                lastActiveHoursRef.current[dayKey] = currentDayHours
            }
            triggerChange(dayKey, null)
        } else {
            const previousHours = lastActiveHoursRef.current[dayKey]
            const intervalsToSet =
                Array.isArray(previousHours) && previousHours.length > 0
                    ? previousHours
                    : ["09:00-17:00"]
            triggerChange(dayKey, intervalsToSet)
        }
    }

    const handleAddInterval = (dayKey) => {
        const currentIntervals = hours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = [...currentIntervals, "09:00-17:00"]
        triggerChange(dayKey, newIntervals)
    }

    const handleRemoveInterval = (dayKey, indexToRemove) => {
        const currentIntervals = hours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = currentIntervals.filter(
            (_, index) => index !== indexToRemove,
        )
        triggerChange(dayKey, newIntervals)
    }

    const handleIntervalChange = (dayKey, indexToUpdate, newIntervalString) => {
        const currentIntervals = hours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = currentIntervals.map((interval, index) =>
            index === indexToUpdate ? newIntervalString : interval,
        )
        triggerChange(dayKey, newIntervals)
    }

    const currentHours = hours || {}

    return (
        <div className="space-y-4">
            {daysOfWeek.map((day) => {
                const intervals = currentHours[day.key]
                const isWorking = intervals !== null && intervals !== undefined

                return (
                    <div
                        key={day.key}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-3 border rounded-lg bg-white"
                    >
                        {/* Day Label and Toggle */}
                        <div className="w-full sm:w-28 flex-shrink-0 flex items-center justify-between sm:justify-start">
                            <span className="font-medium text-textMain w-full">
                                {day.label}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer ml-auto sm:ml-2 shrink-0">
                                <input
                                    type="checkbox"
                                    className="sr-only peer"
                                    checked={isWorking}
                                    onChange={(e) =>
                                        handleToggleDay(
                                            day.key,
                                            e.target.checked,
                                        )
                                    }
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary"></div>
                            </label>
                        </div>

                        {/* Time Intervals Section */}
                        <div
                            className={`flex-1 transition-opacity duration-300 ${isWorking ? "opacity-100" : "opacity-50 pointer-events-none"}`}
                        >
                            {isWorking ? (
                                Array.isArray(intervals) &&
                                intervals.length > 0 ? (
                                    intervals.map((interval, index) => (
                                        <TimeRangeInput
                                            key={`${day.key}-${index}-${interval}-${Date.now()}`}
                                            dayKey={day.key}
                                            index={index}
                                            interval={interval || "09:00-17:00"}
                                            onIntervalChange={
                                                handleIntervalChange
                                            }
                                            onRemoveInterval={
                                                handleRemoveInterval
                                            }
                                        />
                                    ))
                                ) : (
                                    <p className="text-sm text-gray-500 italic mb-2">
                                        Día habilitado, pero sin horarios
                                        definidos. Añade un intervalo.
                                    </p>
                                )
                            ) : (
                                <p className="text-sm text-gray-500 italic h-[38px] flex items-center">
                                    Día libre
                                </p>
                            )}
                            {/* Add Interval Button */}
                            {isWorking && (
                                <Button
                                    type="outline"
                                    size="sm"
                                    onClick={() => handleAddInterval(day.key)}
                                    className="mt-1 !text-xs !py-1 !px-2 flex items-center gap-1"
                                    title="Añadir otro intervalo (ej. para descansos)"
                                >
                                    <Plus size={14} /> Añadir Intervalo
                                </Button>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default WorkingHoursEditor
