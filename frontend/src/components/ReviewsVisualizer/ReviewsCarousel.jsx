// src/components/ReviewsVisualizer/ReviewsCarousel.jsx
import React, { useState, useRef } from "react";
import ReviewCard from "./ReviewCard";
import { Scissors, Brush, ChevronLeft, ChevronRight } from "lucide-react";

const iconMap = {
    scissors: Scissors,
    brush: Brush,
};

function ReviewsCarousel({ reviews }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const maxIndex = Math.max(0, reviews.length - 3);
    const carouselRef = useRef(null);

    const handlePrevious = () => {
        setCurrentIndex(prev => Math.max(0, prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prev => Math.min(maxIndex, prev + 1));
    };

    return (
        <div className="relative">
            {/* Navigation Buttons */}
            <button
                onClick={handlePrevious}
                disabled={currentIndex === 0}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 z-10 bg-white rounded-full p-2 shadow-md focus:outline-none ${
                    currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                aria-label="Ver reseña anterior"
            >
                <ChevronLeft className="w-6 h-6 text-pink-500" />
            </button>

            {/* Cards Container */}
            <div className="overflow-hidden py-4 px-2">
                <div
                    ref={carouselRef}
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
                >
                    {reviews.map((review) => {
                        const IconComponent = iconMap[review.icon];
                        return (
                            <div key={review.id} className="w-1/3 px-4 flex-shrink-0">
                                <ReviewCard {...review} icon={IconComponent} />
                            </div>
                        );
                    })}
                </div>
            </div>

            <button
                onClick={handleNext}
                disabled={currentIndex >= maxIndex}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-7 z-10 bg-white rounded-full p-2 shadow-md focus:outline-none ${
                    currentIndex >= maxIndex ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                }`}
                aria-label="Ver siguiente reseña"
            >
                <ChevronRight className="w-6 h-6 text-pink-500" />
            </button>

            {/* Indicator Dots */}
            <div className="flex justify-center space-x-2 mt-6">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full ${
                            currentIndex === index ? 'bg-pink-500' : 'bg-gray-300'
                        }`}
                        aria-label={`Ir a página ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ReviewsCarousel;