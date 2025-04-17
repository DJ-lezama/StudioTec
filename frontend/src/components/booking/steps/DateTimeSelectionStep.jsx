import React from "react"
import FormField from "../FormField"
import TimeSlotGrid from "../TimeSlotGrid"
import Button from "../../../components/common/Button"

const DateTimeSelectionStep = ({
    formData,
    onFormUpdate,
    onNext,
    onPrev,
    availableTimes,
}) => {
    const today = new Date()
    const minDate = today.toISOString().split("T")[0]
    const maxDate = new Date(today)
    maxDate.setMonth(maxDate.getMonth() + 3)
    const maxDateStr = maxDate.toISOString().split("T")[0]

    const handleInputChange = (e) => {
        const { name, value } = e.target
        onFormUpdate({
            ...formData,
            [name]: value,
        })
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
                Selecciona fecha y hora
            </h2>

            <div className="space-y-6">
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

                {formData.date && (
                    <div>
                        <label className="block text-textMain font-medium mb-2">
                            Hora
                        </label>
                        <TimeSlotGrid
                            times={availableTimes}
                            selectedTime={formData.time}
                            onSelectTime={handleTimeSelect}
                        />
                    </div>
                )}
            </div>

            <div className="pt-4 flex justify-between">
                <Button type="transparent" onClick={onPrev}>
                    Atrás
                </Button>
                <Button
                    type="dark"
                    onClick={onNext}
                    disabled={!formData.date || !formData.time}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export default DateTimeSelectionStep
