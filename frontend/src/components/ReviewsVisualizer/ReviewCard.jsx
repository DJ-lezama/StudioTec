// src/components/ReviewsVisualizer/ReviewCard.jsx
import React from "react";
import { Star } from "lucide-react";

function ReviewCard({ image, name, review, icon: Icon, rating = 5 }) {
    return (
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1">
            {/* Top image - covers ~70-75% of the card */}
            <img src={image} alt={name} className="h-[280px] w-full object-cover" />

            {/* Review content */}
            <div className="flex flex-col justify-between h-full p-6 space-y-4 text-textMain font-body">
                <p className="text-body-s font-medium leading-relaxed">{review}</p>

                <div className="pt-2 border-t border-gray-100">
                    <p className="text-body-xs font-bold mb-2">{name}</p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {Array.from({ length: rating }).map((_, i) => (
                                <Star
                                    key={i}
                                    fill="currentColor"
                                    stroke="currentColor"
                                    className="w-4 h-4 text-textMain"
                                />
                            ))}
                        </div>
                        <Icon className="w-5 h-5 text-textMain" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;