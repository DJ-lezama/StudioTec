import React from "react"
import Button from "../../components/common/Button"
import {
    Clock,
    Loader2,
    MessageSquare,
    ThumbsDown,
    ThumbsUp,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

const AppointmentCard = ({
    appointment,
    onReschedule,
    onAcceptSuggestion,
    onDeclineSuggestion,
    actionLoading,
}) => {
    const isSuggestionPending = appointment.status === "suggestion_made"

    const formatSimpleDate = (timestamp) => {
        if (!timestamp) return "?"
        try {
            return format(timestamp.toDate(), "d MMM, HH:mm", { locale: es })
        } catch {
            return "?"
        }
    }

    return (
        <div
            className={`p-4 border rounded-lg transition-colors duration-150 ${isSuggestionPending ? "bg-blue-50 border-blue-200" : "bg-primary/10 border-primary/20"}`}
        >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between">
                {/* Left side - Details */}
                <div className="flex-1 mb-4 sm:mb-0 sm:mr-4">
                    <p className="font-semibold text-textMain">
                        {appointment.serviceName || appointment.service}{" "}
                    </p>
                    <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap gap-x-4 text-sm text-textMain/80">
                        <span>
                            <Clock
                                size={14}
                                className="inline mr-1 relative -top-px"
                            />
                            Solicitado:{" "}
                            {formatSimpleDate(appointment.requestedDateTime)}
                        </span>
                        <span>
                            • {appointment.stylistName || appointment.stylist}
                        </span>
                        <span
                            className={`capitalize font-medium text-xs px-2 py-0.5 rounded-full ${
                                appointment.status === "accepted"
                                    ? "bg-green-100 text-green-700"
                                    : appointment.status === "pending"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : isSuggestionPending
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {appointment.status === "suggestion_made"
                                ? "Sugerencia"
                                : appointment.status}
                        </span>
                    </div>

                    {/* Suggestion Details */}
                    {isSuggestionPending && appointment.suggestedDateTime && (
                        <div className="mt-3 pt-3 border-t border-blue-200 space-y-1">
                            <p className="text-sm font-medium text-blue-700">
                                <Clock
                                    size={14}
                                    className="inline mr-1 relative -top-px"
                                />
                                Propuesta:{" "}
                                {formatSimpleDate(
                                    appointment.suggestedDateTime,
                                )}
                            </p>
                            {appointment.suggestionComment && (
                                <p className="text-xs text-blue-600 pl-1 flex">
                                    <MessageSquare
                                        size={12}
                                        className="inline mr-1 mt-px flex-shrink-0"
                                    />
                                    <span className="italic">
                                        "{appointment.suggestionComment}"
                                    </span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Right side - Actions */}
                <div className="flex-shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                    {isSuggestionPending ? (
                        <>
                            <Button
                                type="outline-danger"
                                className="text-sm !border-red-500 !text-red-600 hover:!bg-red-50 disabled:opacity-50 flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 py-1.5"
                                onClick={() =>
                                    onDeclineSuggestion(appointment.id)
                                }
                                disabled={!!actionLoading}
                            >
                                {actionLoading === "decline" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ThumbsDown size={14} />
                                )}
                                Rechazar
                            </Button>
                            <Button
                                type="success"
                                className="text-sm !bg-green-600 hover:!bg-green-700 !text-white disabled:opacity-50 flex-1 sm:flex-none flex items-center justify-center gap-1 px-2 py-1.5"
                                onClick={() =>
                                    onAcceptSuggestion(appointment.id)
                                }
                                disabled={!!actionLoading}
                            >
                                {actionLoading === "accept" ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <ThumbsUp size={14} />
                                )}
                                Aceptar
                            </Button>
                        </>
                    ) : (
                        <>
                            {["pending", "accepted"].includes(
                                appointment.status,
                            ) && (
                                <Button
                                    type="dark"
                                    className="text-sm flex-1 sm:flex-none px-2 py-1.5"
                                    onClick={() => onReschedule(appointment)}
                                    disabled={!!actionLoading}
                                >
                                    Reprogramar
                                </Button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AppointmentCard
