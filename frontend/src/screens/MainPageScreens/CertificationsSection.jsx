import React, { useState } from 'react';
// Importa las imágenes de las certificaciones
import certLoreal from '../../assets/loreal.png';
import certRedken from '../../assets/loreal.png';
import certWella from '../../assets/loreal.png';
import certOPI from '../../assets/loreal.png';

const CertificationsSection = () => {
    // Estado para controlar la certificación actualmente seleccionada
    const [activeIndex, setActiveIndex] = useState(0);

    const certificaciones = [
        {
            id: 1,
            nombre: "L'Oréal Professional",
            imagen: certLoreal,
            descripcion: "Certificación en colorimetría y técnicas avanzadas de coloración"
        },
        {
            id: 2,
            nombre: "Redken",
            imagen: certRedken,
            descripcion: "Especialización en cortes de precisión y diseño de textura"
        },
        {
            id: 3,
            nombre: "Wella Professionals",
            imagen: certWella,
            descripcion: "Certificadas en transformación capilar y tratamientos reparadores"
        },
        {
            id: 4,
            nombre: "OPI Professional",
            imagen: certOPI,
            descripcion: "Manicura de gel y técnicas artísticas para uñas"
        }
    ];

    // Función para mover al elemento anterior
    const prevSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === 0 ? certificaciones.length - 1 : prevIndex - 1
        );
    };

    // Función para mover al elemento siguiente
    const nextSlide = () => {
        setActiveIndex((prevIndex) =>
            prevIndex === certificaciones.length - 1 ? 0 : prevIndex + 1
        );
    };

    return (
        <section className="w-full relative py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Encabezado */}
                <div className="text-center mb-16">
                    <h2 className="text-h2 font-bold text-[#60182D] mb-6">Certificaciones que nos avalan</h2>
                    <p className="text-xl text-[#3B0A20] max-w-3xl mx-auto">
                        Nuestro compromiso con la excelencia se refleja en la formación continua de nuestro equipo y
                        las certificaciones que garantizan la calidad de nuestros servicios.
                    </p>
                </div>

                {/* Contenedor de carrusel de certificaciones */}
                <div className="bg-white rounded-[40px] shadow-xl overflow-hidden">
                    {/* Barra superior decorativa */}
                    <div className="h-3 bg-gradient-to-r from-[#FAD4E3] via-[#60182D] to-[#3B0A20]"></div>

                    <div className="p-8 sm:p-12 relative">
                        {/* Botones de navegación */}
                        <button
                            onClick={prevSlide}
                            className="absolute left-4 sm:left-8 top-1/2 transform -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg text-[#60182D] hover:bg-[#FAD4E3] transition-colors"
                            aria-label="Anterior certificación"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextSlide}
                            className="absolute right-4 sm:right-8 top-1/2 transform -translate-y-1/2 z-20 bg-white p-3 rounded-full shadow-lg text-[#60182D] hover:bg-[#FAD4E3] transition-colors"
                            aria-label="Siguiente certificación"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                        {/* Contenedor del carrusel de 3 elementos */}
                        <div className="flex justify-center items-center py-8">
                            <div className="relative w-full max-w-5xl h-[350px]">
                                {certificaciones.map((cert, index) => {
                                    // Calcular la posición relativa para mostrar 3 items
                                    let position = index - activeIndex;

                                    // Para efecto circular, ajustar posiciones extremas
                                    if (position < -1) {
                                        position += certificaciones.length;
                                    } else if (position > 1) {
                                        position -= certificaciones.length;
                                    }

                                    // Configurar la posición y apariencia basado en la posición relativa
                                    let translateX = 0;
                                    let scale = 0.8;
                                    let zIndex = 0;
                                    let opacity = 0.6;

                                    if (position === -1) {
                                        translateX = '-30%';
                                    } else if (position === 0) {
                                        scale = 1;
                                        zIndex = 10;
                                        opacity = 1;
                                    } else if (position === 1) {
                                        translateX = '30%';
                                    } else {
                                        return null;
                                    }

                                    return (
                                        <div
                                            key={cert.id}
                                            className="absolute top-0 left-0 right-0 h-full flex justify-center items-center transition-all duration-500 ease-in-out cursor-pointer"
                                            style={{
                                                transform: `translateX(${translateX}) scale(${scale})`,
                                                zIndex: zIndex,
                                                opacity: opacity
                                            }}
                                            onClick={() => position !== 0 && setActiveIndex(index)}
                                        >
                                            <div className={`bg-gray-50 rounded-2xl overflow-hidden shadow-md w-[280px] h-full
                                                ${position === 0 ? 'shadow-lg border-2' : ''}`}>
                                                <div className="p-6 flex flex-col items-center justify-between h-full">
                                                    <div className="w-28 h-28 mb-4 flex items-center justify-center p-4 bg-white rounded-full shadow-inner">
                                                        <img
                                                            src={cert.imagen}
                                                            alt={`Certificación ${cert.nombre}`}
                                                            className="max-w-full max-h-full object-contain"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-[#3B0A20] mb-3 text-center">{cert.nombre}</h3>
                                                        <p className="text-gray-600 text-center">{cert.descripcion}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Indicadores de posición */}
                        <div className="flex justify-center mt-4 gap-3">
                            {certificaciones.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`h-3 rounded-full transition-all duration-300 ${
                                        activeIndex === index
                                            ? 'bg-[#60182D] w-10'
                                            : 'bg-[#FAD4E3] w-3 hover:bg-pink-300'
                                    }`}
                                    aria-label={`Ir a certificación ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CertificationsSection;