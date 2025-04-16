// src/components/ReviewsVisualizer/SelectableReviewListItem.jsx
import React from "react";
import { Star, Scissors, Brush, Eye } from "lucide-react";

// Componente para seleccionar reseñas en ManageReviewsScreen (formato de lista)
function SelectableReviewCard({
                                      image,
                                      name,
                                      review,
                                      icon,
                                      rating = 5,
                                      isSelected,
                                      onToggle,
                                  }) {
    // Mapeo de íconos basado en el string
    const iconComponents = {
        scissors: Scissors,
        brush: Brush,
        eyebrow: Eye,
    };

    // Seleccionar el componente de ícono apropiado
    const IconComponent = iconComponents[icon] || Scissors; // Por defecto usar Scissors

    return (
        <div
            className={`flex items-center bg-white p-4 rounded-lg shadow-sm border transition-all duration-200 hover:shadow-md ${
                isSelected ? "border-secondary ring-1 ring-secondary/50 bg-secondary/5" : "border-gray-200"
            }`}
        >
            {/* Checkbox de selección */}
            <div className="mr-4">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-5 h-5 accent-secondary cursor-pointer"
                />
            </div>

            {/* Avatar */}
            <div className="w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0">
                <img
                    src={image}
                    alt={name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        // Imagen de respaldo si la original falla
                        e.target.src = "https://randomuser.me/api/portraits/lego/1.jpg";
                    }}
                />
            </div>

            {/* Detalles de la reseña */}
            <div className="flex-grow">
                <div className="flex items-center justify-between">
                    <h3 className="font-medium text-textMain">{name}</h3>
                    <div className="flex items-center">
                        <div className="flex gap-1 mr-2">
                            {Array.from({ length: rating }).map((_, i) => (
                                <Star
                                    key={i}
                                    fill="currentColor"
                                    stroke="currentColor"
                                    className="w-4 h-4 text-textMain"
                                />
                            ))}
                        </div>
                        <IconComponent className="w-5 h-5 text-textMain" />
                    </div>
                </div>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{review}</p>
            </div>
        </div>
    );
}

export default SelectableReviewCard;