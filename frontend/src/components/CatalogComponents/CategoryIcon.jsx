import React from "react"

/**
 * Componente para mostrar un ícono de categoría seleccionable
 * @param {string} label - Nombre de la categoría
 * @param {Component} icon - Componente de ícono de Lucide
 * @param {boolean} active - Si la categoría está actualmente seleccionada
 * @param {function} onClick - Función para manejar el clic en la categoría
 */
function CategoryIcon({ label, icon: Icon, active, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center transition-all duration-300 ${
                active ? "text-secondary" : "text-textMain/80"
            }`}
        >
            <div
                className={`w-24 h-24 rounded-full flex items-center justify-center mb-3 transition-all duration-300 ${
                    active
                        ? "bg-secondary text-white"
                        : "bg-primary/20 text-textMain"
                }`}
            >
                <Icon className="w-10 h-10" />
            </div>
            <span className="text-lg font-bold">{label}</span>
        </button>
    )
}

export default CategoryIcon
