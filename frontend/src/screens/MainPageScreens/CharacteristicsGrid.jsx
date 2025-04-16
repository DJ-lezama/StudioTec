import React from "react"
import { Link } from "react-router-dom"

import serviceImage from "../../assets/1.png"
import qualityImage from "../../assets/2.png"
import paymentImage from "../../assets/3.png"
import ScissorIcon from "../../assets/BrushIcon"
import StylistIcon from "../../assets/PersonIcon"
import PaymentIcon from "../../assets/PaymentIcon"

function CharacteristicsGrid() {
    return (
        <div className="w-full bg-white">
            <div className="w-full max-w-[2000px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Imagen 1 */}
                <div className="aspect-square overflow-hidden">
                    <img
                        src={serviceImage}
                        alt="Servicio personalizado"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Texto 1 → Catálogo */}
                <Link
                    to="/catalogo"
                    className="aspect-square bg-textMain text-primary group flex flex-col justify-end p-8 md:p-12 transition duration-300 hover:bg-primary hover:text-textMain"
                >
                    <div className="mb-6 transition-colors duration-300 group-hover:text-textMain">
                        <ScissorIcon />
                    </div>
                    <div>
                        <span className="text-2xl md:text-3xl font-bold mb-4 block">
                            Servicio personalizado
                        </span>
                        <p className="text-sm md:text-base">
                            Adaptamos cada servicio a tus necesidades
                            específicas para brindarte la mejor experiencia.
                        </p>
                    </div>
                </Link>

                {/* Imagen 2 */}
                <div className="aspect-square overflow-hidden">
                    <img
                        src={qualityImage}
                        alt="Estilistas profesionales"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Texto 2 → Nosotros */}
                <Link
                    to="/nosotros"
                    className="aspect-square bg-textMain text-primary group flex flex-col justify-end p-8 md:p-12 transition duration-300 hover:bg-primary hover:text-textMain"
                >
                    <div className="mb-6 transition-colors duration-300 group-hover:text-textMain">
                        <StylistIcon />
                    </div>
                    <div>
                        <span className="text-2xl md:text-3xl font-bold mb-4 block">
                            Estilistas profesionales
                        </span>
                        <p className="text-sm md:text-base">
                            Nuestro equipo está formado por profesionales con
                            experiencia y formación continua en tendencias.
                        </p>
                    </div>
                </Link>

                {/* Imagen 3 */}
                <div className="aspect-square overflow-hidden">
                    <img
                        src={paymentImage}
                        alt="Opciones de pago"
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Texto 3 → Agendar */}
                <Link
                    to="/agendar"
                    className="aspect-square bg-textMain text-primary group flex flex-col justify-end p-8 md:p-12 transition duration-300 hover:bg-primary hover:text-textMain"
                >
                    <div className="mb-6 transition-colors duration-300 group-hover:text-textMain">
                        <PaymentIcon />
                    </div>
                    <div>
                        <span className="text-2xl md:text-3xl font-bold mb-4 block">
                            Múltiples opciones de pago
                        </span>
                        <p className="text-sm md:text-base">
                            Aceptamos tarjeta, transferencia o efectivo. Elige
                            la opción que mejor se adapte a ti.
                        </p>
                    </div>
                </Link>
            </div>
        </div>
    )
}

export default CharacteristicsGrid
