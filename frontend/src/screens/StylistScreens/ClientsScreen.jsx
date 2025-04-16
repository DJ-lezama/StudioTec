// src/screens/StylistScreens/ClientsScreen.jsx
import React, { useState } from "react"
import ClientOverlay from "../../components/StylistDashboard/ClientOverlay.jsx"
import Button from "../../components/common/Button.jsx"
import { useNavigate } from "react-router-dom"

const mockClients = [
    {
        name: "Ana Torres",
        email: "ana@example.com",
        lastVisit: "2025-03-12",
        birthday: "2025-08-20",
        history: [
            { date: "2025-03-12", service: "Corte", stylist: "Estilista 3" },
            {
                date: "2024-12-01",
                service: "Coloración",
                stylist: "Estilista 2",
            },
        ],
    },
    {
        name: "Laura Duarte",
        email: "laura@example.com",
        lastVisit: "2025-01-03",
        birthday: "2025-07-14",
        history: [
            {
                date: "2025-01-03",
                service: "Mascarilla",
                stylist: "Estilista 1",
            },
        ],
    },
]

const ClientsScreen = () => {
    const [selectedClient, setSelectedClient] = useState(null)
    const navigate = useNavigate()

    return (
        <div className="p-8">
            <div className="flex items-center justify-between">
                <h1 className="text-h3 font-heading font-semibold mb-6">
                    Clientes
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al panel
                </Button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                    <thead className="bg-secondary text-white rounded-b-lg">
                        <tr>
                            <th className="text-left p-4">Cliente</th>
                            <th className="text-left p-4">Contacto</th>
                            <th className="text-left p-4">Última visita</th>
                            <th className="text-left p-4">Cumpleaños</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mockClients.map((client, i) => (
                            <tr
                                key={i}
                                className="cursor-pointer hover:bg-secondary/10 transition"
                                onClick={() => setSelectedClient(client)}
                            >
                                <td className="p-4 font-medium">
                                    {client.name}
                                </td>
                                <td className="p-4">{client.email}</td>
                                <td className="p-4">
                                    {new Date(
                                        client.lastVisit,
                                    ).toLocaleDateString("es-MX", {
                                        dateStyle: "long",
                                    })}
                                </td>
                                <td className="p-4">
                                    {new Date(
                                        client.birthday,
                                    ).toLocaleDateString("es-MX", {
                                        day: "numeric",
                                        month: "long",
                                    })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ClientOverlay
                client={selectedClient}
                onClose={() => setSelectedClient(null)}
            />
        </div>
    )
}

export default ClientsScreen
