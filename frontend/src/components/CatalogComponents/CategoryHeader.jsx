import React from "react"

/**
 * Componente para mostrar el encabezado de la categoría actual
 * @param {string} title - Título de la categoría
 */
function CategoryHeader({ title }) {
    return (
        <div className="flex items-center mb-6">
            <div className="h-1 flex-grow bg-primary/30 rounded-full"></div>
            <h2 className="text-h4 font-heading font-bold text-textMain px-4">
                {title}
            </h2>
            <div className="h-1 flex-grow bg-primary/30 rounded-full"></div>
        </div>
    )
}

export default CategoryHeader
