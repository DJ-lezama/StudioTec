import React, { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import { AlertTriangle, Eye, Hand, List, Loader2, Scissors } from "lucide-react"
import ServiceCard from "../../components/catalog/ServiceCard.jsx"
import CategoryIcon from "../../components/catalog/CategoryIcon"
import SearchBar from "../../components/catalog/SearchBar"
import EmptyState from "../../components/catalog/EmptyState"
import CategoryHeader from "../../components/catalog/CategoryHeader"
import PromoSection from "../../components/catalog/PromoSection"
import { useServices } from "../../features/services/hooks/useServices.js"

const categoryConfig = {
    hair: { key: "hair", label: "Cabello", icon: Scissors },
    nails: { key: "nails", label: "Uñas", icon: Hand },
    face: { key: "face", label: "Cara", icon: Eye },
}
const allCategoryOptions = [
    { key: "todos", label: "Todos", icon: List },
    ...Object.values(categoryConfig),
]

/**
 * Main element for the Catalog screen.
 * Fetches and displays active services using the useServices hook.
 */
function CatalogScreen() {
    const location = useLocation()
    const { services: allServices, isLoading: loading, error } = useServices()

    const [selectedCategoryLabel, setSelectedCategoryLabel] = useState("Todos")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const categoriaKey = params.get("categoria")
        const targetCategory = Object.values(categoryConfig).find(
            (cat) => cat.key === categoriaKey,
        )

        if (targetCategory) {
            setSelectedCategoryLabel(targetCategory.label)
        } else {
            setSelectedCategoryLabel("Todos")
        }
    }, [location.search])

    const filteredServices = useMemo(() => {
        return allServices
            .filter((service) => service.isActive === true)
            .filter((service) => {
                return (
                    selectedCategoryLabel === "Todos" ||
                    service.category === selectedCategoryLabel
                )
            })
            .filter((service) => {
                const nameMatch =
                    service.name
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ?? false
                const descriptionMatch =
                    service.description
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ?? false
                return nameMatch || descriptionMatch
            })
    }, [allServices, selectedCategoryLabel, searchQuery])

    return (
        <section className="pt-20 pb-20 px-6 sm:px-8 lg:px-16 bg-primaryLight min-h-screen">
            <div className="max-w-6xl mx-auto">
                {/* Catalog Header */}
                <div id="catalog-services" className="text-center mb-12 pt-6">
                    <h1 className="text-h2 font-heading font-bold text-textMain mb-6">
                        Nuestro catálogo
                    </h1>

                    {/* Category Icons */}
                    <div className="flex justify-center gap-6 md:gap-10 flex-wrap mb-8">
                        {allCategoryOptions.map((catOption) => (
                            <CategoryIcon
                                key={catOption.key}
                                label={catOption.label}
                                icon={catOption.icon}
                                active={
                                    selectedCategoryLabel === catOption.label
                                }
                                onClick={() =>
                                    setSelectedCategoryLabel(catOption.label)
                                }
                            />
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="mb-8 max-w-xl mx-auto">
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            placeholder="Buscar servicios..."
                        />
                    </div>
                </div>

                {/* Dynamic Category Header */}
                <CategoryHeader
                    title={
                        selectedCategoryLabel === "Todos"
                            ? "Todos los servicios"
                            : selectedCategoryLabel
                    }
                />

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center p-10 text-center">
                        <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                        <span className="text-gray-600">
                            Cargando servicios...
                        </span>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 mr-2" />
                        <span>{error.message}</span>
                    </div>
                )}

                {/* Service List or Empty State */}
                {!loading &&
                    !error &&
                    (filteredServices.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredServices.map((service) => (
                                <ServiceCard
                                    key={service.serviceID}
                                    title={service.name}
                                    description={service.description}
                                    price={service.basePrice}
                                    duration={`${service.duration} min`}
                                    imageUrl={service.imageUrl}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyState
                            category={selectedCategoryLabel}
                            searchQuery={searchQuery}
                        />
                    ))}

                {/* Promotional Section */}
                {!loading && (
                    <div className="mt-16">
                        <PromoSection />
                    </div>
                )}
            </div>
        </section>
    )
}

export default CatalogScreen
