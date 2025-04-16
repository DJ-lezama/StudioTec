// src/screens/StylistScreens/RequestsScreen.jsx
import React, { useState } from "react"
import RequestReviewOverlay from "../../components/ScheduleVisualizer/AppointmentOverlay.jsx"
import Button from "../../components/common/Button.jsx"
import { useNavigate } from "react-router-dom"
import RequestCardCarousel from "../../components/RequestsVisualizer/RequestCardCarousel.jsx"

// Muestra de solicitudes para demostración
const sampleRequests = [
    {
        id: "123456",
        service: "Limpieza de orzuela + Corte",
        stylist: "Estilista A",
        time: "16:40",
        date: "23 de Marzo de 2025",
        client: "Alina Porras",
        hairImage:
            "https://images.unsplash.com/photo-1580618864527-0869fced739a?ixlib=rb-4.0.3",
        referenceImage:
            "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?ixlib=rb-4.0.3",
    },
    {
        id: "234567",
        service: "Limpieza de orzuela + Corte",
        stylist: "Estilista A",
        time: "14:30",
        date: "24 de Marzo de 2025",
        client: "Diana López",
        hairImage:
            "https://images.unsplash.com/photo-1600180758890-6c861b6b2c7b",
        referenceImage:
            "https://images.unsplash.com/photo-1605379399642-870262d3d051",
    },
    {
        id: "345678",
        service: "Limpieza de orzuela",
        stylist: "Estilista B",
        time: "10:15",
        date: "25 de Marzo de 2025",
        client: "Alexa Perez",
        hairImage: "https://images.unsplash.com/photo-1559599078-0bcb85b4e3c3",
        referenceImage:
            "https://images.unsplash.com/photo-1594824476967-48c8b9642738",
    },
    {
        id: "456789",
        service: "Coloración + Tratamiento",
        stylist: "Estilista C",
        time: "11:30",
        date: "26 de Marzo de 2025",
        client: "Carmen Ruiz",
        hairImage:
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
        referenceImage:
            "https://images.unsplash.com/photo-1562322140-8baeececf3df",
    },
    {
        id: "567890",
        service: "Manicure Gelish",
        stylist: "Estilista A",
        time: "15:00",
        date: "27 de Marzo de 2025",
        client: "Laura Torres",
        hairImage: null,
        referenceImage:
            "https://images.unsplash.com/photo-1604902396830-aca29e19b067",
    },
    {
        id: "678901",
        service: "Corte + Balayage",
        stylist: "Estilista B",
        time: "13:45",
        date: "28 de Marzo de 2025",
        client: "Mónica Guzmán",
        hairImage:
            "https://images.unsplash.com/photo-1605497788044-5a32c7078486",
        referenceImage:
            "https://images.unsplash.com/photo-1562322140-8baeececf3df",
    },
]

const RequestsScreen = () => {
    const [requests, setRequests] = useState(sampleRequests)
    const [selectedRequest, setSelectedRequest] = useState(null)
    const navigate = useNavigate()

    // Función para manejar respuestas a las solicitudes
    const handleRequestResponse = (requestId, response) => {
        console.log(`Solicitud ${requestId} ${response.decision}`)

        // En un caso real, aquí se enviaría la respuesta al backend

        // Actualizamos el estado local (simulación)
        setRequests((prevRequests) =>
            prevRequests.filter((req) => req.id !== requestId),
        )

        setSelectedRequest(null)
    }

    return (
        <div className="p-8 space-y-6 min-h-screen bg-primaryLight">
            <div className="flex items-center justify-between">
                <h1 className="text-h2 font-normal text-textMain mb-6">
                    Solicitudes
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al panel
                </Button>
            </div>

            {requests.length > 0 ? (
                <RequestCardCarousel
                    requests={requests}
                    onCardClick={setSelectedRequest}
                />
            ) : (
                <div className="bg-white p-8 rounded-xl shadow text-center">
                    <h2 className="text-h4 font-heading text-textMain mb-2">
                        No hay solicitudes pendientes
                    </h2>
                    <p className="text-textMain/70">
                        Todas las solicitudes han sido procesadas. Volveremos a
                        notificarte cuando haya nuevas solicitudes.
                    </p>
                </div>
            )}

            {selectedRequest && (
                <RequestReviewOverlay
                    request={selectedRequest}
                    onClose={() => setSelectedRequest(null)}
                    onRespond={(response) =>
                        handleRequestResponse(selectedRequest.id, response)
                    }
                />
            )}
        </div>
    )
}

export default RequestsScreen
