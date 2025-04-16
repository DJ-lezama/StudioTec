import React from 'react';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate para la redirección
import fondo from '../../assets/MainView1.png';
import decoracion from '../../assets/wave.svg';
import Button from '../../components/common/Button.jsx';
import { ArrowRight } from 'lucide-react';

function MainView() {
    // Utilizamos el hook useNavigate para obtener la función de navegación
    const navigate = useNavigate();

    // Función para manejar la redirección a la página de agendar cita
    const handleBookingClick = () => {
        navigate('/agendar');
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden pt-16">
            <div className="absolute inset-0 -z-10">
                <img
                    src={fondo}
                    alt="Fondo"
                    className="h-full w-full object-cover object-center"
                />
            </div>

            <div className="absolute top-0.5 left-0 w-full z-0 overflow-hidden">
                <img
                    src={decoracion}
                    alt="Decoración"
                    className="w-full min-w-[1200px] -translate-y-32 sm:-translate-y-36 md:-translate-y-44"
                />
            </div>

            {/* Botón actualizado con función de navegación */}
            <div className="absolute bottom-2/4 md:right-1/3 right-4 md:translate-x-40 z-20">
                <Button
                    type="rounded"
                    icon={<ArrowRight size={16} />}
                    className="px-4 py-2 md:px-8 md:py-3 font-semibold text-sm md:text-base"
                    onClick={handleBookingClick} // Agregamos el manejador de eventos
                >
                    Agenda tu cita
                </Button>
            </div>

            <div className="relative z-10 flex flex-col items-center justify-start h-screen text-center pt-24 sm:pt-20 md:pt-16">
                <div className="-mt-8 sm:-mt-12 md:-mt-16 lg:-mt-24">
                    <h1 className="text-[80px] md:text-[120px] lg:text-[180px] leading-[1] md:leading-[1] lg:leading-[1.7] font-bold font-heading text-textMain mb-0">
                        Studio Tec
                    </h1>
                    <p className="text-[20px] md:text-[30px] lg:text-[40px] leading-[1.2] md:leading-[1.2] lg:leading-[1.2] font-bold font-heading text-textMain -mt-2 sm:-mt-6 md:-mt-8">
                        Tu belleza, nuestra pasión
                    </p>
                </div>
            </div>
        </div>
    );
}

export default MainView;