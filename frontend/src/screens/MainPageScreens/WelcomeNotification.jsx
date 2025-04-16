import React, {useEffect, useState} from 'react';
import useAuth from "../../features/auth/hooks/useAuth.js";

function WelcomeNotification() {
    const [visible, setVisible] = useState(false);
    const {currentUser} = useAuth();

    useEffect(() => {
        // Si hay un usuario y es un inicio de sesión reciente (primeros 5 segundos)
        if (currentUser) {
            setVisible(true);

            // Ocultar después de 5 segundos
            const timer = setTimeout(() => {
                setVisible(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [currentUser]);

    if (!visible) return null;

    return (
        <div
            className="fixed bottom-4 right-4 bg-white shadow-lg rounded-lg p-4 max-w-xs z-50 border-l-4 border-secondary">
            <div className="flex items-start">
                <div>
                    <h3 className="font-medium text-textMain">¡Bienvenido/a {currentUser.name}!</h3>
                    <p className="text-sm text-gray-600 mt-1">Has iniciado sesión correctamente.</p>
                </div>
                <button
                    onClick={() => setVisible(false)}
                    className="ml-4 text-gray-400 hover:text-gray-600"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default WelcomeNotification;