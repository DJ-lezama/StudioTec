import React from "react"
import SelectionCard from "../SelectionCard"
import Button from "../../../components/common/Button"

const ServiceSelectionStep = ({
    formData,
    onFormUpdate,
    onNext,
    categoryConfig,
    catalogData,
}) => {
    const services = formData.category
        ? catalogData[formData.category] || []
        : []

    const handleCategorySelect = (category) => {
        onFormUpdate({ ...formData, category, serviceId: "" })
    }
    const handleServiceSelect = (serviceId) => {
        onFormUpdate({ ...formData, serviceId })
    }

    const isNextDisabled = !formData.serviceId

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                ¿Qué servicio deseas reservar?
            </h2>
            {/* Category Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.entries(categoryConfig).map(([key, config]) => (
                    <SelectionCard
                        key={key}
                        isSelected={formData.category === key}
                        onClick={() => handleCategorySelect(key)}
                        primary={config.label}
                    />
                ))}
            </div>
            {/* Service Selection (conditional) */}
            {formData.category && services.length > 0 && (
                <>
                    <hr className="my-6 border-t border-gray-200" />
                    <h3 className="text-h4 font-heading font-semibold text-textMain">
                        Elige el servicio específico
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {services.map((service) => (
                            <SelectionCard
                                key={service.id}
                                isSelected={formData.serviceId === service.id}
                                onClick={() => handleServiceSelect(service.id)}
                                primary={service.title}
                                secondary={`${service.duration} - $${service.price}`}
                            />
                        ))}
                    </div>
                </>
            )}
            {formData.category && services.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                    No hay servicios disponibles en esta categoría.
                </p>
            )}
            {/* Navigation */}
            <div className="flex justify-end pt-4">
                <Button type="dark" onClick={onNext} disabled={isNextDisabled}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export default ServiceSelectionStep
