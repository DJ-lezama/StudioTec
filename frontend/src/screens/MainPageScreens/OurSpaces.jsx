import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import instalacion1 from '../../assets/Instalaciones1.png';
import instalacion2 from '../../assets/Instalaciones2.png';
import instalacion3 from '../../assets/Instalaciones3.png';

const OurSpaces = () => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);

    const instalaciones = [
        {
            id: 1,
            imagen: instalacion1,
            titulo: "Área de corte",
            descripcion: "Espacio amplio y elegante para nuestros servicios de corte y peinado, diseñado para brindarte máxima comodidad mientras te transformamos."
        },
        {
            id: 2,
            imagen: instalacion2,
            titulo: "Zona de lavado",
            descripcion: "Sillones ergonómicos para una experiencia relajante durante el lavado. Disfruta de un masaje capilar mientras cuidan de tu cabello."
        },
        {
            id: 3,
            imagen: instalacion3,
            titulo: "Estación de manicure",
            descripcion: "Diseñada para brindarte la máxima comodidad durante tu servicio, con los mejores productos y atención personalizada."
        }
        // Puedes agregar más instalaciones aquí y el componente las manejará automáticamente
    ];

    // Características que ofrecen las instalaciones (aparecerán en el carrusel)
    const caracteristicas = [
        {
            icono: "check",
            titulo: "Comodidad",
            descripcion: "Espacios ergonómicos para tu máximo confort"
        },
        {
            icono: "plus",
            titulo: "Tecnología",
            descripcion: "Equipamiento de última generación"
        },
        {
            icono: "smile",
            titulo: "Ambiente",
            descripcion: "Espacio acogedor y relajante"
        }
    ];

    useEffect(() => {
        let interval;
        if (autoplay && !isModalOpen) {
            interval = setInterval(() => {
                setSelectedImage((prev) => (prev + 1) % instalaciones.length);
            }, 8000);
        }
        return () => clearInterval(interval);
    }, [autoplay, isModalOpen, instalaciones.length]);

    // Función para ir a la siguiente imagen
    const nextImage = () => {
        setSelectedImage((prev) => (prev + 1) % instalaciones.length);
    };

    // Función para ir a la imagen anterior
    const prevImage = () => {
        setSelectedImage((prev) => (prev - 1 + instalaciones.length) % instalaciones.length);
    };

    // Función para abrir el lightbox
    const openLightbox = (index) => {
        setLightboxIndex(index);
        setIsModalOpen(true);
        setAutoplay(false);
    };

    // Función para cerrar el lightbox
    const closeLightbox = () => {
        setIsModalOpen(false);
        setTimeout(() => setAutoplay(true), 1000);
    };

    // Renderiza el icono apropiado basado en el tipo
    const renderIcon = (iconType) => {
        switch (iconType) {
            case 'check':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                );
            case 'plus':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                );
            case 'smile':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    return (
        <section className="w-full bg-gradient-to-b  overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Encabezado elegante con animación sutil */}
                <div className="text-center mb-16">
                    <h2 className="text-h2 font-bold text-textMain mb-6 relative inline-block">
                        Nuestras instalaciones
                    </h2>
                    <p className="text-xl text-textMain max-w-3xl mx-auto mt-6">
                        Conoce los espacios que hemos diseñado pensando en tu comodidad y en ofrecerte la mejor experiencia.
                    </p>
                </div>

                {/* Carrusel principal con detalles */}
                <div className="relative mb-16 rounded-3xl overflow-hidden shadow-2xl">
                    {/* Capa para el autoplay indicator */}
                    {autoplay && (
                        <div className="absolute top-5 right-5 z-10">
                            <span className="flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary"></span>
                            </span>
                        </div>
                    )}

                    {/* Controles de navegación */}
                    <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                        aria-label="Imagen anterior"
                    >
                        <ChevronLeft size={24} />
                    </button>

                    <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-2 shadow-md text-secondary hover:bg-secondary hover:text-white transition-all duration-300"
                        aria-label="Siguiente imagen"
                    >
                        <ChevronRight size={24} />
                    </button>

                    {/* Contenedor de imágenes con transición */}
                    <div className="relative h-[70vh] max-h-[700px] w-full overflow-hidden">
                        {instalaciones.map((item, index) => (
                            <div
                                key={item.id}
                                className={`absolute inset-0 transition-opacity duration-1000 ${
                                    selectedImage === index ? 'opacity-100 z-20' : 'opacity-0 z-10'
                                }`}
                                onClick={() => openLightbox(index)}
                            >
                                <img
                                    src={item.imagen}
                                    alt={item.titulo}
                                    className="w-full h-full object-cover cursor-pointer"
                                />

                                {/* Información de lo que ofrecen */}
                                <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs text-textMain transition-transform duration-500 transform hover:scale-105">
                                    <div className="flex items-center mb-2">
                                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center mr-3 text-secondary">
                                            {renderIcon(caracteristicas[index % caracteristicas.length].icono)}
                                        </div>
                                        <h4 className="text-lg font-semibold">{caracteristicas[index % caracteristicas.length].titulo}</h4>
                                    </div>
                                    <p className="text-sm">{caracteristicas[index % caracteristicas.length].descripcion}</p>
                                </div>

                                {/* Información de la instalación (parte inferior) */}
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-8 text-white transform transition-transform duration-700">
                                    <h3 className="text-3xl font-bold mb-3">{item.titulo}</h3>
                                    <p className="text-white/90 text-lg max-w-2xl">{item.descripcion}</p>
                                    <button
                                        className="mt-4 px-6 py-2 bg-secondary text-white rounded-full hover:bg-primary hover:text-textMain transition-colors duration-300 flex items-center"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            openLightbox(index);
                                        }}
                                    >
                                        Ver más
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>

                            </div>
                        ))}
                    </div>

                    {/* Indicadores de navegación */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30 flex-wrap px-4">
                        {instalaciones.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    selectedImage === index
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                                aria-label={`Ir a la imagen ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

            </div>

            {/* Modal de lightbox para vista ampliada */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 transition-opacity duration-300">
                    <button
                        className="absolute top-6 right-6 text-white hover:text-primary transition-colors duration-300"
                        onClick={closeLightbox}
                    >
                        <X size={32} />
                    </button>

                    <button
                        className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white hover:text-primary transition-colors duration-300"
                        onClick={() => setLightboxIndex((prev) => (prev - 1 + instalaciones.length) % instalaciones.length)}
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <img
                        src={instalaciones[lightboxIndex].imagen}
                        alt={instalaciones[lightboxIndex].titulo}
                        className="max-h-[85vh] max-w-[85vw] object-contain"
                    />

                    <button
                        className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white hover:text-primary transition-colors duration-300"
                        onClick={() => setLightboxIndex((prev) => (prev + 1) % instalaciones.length)}
                    >
                        <ChevronRight size={40} />
                    </button>

                    <div className="absolute bottom-8 left-0 right-0 text-center text-white">
                        <h3 className="text-2xl font-bold mb-2">{instalaciones[lightboxIndex].titulo}</h3>
                        <p className="max-w-2xl mx-auto text-white/80">{instalaciones[lightboxIndex].descripcion}</p>
                    </div>

                    {/* Indicadores de navegación en el lightbox */}
                    <div className="absolute bottom-4 left-0 right-0 flex justify-center flex-wrap gap-2 px-8">
                        {instalaciones.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setLightboxIndex(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                    lightboxIndex === index
                                        ? 'bg-white scale-125'
                                        : 'bg-white/50 hover:bg-white/70'
                                }`}
                                aria-label={`Ir a la imagen ${index + 1} en el lightbox`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default OurSpaces;