import { Star } from "lucide-react";

function ReviewCard({ image, name, review, icon: Icon, rating = 5 }) {
  return (
    <div className="flex flex-col bg-white rounded-3xl overflow-hidden w-[260px] min-w-[260px] shadow-md">
      {/* Top image - covers ~70-75% of the card */}
      <img src={image} alt={name} className="h-[240px] w-full object-cover" />

      {/* Review content */}
      <div className="flex flex-col justify-between h-full p-4 space-y-3 text-textMain font-body">
        <p className="text-body-s font-medium leading-snug">{review}</p>
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

export default ReviewCard;
