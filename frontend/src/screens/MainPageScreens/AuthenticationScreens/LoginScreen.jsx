import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "../../../components/common/Button"
import useAuth from "../../../features/auth/hooks/useAuth.js"

function LoginScreen({ onSwitch }) {
    const [form, setForm] = useState({ email: "", password: "" })
    const [error, setError] = useState("")
    const [loadingAuth, setLoadingAuth] = useState(false)
    const navigate = useNavigate()
    const { login } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        setError("")
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoadingAuth(true)
        setError("")
        try {
            const { redirectTo } = await login(form.email, form.password)
            navigate(redirectTo)
        } catch (err) {
            console.error("Firebase Login Error:", err)
            switch (err.code) {
                case "auth/user-not-found":
                case "auth/wrong-password":
                case "auth/invalid-credential":
                    setError(
                        "Credenciales incorrectas. Verifica tu correo y contraseña.",
                    )
                    break
                case "auth/invalid-email":
                    setError("El formato del correo electrónico no es válido.")
                    break
                case "auth/user-disabled":
                    setError("Esta cuenta de usuario ha sido deshabilitada.")
                    break
                case "auth/user-data-missing":
                    setError(
                        "No se pudieron cargar los datos del usuario. Intenta de nuevo.",
                    )
                    break
                default:
                    setError(
                        "Error al iniciar sesión. Inténtalo de nuevo más tarde.",
                    )
            }
        } finally {
            setLoadingAuth(false)
        }
    }

    const fillClientCredentials = () => {
        setForm({
            email: "test@example.com",
            password: "password",
        })
    }
    const fillStylistCredentials = () => {
        setForm({
            email: "estilista@studiotec.mx",
            password: "estilista123",
        })
    }

    return (
        <div className="flex items-center justify-center bg-primaryLight px-6 py-36">
            <div className="bg-white rounded-xl shadow-md p-8 w-full max-w-md">
                <h2 className="text-h3 font-heading font-bold text-textMain mb-6">
                    Iniciar sesión
                </h2>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
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
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
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

                    {/* Test Credential Buttons - TODO: We should remove this later */}
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="text-sm text-secondary hover:underline"
                            onClick={fillClientCredentials}
                        >
                            Cliente de prueba
                        </button>
                        <button
                            type="button"
                            className="text-sm text-secondary hover:underline"
                            onClick={fillStylistCredentials}
                        >
                            Estilista de prueba
                        </button>
                    </div>

                    <Button
                        type="dark"
                        className="w-full"
                        disabled={loadingAuth}
                    >
                        {loadingAuth ? "Iniciando sesión..." : "Iniciar sesión"}
                    </Button>
                </form>

                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿No tienes cuenta?{" "}
                    <button
                        className="text-secondary font-medium hover:underline"
                        onClick={onSwitch}
                    >
                        Regístrate
                    </button>
                </p>
            </div>
        </div>
    )
}

export default LoginScreen
