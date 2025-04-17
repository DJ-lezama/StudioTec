import React, { useEffect, useState } from "react"
import { AlertTriangle, Loader2 } from "lucide-react"
import FormField from "../FormField"
import TimeSlotGrid from "../TimeSlotGrid"
import Button from "../../../components/common/Button"
import { getAvailableSlotsForDay } from "../../../features/availability/services/availabilityService"

const DateTimeSelectionStep = ({ formData, onFormUpdate, onNext, onPrev }) => {
    const [slots, setSlots] = useState([])
    const [isLoadingSlots, setIsLoadingSlots] = useState(false)
    const [slotsError, setSlotsError] = useState(null)

    const today = new Date()
    const minDate = today.toISOString().split("T")[0]
    const maxDate = new Date(today)
    // TODO: We might want to change this to a different time frame
    maxDate.setMonth(maxDate.getMonth() + 3) // Limit booking to 3 months ahead
    const maxDateStr = maxDate.toISOString().split("T")[0]

    useEffect(() => {
        onFormUpdate({ ...formData, time: "" })
        setSlots([])

        if (formData.date && formData.stylistId && formData.serviceId) {
            const fetchSlots = async () => {
                setIsLoadingSlots(true)
                setSlotsError(null)
                setSlots([])

                // const serviceDetails = findServiceDetails(formData.serviceId)
                // const duration = serviceDetails?.duration

                // if (typeof duration !== "number" || duration <= 0) {
                //     console.error(
                //         "Invalid duration for service:",
                //         formData.serviceId,
                //     )
                //     setSlotsError(
                //         "No se pudo determinar la duración del servicio.",
                //     )
                //     setIsLoadingSlots(false)
                //     return
                // }

                const dateParts = formData.date.split("-").map(Number)
                const targetDate = new Date(
                    dateParts[0],
                    dateParts[1] - 1,
                    dateParts[2],
                )

                if (isNaN(targetDate.getTime())) {
                    throw new Error("Invalid date selected")
                }
                try {
                    const fetchedSlots = await getAvailableSlotsForDay(
                        formData.stylistId,
                        targetDate,
                        60, // TODO: Replace with the actual duration of the service
                    )
                    setSlots(fetchedSlots)
                } catch (error) {
                    console.error("Error fetching slots:", error)
                    setSlotsError(`Error al cargar horarios: ${error.message}`)
                    setSlots([])
                } finally {
                    setIsLoadingSlots(false)
                }
            }
            fetchSlots().then((r) => r)
        } else {
            setSlots([])
            setIsLoadingSlots(false)
            setSlotsError(null)
        }
    }, [
        formData.date,
        formData.stylistId,
        formData.serviceId,
        onFormUpdate,
        formData,
    ])

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
    }

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Selecciona Fecha y Hora
            </h2>

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
                />

                {/* Time Selection Area */}
                <div className={!formData.date ? "opacity-50" : ""}>
                    {" "}
                    <label className="block text-textMain font-medium mb-2">
                        Hora Disponible
                    </label>
                    {isLoadingSlots && (
                        <div className="flex items-center text-gray-500">
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />{" "}
                            Cargando horarios...
                        </div>
                    )}
                    {slotsError && !isLoadingSlots && (
                        <div className="text-red-600 text-sm flex items-center">
                            <AlertTriangle className="w-4 h-4 mr-1" />{" "}
                            {slotsError}
                        </div>
                    )}
                    {!isLoadingSlots &&
                        !slotsError &&
                        formData.date &&
                        (slots.length === 0 ? (
                            <p className="text-sm text-gray-500 italic">
                                No hay horarios disponibles para la fecha
                                seleccionada.
                            </p>
                        ) : (
                            <TimeSlotGrid
                                slots={slots}
                                selectedTime={formData.time}
                                onSelectTime={handleTimeSelect}
                            />
                        ))}
                    {!formData.date && (
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
                <Button
                    type="dark"
                    onClick={onNext}
                    disabled={
                        !formData.date ||
                        !formData.time ||
                        isLoadingSlots ||
                        !!slotsError
                    }
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export default DateTimeSelectionStep
