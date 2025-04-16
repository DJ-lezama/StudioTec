import React, { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";
import catalogData, { categoryConfig } from "../../components/CatalogComponents/catalogData";


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

function BookingForm() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        category: "",
        serviceId: "",
        stylistId: "",
        date: "",
        time: "",
        name: "",
        email: "",
        phone: "",
        comments: "",
    });
    const navigate = useNavigate();


    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return format(date, "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate("/confirmacion");
        setFormData({
            category: "",
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

    const selectedService =
        formData.category && catalogData[formData.category]
            ? catalogData[formData.category].find(s => s.id === formData.serviceId)?.title
            : "";

    const selectedStylist = stylists.find(s => s.id === formData.stylistId)?.name || "";

    const renderStepContent = () => {
        switch (step) {
            case 1: // Categoría + Servicio
                const services = formData.category ? catalogData[formData.category] : [];
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">
                            ¿Qué servicio deseas reservar?
                        </h2>

                        {/* Selección de categoría */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {Object.entries(categoryConfig).map(([key, config]) => (
                                <div
                                    key={key}
                                    className={`p-4 border rounded-lg cursor-pointer ${
                                        formData.category === key
                                            ? "border-secondary bg-background"
                                            : "border-gray-300 hover:border-secondary"
                                    }`}
                                    onClick={() => setFormData({ ...formData, category: key, serviceId: "" })}
                                >
                                    <p className="font-medium text-textMain">{config.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Divider */}
                        {formData.category && <hr className="my-4 border-t border-gray-300" />}

                        {/* Selección de servicio */}
                        {formData.category && (
                            <>
                                <h3 className="text-h4 font-heading font-semibold text-textMain mt-6">
                                    Elige el servicio específico
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {services.map(service => (
                                        <div
                                            key={service.id}
                                            className={`p-4 border rounded-lg cursor-pointer ${
                                                formData.serviceId === service.id
                                                    ? "border-secondary bg-background"
                                                    : "border-gray-300 hover:border-secondary"
                                            }`}
                                            onClick={() => setFormData({ ...formData, serviceId: service.id })}
                                        >
                                            <p className="font-medium text-textMain">{service.title}</p>
                                            <p className="text-sm text-gray-500">{service.duration} - ${service.price}</p>
                                        </div>
                                    ))}
                                </div>
                            </>
                        )}

                        {/* Botón de continuar */}
                        <div className="flex justify-end pt-4">
                            <Button
                                type="dark"
                                onClick={nextStep}
                                disabled={!formData.serviceId}
                            >
                                Continuar
                            </Button>
                        </div>
                    </div>
                );

            case 2: // Selección de estilista (reinsertado)
                return (
                    <div className="space-y-6">
                        <h2 className="text-h3 font-heading font-semibold text-textMain">Selecciona un estilista</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {stylists.map((stylist) => (
                                <div
                                    key={stylist.id}
                                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                                        formData.stylistId === stylist.id
                                            ? "border-secondary bg-background"
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

                        <div className="space-y-6">
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
                                                        ? "border-secondary bg-background"
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

                <div className="flex mb-8">
                    {[1, 2, 3, 4, 5].map((n) => (
                        <div key={n} className="flex-1 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                                step === n ? "bg-secondary text-white" : "bg-gray-200 text-gray-500"
                            }`}>
                                {n}
                            </div>
                            <div className={`h-1 ${n < 6 ? "w-full" : "w-0"} ${n <= step ? "bg-secondary" : "bg-gray-200"}`} />
                        </div>
                    ))}
                </div>


                {renderStepContent()}
            </div>
        </div>
    );
}

export default BookingForm;