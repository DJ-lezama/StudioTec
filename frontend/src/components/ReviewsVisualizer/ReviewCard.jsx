import React from "react";
import { Star } from "lucide-react";

function ReviewCard({ image, name, review, icon: Icon, rating = 5 }) {
    const truncateText = (text, maxLength = 160) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + "...";
    };

    return (
        <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-full shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-[500px]">
            {/* Top image */}
            <div className="h-[300px] w-full overflow-hidden">
                <img
                    src={image}
                    alt={name}
                    className="h-full w-full object-cover"
                />
            </div>

            {/* Content */}
            <div className="flex flex-col justify-between flex-1 p-4 space-y-3 text-textMain font-body">
                {/* Texto extendido sin limitación artificial */}
                <div className="overflow-hidden">
                    <p className="text-body-s font-medium leading-relaxed">
                        {truncateText(review)}
                    </p>
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-gray-100 mt-auto">
                    <p className="text-body-xs font-bold mb-1">{name}</p>
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
