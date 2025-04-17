import React, { useState } from "react"
import Button from "../../../components/common/Button"
import useAuth from "../../../features/auth/hooks/useAuth.js"
import { Loader2 } from "lucide-react"

function RegisterScreen({ onSwitch }) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    })
    const [isStylist, setIsStylist] = useState(false)
    const [error, setError] = useState("")
    const [loadingAuth, setLoadingAuth] = useState(false)
    const { register } = useAuth()

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm((prev) => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const validateForm = () => {
        setError("")
        if (!form.name.trim()) {
            setError("El nombre es obligatorio.")
            return false
        }
        if (!form.email.trim()) {
            setError("El correo electrónico es obligatorio.")
            return false
        }
        if (!/\S+@\S+\.\S+/.test(form.email)) {
            setError("Introduce un correo electrónico válido.")
            return false
        }
        const phoneDigits = form.phone.replace(/\s/g, "")
        if (!phoneDigits) {
            setError("El número de teléfono es obligatorio.")
            return false
        } else if (!/^\d{10}$/.test(phoneDigits)) {
            setError("Introduce un número de teléfono válido de 10 dígitos.")
            return false
        }
        if (form.password.length < 6) {
            setError("La contraseña debe tener al menos 6 caracteres.")
            return false
        }
        if (form.password !== form.confirmPassword) {
            setError("Las contraseñas no coinciden.")
            return false
        }
        return true
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        setLoadingAuth(true)
        setError("")
        try {
            await register(
                form.name,
                form.email,
                form.password,
                form.phone,
                isStylist,
            )
        } catch (err) {
            console.error("Registration Screen Error:", err)
            if (
                err.message &&
                (err.code?.startsWith("auth/") ||
                    typeof err.code === "undefined")
            ) {
                setError(err.message)
            } else {
                setError(
                    "Error al crear la cuenta. Inténtalo de nuevo más tarde.",
                )
            }
        } finally {
            setLoadingAuth(false)
        }
    }

    return (
        <div className="flex items-center justify-center bg-primaryLight px-6 py-12 sm:py-16">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
                <h2 className="text-h3 font-heading font-bold text-textMain mb-6 text-center">
                    Crear Cuenta
                </h2>
                {error && (
                    <div
                        className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg mb-4 text-sm text-center"
                        role="alert"
                    >
                        {error}
                    </div>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                    {/* Name Input */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
                            Nombre completo*
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Tu nombre"
                            value={form.name}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
                            Correo electrónico*
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="tu@correo.com"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Phone Input */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
                            Teléfono (10 dígitos)*
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            placeholder="Ej. 5512345678"
                            value={form.phone}
                            onChange={handleChange}
                            required
                            maxLength="10"
                            pattern="\d{10}"
                            title="Introduce 10 dígitos numéricos"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
                            Contraseña (mín. 6 caracteres)*
                        </label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-textMain mb-1"
                        >
                            Confirmar contraseña*
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>

                    {/* Stylist Toggle */}
                    <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer text-sm text-textMain select-none">
                            <input
                                type="checkbox"
                                checked={isStylist}
                                onChange={(e) => setIsStylist(e.target.checked)}
                                className="rounded border-gray-300 text-secondary shadow-sm focus:border-secondary focus:ring focus:ring-offset-0 focus:ring-secondary/50 h-4 w-4"
                            />
                            Registrarse como Estilista
                        </label>
                        <p className="text-xs text-gray-500 mt-1 pl-7">
                            (Marca esto si eres parte del personal del salón)
                        </p>
                    </div>

                    {/* Submit Button */}
                    <Button
                        type="dark"
                        className="w-full !py-3 !text-base mt-4"
                        disabled={loadingAuth}
                        buttonType="submit"
                    >
                        {loadingAuth ? (
                            <>
                                <Loader2 className="w-5 h-5 mr-2 inline animate-spin" />
                                Creando cuenta...
                            </>
                        ) : (
                            "Registrarse"
                        )}
                    </Button>
                </form>
                {/* Switch to Log in */}
                <p className="mt-6 text-sm text-center text-gray-600">
                    ¿Ya tienes cuenta?{" "}
                    <button
                        className="text-secondary font-medium hover:underline focus:outline-none"
                        onClick={onSwitch}
                    >
                        Inicia sesión
                    </button>
                </p>
            </div>
        </div>
    )
}

export default RegisterScreen
