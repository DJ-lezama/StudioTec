import React, { useState } from "react"
import ReviewsCarousel from "../../components/reviews/ReviewsCarousel.jsx"
import ReviewForm from "./ReviewForm.jsx"
import Button from "../../components/common/Button.jsx"
import { Plus } from "lucide-react"

const ReviewsSection = () => {
    const [isReviewFormOpen, setIsReviewFormOpen] = useState(false)
    const [reviews, setReviews] = useState([
        {
            id: 1,
            image: "/reviews/camila.jpg",
            name: "Camila Carter",
            review: "Excelente servicio, me encanta la atención que te dan. ¡Justo el corte que quería! El ambiente es muy agradable.",
            icon: "scissors",
            rating: 5,
        },
        {
            id: 2,
            image: "/reviews/sophie.jpg",
            name: "Sophie Moore",
            review: "¡Súper! Me hicieron un peinado rapidísimo y llegué a mi evento a tiempo. El personal es muy profesional.",
            icon: "brush",
            rating: 5,
        },
        {
            id: 3,
            image: "/reviews/maria.jpg",
            name: "María González",
            review: "Siempre una increíble experiencia en este salón. Súper contenta con mi corte. Seguiré viniendo sin duda.",
            icon: "scissors",
            rating: 5,
        },
        {
            id: 4,
            image: "/reviews/valentina.jpg",
            name: "Valentina Martínez",
            review: "El ambiente es súper lindo y el trato increíble. Lo recomiendo totalmente para cualquier servicio de belleza.",
            icon: "brush",
            rating: 5,
        },
        {
            id: 5,
            image: "/reviews/lucia.jpg",
            name: "Lucía Rodríguez",
            review: "Quedé encantada con el resultado. El personal es muy profesional y atento. El precio es justo para la calidad.",
            icon: "brush",
            rating: 4,
        },
        {
            id: 6,
            image: "/reviews/ana.jpg",
            name: "Ana Gómez",
            review: "Me encantó el servicio personalizado y el resultado final. Los productos que usan son de excelente calidad.",
            icon: "eyebrow",
            rating: 5,
        },
        {
            id: 7,
            image: "/reviews/isabel.jpg",
            name: "Isabel Torres",
            review: "Excelente técnica y productos de primera calidad. La atención desde que llegas hasta que sales es impecable.",
            icon: "scissors",
            rating: 5,
        },
    ])

    const openReviewForm = () => setIsReviewFormOpen(true)
    const closeReviewForm = () => setIsReviewFormOpen(false)

    const handleSubmitReview = (newReview) => {
        setReviews((prev) => [newReview, ...prev])
    }

    return (
        <section className="w-full py-20 px-6 sm:px-10 md:px-16 lg:px-24">
            <div className="max-w-7xl mx-auto flex flex-col gap-10">
                <div className="text-center">
                    <h2 className="text-h2 text-textMain font-heading font-bold mb-3">
                        Lo que opinan nuestras clientas
                    </h2>
                    <p className="text-body-l text-textMain/80 max-w-3xl mx-auto">
                        Nos enorgullece brindar experiencias memorables. Conoce
                        lo que nuestras clientas dicen sobre nosotros.
                    </p>
                </div>

                <ReviewsCarousel reviews={reviews} />

                <div className="flex justify-center mt-6">
                    <Button
                        type="cta"
                        icon={<Plus size={18} />}
                        iconPosition="left"
                        onClick={openReviewForm}
                        className="px-6 py-3 font-medium"
                    >
                        Escribe tu reseña
                    </Button>
                </div>
            </div>

            {/* Modal de formulario de reseñas */}
            <ReviewForm
                isOpen={isReviewFormOpen}
                onClose={closeReviewForm}
                onSubmit={handleSubmitReview}
            />
        </section>
    )
}

export default ReviewsSection
