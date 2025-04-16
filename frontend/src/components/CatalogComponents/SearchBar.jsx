import React from "react";

/**
 * Componente de barra de búsqueda para filtrar servicios
 * @param {string} searchQuery - Valor actual de la búsqueda
 * @param {function} setSearchQuery - Función para actualizar el valor de búsqueda
 */
function SearchBar({ searchQuery, setSearchQuery }) {
    return (
        <div className="relative max-w-md mx-auto">
            <input
                type="text"
                placeholder="Buscar servicios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
            </div>
        </div>
    );
}

export default SearchBar;