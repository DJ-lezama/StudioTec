import React from "react"
import SelectionCard from "../SelectionCard"
import Button from "../../../components/common/Button"
import { Loader2 } from "lucide-react"

const StylistSelectionStep = ({
    formData,
    onFormUpdate,
    onNext,
    onPrev,
    stylists,
    isLoading = false,
    error = null,
}) => {
    const handleStylistSelect = (stylistId) => {
        onFormUpdate({ ...formData, stylistId })
    }

    const isNextDisabled = !formData.stylistId

    if (isLoading) {
        return (
            <div className="text-center p-4">
                <Loader2 className="animate-spin inline-block w-6 h-6 text-secondary" />
            </div>
        )
    }

    if (error) {
        return <div className="text-center p-4 text-red-600">{error}</div>
    }

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Selecciona un estilista
            </h2>

            {stylists.length === 0 ? (
                <p className="text-center text-gray-500 italic">
                    No hay estilistas disponibles en este momento.
                </p>
            ) : (
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
            )}

            {/* Navigation Buttons */}
            <div className="pt-4 flex justify-between border-t border-gray-200 mt-6">
                <Button type="transparent" onClick={onPrev}>
                    Atrás
                </Button>
                <Button
                    type="dark"
                    onClick={onNext}
                    disabled={isNextDisabled || stylists.length === 0}
                >
                    Continuar
                </Button>
            </div>
        </div>
    )
}
export default StylistSelectionStep
