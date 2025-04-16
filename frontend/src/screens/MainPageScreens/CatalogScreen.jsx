import React, { useState } from "react"
import { Scissors, Hand, Eye } from "lucide-react"
import ServiceCard from "../../components/CatalogComponents/ServiceCard.jsx"
import CategoryIcon from "../../components/CatalogComponents/CategoryIcon"
import SearchBar from "../../components/CatalogComponents/SearchBar"
import EmptyState from "../../components/CatalogComponents/EmptyState"
import CategoryHeader from "../../components/CatalogComponents/CategoryHeader"
import PromoSection from "../../components/CatalogComponents/PromoSection"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import catalogData, {
    categoryConfig as configData,
} from "../../components/CatalogComponents/catalogData.js"

/**
 * Componente principal para la pantalla de catálogo
 */
function CatalogScreen() {
    const location = useLocation()

    // Mapeo de íconos de Lucide para las categorías
    const iconComponents = {
        Scissors: Scissors,
        Hand: Hand,
        Eye: Eye,
    }

    // Configuración de categorías con componentes de íconos
    const categoryConfig = Object.entries(configData).reduce(
        (acc, [key, config]) => {
            return {
                ...acc,
                [key]: {
                    ...config,
                    icon: iconComponents[config.icon],
                },
            }
        },
        {},
    )

    const [selectedCategory, setSelectedCategory] = useState("hair")
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const categoria = params.get("categoria")

        if (categoria && categoryConfig[categoria]) {
            setSelectedCategory(categoria)
            const header = document.getElementById("catalog-services")
            if (header) header.scrollIntoView({ behavior: "smooth" })
        }
    }, [location.search])

    // Filtrar servicios basados en la búsqueda
    const filteredServices = catalogData[selectedCategory]
        ? catalogData[selectedCategory].filter(
              (service) =>
                  service.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                  service.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()),
          )
        : []

    return (
        <section className="pt-24 pb-20 px-6 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado del catálogo */}
                <div id="catalog-services" className="text-center mb-8">
                    <h1 className="text-h2 font-heading font-bold text-textMain mb-6">
                        Nuestro catálogo
                    </h1>

                    {/* Íconos de categoría */}
                    <div className="flex justify-center gap-10 flex-wrap mb-8">
                        {Object.entries(categoryConfig).map(([key, config]) => (
                            <CategoryIcon
                                key={key}
                                label={config.label}
                                icon={config.icon}
                                active={selectedCategory === key}
                                onClick={() => setSelectedCategory(key)}
                            />
                        ))}
                    </div>

                    {/* Barra de búsqueda */}
                    <div className="mb-8">
                        <SearchBar
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                        />
                    </div>
                </div>

                {/* Encabezado de la categoría seleccionada */}
                <CategoryHeader
                    title={categoryConfig[selectedCategory]?.label}
                />

                {/* Lista de servicios o estado vacío */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map((service) => (
                            <ServiceCard key={service.id} {...service} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}

                {/* Sección promocional */}
                <div className="mt-16">
                    <PromoSection />
                </div>
            </div>
        </section>
    )
}

export default CatalogScreen
