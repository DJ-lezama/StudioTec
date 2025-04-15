// src/components/ReviewsManager/SelectableReviewCard.jsx
import { Star } from "lucide-react";
import React from "react";

function SelectableReviewCard({
                                  image,
                                  name,
                                  review,
                                  icon: Icon,
                                  rating = 5,
                                  isSelected,
                                  onToggle,
                              }) {
    return (
        <div
            className={`relative flex flex-col bg-white rounded-3xl overflow-hidden w-[260px] min-w-[260px] shadow-md border-2 transition-all duration-200 ${
                isSelected ? "border-secondary ring-2 ring-secondary/50" : "border-transparent"
            }`}
        >
            {/* Selection checkbox */}
            <div className="absolute top-2 right-2 z-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-5 h-5 accent-secondary cursor-pointer"
                />
            </div>

            {/* Top image */}
            <img src={image} alt={name} className="h-[240px] w-full object-cover" />

            {/* Review content */}
            <div className="flex flex-col justify-between h-full p-4 space-y-3 text-textMain font-body">
                <p className="text-body-s font-medium leading-snug line-clamp-4">{review}</p>
                <p className="text-body-xs font-bold">{name}</p>

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
    );
}

export default SelectableReviewCard;
