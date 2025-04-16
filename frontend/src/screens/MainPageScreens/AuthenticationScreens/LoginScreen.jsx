import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Button from "../../../components/common/Button";

function LoginScreen({ onSwitch }) {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError(""); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await login(form.email, form.password);
            navigate("/"); // Redirige al inicio después del login exitoso
        } catch (err) {
            setError("Error al iniciar sesión. Verifica tus credenciales.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Credenciales de prueba para facilitar las demos
    const fillTestCredentials = () => {
        setForm({
            email: "test@example.com",
            password: "password"
        });
    };

    return (
        <div className="flex items-center justify-center bg-primaryLight px-6 py-36">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-h3 font-heading font-bold text-textMain mb-6">Iniciar sesión</h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
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

                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="text-sm text-secondary hover:underline"
                            onClick={fillTestCredentials}
                        >
                            Usar credenciales de prueba
                        </button>
                    </div>

                    <Button type="dark" className="w-full" disabled={loading}>
                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿No tienes cuenta?{' '}
                    <button
                        className="text-secondary font-medium hover:underline"
                        onClick={onSwitch}
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </div>
    );
}

export default LoginScreen;