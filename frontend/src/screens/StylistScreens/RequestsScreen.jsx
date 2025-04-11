// src/screens/StylistScreens/RequestsScreen.jsx
import React, { useState } from "react";
import RequestReviewOverlay from "../../components/StylistDashboard/RequestReviewOverlay.jsx";
import Button from "../../components/common/Button.jsx";
import { useNavigate } from "react-router-dom";

const mockRequests = [
  {
    id: "123456",
    date: "2025-04-18",
    time: "15:00",
    service: "Coloración",
    stylist: "Estilista 1",
    clientName: "Valeria Mendoza",
    hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
    referenceImage:
      "https://images.unsplash.com/photo-1605379399642-870262d3d051",
  },
  {
    id: "789012",
    date: "2025-04-22",
    time: "12:30",
    service: "Peinado",
    stylist: "Estilista 2",
    clientName: "Laura Rivas",
    hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
    referenceImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
  },
];

const RequestsScreen = () => {
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

      <div className="space-y-4">
        {mockRequests.map((req) => (
          <div
            key={req.id}
            className="bg-white hover:bg-secondary/10 cursor-pointer p-4 rounded-lg shadow-sm flex justify-between items-center"
            onClick={() => setSelectedRequest(req)}
          >
            <div>
              <p className="font-semibold text-textMain">
                Información de solicitud
              </p>
              <p className="text-sm text-textMain/60">
                {req.service} - {req.date} - {req.time}
              </p>
            </div>
            <span className="text-xl text-textMain">&rarr;</span>
          </div>
        ))}
      </div>

      <RequestReviewOverlay
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
      />
    </div>
  );
};

export default RequestsScreen;
