// src/screens/StylistScreens/ManageReviewsScreen.jsx
import React, { useState } from "react"
import SelectableReviewCard from "../../components/ReviewsVisualizer/SelectableReviewCard"
import Button from "../../components/common/Button"
import { useNavigate } from "react-router-dom"

const allReviewsMock = [
    {
        id: 1,
        name: "María Treviño",
        review: "Excelente servicio, me encanta la atención que te dan",
        icon: "scissors",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
        id: 2,
        name: "Grecia González",
        review: "¡Súper! Me hicieron un peinado rapidísimo y llegué a mi evento a tiempo",
        icon: "brush",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
        id: 3,
        name: "Fernanda López",
        review: "Quedé encantada con el resultado, sin duda volveré",
        icon: "scissors",
        rating: 4,
        image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
        id: 4,
        name: "Valentina Martínez",
        review: "El ambiente es súper lindo y el trato increíble",
        icon: "brush",
        rating: 5,
        image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
]

// Configurar valores predeterminados para las props
const ManageReviewsScreen = ({
    selectedReviews = [],
    onSaveSelected = () => console.log("Guardando reseñas..."),
}) => {
    const navigate = useNavigate()
    const [selectedIds, setSelectedIds] = useState(
        // Asegurarnos de que selectedReviews es un array antes de llamar a map
        Array.isArray(selectedReviews) ? selectedReviews.map((r) => r.id) : [],
    )

    const handleToggle = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((i) => i !== id)
                : prev.length < 15
                  ? [...prev, id]
                  : prev,
        )
    }

    const handleSave = () => {
        const selected = allReviewsMock.filter((r) =>
            selectedIds.includes(r.id),
        )

        // Si no se proporciona una función onSaveSelected, simplemente mostrar un mensaje
        if (typeof onSaveSelected === "function") {
            onSaveSelected(selected)
        } else {
            console.log("Reseñas seleccionadas:", selected)
            // Podríamos guardar en localStorage como alternativa
            localStorage.setItem("featuredReviews", JSON.stringify(selected))
        }

        // Redirigir a la página principal para ver el carrusel
        navigate("/")
    }

    return (
        <div className="p-8 pt-20 min-h-screen space-y-6 bg-primaryLight">
            <div className="flex items-center justify-between">
                <h1 className="text-h3 font-heading font-semibold">
                    Administrar Reseñas
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al panel
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {allReviewsMock.map((review) => (
                    <SelectableReviewCard
                        key={review.id}
                        {...review}
                        isSelected={selectedIds.includes(review.id)}
                        onToggle={() => handleToggle(review.id)}
                    />
                ))}
            </div>

            {selectedIds.length >= 1 && (
                <div className="pt-6 text-center">
                    <Button type="dark" onClick={handleSave}>
                        Guardar {selectedIds.length}/15 reseñas destacadas
                    </Button>
                </div>
            )}
        </div>
    )
}

export default ManageReviewsScreen
