// src/components/Services/ServiceCardCarousel.jsx
import React from "react"
import ServiceCard from "./ServiceCard"

const ServiceCardCarousel = ({ services, onUpdate, onDelete }) => {
    return (
        <div className="space-y-4 overflow-y-auto max-h-[75vh] pr-2">
            {services.map((service) => (
                <ServiceCard
                    key={service.serviceID}
                    service={service}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                />
            ))}
        </div>
    )
}

export default ServiceCardCarousel
