// src/components/ReviewsVisualizer/ReviewsCarousel.jsx
import ReviewCard from "./ReviewCard";
import { Scissors, Brush } from "lucide-react";

const iconMap = {
  scissors: Scissors,
  brush: Brush,
};

function ReviewsCarousel({ reviews }) {
  return (
    <div className="space-y-6">
      <h2 className="text-h2 font-heading text-textMain font-medium">
        Lo que opinan nuestras clientas
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-textMain scrollbar-track-transparent">
        {reviews.map((review) => {
          const IconComponent = iconMap[review.icon];
          return (
            <ReviewCard key={review.id} {...review} icon={IconComponent} />
          );
        })}
      </div>
    </div>
  );
}

export default ReviewsCarousel;
