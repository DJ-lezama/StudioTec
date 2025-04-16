import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthenticationScreens/AuthContext.jsx";
import Button from "../../components/common/Button";

function ProfileScreen() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [form, setForm] = useState({
        name: currentUser?.name || "",
        email: currentUser?.email || "",
    });

    // Si no hay usuario autenticado, redirigir a la página de inicio de sesión
    if (!currentUser) {
        navigate("/auth");
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        // Aquí iría la lógica para actualizar los datos del usuario
        // En una implementación real, esto se conectaría con el backend

        // Simulamos actualizar el usuario
        const updatedUser = {
            ...currentUser,
            name: form.name,
        };

        localStorage.setItem("studioTecUser", JSON.stringify(updatedUser));
        setIsEditing(false);

        // Recargamos la página para ver los cambios
        window.location.reload();
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <div className="min-h-screen pt-24 px-6 py-40">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
                <div className="md:flex">
                    <div className="md:flex-shrink-0 bg-secondary p-8 text-white md:w-64">
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-textMain text-3xl font-bold mb-4">
                                {currentUser.name.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-semibold">{currentUser.name}</h2>
                            <p className="text-white/80">{currentUser.email}</p>
                            <p className="mt-2 text-white/70 capitalize text-sm">
                                {currentUser.role === "stylist" ? "Estilista" : "Cliente"}
                            </p>
                        </div>

                        <div className="mt-8 space-y-2">
                            <button
                                className="w-full text-left px-3 py-2 rounded hover:bg-secondary/90 transition"
                                onClick={() => setIsEditing(false)}
                            >
                                Información de perfil
                            </button>

                            {currentUser.role === "stylist" && (
                                <button
                                    className="w-full text-left px-3 py-2 rounded hover:bg-secondary/90 transition"
                                    onClick={() => navigate("/stylist/dashboard")}
                                >
                                    Panel de estilista
                                </button>
                            )}

                            <button
                                className="w-full text-left px-3 py-2 rounded hover:bg-red-700 transition"
                                onClick={handleLogout}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    </div>

                    <div className="p-8 w-full">
                        <h3 className="text-h4 font-heading font-semibold mb-6">
                            {isEditing ? "Editar perfil" : "Información de perfil"}
                        </h3>

                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-textMain mb-1">
                                        Nombre completo
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-textMain mb-1">
                                        Correo electrónico
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        disabled
                                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">El correo electrónico no se puede cambiar</p>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="dark" onClick={handleSave}>
                                        Guardar cambios
                                    </Button>
                                    <Button type="transparent" onClick={() => setIsEditing(false)}>
                                        Cancelar
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Nombre completo</h4>
                                    <p className="text-lg">{currentUser.name}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Correo electrónico</h4>
                                    <p className="text-lg">{currentUser.email}</p>
                                </div>

                                <div>
                                    <h4 className="text-sm font-medium text-gray-500">Rol</h4>
                                    <p className="text-lg capitalize">
                                        {currentUser.role === "stylist" ? "Estilista" : "Cliente"}
                                    </p>
                                </div>

                                <div className="pt-4">
                                    <Button type="dark" onClick={() => setIsEditing(true)}>
                                        Editar perfil
                                    </Button>
                                </div>

                                {currentUser.role === "client" && (
                                    <div className="border-t border-gray-200 pt-6 mt-8">
                                        <h4 className="text-subtitle-m font-medium mb-4">Historial de citas</h4>
                                        <p className="text-gray-500">No tienes citas previas.</p>
                                        <div className="mt-4">
                                            <Button
                                                type="transparent"
                                                onClick={() => navigate("/agendar")}
                                            >
                                                Agendar una cita
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfileScreen;