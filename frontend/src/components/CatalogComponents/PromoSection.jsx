import React from "react";

/**
 * Componente para la sección promocional al final del catálogo
 */
function PromoSection() {
    return (
        <div className="bg-primary/10 rounded-2xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-left mb-6 md:mb-0 md:pr-6">
                    <h3 className="text-h4 font-heading font-bold text-textMain mb-2">¿Buscas algo especial?</h3>
                    <p className="text-textMain/70 max-w-xl">
                        Ofrecemos servicios personalizados adaptados a tus necesidades específicas.
                        Contáctanos para discutir tratamientos especiales o solicitar un presupuesto personalizado.
                    </p>
                </div>
                <button className="bg-secondary hover:bg-secondary/90 text-white px-6 py-3 rounded-full transition-colors duration-300 whitespace-nowrap flex items-center">
                    <span className="mr-2">Consulta personalizada</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default PromoSection;