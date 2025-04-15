// src/screens/StylistScreens/RequestsScreen.jsx
import React, { useState } from "react";
import RequestReviewOverlay from "../../components/StylistDashboard/RequestReviewOverlay.jsx";
import Button from "../../components/common/Button.jsx";
import { useNavigate } from "react-router-dom";
import RequestCardCarousel from "../../components/RequestsVisualizer/RequestCardCarousel.jsx";

const sampleRequests = [
  {
    imageSrc: "https://randomuser.me/api/portraits/women/45.jpg",
    id: "123456",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "234567",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "345678",
    service: "Limpieza de orzuela ",
    stylist: "Estilista B",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alexa Perez",
  },
  {
    id: "123456",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "234567",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "345678",
    service: "Limpieza de orzuela ",
    stylist: "Estilista B",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alexa Perez",
  },
  {
    id: "123456",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "234567",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "345678",
    service: "Limpieza de orzuela ",
    stylist: "Estilista B",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alexa Perez",
  },
  {
    id: "123456",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "234567",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "345678",
    service: "Limpieza de orzuela ",
    stylist: "Estilista B",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alexa Perez",
  },
  {
    id: "123456",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "234567",
    service: "Limpieza de orzuela + Corte",
    stylist: "Estilista A",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alina Porras",
  },
  {
    id: "345678",
    service: "Limpieza de orzuela ",
    stylist: "Estilista B",
    time: "16:40",
    date: "23 de Marzo de 2025",
    client: "Alexa Perez",
  },
];

const RequestsScreen = () => {
  const [requests, setRequests] = useState(sampleRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 min-h-screen bg-primaryLight">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-heading font-semibold mb-6">Solicitudes</h1>
        <Button type="dark" onClick={() => navigate("/stylist/dashboard")}>
          Volver al panel
        </Button>
      </div>

      <RequestCardCarousel
        requests={requests}
        onCardClick={setSelectedRequest}
      />

      <RequestReviewOverlay
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};

export default RequestsScreen;
