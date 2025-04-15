import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../../frontend/src/components/common/Button";

function BookingScreen() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        service: "",
        stylist: "",
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "",
        comments: "",
    });

    const services = [
        "Corte de cabello",
        "Peinado",
        "Coloración",
        "Tratamiento capilar",
        "Manicure",
        "Pedicure",
    ];

    const stylists = [
        "Estilista A",
        "Estilista B",
        "Estilista C",
    ];

    const availableTimes = [
        "09:00", "10:00", "11:00", "12:00",
        "13:00", "14:00", "15:00", "16:00",
        "17:00", "18:00"
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => {
        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulación de envío - en producción, aquí iría la llamada a la API
        alert("¡Reserva completada! Te enviaremos una confirmación por correo electrónico.");
        setFormData({
            service: "",
            stylist: "",
            date: "",
            time: "",
            name: "",
            email: "",
            phone: "",
            comments: "",
        });
        setStep(1);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona un servicio</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {services.map((service) => (
                                <div
                                    key={service}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                        formData.service === service
                                            ? "border-secondary bg-primary/30"
                                            : "border-gray-200 hover:border-secondary"
                                    }`}
                                    onClick={() => setFormData({ ...formData, service })}
                                >
                                    <span className="font-medium">{service}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-end">
                            <Button
                                type="dark"
                                onClick={nextStep}
                                className={formData.service ? "opacity-100" : "opacity-50 cursor-not-allowed"}
                                disabled={!formData.service}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona estilista</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {stylists.map((stylist) => (
                                <div
                                    key={stylist}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                                        formData.stylist === stylist
                                            ? "border-secondary bg-primary/30"
                                            : "border-gray-200 hover:border-secondary"
                                    }`}
                                    onClick={() => setFormData({ ...formData, stylist })}
                                >
                                    <span className="font-medium">{stylist}</span>
                                </div>
                            ))}
                        </div>
                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>
                                Atrás
                            </Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                className={formData.stylist ? "opacity-100" : "opacity-50 cursor-not-allowed"}
                                disabled={!formData.stylist}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona fecha y hora</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-body-s font-medium mb-2">Fecha</label>
                                <input
                                    type="date"
                                    name="date"
                                    min={format(new Date(), "yyyy-MM-dd")}
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-body-s font-medium mb-2">Hora</label>
                                <select
                                    name="time"
                                    value={formData.time}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                    disabled={!formData.date}
                                >
                                    <option value="">Selecciona una hora</option>
                                    {availableTimes.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>
                                Atrás
                            </Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                className={(formData.date && formData.time) ? "opacity-100" : "opacity-50 cursor-not-allowed"}
                                disabled={!formData.date || !formData.time}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Tus datos</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-body-s font-medium mb-2">Nombre completo</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-body-s font-medium mb-2">Correo electrónico</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-body-s font-medium mb-2">Teléfono</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    required
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-body-s font-medium mb-2">Comentarios (opcional)</label>
                                <textarea
                                    name="comments"
                                    value={formData.comments}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                                    rows="3"
                                ></textarea>
                            </div>
                        </div>
                        <div className="pt-4 flex justify-between">
                            <Button type="transparent" onClick={prevStep}>
                                Atrás
                            </Button>
                            <Button
                                type="dark"
                                onClick={nextStep}
                                className={(formData.name && formData.email && formData.phone) ? "opacity-100" : "opacity-50 cursor-not-allowed"}
                                disabled={!formData.name || !formData.email || !formData.phone}
                            >
                                Continuar
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
                                    <p className="text-body-m font-medium">{formData.service}</p>
                                </div>
                                <div>
                                    <p className="text-body-s text-gray-500">Estilista</p>
                                    <p className="text-body-m font-medium">{formData.stylist}</p>
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
                            <Button type="transparent" onClick={prevStep}>
                                Atrás
                            </Button>
                            <Button type="dark" onClick={handleSubmit}>
                                Confirmar reserva
                            </Button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen pt-24 px-6 sm:px-8 lg:px-16 bg-primaryLight">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8">
                <h1 className="text-h2 font-heading font-bold text-textMain mb-6">Agenda tu cita</h1>

                {/* Progress bar */}
                <div className="mb-8">
                    <div className="flex justify-between">
                        {[1, 2, 3, 4, 5].map((stepNumber) => (
                            <div key={stepNumber} className="flex flex-col items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mb-1
                    ${step >= stepNumber ? "bg-secondary text-white" : "bg-gray-200 text-gray-500"}`}
                                >
                                    {stepNumber}
                                </div>
                                <span className="text-xs text-gray-500 hidden sm:block">
                  {stepNumber === 1 && "Servicio"}
                                    {stepNumber === 2 && "Estilista"}
                                    {stepNumber === 3 && "Fecha/Hora"}
                                    {stepNumber === 4 && "Datos"}
                                    {stepNumber === 5 && "Confirmar"}
                </span>
                            </div>
                        ))}
                    </div>
                    <div className="relative mt-2">
                        <div className="absolute top-0 h-1 w-full bg-gray-200 rounded"></div>
                        <div
                            className="absolute top-0 h-1 bg-secondary rounded transition-all duration-300"
                            style={{ width: `${(step - 1) * 25}%` }}
                        ></div>
                    </div>
                </div>

                {/* Form content */}
                <form>{renderStepContent()}</form>
            </div>
        </div>
    );
}

export default BookingScreen;