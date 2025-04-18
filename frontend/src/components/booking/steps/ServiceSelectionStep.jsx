import React, { useMemo } from "react"
import SelectionCard from "../SelectionCard"
import Button from "../../../components/common/Button"
import { useServices } from "../../../features/services/hooks/useServices.js"
import { AlertTriangle, Eye, Hand, Loader2, Scissors } from "lucide-react"

const categoryConfig = {
    hair: { key: "hair", label: "Cabello", icon: Scissors },
    nails: { key: "nails", label: "Uñas", icon: Hand },
    face: { key: "face", label: "Cara", icon: Eye },
}

const ServiceSelectionStep = ({ formData, onFormUpdate, onNext }) => {
    const {
        services: allServices,
        isLoading: isLoadingServices,
        error: servicesError,
    } = useServices()

    const servicesGroupedByCategory = useMemo(() => {
        if (isLoadingServices || servicesError || !allServices) {
            return {}
        }
        return allServices
            .filter((service) => service.isActive === true)
            .reduce((acc, service) => {
                const category = service.category || "Otros"
                if (!acc[category]) {
                    acc[category] = []
                }
                acc[category].push(service)
                return acc
            }, {})
    }, [allServices, isLoadingServices, servicesError])

    const availableCategories = useMemo(() => {
        return Object.keys(servicesGroupedByCategory)
            .map(
                (label) =>
                    categoryConfig[label] || { key: label, label: label },
            )
            .sort((a, b) => a.label.localeCompare(b.label))
    }, [servicesGroupedByCategory])

    const servicesForSelectedCategory =
        servicesGroupedByCategory[formData.category] || []

    const handleCategorySelect = (categoryLabel) => {
        onFormUpdate({ ...formData, category: categoryLabel, serviceId: "" })
    }

    const handleServiceSelect = (serviceId) => {
        onFormUpdate({ ...formData, serviceId })
    }

    const isNextDisabled = !formData.serviceId

    if (isLoadingServices) {
        return (
            <div className="flex justify-center items-center p-10 text-gray-600">
                <Loader2 className="w-6 h-6 text-secondary animate-spin mr-2" />
                <span>Cargando servicios...</span>
            </div>
        )
    }

    if (servicesError) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>
                    {servicesError.message || "Error al cargar servicios."}
                </span>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                ¿Qué servicio deseas reservar?
            </h2>

            {/* Category Selection */}
            {availableCategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {availableCategories.map((config) => (
                        <SelectionCard
                            key={config.key}
                            isSelected={formData.category === config.label}
                            onClick={() => handleCategorySelect(config.label)}
                            primary={config.label}
                        />
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500 mt-4">
                    No hay categorías de servicios disponibles en este momento.
                </p>
            )}

            {formData.category && servicesForSelectedCategory.length > 0 && (
                <>
                    <hr className="my-6 border-t border-gray-200" />
                    <h3 className="text-h4 font-heading font-semibold text-textMain">
                        Elige el servicio específico
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {servicesForSelectedCategory.map((service) => (
                            <SelectionCard
                                key={service.serviceID}
                                isSelected={
                                    formData.serviceId === service.serviceID
                                }
                                onClick={() =>
                                    handleServiceSelect(service.serviceID)
                                }
                                primary={service.name}
                                secondary={`${service.duration} min - $${
                                    service.basePrice?.toFixed(2) ?? "N/A"
                                }`}
                            />
                        ))}
                    </div>
                </>
            )}

            {formData.category && servicesForSelectedCategory.length === 0 && (
                <p className="text-center text-gray-500 mt-4">
                    No hay servicios activos disponibles en la categoría "
                    {formData.category}".
                </p>
            )}

            {/* Navigation */}
            <div className="flex justify-end pt-4 border-t border-gray-200 mt-6">
                <Button type="dark" onClick={onNext} disabled={isNextDisabled}>
                    Continuar
                </Button>
            </div>
        </div>
    )
}

export default ServiceSelectionStep
