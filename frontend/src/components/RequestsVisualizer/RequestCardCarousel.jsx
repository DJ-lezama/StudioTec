import React from "react";
import RequestCard from "./RequestCard";

function RequestCardCarousel({ requests }) {
  return (
    <div className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
      <h2 className="text-h2 font-heading text-textMain font-medium">
        Solicitudes
      </h2>
      {requests.map((request, index) => (
        <RequestCard
          key={index}
          id={request.id}
          service={request.service}
          stylist={request.stylist}
          time={request.time}
          date={request.date}
          client={request.client}
        />
      ))}
    </div>
  );
}

export default RequestCardCarousel;
