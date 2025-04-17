import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { onAuthStateChanged } from "firebase/auth"
import { auth } from "../../../../firebaseConfig.js"
import AuthContext from "./AuthContext"
import {
    getUserData,
    loginUser,
    logoutUser,
    registerUser,
} from "../services/authService"

const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            try {
                const userData = await getUserData(user)
                setCurrentUser(userData)
            } catch (error) {
                console.error("Auth state change error:", error)
                setCurrentUser(null)
            } finally {
                setLoading(false)
            }
        })
    }, [])

    const register = async (name, email, password) => {
        setLoading(true)
        try {
            const user = await registerUser(name, email, password)
            setCurrentUser(user)
            toast.success(`¡Registro exitoso! Bienvenido/a, ${user.name}!`)
            navigate("/")
            return { user }
        } catch (error) {
            console.error("Registration error:", error)
            toast.error(
                error.message ||
                    "Error durante el registro. Inténtalo de nuevo.",
            )
            throw error
        } finally {
            setLoading(false)
        }
    }

    const login = useCallback(
        async (email, password, intendedPath = null) => {
            setLoading(true)
            try {
                const { user } = await loginUser(email, password)
                setCurrentUser(user)
                const defaultPath =
                    user.role === "stylist" ? "/stylist/dashboard" : "/"
                const pathToGo = intendedPath || defaultPath
                navigate(pathToGo, { replace: true })
                toast.success(`¡Bienvenido/a de nuevo, ${user.name}!`)
            } catch (error) {
                console.error("Login error:", error)
                toast.error(
                    error.message ||
                        "Error al iniciar sesión. Verifica tus credenciales.",
                )
                throw error
            } finally {
                setLoading(false)
            }
        },
        [navigate],
    )

    const logout = async () => {
        setLoading(true)
        try {
            await logoutUser()
            toast.success("¡Has cerrado sesión exitosamente!")
            setCurrentUser(null)
            navigate("/", { replace: true })
        } catch (error) {
            console.error("Logout error:", error)
            toast.error(error.message || "Error al cerrar sesión.") // Error toast for logout
        } finally {
            setLoading(false)
        }
    }

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
