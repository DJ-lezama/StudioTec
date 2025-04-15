// src/screens/StylistScreens/ServicesScreen.jsx
import React, { useState } from "react";
import ServiceCardCarousel from "../../components/ServicesVisualizer/ServiceCardCarousel";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import ServiceCreationOverlay from "../../components/ServicesVisualizer/ServiceCreationOverlay.jsx";

const initialServices = [
    {
        serviceID: 1,
        name: "Corte de Cabello",
        description: "Corte profesional con estilo personalizado.",
        basePrice: 150.0,
        duration: 30,
        category: "Cabello",
        image: "https://source.unsplash.com/featured/?haircut",
        isActive: true,
    },
    {
        serviceID: 2,
        name: "Peinado de Evento",
        description: "Peinado elegante para eventos especiales.",
        basePrice: 250.0,
        duration: 60,
        category: "Peinado",
        image: "https://source.unsplash.com/featured/?hairstyle",
        isActive: true,
    },
    {
        serviceID: 3,
        name: "Limpieza de Orzuela",
        description: "Corte profesional con estilo personalizado.",
        basePrice: 150.0,
        duration: 30,
        category: "Cabello",
        image: "https://source.unsplash.com/featured/?haircut",
        isActive: true,
    },
    {
        serviceID: 4,
        name: "Mascarilla Hidratante",
        description: "Peinado elegante para eventos especiales.",
        basePrice: 250.0,
        duration: 60,
        category: "Peinado",
        image: "https://source.unsplash.com/featured/?hairstyle",
        isActive: true,
    },
    {
        serviceID: 5,
        name: "Aplicaciín de gelish",
        description: "Peinado elegante para eventos especiales.",
        basePrice: 250.0,
        duration: 60,
        category: "Uñas",
        image: "https://source.unsplash.com/featured/?hairstyle",
        isActive: true,
    },
];

const ManageServicesScreen = () => {
    const [services, setServices] = useState(initialServices);
    const navigate = useNavigate();
    const [showAddOverlay, setShowAddOverlay] = useState(false);

    const handleUpdateService = (updated) => {
        setServices((prev) =>
            prev.map((s) => (s.serviceID === updated.serviceID ? updated : s))
        );
    };

    const handleDeleteService = (id) => {
        setServices((prev) => prev.filter((s) => s.serviceID !== id));
    };

    const handleAddService = (newService) => {
        setServices((prev) => [newService, ...prev]);
        setShowAddOverlay(false); // Close the overlay after adding
    };

    return (
        <div className="p-8 min-h-screen space-y-6 bg-primaryLight">
            <div className="flex items-center justify-between">
                <h1 className="text-h3 font-heading font-semibold">Servicios</h1>
                <Button type="dark" onClick={() => navigate("/stylist/dashboard")}>
                    Volver al panel
                </Button>
            </div>
            <div>
                <Button type="dark" onClick={() => setShowAddOverlay(true)}>
                    + Nuevo servicio
                </Button>
            </div>
            <ServiceCardCarousel
                services={services}
                onUpdate={handleUpdateService}
                onDelete={handleDeleteService}
            />
            {showAddOverlay && (
                <ServiceCreationOverlay
                    onAdd={handleAddService}
                    onClose={() => setShowAddOverlay(false)}
                />
            )}
        </div>
    );
};

export default ManageServicesScreen;