import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, Scissors, Hand, Eye } from "lucide-react"

import imgCorte from "../../assets/Corte.png"
import imgManos from "../../assets/manicura.png"
import imgCejas from "../../assets/Cejas.png"

import Button from "../../components/common/Button.jsx"

const ServicesView = () => {
    const [activeService, setActiveService] = useState(null)
    const navigate = useNavigate()

    const handleBookingClick = () => {
        navigate("/catalogo")
    }

    const servicios = [
        {
            id: "hair",
            nombre: "Cabello",
            imagen: imgCorte,
            iconoReact: <Scissors className="w-6 h-6 text-[#3B0A20]" />,
            descripcion:
                "Desde cortes clásicos hasta las últimas tendencias, adaptamos cada estilo a tu personalidad y forma de rostro.",
            precio: "Desde $250",
        },
        {
            id: "nails",
            nombre: "Uñas",
            imagen: imgManos,
            iconoReact: <Hand className="w-6 h-6 text-[#3B0A20]" />,
            descripcion:
                "Cuida tus manos y pies con nuestros tratamientos profesionales. Ofrecemos diseños personalizados y los mejores productos.",
            precio: "Desde $200",
        },
        {
            id: "eyebrows",
            nombre: "Cara",
            imagen: imgCejas,
            iconoReact: <Eye className="w-6 h-6 text-[#3B0A20]" />,
            descripcion:
                "Realza tu mirada con el diseño y perfilado de cejas que mejor se adapte a tus facciones.",
            precio: "Desde $180",
        },
    ]

    return (
        <section className="w-full bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <div className="text-center mb-16">
                    <h2 className="text-h2 font-bold text-textMain mb-6">
                        Nuestros servicios
                    </h2>
                    <p className="text-xl text-textMain max-w-3xl mx-auto">
                        Cada servicio es una experiencia pensada para ti,
                        combinando técnica, creatividad y productos de alta
                        calidad.
                    </p>
                </div>

                <div className="bg-textMain rounded-[40px] p-2 sm:p-8 shadow-xl">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {servicios.map((servicio) => (
                            <div
                                key={servicio.id}
                                className="group relative transition-all duration-300 cursor-pointer"
                                onMouseEnter={() =>
                                    setActiveService(servicio.id)
                                }
                                onMouseLeave={() => setActiveService(null)}
                            >
                                <div className="overflow-hidden rounded-3xl shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2">
                                    <div className="relative">
                                        <img
                                            src={servicio.imagen}
                                            alt={`Servicio de ${servicio.nombre}`}
                                            className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                                        />

                                        <div
                                            className={`absolute inset-0 bg-gradient-to-t from-textMain to-transparent opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col justify-end p-6`}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-2">
                                                {servicio.nombre}
                                            </h3>
                                            <p className="text-white/90 mb-4">
                                                {servicio.descripcion}
                                            </p>
                                            <div className="flex justify-between items-center">
                                                <span className="text-background text-lg font-semibold">
                                                    {servicio.precio}
                                                </span>
                                                <Button
                                                    type="roundedLight"
                                                    className="text-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/catalogo?categoria=${servicio.id}`,
                                                        )
                                                    }
                                                >
                                                    Ver más
                                                </Button>
                                            </div>
                                        </div>

                                        {/* Ícono react visible siempre */}
                                        <div className="absolute top-4 right-4 bg-white/90 p-3 rounded-full shadow-lg transform transition-transform duration-300 group-hover:rotate-12">
                                            {servicio.iconoReact}
                                        </div>
                                    </div>
                                </div>

                                <h3 className="text-center text-xl font-semibold text-[#3B0A20] mt-4 md:hidden">
                                    {servicio.nombre}
                                </h3>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-white text-center">
                        <p className="text-xl max-w-4xl mx-auto leading-relaxed">
                            Queremos que te sientas segura, feliz y hermosa, ya
                            sea con un nuevo look, uñas impecables o cejas
                            perfectamente definidas
                        </p>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <Button
                        onClick={handleBookingClick}
                        type="cta"
                        icon={<ArrowRight size={16} />}
                        className="py-3 px-8 font-semibold"
                    >
                        Ver todos los servicios
                    </Button>
                </div>
            </div>
        </section>
    )
}

export default ServicesView
