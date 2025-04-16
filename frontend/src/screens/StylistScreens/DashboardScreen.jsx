// src/screens/StylistScreens/DashboardScreen.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import SchedulePreview from "../../components/StylistDashboard/SchedulePreview";
import StatWidget from "../../components/StylistDashboard/StatWidget.jsx";
import ReviewPreview from "../../components/StylistDashboard/ReviewPreview";

const DashboardScreen = () => {
  const navigate = useNavigate();

  // Mock data (to be replaced with DB values later)
  const appointments = [
    {
      service: "Corte",
      stylist: "Estilista 3",
      client: "Clienta C",
      date: "2025-04-04",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-04-05",
    },
    {
      service: "Mascarilla hidratante",
      stylist: "Estilista 2",
      client: "Clienta B",
      date: "2025-04-05",
    },
    {
      service: "Coloración completa",
      stylist: "Estilista 3",
      client: "Clienta D",
      date: "2025-04-08",
    },
    {
      service: "Peinado de evento",
      stylist: "Estilista 2",
      client: "Clienta E",
      date: "2025-04-10",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta K",
      date: "2025-06-03",
    },
    {
      service: "Corte",
      stylist: "Estilista 3",
      client: "Clienta C",
      date: "2025-04-04",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-04-05",
    },
    {
      service: "Mascarilla hidratante",
      stylist: "Estilista 2",
      client: "Clienta B",
      date: "2025-04-05",
    },
    {
      service: "Coloración completa",
      stylist: "Estilista 3",
      client: "Clienta D",
      date: "2025-04-08",
    },
    {
      service: "Peinado de evento",
      stylist: "Estilista 2",
      client: "Clienta E",
      date: "2025-04-10",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta K",
      date: "2025-06-03",
    },
  ];

  const stats = [
    {
      title: "Solicitudes",
      value: 6,
      subtitle: "pendientes por revisar",
      buttonText: "Ver solicitudes",
      route: "/stylist/solicitudes",
    },
    {
      title: "Clientes",
      value: 24,
      subtitle: "registrados",
      buttonText: "Ver clientes",
      route: "/stylist/clientes",
    },
    {
      title: "Servicios",
      value: 12,
      subtitle: "en catálogo",
      buttonText: "Gestionar servicios",
      route: "/stylist/servicios",
    },
    {
      title: "Reseñas",
      value: 4,
      subtitle: "recientes",
      buttonText: "Ver reseñas",
      route: "/stylist/reseñas",
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "María Treviño",
      review: "Excelente servicio, me encanta la atención que te dan",
    },
    {
      id: 2,
      name: "Grecia González",
      review: "¡Súper! Me hicieron un peinado rapidísimo",
    },
    {
      id: 3,
      name: "Fernanda López",
      review: "Quedé encantada con el resultado",
    },
    {
      id: 4,
      name: "Valentina Martínez",
      review: "El ambiente es súper lindo y el trato increíble",
    },
  ];

  return (
      <div className="pt-6 p-8 space-y-8">
        <h1 className="text-h3 font-heading font-bold">Panel de control</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: SchedulePreview (fixed size) */}
          <div className="lg:col-span-1">
            <SchedulePreview
                appointments={appointments.slice(0, 6)}
                onClick={() => navigate("/stylist/schedule")}
            />
          </div>

          {/* RIGHT: 4 square widgets in 2x2 grid */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.slice(0, 3).map((stat, index) => (
                <StatWidget
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    subtitle={stat.subtitle}
                    buttonText={stat.buttonText}
                    onClick={() => navigate(stat.route)}
                />
            ))}

            {/* Fourth widget slot: reviews */}
            <ReviewPreview
                reviews={reviews}
                onClick={() => navigate("/stylist/reviews")}
            />
          </div>
        </div>
      </div>
  );
};

export default DashboardScreen;