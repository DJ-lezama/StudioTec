import React, { useEffect, useState } from "react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "../../../firebaseConfig"
import {
    updateAppointmentStatus,
    updateAppointmentSuggestion,
} from "../../features/booking/services/bookingService"
import Button from "../../components/common/Button.jsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
    AlertTriangle,
    Calendar as CalendarIcon,
    Image as ImageIcon,
    Link as LinkIcon,
    Loader2,
    MessageSquare,
    Send,
    X,
} from "lucide-react"
import AlternativeTimesCalendar from "./AlternativeTimesCalendar"

const AppointmentOverlay = ({ appointmentId, onClose }) => {
    const [appointmentData, setAppointmentData] = useState(null)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [fetchError, setFetchError] = useState(null)
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
    const [updateError, setUpdateError] = useState(null)

    const [isSuggesting, setIsSuggesting] = useState(false)
    const [suggestionComment, setSuggestionComment] = useState("")
    const [selectedSuggestionDateTime, setSelectedSuggestionDateTime] =
        useState(null)
    const [isSendingSuggestion, setIsSendingSuggestion] = useState(false)
    const [suggestionError, setSuggestionError] = useState(null)

    useEffect(() => {
        if (appointmentId) {
            const fetchDetails = async () => {
                setIsLoadingData(true)
                setFetchError(null)
                setAppointmentData(null)
                setUpdateError(null)
                setIsSuggesting(false)
                setSuggestionComment("")
                setSelectedSuggestionDateTime(null)
                setIsSendingSuggestion(false)
                setSuggestionError(null)

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
            setIsSuggesting(false)
            setSuggestionComment("")
            setSelectedSuggestionDateTime(null)
            setIsSendingSuggestion(false)
            setSuggestionError(null)
        }
    }, [appointmentId])

    const formatDateTime = (timestamp) => {
        if (!timestamp) return "Fecha no especificada"
        try {
            const date = timestamp.toDate()
            return format(date, "EEEE d 'de' MMMM, HH:mm", { locale: es })
        } catch (e) {
            if (timestamp instanceof Date) {
                try {
                    return format(timestamp, "EEEE d 'de' MMMM, HH:mm", {
                        locale: es,
                    })
                } catch (formatErr) {
                    console.warn("Error formatting JS Date:", formatErr)
                }
            }
            console.warn(
                "Error formatting date (neither Timestamp nor Date):",
                e,
                timestamp,
            )
            return "Fecha inválida"
        }
    }

    const handleStatusUpdate = async (newStatus) => {
        if (!appointmentId) return
        setIsUpdatingStatus(true)
        setUpdateError(null)
        setSuggestionError(null)
        try {
            await updateAppointmentStatus(appointmentId, newStatus)
            onClose()
        } catch (error) {
            console.warn(`Error setting status to ${newStatus}:`, error)
            setUpdateError(
                `Error al ${newStatus === "accepted" ? "aceptar" : "rechazar"} la solicitud. Intenta de nuevo.`,
            )
            // TODO: Optionally show toast error
        } finally {
            setIsUpdatingStatus(false)
        }
    }

    const handleSuggestionSelect = (dateTimeInfo) => {
        setSelectedSuggestionDateTime(dateTimeInfo)
        setSuggestionError(null)
    }

    const handleCancelSuggestion = () => {
        setIsSuggesting(false)
        setSelectedSuggestionDateTime(null)
        setSuggestionComment("")
        setSuggestionError(null)
    }

    const handleSendSuggestion = async () => {
        if (!selectedSuggestionDateTime) {
            setSuggestionError(
                "Por favor, selecciona una fecha y hora alternativa.",
            )
            return
        }
        if (!suggestionComment.trim()) {
            setSuggestionError(
                "Por favor, escribe un comentario para el cliente.",
            )
            return
        }
        if (!appointmentId) return

        setIsSendingSuggestion(true)
        setSuggestionError(null)
        setUpdateError(null)

        const [year, month, day] = selectedSuggestionDateTime.date
            .split("-")
            .map(Number)
        const [hours, minutes] = selectedSuggestionDateTime.time
            .split(":")
            .map(Number)
        const suggestedDate = new Date(year, month - 1, day, hours, minutes)

        if (isNaN(suggestedDate))
            throw new Error("Fecha/hora seleccionada inválida.")

        try {
            await updateAppointmentSuggestion(
                appointmentId,
                suggestedDate,
                suggestionComment,
            )
            // TODO: Optionally show toast success
            console.log("Suggestion sent successfully!")
            onClose()
        } catch (error) {
            console.error("Error sending suggestion:", error)
            setSuggestionError(
                `Error al enviar la sugerencia: ${error.message || "Intenta de nuevo."}`,
            )
            // TODO: Optionally show toast error
        } finally {
            setIsSendingSuggestion(false)
        }
    }

    const isActionInProgress = isUpdatingStatus || isSendingSuggestion

    const serviceDuration = appointmentData?.duration
    const stylistId = appointmentData?.stylistId

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
                        disabled={isActionInProgress}
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-subtitle-m font-heading font-semibold text-textMain text-center flex-grow mr-8">
                        {isSuggesting
                            ? "Sugerir Horario Alternativo"
                            : "Revisar Solicitud"}
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
                                    {" "}
                                    Información de la cita{" "}
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
                                            Solicitado:
                                        </strong>{" "}
                                        {formatDateTime(
                                            appointmentData.requestedDateTime,
                                        )}
                                    </p>
                                    {appointmentData.duration && (
                                        <p>
                                            <strong className="font-medium">
                                                Duración:
                                            </strong>{" "}
                                            {appointmentData.duration} min
                                        </p>
                                    )}
                                    {appointmentData.suggestedDateTime && (
                                        <p className="mt-2 pt-2 border-t border-gray-200 text-blue-600">
                                            <strong className="font-medium text-blue-700">
                                                {" "}
                                                {appointmentData.status ===
                                                "suggestion_made"
                                                    ? "Sugerencia Pendiente:"
                                                    : "Sugerido Previamente:"}{" "}
                                            </strong>
                                            {formatDateTime(
                                                appointmentData.suggestedDateTime,
                                            )}
                                            <span className="block text-xs italic mt-1">
                                                {
                                                    appointmentData.suggestionComment
                                                }
                                            </span>
                                        </p>
                                    )}
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

                            {/* Suggestion Input Area (Conditional) */}
                            {isSuggesting && (
                                <div className="border-2 border-secondary/30 rounded-lg p-4 bg-secondary/5 space-y-4 transition-all duration-300 mt-4 mb-4">
                                    <h4 className="text-body-l font-semibold text-textMain mb-2 flex items-center">
                                        <CalendarIcon
                                            size={18}
                                            className="mr-2 text-secondary"
                                        />{" "}
                                        Selecciona Fecha y Hora Alternativa
                                    </h4>
                                    <AlternativeTimesCalendar
                                        onSelectAlternative={
                                            handleSuggestionSelect
                                        }
                                        onCancel={handleCancelSuggestion}
                                        stylistId={stylistId}
                                        serviceDuration={serviceDuration}
                                    />
                                    {selectedSuggestionDateTime && (
                                        <p className="text-sm text-textMain bg-primary/10 p-2 rounded border border-primary/20">
                                            <strong className="font-medium">
                                                Seleccionado:
                                            </strong>{" "}
                                            {
                                                selectedSuggestionDateTime.formatted
                                            }
                                        </p>
                                    )}
                                    <div className="mt-4">
                                        <label
                                            htmlFor="suggestionComment"
                                            className="text-body-l font-semibold text-textMain mb-2 flex items-center"
                                        >
                                            <MessageSquare
                                                size={18}
                                                className="mr-2 text-secondary"
                                            />{" "}
                                            Comentario para el Cliente*
                                        </label>
                                        <textarea
                                            id="suggestionComment"
                                            rows="3"
                                            value={suggestionComment}
                                            onChange={(e) => {
                                                setSuggestionComment(
                                                    e.target.value,
                                                )
                                                if (e.target.value.trim()) {
                                                    setSuggestionError(null)
                                                }
                                            }}
                                            placeholder="Ej: Este horario funciona mejor para mí..."
                                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-secondary focus:border-secondary text-sm"
                                            aria-required="true"
                                        ></textarea>
                                    </div>
                                    {suggestionError && (
                                        <div
                                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm"
                                            role="alert"
                                        >
                                            {" "}
                                            {suggestionError}{" "}
                                        </div>
                                    )}
                                    <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                                        <Button
                                            type="light"
                                            onClick={handleCancelSuggestion}
                                            disabled={isSendingSuggestion}
                                            className="order-2 sm:order-1"
                                        >
                                            {" "}
                                            Cancelar Sugerencia{" "}
                                        </Button>
                                        <Button
                                            type="dark"
                                            onClick={handleSendSuggestion}
                                            disabled={
                                                !selectedSuggestionDateTime ||
                                                !suggestionComment.trim() ||
                                                isSendingSuggestion
                                            }
                                            className="flex items-center justify-center min-w-[150px] order-1 sm:order-2"
                                        >
                                            {isSendingSuggestion ? (
                                                <>
                                                    <Loader2 className="animate-spin w-4 h-4 mr-2" />{" "}
                                                    Enviando...
                                                </>
                                            ) : (
                                                <>
                                                    <Send
                                                        size={16}
                                                        className="mr-2"
                                                    />{" "}
                                                    Enviar Sugerencia
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Footer / Action Area */}
                <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0 bg-white">
                    {updateError && !isSuggesting && (
                        <div
                            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-center mb-3 text-sm"
                            role="alert"
                        >
                            {" "}
                            {updateError}{" "}
                        </div>
                    )}
                    {appointmentData &&
                        !isLoadingData &&
                        !fetchError &&
                        !isSuggesting && (
                            <div className="flex flex-col sm:flex-row gap-3 justify-end">
                                {appointmentData.status !== "accepted" &&
                                    appointmentData.status !== "rejected" && (
                                        <Button
                                            type="light"
                                            onClick={() =>
                                                handleStatusUpdate("rejected")
                                            }
                                            disabled={isUpdatingStatus}
                                            className="flex-1 sm:flex-none flex justify-center items-center min-w-[110px]"
                                        >
                                            {isUpdatingStatus ? (
                                                <Loader2 className="animate-spin w-5 h-5" />
                                            ) : (
                                                "Rechazar"
                                            )}
                                        </Button>
                                    )}
                                {appointmentData.status === "pending" && (
                                    <Button
                                        type="secondary"
                                        onClick={() => {
                                            setIsSuggesting(true)
                                            setUpdateError(null)
                                            setSuggestionError(null)
                                        }}
                                        disabled={isUpdatingStatus}
                                        className="flex-1 sm:flex-none flex justify-center items-center min-w-[110px]"
                                    >
                                        {" "}
                                        Sugerir Otro{" "}
                                    </Button>
                                )}
                                {appointmentData.status !== "accepted" &&
                                    appointmentData.status !== "rejected" && (
                                        <Button
                                            type="dark"
                                            onClick={() =>
                                                handleStatusUpdate("accepted")
                                            }
                                            disabled={isUpdatingStatus}
                                            className="flex-1 sm:flex-none flex justify-center items-center min-w-[110px]"
                                        >
                                            {isUpdatingStatus ? (
                                                <Loader2 className="animate-spin w-5 h-5" />
                                            ) : (
                                                "Aceptar"
                                            )}
                                        </Button>
                                    )}
                            </div>
                        )}
                    {(!appointmentData || fetchError) && !isLoadingData && (
                        <p className="text-center text-gray-500 text-sm">
                            {" "}
                            No se pueden realizar acciones.{" "}
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AppointmentOverlay
