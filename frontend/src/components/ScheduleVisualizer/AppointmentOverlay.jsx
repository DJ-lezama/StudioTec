import React, { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import { updateAppointmentStatus } from "../../features/booking/services/bookingService"
import Button from "../../components/common/Button.jsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    AlertTriangle,
    Image as ImageIcon,
    Link as LinkIcon,
    Loader2,
    X,
} from "lucide-react"

const AppointmentOverlay = ({ appointmentId, onClose }) => {
    const [appointmentData, setAppointmentData] = useState(null)
    const [isLoadingData, setIsLoadingData] = useState(false)
    const [fetchError, setFetchError] = useState(null)
    const [isUpdating, setIsUpdating] = useState(false)
    const [updateError, setUpdateError] = useState(null)

    useEffect(() => {
        if (appointmentId) {
            const fetchDetails = async () => {
                setIsLoadingData(true)
                setFetchError(null)
                setAppointmentData(null)
                setUpdateError(null)
                try {
                    const docRef = doc(db, "appointments", appointmentId)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        setAppointmentData({
                            id: docSnap.id,
                            ...docSnap.data(),
                        })
                    } else {
                        setFetchError(
                            "No se encontró la solicitud especificada.",
                        )
                    }
                } catch (error) {
                    console.error("Error fetching appointment details:", error)
                    setFetchError(
                        "Error al cargar los detalles de la solicitud.",
                    )
                } finally {
                    setIsLoadingData(false)
                }
            }
            fetchDetails().then((r) => r)
        } else {
            setAppointmentData(null)
            setIsLoadingData(false)
            setFetchError(null)
            setUpdateError(null)
        }
    }, [appointmentId])

    const formatDateTime = (timestamp) => {
        if (!timestamp) return "Fecha no especificada"
        try {
            const date = timestamp.toDate()
            return format(date, "EEEE d 'de' MMMM, HH:mm", { locale: es })
        } catch (e) {
            console.warn("Error formatting date:", e)
            return "Fecha inválida"
        }
    }

    const handleUpdate = async (newStatus) => {
        if (!appointmentId) return
        setIsUpdating(true)
        setUpdateError(null)
        try {
            await updateAppointmentStatus(appointmentId, newStatus)
            onClose()
        } catch (error) {
            console.warn(`Error setting status to ${newStatus}:`, error)
            setUpdateError(
                `Error al ${newStatus === "accepted" ? "aceptar" : "rechazar"} la solicitud.`,
            )
        } finally {
            setIsUpdating(false)
        }
    }

    if (!appointmentId) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm">
            <div className="w-full sm:w-[450px] h-full bg-white shadow-xl flex flex-col transition-transform transform duration-300 ease-in-out">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 p-1 rounded-full hover:bg-gray-100 disabled:opacity-50"
                        aria-label="Cerrar"
                        disabled={isUpdating}
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-subtitle-m font-heading font-semibold text-textMain text-center flex-grow mr-8">
                        Revisar Solicitud
                    </h2>
                    <div className="w-8"></div>
                </div>

                {/* Content Area */}
                <div className="p-6 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Loading State */}
                    {isLoadingData && (
                        <div className="flex justify-center items-center p-10 text-gray-600">
                            <Loader2 className="w-6 h-6 text-secondary animate-spin mr-2" />
                            <span>Cargando detalles...</span>
                        </div>
                    )}
                    {/* Fetch Error State */}
                    {fetchError && !isLoadingData && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-center flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0" />
                            <span>{fetchError}</span>
                        </div>
                    )}

                    {/* Display Data */}
                    {appointmentData && !isLoadingData && !fetchError && (
                        <>
                            {/* Appointment Info Section */}
                            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                                <h3 className="text-body-l font-semibold text-textMain mb-3 border-b pb-2">
                                    Información de la cita
                                </h3>
                                <div className="space-y-2 text-body-m text-textMain">
                                    <p>
                                        <strong className="font-medium">
                                            Servicio:
                                        </strong>{" "}
                                        {appointmentData.serviceName}
                                    </p>
                                    <p>
                                        <strong className="font-medium">
                                            Cliente:
                                        </strong>{" "}
                                        {appointmentData.clientName}
                                    </p>
                                    <p>
                                        <strong className="font-medium">
                                            Estilista:
                                        </strong>{" "}
                                        {appointmentData.stylistName}
                                    </p>
                                    <p>
                                        <strong className="font-medium">
                                            Fecha y Hora:
                                        </strong>{" "}
                                        {formatDateTime(
                                            appointmentData.requestedDateTime,
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Client Notes Section */}
                            {appointmentData.clientNotes && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                                    <h4 className="text-body-l font-semibold text-textMain mb-2">
                                        Notas del cliente
                                    </h4>
                                    <p className="text-body-m text-textMain whitespace-pre-wrap">
                                        {appointmentData.clientNotes}
                                    </p>
                                </div>
                            )}

                            {/* Inspiration Image Section */}
                            {appointmentData.inspirationImageUrl && (
                                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                                    <h4 className="text-body-l font-semibold text-textMain mb-3 flex items-center">
                                        <ImageIcon
                                            size={18}
                                            className="mr-2 text-secondary"
                                        />
                                        Inspiración del cliente
                                    </h4>
                                    {/* Display Image */}
                                    <div className="mt-2 overflow-hidden rounded-lg border border-gray-200">
                                        <img
                                            src={
                                                appointmentData.inspirationImageUrl
                                            }
                                            alt="Imagen de inspiración proporcionada por el cliente"
                                            className="w-full h-auto object-contain max-h-60 bg-gray-100"
                                            onError={(e) => {
                                                e.target.onerror = null
                                                e.target.style.display = "none"
                                                const placeholder =
                                                    document.createElement("p")
                                                placeholder.textContent =
                                                    "No se pudo cargar la imagen."
                                                placeholder.className =
                                                    "text-center text-gray-500 p-4"
                                                e.target.parentNode.appendChild(
                                                    placeholder,
                                                )
                                            }}
                                        />
                                    </div>
                                    <a
                                        href={
                                            appointmentData.inspirationImageUrl
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-secondary hover:text-secondaryDark mt-2 inline-flex items-center hover:underline"
                                    >
                                        Ver enlace original{" "}
                                        <LinkIcon size={14} className="ml-1" />
                                    </a>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer / Action Area */}
                <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0 bg-white">
                    {updateError && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center mb-3 text-sm"
                            role="alert"
                        >
                            {updateError}
                        </div>
                    )}
                    {/* Action Buttons */}
                    {appointmentData && !isLoadingData && !fetchError && (
                        <div className="flex gap-4 justify-end">
                            <Button
                                type="light"
                                onClick={() => handleUpdate("rejected")}
                                disabled={isUpdating}
                                className="flex-1 sm:flex-none"
                            >
                                {" "}
                                {isUpdating ? (
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                ) : null}{" "}
                                Rechazar{" "}
                            </Button>
                            <Button
                                type="dark"
                                onClick={() => handleUpdate("accepted")}
                                disabled={isUpdating}
                                className="flex-1 sm:flex-none"
                            >
                                {" "}
                                {isUpdating ? (
                                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                                ) : null}{" "}
                                Aceptar{" "}
                            </Button>
                        </div>
                    )}
                    {(!appointmentData || fetchError) && !isLoadingData && (
                        <p className="text-center text-gray-500 text-sm">
                            No se pueden realizar acciones.
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AppointmentOverlay

// TODO: We will defer implementing the full "Suggest" functionality
//  (alternative times, comments back to the client)
//  until we have the underlying availability management and potentially
//  client notifications in place.
//  We can easily add the UI elements back to the overlay then.
