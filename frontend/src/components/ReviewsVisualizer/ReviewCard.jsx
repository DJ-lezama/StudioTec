// src/components/ReviewCard.jsx
import { Star } from "lucide-react";

function ReviewCard({ imageSrc, name, review, icon: Icon }) {
    return (
        <div className="bg-gradient-to-r from-primary to-tertiary rounded-2xl p-4 w-72 min-w-[18rem] shadow-md space-y-3">
            <div className="flex gap-4">
                <img
                    src={imageSrc}
                    alt={name}
                    className="w-20 h-20 object-cover rounded-xl"
                />
                <div>
                    <h3 className="font-heading text-lg font-bold text-textMain">{name}</h3>
                    <p className="text-sm font-body text-textMain">{review}</p>
                </div>
            </div>
            <div className="flex items-center justify-between pt-2">
                <Icon className="w-4 h-4 text-textMain" />
                <div className="flex gap-1 text-textMain">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} fill="currentColor" className="w-4 h-4" />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ReviewCard;
