import React from "react";
import ReviewsCarousel from "../components/ReviewsVisualizer/ReviewsCarousel.jsx";

const reviews = [
    {
        id: 1,
        image: "/reviews/camila.jpg",
        name: "Camila Carter",
        review:
            "Excelente servicio, me encanta la atención que te dan. ¡Justo el corte que quería!",
        icon: "scissors",
        rating: 5,
    },
    {
        id: 2,
        image: "/reviews/sophie.jpg",
        name: "Sophie Moore",
        review:
            "¡Súper! Me hicieron un peinado rapidísimo y llegué a mi evento a tiempo",
        icon: "brush",
        rating: 5,
    },
    {
        id: 3,
        image: "/reviews/maria.jpg",
        name: "María González",
        review:
            "Siempre una increíble experiencia en este salón. Súper contenta con mi corte!",
        icon: "scissors",
        rating: 5,
    },
    {
        id: 4,
        image: "/reviews/maria.jpg",
        name: "María González",
        review:
            "Siempre una increíble experiencia en este salón. Súper contenta con mi corte!",
        icon: "scissors",
        rating: 5,
    },
    {
        id: 5,
        image: "/reviews/maria.jpg",
        name: "María González",
        review:
            "Siempre una increíble experiencia en este salón. Súper contenta con mi corte!",
        icon: "scissors",
        rating: 5,
    },
    {
        id: 6,
        image: "/reviews/maria.jpg",
        name: "María González",
        review:
            "Siempre una increíble experiencia en este salón. Súper contenta con mi corte!",
        icon: "scissors",
        rating: 5,
    },
    {
        id: 7,
        image: "/reviews/maria.jpg",
        name: "María González",
        review:
            "Siempre una increíble experiencia en este salón. Súper contenta con mi corte!",
        icon: "scissors",
        rating: 5,
    },
];

function ReviewsSection() {
    return (
        <section className="w-full py-20 px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                <h2 className="text-h2 text-textMain font-heading font-bold text-center">
                    Lo que opinan nuestras clientas
                </h2>

                <ReviewsCarousel reviews={reviews} />

                <div className="flex justify-center mt-1">
                    <button className="bg-relevantButton text-white px-6 py-3 rounded-full text-button-m font-medium hover:brightness-110 transition duration-300">
                        Escribe tu reseña
                    </button>
                </div>
            </div>
        </section>
    );
}

export default ReviewsSection;
