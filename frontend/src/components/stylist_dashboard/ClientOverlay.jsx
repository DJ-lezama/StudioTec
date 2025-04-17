import React, { useEffect, useState } from "react"
import { AlertTriangle, Loader2, X } from "lucide-react"
import { db } from "../../../firebaseConfig" // Adjust path
import { collection, getDocs, orderBy, query, where } from "firebase/firestore"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const ClientOverlay = ({ client, onClose }) => {
    const [appointmentHistory, setAppointmentHistory] = useState([])
    const [isLoadingHistory, setIsLoadingHistory] = useState(false)
    const [errorHistory, setErrorHistory] = useState(null)

    useEffect(() => {
        if (client?.id) {
            const fetchHistory = async () => {
                setIsLoadingHistory(true)
                setErrorHistory(null)
                setAppointmentHistory([])

                try {
                    const q = query(
                        collection(db, "appointments"),
                        where("clientId", "==", client.id),
                        orderBy("requestedDateTime", "desc"),
                    )
                    const querySnapshot = await getDocs(q)
                    const history = querySnapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }))
                    setAppointmentHistory(history)
                } catch (err) {
                    console.error(
                        `Error fetching appointment history for client ${client.id}:`,
                        err,
                    )
                    setErrorHistory("Error al cargar el historial de citas.")
                } finally {
                    setIsLoadingHistory(false)
                }
            }
            fetchHistory().then((r) => r)
        } else {
            setAppointmentHistory([])
            setIsLoadingHistory(false)
            setErrorHistory(null)
        }
    }, [client?.id])

    const formatHistoryDate = (timestamp) => {
        if (!timestamp) return "N/A"
        try {
            return format(timestamp.toDate(), "PP", { locale: es })
        } catch {
            return "Fecha Inv."
        }
    }

    if (!client) return null

    return (
        <div className="fixed inset-0 z-50 bg-black/30 flex justify-end backdrop-blur-sm">
            <div className="w-full sm:max-w-md bg-white h-full shadow-lg p-6 overflow-y-auto relative flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-primary transition p-1 hover:bg-gray-100 rounded-full z-10"
                    aria-label="Cerrar panel de cliente"
                >
                    <X size={20} />
                </button>

                {/* Client Info */}
                <div className="mb-6 pb-4 border-b border-gray-200">
                    <h2 className="text-h4 font-heading font-semibold mb-2 text-textMain">
                        {client.name}
                    </h2>
                    <div className="space-y-1 text-sm text-gray-600">
                        <p>
                            <span className="font-medium text-gray-700">
                                Email:
                            </span>{" "}
                            {client.email || "N/A"}{" "}
                        </p>
                        <p>
                            <span className="font-medium text-gray-700">
                                Teléfono:
                            </span>{" "}
                            {client.phone || "No especificado"}
                        </p>
                    </div>
                </div>

                {/* Appointment History */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mr-3 pr-3">
                    {" "}
                    <h3 className="text-h5 font-semibold mb-3 text-textMain sticky top-0 bg-white pt-1 pb-2">
                        Historial de Citas
                    </h3>
                    {isLoadingHistory && (
                        <div className="flex justify-center items-center py-6 text-gray-500">
                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                            <span>Cargando historial...</span>
                        </div>
                    )}
                    {errorHistory && !isLoadingHistory && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            <span>{errorHistory}</span>
                        </div>
                    )}
                    {!isLoadingHistory &&
                        !errorHistory &&
                        (appointmentHistory.length === 0 ? (
                            <p className="text-sm text-gray-500 italic mt-2">
                                No hay citas registradas para este cliente.
                            </p>
                        ) : (
                            <ul className="space-y-3">
                                {appointmentHistory.map((appt) => (
                                    <li
                                        key={appt.id}
                                        className="border rounded-lg p-3 bg-gray-50/70 border-gray-200 text-sm"
                                    >
                                        <p className="font-medium text-textMain mb-0.5">
                                            {" "}
                                            {appt.serviceName ||
                                                "Servicio Desconocido"}{" "}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Fecha:
                                            </span>{" "}
                                            {formatHistoryDate(
                                                appt.requestedDateTime,
                                            )}
                                        </p>
                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Estilista:
                                            </span>{" "}
                                            {appt.stylistName || "N/A"}{" "}
                                        </p>
                                        <p className="text-gray-600 capitalize">
                                            <span className="font-medium">
                                                Status:
                                            </span>{" "}
                                            <span
                                                className={`font-medium ${appt.status === "completed" ? "text-green-600" : appt.status === "rejected" ? "text-red-600" : "text-gray-500"}`}
                                            >
                                                {appt.status || "N/A"}
                                            </span>
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default ClientOverlay
