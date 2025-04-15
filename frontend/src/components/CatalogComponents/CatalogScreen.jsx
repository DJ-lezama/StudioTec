import React, { useState } from "react";
import { Scissors, Fingerprint, Eye, Sparkles } from "lucide-react";

// Importación de componentes
import ServiceCard from "./ServiceCard";
import CategoryIcon from "./CategoryIcon";
import SearchBar from "./SearchBar";
import EmptyState from "./EmptyState";
import CategoryHeader from "./CategoryHeader";
import PromoSection from "./PromoSection";

// Importación de datos
import catalogData, { categoryConfig as configData } from "./catalogData";

/**
 * Componente principal para la pantalla de catálogo
 */
function CatalogScreen() {
    // Estados
    const [selectedCategory, setSelectedCategory] = useState("hair");
    const [searchQuery, setSearchQuery] = useState("");

    // Mapeo de íconos de Lucide para las categorías
    const iconComponents = {
        Scissors: Scissors,
        Fingerprint: Fingerprint,
        Eye: Eye
    };

    // Configuración de categorías con componentes de íconos
    const categoryConfig = Object.entries(configData).reduce((acc, [key, config]) => {
        return {
            ...acc,
            [key]: {
                ...config,
                icon: iconComponents[config.icon]
            }
        };
    }, {});

    // Filtrar servicios basados en la búsqueda
    const filteredServices = catalogData[selectedCategory]
        ? catalogData[selectedCategory].filter(service =>
            service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : [];

    return (
        <section className="pt-24 pb-20 px-6 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado del catálogo */}
                <div className="text-center mb-8">
                    <h1 className="text-h2 font-heading font-bold text-textMain mb-6">Nuestro catálogo</h1>

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
                <CategoryHeader title={categoryConfig[selectedCategory]?.label} />

                {/* Lista de servicios o estado vacío */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map(service => (
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
    );
}

export default CatalogScreen;