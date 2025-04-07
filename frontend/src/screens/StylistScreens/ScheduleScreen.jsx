// src/screens/StylistScreens/ScheduleScreen.jsx
import React from "react";
import ScheduleVisualizer from "../../components/ScheduleVisualizer/ScheduleVisualizer";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";

const ScheduleScreen = () => {
  // Mock data — in the future, this will come from the DB or API
  const mock_appointments = [
    {
      service: "Corte",
      stylist: "Estilista 3",
      client: "Clienta C",
      date: "2025-04-04",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Tu tipo de cabello permite lograr ese look fácilmente.",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-04-05",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Te conviene un corte gradual para mantener el volumen.",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta I",
      date: "2025-04-06",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Podemos probar un tono un poco más claro si lo deseas.",
    },
    {
      service: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Este estilo va perfecto con tu forma de rostro.",
    },
    {
      service: "Mascarilla hidratante",
      stylist: "Estilista 2",
      client: "Clienta B",
      date: "2025-04-05",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments:
        "Te recomiendo un tratamiento antes de la coloración para evitar daño.",
    },
    {
      service: "Coloración completa",
      stylist: "Estilista 3",
      client: "Clienta D",
      date: "2025-04-08",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Peinado de evento",
      stylist: "Estilista 2",
      client: "Clienta E",
      date: "2025-04-10",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Tu tipo de cabello permite lograr ese look fácilmente.",
    },
    {
      service: "Corte + Tratamiento",
      stylist: "Estilista 1",
      client: "Clienta F",
      date: "2025-04-18",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Te conviene un corte gradual para mantener el volumen.",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 2",
      client: "Clienta G",
      date: "2025-04-22",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Este estilo va perfecto con tu forma de rostro.",
    },
    {
      service: "Peinado + Limpieza de orzuela",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-05-01",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta K",
      date: "2025-06-03",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Podemos probar un tono un poco más claro si lo deseas.",
    },
    {
      service: "Corte",
      stylist: "Estilista 3",
      client: "Clienta C",
      date: "2025-04-04",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Tu tipo de cabello permite lograr ese look fácilmente.",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-04-05",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Te conviene un corte gradual para mantener el volumen.",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta I",
      date: "2025-04-06",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Podemos probar un tono un poco más claro si lo deseas.",
    },
    {
      service: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Este estilo va perfecto con tu forma de rostro.",
    },
    {
      service: "Mascarilla hidratante",
      stylist: "Estilista 2",
      client: "Clienta B",
      date: "2025-04-05",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments:
        "Te recomiendo un tratamiento antes de la coloración para evitar daño.",
    },
    {
      service: "Coloración completa",
      stylist: "Estilista 3",
      client: "Clienta D",
      date: "2025-04-08",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Peinado de evento",
      stylist: "Estilista 2",
      client: "Clienta E",
      date: "2025-04-10",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Tu tipo de cabello permite lograr ese look fácilmente.",
    },
    {
      service: "Corte + Tratamiento",
      stylist: "Estilista 1",
      client: "Clienta F",
      date: "2025-04-18",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Te conviene un corte gradual para mantener el volumen.",
    },
    {
      service: "Uñas gelish",
      stylist: "Estilista 2",
      client: "Clienta G",
      date: "2025-04-22",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Este estilo va perfecto con tu forma de rostro.",
    },
    {
      service: "Peinado + Limpieza de orzuela",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-05-01",
      referenceImage:
        "https://images.unsplash.com/photo-1605379399642-870262d3d051",
      hairImage: "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
      comments: "Será necesario hacer una limpieza profunda primero.",
    },
    {
      service: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta K",
      date: "2025-06-03",
      referenceImage:
        "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
      hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
      comments: "Podemos probar un tono un poco más claro si lo deseas.",
    },
  ];
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-h3 font-heading font-bold">Agenda completa</h1>
        <Button type="dark" onClick={() => navigate("/stylist/dashboard")}>
          Volver al panel
        </Button>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white p-4">
        <ScheduleVisualizer tasks={mock_appointments} />
      </div>
    </div>
  );
};

export default ScheduleScreen;
