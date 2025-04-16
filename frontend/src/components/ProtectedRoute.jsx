import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../screens/MainPageScreens/AuthenticationScreens/AuthContext.jsx';

// Componente que protege rutas para usuarios autenticados
function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // Mostrar un indicador de carga mientras verificamos el estado de autenticación
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        );
    }

    // Redireccionar a la página de autenticación si no hay usuario
    if (!currentUser) {
        return <Navigate to="/auth" />;
    }

    // Renderizar el contenido si el usuario está autenticado
    return children;
}

// Componente que protege rutas para estilistas
function StylistRoute({ children }) {
    const { currentUser, loading } = useAuth();

    // Mostrar un indicador de carga mientras verificamos el estado de autenticación
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        );
    }

    // Redireccionar a la página de autenticación si no hay usuario
    if (!currentUser) {
        return <Navigate to="/auth" />;
    }

    // Redireccionar a la página principal si no es estilista
    if (currentUser.role !== 'stylist') {
        return <Navigate to="/" />;
    }

    // Renderizar el contenido si el usuario es estilista
    return children;
}

export { ProtectedRoute, StylistRoute };