import React, { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import DatePicker, { registerLocale } from "react-datepicker"
import { es } from "date-fns/locale"
import { format } from "date-fns"
import "react-datepicker/dist/react-datepicker.css"

import TimeSlotGrid from "../TimeSlotGrid"
import Button from "../../../components/common/Button"
import { getAvailableSlotsForDay } from "../../../features/availability/services/availabilityService"

registerLocale("es", es)

const DateTimeSelectionStep = ({
    formData,
    onFormUpdate,
    onNext,
    onPrev,
    serviceDuration,
}) => {
    const [slots, setSlots] = useState([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [slotsError, setSlotsError] = useState(null)
    const [internalError, setInternalError] = useState(null)

    const [selectedDateObject, setSelectedDateObject] = useState(null)

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const minDate = today
    const maxDate = new Date(today)
    // TODO: We might want to change this to a different time frame
    maxDate.setMonth(maxDate.getMonth() + 3) // Limit booking to 3 months ahead

    useEffect(() => {
        if (formData.date) {
            try {
                const [year, month, day] = formData.date.split("-").map(Number)
                const dateObj = new Date(year, month - 1, day)
                if (
                    !selectedDateObject ||
                    dateObj.getTime() !== selectedDateObject.getTime()
                ) {
                    setSelectedDateObject(dateObj)
                }
            } catch (e) {
                console.error("Error parsing formData date:", e)
                setSelectedDateObject(null)
            }
        } else {
            setSelectedDateObject(null)
        }
    }, [formData.date, selectedDateObject])

    useEffect(() => {
        setSlots([])
        setIsLoadingSlots(false)
        setSlotsError(null)
        setInternalError(null)

        if (!selectedDateObject) {
            return
        }
        if (!formData.stylistId) {
            setInternalError("Estilista no seleccionado.")
            return
        }
        if (typeof serviceDuration !== "number" || serviceDuration <= 0) {
            console.error(
                "DateTimeSelectionStep received invalid serviceDuration:",
                serviceDuration,
            )
            setInternalError(
                "No se pudo determinar la duración del servicio. Por favor, regresa y selecciona un servicio válido.",
            )
            return
        }

        const fetchSlots = async () => {
            setIsLoadingSlots(true)
            setSlotsError(null)
            setSlots([])

            if (isNaN(selectedDateObject.getTime())) {
                setInternalError("Fecha seleccionada inválida")
                setIsLoadingSlots(false)
                return
            }

            try {
                console.log(
                    `Fetching slots for stylist ${
                        formData.stylistId
                    } on ${selectedDateObject.toISOString()} with duration ${serviceDuration} min (using local time assumption)`,
                )

                const fetchedSlots = await getAvailableSlotsForDay(
                    formData.stylistId,
                    selectedDateObject,
                    serviceDuration,
                )

                setSlots(fetchedSlots)

                if (fetchedSlots.length === 0) {
                    setSlotsError(
                        "No hay horarios disponibles para la fecha y servicio seleccionados.",
                    )
                }
            } catch (error) {
                console.error("Error fetching slots:", error)
                setSlotsError(
                    `Error al cargar horarios: ${
                        error.message || "Intenta de nuevo."
                    }`,
                )
                setSlots([])
            } finally {
                setIsLoadingSlots(false)
            }
        }

        fetchSlots().then((r) => r)
    }, [
        selectedDateObject,
        formData.stylistId,
        formData.serviceId,
        serviceDuration,
    ])

    const handleDateChange = (date) => {
        setSelectedDateObject(date)

        const dateString = date ? format(date, "yyyy-MM-dd") : ""
        const updatedData = {
            ...formData,
            date: dateString,
            time: "",
        }
        onFormUpdate(updatedData)
        if (internalError) setInternalError(null)
        if (slotsError) setSlotsError(null)
    }

    const handleTimeSelect = (time) => {
        onFormUpdate({
            ...formData,
            time,
        })
        if (slotsError) setSlotsError(null)
    }

    const isNextDisabled =
        !formData.date ||
        !formData.time ||
        isLoadingSlots ||
        !!slotsError ||
        !!internalError

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Selecciona Fecha y Hora
            </h2>

            {internalError && !isLoadingSlots && (
                <div className="bg-yellow-50 border border-yellow-300 text-yellow-800 px-4 py-3 rounded text-sm flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{internalError}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-textMain font-medium mb-2">
                        Fecha <span className="text-red-500">*</span>
                    </label>
                    <DatePicker
                        selected={selectedDateObject}
                        onChange={handleDateChange}
                        locale="es"
                        dateFormat="EEEE d 'de' MMMM, yyyy"
                        minDate={minDate}
                        maxDate={maxDate}
                        placeholderText="Selecciona una fecha"
                        className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                            internalError
                                ? "bg-gray-100 text-gray-500 cursor-not-allowed focus:ring-0 border-gray-300"
                                : "border-gray-300 focus:ring-secondary"
                        }`}
                        disabled={!!internalError}
                        popperPlacement="bottom-start"
                        required
                        showMonthYearDropdown={true}
                    />
                </div>

                {/* Time Selection Area */}
                <div
                    className={
                        !selectedDateObject || !!internalError
                            ? "opacity-50"
                            : ""
                    }
                >
                    <label className="block text-textMain font-medium mb-2">
                        Hora Disponible{" "}
                        {serviceDuration
                            ? `(Duración: ${serviceDuration} min)`
                            : ""}
                        {formData.date && (
                            <span className="text-red-500"> *</span>
                        )}
                    </label>

                    {isLoadingSlots && (
                        <div className="flex items-center text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Cargando horarios...
                        </div>
                    )}

                    {slotsError && !isLoadingSlots && (
                        <div className="text-red-600 text-sm flex items-center bg-red-50 p-2 rounded border border-red-200">
                            <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />{" "}
                            {slotsError}
                        </div>
                    )}

                    {!isLoadingSlots &&
                        !slotsError &&
                        !internalError &&
                        selectedDateObject &&
                        slots.length > 0 && (
                            <TimeSlotGrid
                                times={slots
                                    .filter((s) => s.isAvailable)
                                    .map((s) => s.time)}
                                selectedTime={formData.time}
                                onSelectTime={handleTimeSelect}
                            />
                        )}
                    {!isLoadingSlots &&
                        !slotsError &&
                        !internalError &&
                        selectedDateObject &&
                        slots.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                No hay horarios disponibles para la fecha y
                                servicio seleccionados.
                            </p>
                        )}

                    {!selectedDateObject && !internalError && (
                        <p className="text-sm text-gray-400 italic">
                            Selecciona una fecha para ver los horarios.
                        </p>
                    )}
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-gray-200 mt-6">
                <Button type="transparent" onClick={onPrev}>
                    Atrás
                </Button>
                <Button type="dark" onClick={onNext} disabled={isNextDisabled}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export default DateTimeSelectionStep
