import React from "react"
import SelectionCard from "../SelectionCard"
import Button from "../../../components/common/Button"

const StylistSelectionStep = ({
    formData,
    onFormUpdate,
    onNext,
    onPrev,
    stylists,
}) => {
    const handleStylistSelect = (stylistId) => {
        onFormUpdate({ ...formData, stylistId })
    }

    const isNextDisabled = !formData.stylistId

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Selecciona un estilista
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stylists.map((stylist) => (
                    <SelectionCard
                        key={stylist.id}
                        isSelected={formData.stylistId === stylist.id}
                        onClick={() => handleStylistSelect(stylist.id)}
                        primary={stylist.name}
                    />
                ))}
            </div>
            <div className="pt-4 flex justify-between">
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
export default StylistSelectionStep
