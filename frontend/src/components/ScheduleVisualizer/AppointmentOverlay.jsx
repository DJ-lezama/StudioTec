
import React from "react";
import { X } from "lucide-react";

function AppointmentDetailsOverlay({ appointment, onClose }) {
    if (!appointment) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
            />

            {/* Side Overlay (Right side + wider) */}
            <div className="relative w-[500px] bg-white shadow-lg p-6 overflow-y-auto z-50 h-full">
                <button
                    className="absolute top-4 right-4 text-textMain hover:text-textMain/70"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-h4 font-heading text-textMain mb-4 font-medium">
                    Detalles de la cita
                </h2>

                <div className="space-y-4">
                    <div>
                        <p className="text-body-s text-textMain/70">Servicio</p>
                        <p className="text-body-m text-textMain font-medium">{appointment.service}</p>
                    </div>

                    <div>
                        <p className="text-body-s text-textMain/70">Fecha</p>
                        <p className="text-body-m text-textMain font-medium">{appointment.date}</p>
                    </div>

                    <div>
                        <p className="text-body-s text-textMain/70">Hora</p>
                        <p className="text-body-m text-textMain font-medium">{appointment.time}</p>
                    </div>

                    <div>
                        <p className="text-body-s text-textMain/70">Estilista</p>
                        <p className="text-body-m text-textMain font-medium">{appointment.stylist}</p>
                    </div>

                    <div>
                        <p className="text-body-s text-textMain/70">Cliente</p>
                        <p className="text-body-m text-textMain font-medium">{appointment.client}</p>
                    </div>

                    {appointment.referenceImage && (
                        <div>
                            <p className="text-body-s text-textMain/70">Imagen de referencia</p>
                            <img
                                src={appointment.referenceImage}
                                alt="Imagen deseada"
                                className="w-full h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    {appointment.hairImage && (
                        <div>
                            <p className="text-body-s text-textMain/70">Imagen de cabello actual</p>
                            <img
                                src={appointment.hairImage}
                                alt="Cabello actual"
                                className="w-full h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    {appointment.comments && (
                        <div>
                            <p className="text-body-s text-textMain/70">Comentarios del estilista</p>
                            <p className="text-body-m text-textMain">{appointment.comments}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AppointmentDetailsOverlay;
