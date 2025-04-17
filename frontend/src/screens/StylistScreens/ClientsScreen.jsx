import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../../../firebaseConfig"
import { collection, getDocs, query, where } from "firebase/firestore"
import ClientOverlay from "../../components/stylist_dashboard/ClientOverlay.jsx"
import Button from "../../components/common/Button.jsx"
import { AlertTriangle, Loader2 } from "lucide-react"

const ClientsScreen = () => {
    const [selectedClient, setSelectedClient] = useState(null)
    const [clients, setClients] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchClients = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const q = query(
                    collection(db, "users"),
                    where("role", "==", "client"),
                )
                const querySnapshot = await getDocs(q)
                const clientList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }))
                setClients(clientList)
            } catch (err) {
                console.error("Error fetching clients:", err)
                setError("Error al cargar la lista de clientes.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchClients().then((r) => r)
    }, [])

    const handleClientSelect = (client) => {
        setSelectedClient(client)
    }

    return (
        <div className="p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-h3 font-heading font-semibold text-textMain">
                    Clientes
                </h1>
                <Button
                    type="dark"
                    onClick={() => navigate("/stylist/dashboard")}
                >
                    Volver al Panel
                </Button>
            </div>

            {isLoading && (
                <div className="flex justify-center items-center p-10 text-gray-600">
                    <Loader2 className="w-8 h-8 text-secondary animate-spin mr-3" />
                    <span>Cargando clientes...</span>
                </div>
            )}

            {error && !isLoading && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg text-center flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    <span>{error}</span>
                </div>
            )}

            {!isLoading && !error && (
                <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                    <table className="min-w-full">
                        <thead className="bg-secondary text-white">
                            <tr>
                                <th className="text-left p-4 font-semibold">
                                    Cliente
                                </th>
                                <th className="text-left p-4 font-semibold">
                                    Email
                                </th>
                                <th className="text-left p-4 font-semibold">
                                    Teléfono
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="3"
                                        className="text-center p-6 text-gray-500"
                                    >
                                        No se encontraron clientes.
                                    </td>
                                </tr>
                            ) : (
                                clients.map((client) => (
                                    <tr
                                        key={client.id}
                                        className="cursor-pointer hover:bg-secondary/10 transition border-b border-gray-100 last:border-b-0"
                                        onClick={() =>
                                            handleClientSelect(client)
                                        }
                                    >
                                        <td className="p-4 font-medium text-textMain">
                                            {client.name || "N/A"}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {client.email || "N/A"}
                                        </td>
                                        <td className="p-4 text-gray-700">
                                            {client.phone || "No especificado"}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            <ClientOverlay
                client={selectedClient}
                onClose={() => setSelectedClient(null)}
            />
        </div>
    )
}

export default ClientsScreen
