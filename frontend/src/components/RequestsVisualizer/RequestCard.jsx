import React from "react"
import Button from "../common/Button.jsx"
import { format } from "date-fns"
import { es } from "date-fns/locale"

function RequestCard({ request, onClick }) {
    const formatDateTime = (timestamp) => {
        if (!timestamp) return "Fecha no especificada"
        try {
            const date = timestamp.toDate()
            return format(date, "EEE d/MM, HH:mm", { locale: es }) // Format: lun 16/04, 10:30
        } catch (e) {
            console.error("Error formatting date:", e)
            return "Fecha inválida"
        }
    }

    return (
        <div className="relative bg-white rounded-xl shadow-md p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border border-gray-200 overflow-hidden gap-4">
            {/* Left stripe decorator */}
            <div className="absolute left-0 top-0 bottom-0 w-3 bg-secondary rounded-l-xl" />

            {/* Main content area */}
            <div className="space-y-2 font-body text-textMain flex-grow pl-4 sm:pl-2">
                {/* Service Name (Main title) */}
                <h3 className="font-heading font-semibold text-h5 text-primaryDark">
                    {request.serviceName || "Servicio no especificado"}
                </h3>
                {/* Client Name */}
                <p className="text-body-m font-semibold text-secondaryDark">
                    Cliente: {request.clientName || "Cliente no especificado"}
                </p>
                {/* Date, Time, Stylist - flex container for wrapping */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-body-s text-textMain/80 pt-1">
                    <span>🗓️ {formatDateTime(request.requestedDateTime)}</span>
                    <span className="truncate" title={request.stylistName}>
                        👤 {request.stylistName || "Estilista no especificado"}
                    </span>
                    {/* TODO: Optionally display Request ID or other info */}
                    {/* <span className="text-gray-400">ID: {request.id.substring(0, 6)}...</span> */}
                </div>
                {request.clientNotes && (
                    <p
                        className="text-body-s text-textMain/70 pt-1 italic line-clamp-2"
                        title={request.clientNotes}
                    >
                        Notas: {request.clientNotes}
                    </p>
                )}
            </div>

            {/* Action Button Area */}
            <div className="w-full sm:w-auto pt-3 sm:pt-0 sm:ml-4 flex-shrink-0 self-end sm:self-center">
                <Button
                    type="dark"
                    onClick={onClick}
                    className="w-full sm:w-auto"
                >
                    Revisar solicitud
                </Button>
            </div>
        </div>
    )
}

export default RequestCard
