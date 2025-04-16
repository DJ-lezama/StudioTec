import React from 'react';
import imagenEquipo from '../../assets/EquipoStudio.png';
import { Scissors, Heart, Award, Users } from 'lucide-react';

const AboutSection = () => {
    return (
        <section className="w-full bg-white">
            {/* Hero con imagen de fondo */}
            <div className="relative w-full h-[100vh] md:h-[90vh] lg:h-screen">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${imagenEquipo})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(62,10,33,0.85)]" />
                </div>

                {/* Contenido sobrepuesto: título + texto centrado en el tercio inferior */}
                <div className="absolute inset-0 flex items-end justify-center px-4 sm:px-8 pb-20 text-center">
                    <div className="max-w-4xl">
                        {/* Título con fondo degradado */}
                        <div className="absolute top-28 left-10 z-10">
                            <h1 className="text-textMain text-5xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight drop-shadow-lg">
                                ¿Quiénes somos?
                            </h1>
                        </div>



                        {/* Texto debajo del título */}
                        <p className="text-white text-lg sm:text-xl md:text-2xl leading-relaxed px-4 sm:px-10 backdrop-blur-md bg-white/10 py-4 rounded-2xl shadow-md">
                            Somos dos hermanas que convirtieron su pasión por la belleza en un espacio donde cada cliente recibe atención personalizada y servicios de la más alta calidad.
                        </p>
                    </div>
                </div>

            </div>

            {/* Sección de valores */}
            <div className="bg-primaryLight py-20">
                <div className="max-w-[1200px] mx-auto px-6 md:px-10">
                    <h2 className="text-h3 md:text-h2 font-bold text-textMain text-center mb-14 font-heading">
                        Nuestros valores
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10">
                        {[
                            {
                                icon: <Heart className="w-7 h-7 text-textMain" />,
                                title: "Pasión",
                                text: "Amamos lo que hacemos y nos dedicamos con entusiasmo a cada detalle de nuestro trabajo.",
                            },
                            {
                                icon: <Award className="w-7 h-7 text-textMain" />,
                                title: "Excelencia",
                                text: "Nos esforzamos por ofrecer servicios de la más alta calidad, superando siempre las expectativas.",
                            },
                            {
                                icon: <Scissors className="w-7 h-7 text-textMain" />,
                                title: "Creatividad",
                                text: "Buscamos innovar constantemente, incorporando las últimas tendencias y técnicas a nuestros servicios.",
                            },
                            {
                                icon: <Users className="w-7 h-7 text-textMain" />,
                                title: "Comunidad",
                                text: "Creamos relaciones cercanas con nuestras clientas, formando una comunidad basada en la confianza.",
                            },
                        ].map((valor, idx) => (
                            <div
                                key={idx}
                                className="bg-white p-6 md:p-8 rounded-3xl shadow-md flex flex-col items-center text-center transition-transform hover:-translate-y-2"
                            >
                                <div className="w-14 h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mb-5">
                                    {valor.icon}
                                </div>
                                <h3 className="text-h5 md:text-h4 font-bold text-textMain mb-3 font-heading">
                                    {valor.title}
                                </h3>
                                <p className="text-body-s md:text-body-m text-textMain/80">
                                    {valor.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;
