import React, { useCallback, useEffect, useState } from "react"
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
    onIntervalChange,
    onRemoveInterval,
}) => {
    const { start, end, error: initialError } = parseInterval(interval)
    const [startTime, setStartTime] = useState(start)
    const [endTime, setEndTime] = useState(end)
    const [validationError, setValidationError] = useState(initialError)

    useEffect(() => {
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

        if (type === "start") {
            setStartTime(value)
        } else {
            setEndTime(value)
        }
        if (!error) {
            onIntervalChange(dayKey, index, `${currentStart}-${currentEnd}`)
        } else {
            onIntervalChange(
                dayKey,
                index,
                `${currentStart}-${currentEnd}`,
                error,
            )
        }
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
                className={`w-24 px-2 py-1 border rounded text-sm ${validationError ? "border-red-400" : "border-gray-300"} focus:ring-1 focus:ring-primary focus:border-primary`}
                aria-label={`Hora de inicio para intervalo ${index + 1}`}
            />
            <span className="text-gray-500">-</span>
            <input
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className={`w-24 px-2 py-1 border rounded text-sm ${validationError ? "border-red-400" : "border-gray-300"} focus:ring-1 focus:ring-primary focus:border-primary`}
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

const WorkingHoursEditor = ({ initialHours, onChange }) => {
    const [editedHours, setEditedHours] = useState(() => {
        const initialised = {}
        daysOfWeek.forEach((day) => {
            initialised[day.key] =
                initialHours?.[day.key] === undefined
                    ? null
                    : initialHours[day.key]
            if (
                initialised[day.key] !== null &&
                !Array.isArray(initialised[day.key])
            ) {
                console.warn(
                    `Invalid initial interval for ${day.key}, setting to null.`,
                )
                initialised[day.key] = null
            }
        })
        return initialised
    })

    useEffect(() => {
        if (JSON.stringify(initialHours) !== JSON.stringify(editedHours)) {
            const initialised = {}
            daysOfWeek.forEach((day) => {
                initialised[day.key] =
                    initialHours?.[day.key] === undefined
                        ? null
                        : initialHours[day.key]
                if (
                    initialised[day.key] !== null &&
                    !Array.isArray(initialised[day.key])
                ) {
                    initialised[day.key] = null
                }
            })
            setEditedHours(initialised)
            console.log("Synced internal state with initialHours prop change.")
        }
    }, [editedHours, initialHours])

    const handleHoursChange = useCallback(
        (dayKey, newIntervals) => {
            const newState = { ...editedHours, [dayKey]: newIntervals }
            setEditedHours(newState)
            onChange(newState)
        },
        [editedHours, onChange],
    )

    const handleToggleDay = (dayKey, isChecked) => {
        const currentIntervals = editedHours[dayKey]
        const newIntervals = isChecked
            ? Array.isArray(currentIntervals) && currentIntervals.length > 0
                ? currentIntervals
                : ["09:00-17:00"]
            : null
        handleHoursChange(dayKey, newIntervals)
    }

    const handleAddInterval = (dayKey) => {
        const currentIntervals = editedHours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = [...currentIntervals, "09:00-17:00"]
        handleHoursChange(dayKey, newIntervals)
    }

    const handleRemoveInterval = (dayKey, indexToRemove) => {
        const currentIntervals = editedHours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = currentIntervals.filter(
            (_, index) => index !== indexToRemove,
        )
        handleHoursChange(dayKey, newIntervals.length > 0 ? newIntervals : [])
    }

    const handleIntervalChange = (dayKey, indexToUpdate, newIntervalString) => {
        const currentIntervals = editedHours[dayKey]
        if (!Array.isArray(currentIntervals)) return

        const newIntervals = currentIntervals.map((interval, index) =>
            index === indexToUpdate ? newIntervalString : interval,
        )

        const dayHasErrors = newIntervals.some((intStr) => {
            const { start, end, error: parseError } = parseInterval(intStr)
            return (
                !!parseError ||
                !isValidTime(start) ||
                !isValidTime(end) ||
                end <= start
            )
        })

        setEditedHours((prev) => ({ ...prev, [dayKey]: newIntervals }))

        if (!dayHasErrors) {
            onChange({ ...editedHours, [dayKey]: newIntervals })
        } else {
            console.log(
                `Day ${dayKey} has validation errors, not propagating onChange.`,
            )
        }
    }

    return (
        <div className="space-y-4">
            {daysOfWeek.map((day) => {
                const intervals = editedHours[day.key]
                const isWorking = intervals !== null

                return (
                    <div
                        key={day.key}
                        className="flex flex-col sm:flex-row sm:items-start gap-4 p-3 border rounded-lg bg-white"
                    >
                        {/* Day Label and Toggle */}
                        <div className="w-full sm:w-28 flex-shrink-0 flex items-center justify-between sm:justify-start">
                            <span className="font-medium text-textMain">
                                {day.label}
                            </span>
                            <label className="relative inline-flex items-center cursor-pointer ml-auto sm:ml-4">
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
                                            key={`${day.key}-${index}-${interval}`}
                                            dayKey={day.key}
                                            index={index}
                                            interval={interval}
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
                                        definidos.
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
