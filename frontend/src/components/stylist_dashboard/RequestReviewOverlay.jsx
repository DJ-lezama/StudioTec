// src/components/RequestReviewOverlay.jsx
import React, { useState } from "react"
import Button from "../../components/common/Button.jsx"
const RequestReviewOverlay = ({ request, onClose }) => {
    const [decision, setDecision] = useState(null)
    const [suggestion, setSuggestion] = useState("")

    if (!request) return null

    return (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30">
            <div className="w-full sm:w-[400px] h-full bg-white shadow-lg flex flex-col">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <button onClick={onClose} className="text-xl font-bold">
                        ←
                    </button>
                    <h2 className="text-subtitle-m font-heading font-semibold text-textMain">
                        Revisar solicitud
                    </h2>
                </div>

                <div className="p-4 space-y-4 overflow-y-auto">
                    <div>
                        <h3 className="text-body-m font-semibold text-textMain mb-1">
                            Información de cita
                        </h3>
                        <p className="text-sm text-textMain">
                            Servicio: {request.service}
                        </p>
                        <p className="text-sm text-textMain">
                            Fecha: {request.date}
                        </p>
                        <p className="text-sm text-textMain">
                            Hora: {request.time}
                        </p>
                        <p className="text-sm text-textMain">
                            Estilista: {request.stylist}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-body-m font-semibold text-textMain mb-2">
                            Imágenes adjuntas
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            <img
                                src={request.hairImage}
                                alt="Cabello actual"
                                className="rounded-lg w-full h-32 object-cover"
                            />
                            <img
                                src={request.referenceImage}
                                alt="Referencia"
                                className="rounded-lg w-full h-32 object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-textMain">
                            Acción
                        </label>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="action"
                                    onChange={() => setDecision("accept")}
                                />{" "}
                                Aceptar
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="action"
                                    onChange={() => setDecision("reject")}
                                />{" "}
                                Rechazar
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="action"
                                    onChange={() => setDecision("suggest")}
                                />{" "}
                                Hacer sugerencias
                            </label>
                        </div>
                    </div>

                    {decision === "suggest" && (
                        <div className="mt-2">
                            <label className="block text-sm font-medium text-textMain mb-1">
                                Sugerencia
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                placeholder="Escribe tus sugerencias aquí..."
                                value={suggestion}
                                onChange={(e) => setSuggestion(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="pt-4">
                        <Button
                            type="dark"
                            onClick={() =>
                                console.log({ decision, suggestion })
                            }
                        >
                            Enviar
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RequestReviewOverlay
