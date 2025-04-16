import React from "react";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const BookingConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-primaryLight px-4 py-24 text-center">
            <CheckCircle size={80} className="text-secondary mb-6" />
            <h1 className="text-h2 font-heading font-bold text-textMain mb-4">
                ¡Reserva confirmada!
            </h1>
            <p className="text-textMain text-lg max-w-xl mb-8">
                Gracias por agendar tu cita. Hemos enviado la confirmación a tu correo electrónico.
                Si necesitas cambiar algo, no dudes en contactarnos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button type="cta" onClick={() => navigate("/")}>
                    Ir al inicio
                </Button>
                <Button type="roundedLight" onClick={() => navigate("/perfil")}>
                    Ver mis citas
                </Button>
            </div>
        </div>
    );
};

export default BookingConfirmation;
