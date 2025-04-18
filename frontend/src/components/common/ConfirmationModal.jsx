import React from "react"
import Button from "./Button"
import { AlertTriangle, Loader2, X } from "lucide-react"

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar Acción",
    message = "¿Estás seguro de que deseas continuar?",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    confirmButtonType = "danger",
    isConfirming = false,
}) => {
    if (!isOpen) {
        return null
    }

    const getConfirmButtonClasses = () => {
        switch (confirmButtonType) {
            case "danger":
                return "!bg-red-600 hover:!bg-red-700 focus-visible:ring-red-500"
            case "success":
                return "!bg-green-600 hover:!bg-green-700 focus-visible:ring-green-500"
            case "dark":
            default:
                return ""
        }
    }

    return (
        // Overlay
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            aria-labelledby="confirmation-modal-title"
            role="dialog"
            aria-modal="true"
        >
            {/* Modal Panel */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
                {/* Header */}
                <div className="flex items-start justify-between p-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        {confirmButtonType === "danger" && (
                            <div className="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-red-100 sm:mx-0 sm:h-8 sm:w-8">
                                <AlertTriangle
                                    className="h-5 w-5 text-red-600"
                                    aria-hidden="true"
                                />
                            </div>
                        )}
                        <h3
                            className="text-lg font-semibold leading-6 text-gray-900"
                            id="confirmation-modal-title"
                        >
                            {title}
                        </h3>
                    </div>
                    <button
                        type="button"
                        className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                        onClick={onClose}
                        disabled={isConfirming}
                        aria-label="Cerrar"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6">
                    <p className="text-sm text-gray-600">{message}</p>
                </div>

                {/* Footer */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 bg-gray-50 px-4 py-3 sm:px-6">
                    <Button
                        type="light"
                        onClick={onClose}
                        disabled={isConfirming}
                        className="w-full sm:w-auto"
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="custom"
                        className={`w-full sm:w-auto ${getConfirmButtonClasses()}`}
                        onClick={onConfirm}
                        disabled={isConfirming}
                    >
                        {isConfirming ? (
                            <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                        ) : (
                            confirmText
                        )}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmationModal
