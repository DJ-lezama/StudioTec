import React, { useState } from "react"
import Button from "../../components/common/Button"

function CustomVisitForm() {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        preferredDate: "",
        preferredTime: "",
        serviceInterest: "",
        stylingReference: "",
        comments: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Solicitud de visita personalizada enviada:", form)
        alert("¡Gracias! Hemos recibido tu solicitud.")
        setForm({
            name: "",
            phone: "",
            email: "",
            preferredDate: "",
            preferredTime: "",
            serviceInterest: "",
            stylingReference: "",
            comments: "",
        })
    }

    return (
        <div className="min-h-screen pt-32 px-6 pb-24 flex items-center justify-center bg-primaryLight">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8">
                <h2 className="text-h3 font-heading font-bold text-textMain mb-6 text-center">
                    Solicita una visita personalizada
                </h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="Teléfono de contacto"
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Correo electrónico"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="date"
                            name="preferredDate"
                            value={form.preferredDate}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="time"
                            name="preferredTime"
                            value={form.preferredTime}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <input
                        type="text"
                        name="serviceInterest"
                        value={form.serviceInterest}
                        onChange={handleChange}
                        placeholder="¿Qué servicio te interesa? (Ej. corte, peinado, coloración)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="text"
                        name="stylingReference"
                        value={form.stylingReference}
                        onChange={handleChange}
                        placeholder="¿Tienes alguna referencia o inspiración de estilo? (link opcional)"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                    <textarea
                        name="comments"
                        value={form.comments}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Comentarios adicionales o necesidades especiales"
                        className="w-full p-3 border border-gray-300 rounded-lg"
                    ></textarea>

                    <div className="pt-4 flex justify-end">
                        <Button type="dark" className="px-8 py-3">
                            Enviar solicitud
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default CustomVisitForm
