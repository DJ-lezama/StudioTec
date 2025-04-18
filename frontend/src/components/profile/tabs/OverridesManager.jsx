import React, { useCallback, useEffect, useMemo, useState } from "react"
import {
    AlertCircle,
    CalendarDays,
    Clock,
    Plus,
    Save,
    Trash2,
    X,
} from "lucide-react"
import { format, formatISO, parseISO } from "date-fns"
import { es } from "date-fns/locale"
import DatePicker, { registerLocale } from "react-datepicker"
import { isValidTime, parseInterval } from "../../../utils/timeUtils"
import Button from "../../common/Button"
import { toast } from "react-toastify"

registerLocale("es", es)

const formatOverrideDate = (dateString) => {
    try {
        const date = parseISO(dateString + "T00:00:00Z")
        return format(date, "EEEE d 'de' MMMM, yyyy", { locale: es })
    } catch (e) {
        console.error("Error formatting override date:", dateString, e)
        return "Fecha inválida"
    }
}

const TimeRangeInput = ({
    idPrefix,
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
        if (type === "start") setStartTime(value)
        else setEndTime(value)

        onIntervalChange(index, `${currentStart}-${currentEnd}`, error)
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
                id={`${idPrefix}-start-${index}`}
                type="time"
                value={startTime}
                onChange={(e) => handleTimeChange("start", e.target.value)}
                className={`w-auto px-2 py-1 border rounded text-sm ${validationError ? "border-red-400" : "border-gray-300"}`}
            />
            <span className="text-gray-500">-</span>
            <input
                id={`${idPrefix}-end-${index}`}
                type="time"
                value={endTime}
                onChange={(e) => handleTimeChange("end", e.target.value)}
                className={`w-auto px-2 py-1 border rounded text-sm ${validationError ? "border-red-400" : "border-gray-300"}`}
                min={startTime}
            />
            <button
                type="button"
                onClick={() => onRemoveInterval(index)}
                className="text-red-500 hover:text-red-700 p-1"
                title="Eliminar intervalo"
            >
                <Trash2 size={16} />
            </button>
        </div>
    )
}

const OverrideFormModal = ({ isOpen, onClose, onSave, initialData = null }) => {
    const [selectedDate, setSelectedDate] = useState(
        initialData?.date
            ? parseISO(initialData.date + "T00:00:00Z")
            : new Date(),
    )
    const [overrideType, setOverrideType] = useState(
        initialData?.data?.type || "OFF",
    )
    const [description, setDescription] = useState(
        initialData?.data?.description || "",
    )
    const [customHours, setCustomHours] = useState(
        initialData?.data?.hours || ["09:00-17:00"],
    )
    const [errors, setErrors] = useState({})

    const isEditing = !!initialData?.date

    useEffect(() => {
        if (isOpen) {
            setSelectedDate(
                initialData?.date
                    ? parseISO(initialData.date + "T00:00:00Z")
                    : new Date(),
            )
            setOverrideType(initialData?.data?.type || "OFF")
            setDescription(initialData?.data?.description || "")
            setCustomHours(initialData?.data?.hours || ["09:00-17:00"])
            setErrors({})
        }
    }, [isOpen, initialData])

    const handleIntervalChange = (index, newIntervalString, error) => {
        const newHours = [...customHours]
        newHours[index] = newIntervalString
        setCustomHours(newHours)
        setErrors((prev) => ({
            ...prev,
            hours: error ? "Hay errores en los horarios personalizados" : null,
        }))
    }

    const handleRemoveInterval = (indexToRemove) => {
        setCustomHours((prev) =>
            prev.filter((_, index) => index !== indexToRemove),
        )
    }

    const handleAddInterval = () => {
        setCustomHours((prev) => [...prev, "09:00-17:00"])
    }

    const validateForm = () => {
        const newErrors = {}
        if (!selectedDate) newErrors.date = "Debes seleccionar una fecha."

        if (overrideType === "CUSTOM_HOURS") {
            if (!customHours || customHours.length === 0) {
                newErrors.hours =
                    "Debes añadir al menos un intervalo de tiempo."
            } else {
                const hasTimeErrors = customHours.some((intStr) => {
                    const { start, end, error } = parseInterval(intStr)
                    return (
                        !!error ||
                        !isValidTime(start) ||
                        !isValidTime(end) ||
                        end <= start
                    )
                })
                if (hasTimeErrors) {
                    newErrors.hours =
                        "Uno o más intervalos de tiempo son inválidos."
                }
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSaveClick = () => {
        if (!validateForm()) {
            toast.warn("Por favor corrige los errores en el formulario.")
            return
        }

        const dateString = formatISO(selectedDate, { representation: "date" })

        const overrideData = {
            type: overrideType,
        }
        if (overrideType === "OFF") {
            overrideData.description = description.trim()
        } else {
            overrideData.hours = customHours.filter(
                (h) => typeof h === "string" && h.includes("-"),
            )
        }

        onSave({ dateString, data: overrideData })
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-xl p-5 sm:p-6 w-full max-w-lg max-h-[90vh] flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b mb-4">
                    <h3 className="text-h5 font-semibold text-textMain">
                        {isEditing
                            ? "Editar Excepción"
                            : "Añadir Nueva Excepción"}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 p-1"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha*
                        </label>
                        <DatePicker
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date)}
                            dateFormat="d 'de' MMMM, yyyy"
                            locale="es"
                            className={`w-full p-2 border rounded-md ${errors.date ? "border-red-400" : "border-gray-300"}`}
                            minDate={new Date()}
                            popperPlacement="bottom-start"
                            showMonthYearDropdown={true}
                        />
                        {errors.date && (
                            <p className="text-xs text-red-500 mt-1">
                                {errors.date}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Tipo de Excepción*
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="overrideType"
                                    value="OFF"
                                    checked={overrideType === "OFF"}
                                    onChange={(e) =>
                                        setOverrideType(e.target.value)
                                    }
                                    className="text-secondary focus:ring-secondary"
                                />
                                Día Libre
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="overrideType"
                                    value="CUSTOM_HOURS"
                                    checked={overrideType === "CUSTOM_HOURS"}
                                    onChange={(e) =>
                                        setOverrideType(e.target.value)
                                    }
                                    className="text-secondary focus:ring-secondary"
                                />
                                Horario Personalizado
                            </label>
                        </div>
                    </div>

                    {overrideType === "OFF" && (
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Descripción (Opcional)
                            </label>
                            <input
                                id="description"
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ej: Vacaciones, Cita médica"
                                className="w-full p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    )}

                    {overrideType === "CUSTOM_HOURS" && (
                        <div className="border-t pt-3 mt-3">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Horarios para este día*
                            </label>
                            {customHours.map((interval, index) => (
                                <TimeRangeInput
                                    key={index}
                                    idPrefix={`override-${index}`}
                                    index={index}
                                    interval={interval}
                                    onIntervalChange={handleIntervalChange}
                                    onRemoveInterval={handleRemoveInterval}
                                />
                            ))}
                            <Button
                                type="outline"
                                size="sm"
                                onClick={handleAddInterval}
                                className="mt-1 !text-xs !py-1 !px-2"
                            >
                                <Plus size={14} /> Añadir Intervalo
                            </Button>
                            {errors.hours && (
                                <p className="text-xs text-red-500 mt-1">
                                    {errors.hours}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t mt-4">
                    <Button type="light" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        type="dark"
                        onClick={handleSaveClick}
                        className="flex items-center gap-1"
                    >
                        <Save size={16} /> Guardar Excepción
                    </Button>
                </div>
            </div>
        </div>
    )
}

const OverridesManager = ({ initialOverrides, onChange }) => {
    const [editedOverrides, setEditedOverrides] = useState(
        initialOverrides || {},
    )
    const [showModal, setShowModal] = useState(false)
    const [currentModalData, setCurrentModalData] = useState(null)

    useEffect(() => {
        if (
            JSON.stringify(initialOverrides) !== JSON.stringify(editedOverrides)
        ) {
            setEditedOverrides(initialOverrides || {})
        }
    }, [editedOverrides, initialOverrides])

    const sortedDates = useMemo(() => {
        return Object.keys(editedOverrides).sort((a, b) => a.localeCompare(b))
    }, [editedOverrides])

    const handleDeleteOverride = useCallback(
        (dateString) => {
            if (
                window.confirm(
                    `¿Seguro que quieres eliminar la excepción para el ${formatOverrideDate(dateString)}?`,
                )
            ) {
                setEditedOverrides((prevOverrides) => {
                    const newOverrides = { ...prevOverrides }
                    delete newOverrides[dateString]
                    onChange(newOverrides)
                    return newOverrides
                })
            }
        },
        [onChange],
    )

    const handleOpenAddModal = () => {
        setCurrentModalData(null)
        setShowModal(true)
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setCurrentModalData(null)
    }

    const handleSaveOverride = useCallback(
        ({ dateString, data }) => {
            if (!dateString) return

            setEditedOverrides((prevOverrides) => {
                const newOverrides = {
                    ...prevOverrides,
                    [dateString]: data,
                }
                onChange(newOverrides)
                return newOverrides
            })
            handleCloseModal()
        },
        [onChange],
    )

    return (
        <div className="space-y-3">
            <div className="mb-4 text-right">
                <Button
                    type="secondary"
                    size="sm"
                    className="!text-xs"
                    onClick={handleOpenAddModal}
                >
                    <Plus size={14} className="mr-1" /> Añadir Excepción
                </Button>
            </div>

            {sortedDates.length === 0 ? (
                <p className="text-sm text-gray-500 italic px-1">
                    No hay excepciones de disponibilidad definidas. Tu horario
                    semanal predeterminado se aplicará todos los días.
                </p>
            ) : (
                sortedDates.map((dateString) => {
                    const overrideData = editedOverrides[dateString]
                    if (!overrideData || !overrideData.type) return null

                    return (
                        <div
                            key={dateString}
                            className="flex items-start justify-between gap-4 p-3 border rounded-md bg-white shadow-sm"
                        >
                            <div className="flex-1">
                                <p className="font-medium text-textMain flex items-center gap-1.5">
                                    <CalendarDays
                                        size={14}
                                        className="text-secondary flex-shrink-0 relative -top-px"
                                    />
                                    {formatOverrideDate(dateString)}
                                </p>
                                <div className="pl-5 mt-1 text-sm">
                                    {overrideData.type === "OFF" ? (
                                        <>
                                            <p className="font-semibold text-red-600">
                                                Día Libre
                                            </p>
                                            {overrideData.description && (
                                                <p className="text-gray-600 italic text-xs mt-0.5">
                                                    "{overrideData.description}"
                                                </p>
                                            )}
                                        </>
                                    ) : overrideData.type === "CUSTOM_HOURS" ? (
                                        <>
                                            <p className="font-semibold text-blue-600">
                                                Horario Personalizado:
                                            </p>
                                            {Array.isArray(
                                                overrideData.hours,
                                            ) &&
                                            overrideData.hours.length > 0 ? (
                                                <ul className="list-disc list-inside text-gray-700 mt-1 space-y-0.5">
                                                    {overrideData.hours.map(
                                                        (interval, index) => (
                                                            <li
                                                                key={index}
                                                                className="text-xs flex items-center gap-1"
                                                            >
                                                                <Clock
                                                                    size={12}
                                                                    className="flex-shrink-0"
                                                                />{" "}
                                                                {interval}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="text-gray-500 italic text-xs mt-0.5">
                                                    (No se definieron horas)
                                                </p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-yellow-700 italic">
                                            Tipo desconocido:{" "}
                                            {overrideData.type}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex-shrink-0 flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        handleDeleteOverride(dateString)
                                    }
                                    className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                    title="Eliminar esta excepción"
                                    aria-label={`Eliminar excepción del ${formatOverrideDate(dateString)}`}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    )
                })
            )}

            <OverrideFormModal
                isOpen={showModal}
                onClose={handleCloseModal}
                onSave={handleSaveOverride}
                initialData={currentModalData}
            />
        </div>
    )
}

export default OverridesManager
