import React from "react";
import { Sparkles } from "lucide-react";

/**
 * Componente para mostrar cuando no hay servicios disponibles o no se encuentran resultados
 * @param {string} title - Título del estado vacío
 * @param {string} message - Mensaje descriptivo
 */
function EmptyState({ title = "No se encontraron servicios", message = "No hemos encontrado servicios que coincidan con tu búsqueda. Intenta con otros términos o contacta con nosotros para un servicio personalizado." }) {
    return (
        <div className="text-center py-10 bg-primaryLight/50 rounded-xl">
            <Sparkles className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
            <h3 className="text-h5 font-bold text-textMain mb-2">{title}</h3>
            <p className="text-textMain/70 max-w-md mx-auto">
                {message}
            </p>
        </div>
    );
}

export default EmptyState;