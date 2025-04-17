import React, { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import FormField from "../FormField"
import TimeSlotGrid from "../TimeSlotGrid"
import Button from "../../../components/common/Button"
import { getAvailableSlotsForDay } from "../../../features/availability/services/availabilityService"

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

    const today = new Date()
    const minDate = today.toISOString().split("T")[0]
    const maxDate = new Date(today)
    // TODO: We might want to change this to a different time frame
    maxDate.setMonth(maxDate.getMonth() + 3) // Limit booking to 3 months ahead
    const maxDateStr = maxDate.toISOString().split("T")[0]

    useEffect(() => {
        setSlots([])
        setIsLoadingSlots(false)
        setSlotsError(null)
        setInternalError(null)

        if (!formData.date) {
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

            const dateParts = formData.date.split("-").map(Number)
            const targetDate = new Date(
                Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]),
            )

            if (isNaN(targetDate.getTime())) {
                throw new Error("Fecha seleccionada inválida")
            }
            try {
                console.log(
                    `Fetching slots for stylist ${formData.stylistId} on ${targetDate.toISOString()} with duration ${serviceDuration} min`,
                )

                const fetchedSlots = await getAvailableSlotsForDay(
                    formData.stylistId,
                    targetDate,
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
                    `Error al cargar horarios: ${error.message || "Intenta de nuevo."}`,
                )
                setSlots([])
            } finally {
                setIsLoadingSlots(false)
            }
        }

        fetchSlots().then((r) => r)
    }, [formData.date, formData.stylistId, formData.serviceId, serviceDuration])

    const handleInputChange = (e) => {
        const { name, value } = e.target
        const updatedData = {
            ...formData,
            [name]: value,
            ...(name === "date" && { time: "" }),
        }
        onFormUpdate(updatedData)
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
                {/* Date Selection */}
                <FormField
                    label="Fecha"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={minDate}
                    max={maxDateStr}
                    required
                    readOnly={!!internalError}
                    className={
                        internalError ? "opacity-50 cursor-not-allowed" : ""
                    }
                />

                {/* Time Selection Area */}
                <div
                    className={
                        !formData.date || !!internalError ? "opacity-50" : ""
                    }
                >
                    <label className="block text-textMain font-medium mb-2">
                        Hora Disponible{" "}
                        {serviceDuration
                            ? `(Duración: ${serviceDuration} min)`
                            : ""}
                    </label>

                    {isLoadingSlots && (
                        <div className="flex items-center text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Cargando horarios...
                        </div>
                    )}

                    {/* Display slot-specific errors */}
                    {slotsError && !isLoadingSlots && (
                        <div className="text-red-600 text-sm flex items-center bg-red-50 p-2 rounded border border-red-200">
                            <AlertTriangle className="w-4 h-4 mr-1 flex-shrink-0" />{" "}
                            {slotsError}
                        </div>
                    )}

                    {/* Display slots only if prerequisites met and no errors */}
                    {!isLoadingSlots &&
                        !slotsError &&
                        !internalError &&
                        formData.date &&
                        slots.length > 0 && (
                            <TimeSlotGrid
                                times={
                                    slots.length > 0
                                        ? slots
                                              .filter((s) => s.isAvailable)
                                              .map((s) => s.time)
                                        : []
                                }
                                selectedTime={formData.time}
                                onSelectTime={handleTimeSelect}
                            />
                        )}
                    {!isLoadingSlots &&
                        !slotsError &&
                        !internalError &&
                        formData.date &&
                        slots.length === 0 && (
                            <p className="text-sm text-gray-500 italic">
                                No hay horarios disponibles para la fecha y
                                servicio seleccionados.
                            </p>
                        )}

                    {/* Message when date is not selected */}
                    {!formData.date && !internalError && (
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
