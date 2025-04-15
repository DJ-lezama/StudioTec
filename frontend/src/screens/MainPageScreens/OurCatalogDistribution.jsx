import React, { useState } from "react";
import { Scissors, Sparkles, Fingerprint, Eye } from "lucide-react";

// Componente para tarjeta de servicio
function ServiceCard({ title, description, price, duration, imageUrl }) {
    return (
        <div className="bg-primaryLight rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <div className="relative overflow-hidden h-48">
                <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-textMain/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="p-5">
                <h3 className="text-lg font-bold text-textMain mb-1">{title}</h3>

                {duration && (
                    <div className="flex items-center text-body-xs text-textMain/60 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{duration}</span>
                    </div>
                )}

                <p className="text-sm text-textMain/70 mb-4 line-clamp-2">{description}</p>

                <div className="flex justify-between items-center">
                    <span className="text-secondary font-bold">${price} MXN</span>
                    <button className="text-sm bg-textMain text-white rounded-full px-4 py-1.5 hover:bg-secondary transition-colors duration-300">
                        Reservar
                    </button>
                </div>
            </div>
        </div>
    );
}

// Componente para ícono de categoría
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
                    active ? "bg-secondary text-white" : "bg-primary/20 text-textMain"
                }`}
            >
                <Icon className="w-10 h-10" />
            </div>
            <span className="text-lg font-bold">{label}</span>
        </button>
    );
}

// Mock data completa para cada categoría
const catalog = {
    hair: [
        {
            id: "h1",
            title: "Corte de cabello",
            description: "Corte personalizado según la forma de tu rostro y tipo de cabello",
            price: "350",
            duration: "45 min",
            imageUrl: "https://images.unsplash.com/photo-1560869713-7d82c7c64868?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
        },
        {
            id: "h2",
            title: "Peinado",
            description: "Peinados para eventos especiales, bodas y ocasiones importantes",
            price: "450",
            duration: "60 min",
            imageUrl: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1528&q=80"
        },
        {
            id: "h3",
            title: "Coloración",
            description: "Técnicas de color personalizadas para realzar tu belleza natural",
            price: "750",
            duration: "120 min",
            imageUrl: "https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
        },
        {
            id: "h4",
            title: "Tratamiento capilar",
            description: "Tratamientos hidratantes y reparadores para todo tipo de cabello",
            price: "550",
            duration: "45 min",
            imageUrl: "https://images.unsplash.com/photo-1580618864527-0869fced739a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
        },
        {
            id: "h5",
            title: "Lavado y secado",
            description: "Lavado profesional con productos de alta calidad y secado con estilo",
            price: "280",
            duration: "30 min",
            imageUrl: "https://images.unsplash.com/photo-1522336572468-97b06e8ef143?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1176&q=80"
        },
        {
            id: "h6",
            title: "Balayage",
            description: "Técnica de coloración que crea un efecto degradado y natural",
            price: "850",
            duration: "150 min",
            imageUrl: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
        }
    ],
    nails: [
        {
            id: "n1",
            title: "Manicure básico",
            description: "Cuidado completo para tus manos con los mejores productos",
            price: "250",
            duration: "40 min",
            imageUrl: "https://images.unsplash.com/photo-1604902396830-aca29e19b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
        },
        {
            id: "n2",
            title: "Pedicure spa",
            description: "Tratamiento completo para pies cansados o maltratados con exfoliación",
            price: "300",
            duration: "50 min",
            imageUrl: "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "n3",
            title: "Uñas acrílicas",
            description: "Extensiones de uñas acrílicas con diseño personalizado",
            price: "400",
            duration: "90 min",
            imageUrl: "https://images.unsplash.com/photo-1632344499878-a4a24f702944?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "n4",
            title: "Uñas de gel",
            description: "Manicure con esmalte de gel para una duración de hasta 3 semanas",
            price: "350",
            duration: "60 min",
            imageUrl: "https://images.unsplash.com/photo-1607779097040-f06bad5de669?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80"
        },
        {
            id: "n5",
            title: "Nail art",
            description: "Diseños artísticos y decoración detallada para tus uñas",
            price: "150",
            duration: "40 min",
            imageUrl: "https://images.unsplash.com/photo-1631731908417-a8b2ee3c245c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80"
        }
    ],
    eyebrows: [
        {
            id: "e1",
            title: "Depilación de cejas",
            description: "Diseño de cejas con hilo para una forma perfecta",
            price: "180",
            duration: "25 min",
            imageUrl: "https://images.unsplash.com/photo-1594641976175-5d1255afef16?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1287&q=80"
        },
        {
            id: "e2",
            title: "Tinte de cejas",
            description: "Tinte profesional para dar definición y color a tus cejas",
            price: "220",
            duration: "30 min",
            imageUrl: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "e3",
            title: "Laminado de cejas",
            description: "Tratamiento para fijar y dar forma natural a las cejas rebeldes",
            price: "350",
            duration: "45 min",
            imageUrl: "https://images.unsplash.com/photo-1572872202671-dc8bd60080ee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "e4",
            title: "Limpieza facial",
            description: "Tratamiento completo para purificar y revitalizar tu piel",
            price: "480",
            duration: "60 min",
            imageUrl: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "e5",
            title: "Extensiones de pestañas",
            description: "Aplicación profesional de pestañas pelo a pelo para una mirada intensa",
            price: "650",
            duration: "90 min",
            imageUrl: "https://images.unsplash.com/photo-1516914589923-f105f1535f88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        },
        {
            id: "e6",
            title: "Lifting de pestañas",
            description: "Tratamiento que da curvatura y volumen a tus pestañas naturales",
            price: "400",
            duration: "50 min",
            imageUrl: "https://images.unsplash.com/photo-1568653480918-d3a00ed1dacc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
        }
    ]
};

// Componente principal de Catálogo
function CatalogScreen() {
    const [selectedCategory, setSelectedCategory] = useState("hair");
    const [searchQuery, setSearchQuery] = useState("");

    // Configuración de las categorías
    const categoryConfig = {
        hair: { label: "Cabello", icon: Scissors },
        nails: { label: "Uñas", icon: Fingerprint },
        eyebrows: { label: "Cara", icon: Eye }
    };

    // Filtrar servicios basados en la búsqueda
    const filteredServices = catalog[selectedCategory].filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="pt-24 pb-20 px-6 sm:px-8 lg:px-16 bg-white">
            <div className="max-w-6xl mx-auto">
                {/* Encabezado */}
                <div className="text-center mb-8">
                    <h1 className="text-h2 font-heading font-bold text-textMain mb-6">Nuestro catálogo</h1>

                    {/* Íconos de categoría */}
                    <div className="flex justify-center gap-10 flex-wrap mb-8">
                        {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                            <CategoryIcon
                                key={key}
                                label={label}
                                icon={icon}
                                active={selectedCategory === key}
                                onClick={() => setSelectedCategory(key)}
                            />
                        ))}
                    </div>

                    {/* Búsqueda */}
                    <div className="relative max-w-md mx-auto mb-8">
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
                </div>

                {/* Título de la categoría seleccionada */}
                <div className="flex items-center mb-6">
                    <div className="h-1 flex-grow bg-primary/30 rounded-full"></div>
                    <h2 className="text-h4 font-heading font-bold text-textMain px-4">
                        {categoryConfig[selectedCategory].label}
                    </h2>
                    <div className="h-1 flex-grow bg-primary/30 rounded-full"></div>
                </div>

                {/* Servicios de la categoría seleccionada */}
                {filteredServices.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredServices.map(service => (
                            <ServiceCard key={service.id} {...service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-10 bg-primaryLight/50 rounded-xl">
                        <Sparkles className="w-12 h-12 text-secondary/50 mx-auto mb-4" />
                        <h3 className="text-h5 font-bold text-textMain mb-2">No se encontraron servicios</h3>
                        <p className="text-textMain/70 max-w-md mx-auto">
                            No hemos encontrado servicios que coincidan con tu búsqueda.
                            Intenta con otros términos o contacta con nosotros para un servicio personalizado.
                        </p>
                    </div>
                )}

                {/* Sección de promoción */}
                <div className="mt-16 bg-primary/10 rounded-2xl p-8 shadow-sm">
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
            </div>
        </section>
    );
}

export default CatalogScreen;