import React from "react"
import Button from "../../../components/common/Button"

const ConfirmationStep = ({
    formData,
    onPrev,
    onSubmit,
    selectedService,
    isSubmitting,
    selectedStylist,
    formatDate,
}) => {
    return (
        <div className="space-y-6">
            <h2 className="text-h3 font-heading font-semibold text-textMain">
                Confirma tu reserva
            </h2>
            {/* Details Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Service */}
                    <div>
                        <p className="text-body-s text-gray-500">Servicio</p>{" "}
                        <p className="text-body-m font-medium">
                            {selectedService || "No seleccionado"}{" "}
                        </p>
                    </div>
                    {/* Stylist */}
                    <div>
                        <p className="text-body-s text-gray-500">Estilista</p>{" "}
                        <p className="text-body-m font-medium">
                            {selectedStylist || "No seleccionado"}{" "}
                        </p>
                    </div>
                    {/* Date */}
                    <div>
                        <p className="text-body-s text-gray-500">Fecha</p>{" "}
                        <p className="text-body-m font-medium">
                            {formData.date
                                ? formatDate(formData.date)
                                : "No seleccionada"}{" "}
                        </p>
                    </div>
                    {/* Time */}
                    <div>
                        <p className="text-body-s text-gray-500">Hora</p>{" "}
                        <p className="text-body-m font-medium">
                            {formData.time || "No seleccionada"}{" "}
                        </p>
                    </div>
                    {/* Client Name */}
                    <div>
                        <p className="text-body-s text-gray-500">Nombre</p>{" "}
                        <p className="text-body-m font-medium">
                            {formData.name || "No ingresado"}{" "}
                        </p>
                    </div>
                    {/* Contact Info (Email/Phone - Display purposes only) */}
                    <div>
                        <p className="text-body-s text-gray-500">Contacto</p>{" "}
                        <p className="text-body-m font-medium">
                            {formData.email || "-"}{" "}
                        </p>
                        {formData.phone && (
                            <p className="text-body-m font-medium">
                                {formData.phone}
                            </p>
                        )}
                    </div>
                    {/* Comments */}
                    {formData.comments && (
                        <div className="md:col-span-2">
                            <p className="text-body-s text-gray-500">
                                Comentarios
                            </p>
                            <p className="text-body-m">
                                {formData.comments}
                            </p>{" "}
                        </div>
                    )}
                </div>
            </div>
            {/* Action Buttons */}
            <div className="pt-4 flex justify-between">
                {/* Back Button */}
                <Button
                    type="transparent"
                    onClick={onPrev}
                    disabled={isSubmitting}
                >
                    {" "}
                    Atrás
                </Button>
                {/* Confirm Button */}
                <Button type="dark" onClick={onSubmit} disabled={isSubmitting}>
                    {isSubmitting ? "Confirmando..." : "Confirmar reserva"}{" "}
                </Button>
            </div>
        </div>
    )
}

export default ConfirmationStep
