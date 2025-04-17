import React from "react"
import RequestCard from "./RequestCard"

function RequestCardCarousel({ requests, onCardClick }) {
    return (
        <div className="space-y-5 max-h-[calc(100vh-15rem)] overflow-y-auto pr-2 custom-scrollbar">
            {requests.map((request) => (
                <RequestCard
                    key={request.id}
                    request={request}
                    onClick={() => onCardClick(request)}
                />
            ))}
        </div>
    )
}

export default RequestCardCarousel
