import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../../frontend/src/components/common/Button";

const services = [
    { id: "corte", name: "Corte de cabello" },
    { id: "peinado", name: "Peinado" },
    { id: "coloracion", name: "Coloración" },
    { id: "tratamiento", name: "Tratamiento capilar" },
    { id: "manicure", name: "Manicure" },
    { id: "pedicure", name: "Pedicure" },
];

const stylists = [
    { id: "stylistA", name: "Estilista A" },
    { id: "stylistB", name: "Estilista B" },
    { id: "stylistC", name: "Estilista C" },
];

const availableTimes = [
    "09:00", "10:00", "11:00", "12:00",
    "13:00", "14:00", "15:00", "16:00",
    "17:00", "18:00"
];

function BookingScreen() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        serviceId: "",
        stylistId: "",
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "",
        comments: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Aquí se enviaría la información de la reserva al backend
        const bookingToSave = {
            serviceId: formData.serviceId,
            stylistId: formData.stylistId,
            date: formData.date,
            time: formData.time,
            client: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
            },
            comments: formData.comments || null,
            createdAt: new Date().toISOString(),
        };

        // Por ahora, solo mostramos una alerta
        alert("¡Reserva completada! Te enviaremos una confirmación por correo electrónico.");
        // Reiniciar el formulario
        setFormData({
            serviceId: "",
            stylistId: "",
            date: "",
            time: "",
            name: "",
            email: "",
            phone: "",
            comments: "",
        });
        setStep(1);
    };

    const renderStepContent = () => {
        const selectedService = services.find(s => s.id === formData.serviceId)?.name || "";
        const selectedStylist = stylists.find(s => s.id === formData.stylistId)?.name || "";

        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona un servicio</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                        formData.serviceId === service.id
                                            ? "border-secondary bg-primary"
                                            : "border-gray-200 hover:border-secondary hover:bg-primary/30"
                                    }`}
                                    onClick={() => setFormData({...formData, serviceId: service.id})}
                                >
                                    <p className="font-medium text-textMain">{service.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button
                                type="dark"
                                onClick={nextStep}
                                disabled={!formData.serviceId}
                                className={!formData.serviceId ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona un estilista</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stylists.map((stylist) => (
                                <div
                                    key={stylist.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                        formData.stylistId === stylist.id
                                            ? "border-secondary bg-primary"
                                            : "border-gray-200 hover:border-secondary hover:bg-primary/30"
                                    }`}
                                    onClick={() => setFormData({...formData, stylistId: stylist.id})}
                                >
                                    <p className="font-medium text-textMain">{stylist.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>Atrás</Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                disabled={!formData.stylistId}
                                className={!formData.stylistId ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            case 3:
                const today = new Date();
                const minDate = today.toISOString().split('T')[0];
                const maxDate = new Date(today);
                maxDate.setMonth(maxDate.getMonth() + 3);
                const maxDateStr = maxDate.toISOString().split('T')[0];

                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona fecha y hora</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-textMain font-medium mb-2">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    min={minDate}
                                    max={maxDateStr}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                />
                            </div>

                            {formData.date && (
                                <div>
                                    <label className="block text-textMain font-medium mb-2">Hora</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                                        {availableTimes.map((time) => (
                                            <div
                                                key={time}
                                                className={`p-2 text-center border rounded-lg cursor-pointer transition-colors duration-200 ${
                                                    formData.time === time
                                                        ? "border-secondary bg-primary"
                                                        : "border-gray-200 hover:border-secondary hover:bg-primary/30"
                                                }`}
                                                onClick={() => setFormData({...formData, time})}
                                            >
                                                {time}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>Atrás</Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                disabled={!formData.date || !formData.time}
                                className={!formData.date || !formData.time ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Tus datos personales</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-textMain font-medium mb-2">Nombre completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Ej. María González"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-textMain font-medium mb-2">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Ej. maria@ejemplo.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-textMain font-medium mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Ej. 222 123 4567"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-textMain font-medium mb-2">Comentarios adicionales (opcional)</label>
                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    placeholder="Si tienes alguna solicitud especial, déjanos saber"
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>Atrás</Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                disabled={!formData.name || !formData.email || !formData.phone}
                                className={!formData.name || !formData.email || !formData.phone ? "opacity-50 cursor-not-allowed" : ""}
                            >
                                Revisar y confirmar
                            </Button>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Confirma tu reserva</h2>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-body-s text-gray-500">Servicio</p>
                                    <p className="text-body-m font-medium">{selectedService}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Estilista</p>
                                    <p className="text-body-m font-medium">{selectedStylist}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Fecha</p>
                                    <p className="text-body-m font-medium">{formatDate(formData.date)}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Hora</p>
                                    <p className="text-body-m font-medium">{formData.time}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Nombre</p>
                                    <p className="text-body-m font-medium">{formData.name}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Contacto</p>
                                    <p className="text-body-m font-medium">{formData.email}</p>
                                    <p className="text-body-m font-medium">{formData.phone}</p>
                                </div>
                                {formData.comments && (
                                    <div className="md:col-span-2">
                                        <p className="text-body-s text-gray-500">Comentarios</p>
                                        <p className="text-body-m">{formData.comments}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>Atrás</Button>
                            <Button type="dark" onClick={handleSubmit}>Confirmar reserva</Button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-6 sm:px-8 lg:px-16 bg-primaryLight">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-8">
                <h1 className="text-h2 font-heading font-bold text-textMain mb-6">Agenda tu cita</h1>

                {/* Progress indicator */}
                <div className="flex mb-8">
                    {[1, 2, 3, 4, 5].map((stepNumber) => (
                        <div key={stepNumber} className="flex-1 flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                    stepNumber === step
                                        ? "bg-secondary text-white"
                                        : stepNumber < step
                                            ? "bg-secondary/30 text-white"
                                            : "bg-gray-200 text-gray-500"
                                }`}
                            >
                                {stepNumber}
                            </div>
                            <div
                                className={`h-1 ${stepNumber < 5 ? "w-full" : "w-0"} ${
                                    stepNumber < step ? "bg-secondary/30" : "bg-gray-200"
                                }`}
                            />
                        </div>
                    ))}
                </div>

                {renderStepContent()}
            </div>
        </div>
    );
}

export default BookingScreen;