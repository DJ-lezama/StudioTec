import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Button from "../../../components/common/Button";
function RegisterScreen({ onSwitch }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const validateForm = () => {
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden");
            return false;
        }

        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres");
            return false;
        }

        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        setError("");

        try {
            await register(form.name, form.email, form.password);
            navigate("/"); // Redirige al inicio después del registro exitoso
        } catch (err) {
            setError("Error al crear la cuenta. Inténtalo de nuevo.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center bg-primaryLight px-6 py-16">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-h3 font-heading font-bold text-textMain mb-6">Crear cuenta</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-textMain mb-1">
                            Nombre completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Tu nombre completo"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-textMain mb-1">
                            Correo electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-textMain mb-1">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-textMain mb-1">
                            Confirmar contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    <Button type="dark" className="w-full" disabled={loading}>
                        {loading ? "Creando cuenta..." : "Registrarse"}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                        className="text-secondary font-medium hover:underline"
                        onClick={onSwitch}
                    >
                        Inicia sesión
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterScreen;