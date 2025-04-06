import Button from "./components/Button";
import Navbar from "./components/Navbar/Navbar.jsx";
import RequestCardCarousel from "./components/RequestsVisualizer/RequestCardCarousel.jsx";
import ReviewsCarousel from "./components/ReviewsVisualizer/ReviewsCarousel.jsx";
import ScheduleVisualizer from "./components/ScheduleVisualizer/ScheduleVisualizer.jsx";

function App() {
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

  const mockReviews = [
    {
      id: 1,
      name: "María Treviño",
      review: "Excelente servicio, me encanta la atención que te dan",
      icon: "scissors",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      name: "Grecia González",
      review:
        "¡Súper! Me hicieron un peinado rapidísimo y llegué a mi evento a tiempo",
      icon: "brush",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
      id: 3,
      name: "Fernanda López",
      review: "Quedé encantada con el resultado, sin duda volveré",
      icon: "scissors",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 4,
      name: "Valentina Martínez",
      review: "El ambiente es súper lindo y el trato increíble",
      icon: "brush",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
    {
      id: 1,
      name: "María Treviño",
      review: "Excelente servicio, me encanta la atención que te dan",
      icon: "scissors",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
    {
      id: 2,
      name: "Grecia González",
      review:
        "¡Súper! Me hicieron un peinado rapidísimo y llegué a mi evento a tiempo",
      icon: "brush",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/56.jpg",
    },
    {
      id: 3,
      name: "Fernanda López",
      review: "Quedé encantada con el resultado, sin duda volveré",
      icon: "scissors",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/45.jpg",
    },
    {
      id: 4,
      name: "Valentina Martínez",
      review: "El ambiente es súper lindo y el trato increíble",
      icon: "brush",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/32.jpg",
    },
  ];

  const mock_appointments = [
    {
      title: "Limpieza de orzuela + Corte",
      stylist: "Estilista 1",
      client: "Clienta A",
      date: "2025-04-06" // ISO format
    },
    {
      title: "Corte",
      stylist: "Estilista 2",
      client: "Clienta 3",
      date: "2025-05-06" // ISO format
    },

    // AYER
    {
      title: "Limpieza de orzuela + Corte",
      stylist: "Estilista 1",
      client: "Clienta A",
      date: "2025-04-04",
    },

    // HOY
    {
      title: "Mascarilla hidratante",
      stylist: "Estilista 2",
      client: "Clienta B",
      date: "2025-04-05",
    },
    {
      title: "Corte clásico",
      stylist: "Estilista 1",
      client: "Clienta C",
      date: "2025-04-05",
    },

    // ESTA SEMANA (up to April 11)
    {
      title: "Coloración completa",
      stylist: "Estilista 3",
      client: "Clienta D",
      date: "2025-04-08",
    },
    {
      title: "Peinado de evento",
      stylist: "Estilista 2",
      client: "Clienta E",
      date: "2025-04-10",
    },

    // PRÓXIMOS 30 DÍAS
    {
      title: "Corte + Tratamiento",
      stylist: "Estilista 1",
      client: "Clienta F",
      date: "2025-04-18",
    },
    {
      title: "Uñas gelish",
      stylist: "Estilista 2",
      client: "Clienta G",
      date: "2025-04-22",
    },
    {
      title: "Peinado + Limpieza de orzuela",
      stylist: "Estilista 1",
      client: "Clienta H",
      date: "2025-05-01",
    },

    // MAYO (beyond 30 days)
    {
      title: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
    },
    {
      title: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
    },
    {
      title: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
    },
    {
      title: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
    },
    {
      title: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
    },
    {
      title: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
    },
    {
      title: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
    },
    {
      title: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
    },
    {
      title: "Corte en capas",
      stylist: "Estilista 3",
      client: "Clienta I",
      date: "2025-05-14",
    },
    {
      title: "Color fantasía",
      stylist: "Estilista 2",
      client: "Clienta J",
      date: "2025-05-22",
    },

    // JUNIO
    {
      title: "Mascarilla de nutrición",
      stylist: "Estilista 1",
      client: "Clienta K",
      date: "2025-06-03",
    },
]

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-primaryLight text-textMain p-8 space-y-12 font-body">
        <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
          <h1 className="text-h1 font-bold font-heading">Heading 1</h1>
          <h2 className="text-h2 font-bold font-heading">Heading 2</h2>
          <h3 className="text-h3 font-bold font-heading">Heading 3</h3>
          <h4 className="text-h4 font-bold font-heading">Heading 4</h4>
          <h5 className="text-h5 font-bold font-heading">Heading 5</h5>
          <h6 className="text-h6 font-bold font-heading">Heading 6</h6>

          <div className="space-y-2">
            <p className="text-subtitle-m font-medium">Subtitle M</p>
            <p className="text-subtitle-s font-medium">Subtitle S</p>

            <p className="text-body-l">Body L — regular 18px</p>
            <p className="text-body-m">Body M — regular 16px</p>
            <p className="text-body-s">Body S — regular 14px</p>
            <p className="text-body-xs">Body XS — regular 12px</p>
            <p className="text-body-xxs">Body XXS — regular 10px</p>
          </div>

          <div className="space-x-4 pt-6">
            <div className="space-x-4 pt-6">
              <Button type="light">Light Button</Button>
              <Button type="dark">Dark Button</Button>
              <Button type="transparent">Transparent Button</Button>
            </div>
          </div>

          <div>
            <RequestCardCarousel requests={sampleRequests} />
          </div>

          <div>
            <section>
              <ReviewsCarousel reviews={mockReviews} />
            </section>
          </div>

          <div>
            <section>
              <ScheduleVisualizer tasks={mock_appointments} />
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
