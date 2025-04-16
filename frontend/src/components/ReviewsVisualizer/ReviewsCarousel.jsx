// src/components/ReviewsVisualizer/ReviewsCarousel.jsx
import React, { useState, useRef } from "react";
import ReviewCard from "./ReviewCard";
import { Scissors, Brush, Eye, ChevronLeft, ChevronRight } from "lucide-react";

const iconMap = {
    scissors: Scissors, // Corte y peinado
    brush: Brush,      // Uñas y manicure
    eyebrow: Eye       // Cejas y pestañas
};

function ReviewsCarousel({ reviews }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const cardsPerView = window.innerWidth < 768 ? 1 : 3; // Responsive: 1 card en móvil, 3 en desktop
    const maxIndex = Math.max(0, reviews.length - cardsPerView);
    const carouselRef = useRef(null);

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    const goToPage = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 bg-white rounded-full p-2 shadow-md focus:outline-none ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                aria-label="Ver reseña anterior"
            >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            </button>

            {/* Cards Container - Responsive para móviles */}
            <div className="overflow-hidden py-4 px-2">
                <div
                    ref={carouselRef}
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / cardsPerView)}%)` }}
                >
                    {reviews.map((review) => {
                        const IconComponent = iconMap[review.icon] || iconMap.scissors; // Fallback a tijeras si no hay ícono
                        return (
                            <div key={review.id} className="w-full md:w-1/3 px-2 sm:px-4 flex-shrink-0">
                                <ReviewCard
                                    {...review}
                                    icon={IconComponent}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-7 z-10 bg-white rounded-full p-2 shadow-md focus:outline-none ${
                    currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                aria-label="Ver siguiente reseña"
            >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-pink-500" />
            </button>

            {/* Indicator Dots - Más prominentes y accesibles */}
            <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToPage(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            currentIndex === index
                                ? 'bg-secondary scale-110'
                                : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                        aria-label={`Ir a página ${index + 1} de reseñas`}
                        aria-current={currentIndex === index ? "true" : "false"}
                    />
                ))}
            </div>
        </div>
    );
}

export default ReviewsCarousel;