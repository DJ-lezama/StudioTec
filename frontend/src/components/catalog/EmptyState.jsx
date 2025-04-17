import React from "react"
import { Search, Sparkles } from "lucide-react"

/**
 * Component to display when no services are available or found.
 * Provides context-specific messages based on filters or search.
 * @param {string} category - The currently selected category label (e.g., "Todos", "Cabello").
 * @param {string} searchQuery - The current search term entered by the user.
 */
function EmptyState({ category = "Todos", searchQuery = "" }) {
    let title = "No hay servicios disponibles"
    let message =
        "Aún no hemos añadido servicios a nuestro catálogo. ¡Vuelve pronto!"
    let Icon = Sparkles

    if (searchQuery) {
        title = "No se encontraron resultados"
        message = `No pudimos encontrar servicios que coincidan con "${searchQuery}". Intenta con otras palabras.`
        Icon = Search
    } else if (category !== "Todos") {
        title = `No hay servicios en "${category}"`
        message = `Actualmente no tenemos servicios activos en la categoría "${category}". Puedes revisar otras categorías o contactarnos.`
    }

    return (
        <div className="text-center py-10 px-4 bg-white rounded-xl border border-gray-100 shadow-sm">
            {" "}
            <Icon className="w-12 h-12 text-secondary/70 mx-auto mb-4" />{" "}
            <h3 className="text-h5 font-bold text-textMain mb-2">{title}</h3>
            <p className="text-textMain/70 max-w-md mx-auto text-sm">
                {message}
            </p>{" "}
        </div>
    )
}

export default EmptyState
