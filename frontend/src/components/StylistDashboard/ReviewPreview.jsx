import React from "react";
import Button from "../common/Button.jsx";

const ReviewPreview = ({ reviews, onClick }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-h5 font-heading">Reseñas recientes</h3>
        <ul className="space-y-2 mt-2">
          {reviews.map((review) => (
            <li key={review.id} className="text-body-s border-b pb-1">
              <p className="font-semibold">{review.name}</p>
              <p className="text-sm italic text-gray-500">"{review.review}"</p>
            </li>
          ))}
        </ul>
      </div>
      <Button type="dark" onClick={onClick} className="mt-4">
        Ver reseñas
      </Button>
    </div>
  );
};

export default ReviewPreview;
