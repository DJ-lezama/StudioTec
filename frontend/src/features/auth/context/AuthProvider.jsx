import React, { useCallback, useEffect, useState } from "react"
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
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setLoading(true)
            try {
                const userData = await getUserData(user)
                setCurrentUser(userData)
            } catch (error) {
                console.error(
                    "Auth state change error - fetching user data:",
                    error,
                )
                setCurrentUser(null)
                toast.error("Hubo un problema al cargar tu sesión.")
            } finally {
                setLoading(false)
            }
        })
        return () => unsubscribe()
    }, [])

    const register = async (name, email, password, phone, isStylist) => {
        setLoading(true)
        try {
            const user = await registerUser(
                name,
                email,
                password,
                phone,
                isStylist,
            )
            setCurrentUser(user)
            toast.success(`¡Registro exitoso! Bienvenido/a, ${user.name}!`)
            const pathToGo =
                user.role === "stylist" ? "/stylist/dashboard" : "/"
            navigate(pathToGo, { replace: true })
            return { user }
        } catch (error) {
            console.error("Registration error in AuthProvider:", error)
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
                return { user }
            } catch (error) {
                console.error("Login error in AuthProvider:", error)
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

    const logout = useCallback(async () => {
        setLoading(true)
        try {
            await logoutUser()
            toast.success("¡Has cerrado sesión exitosamente!")
            setCurrentUser(null)
            navigate("/", { replace: true })
        } catch (error) {
            console.error("Logout error:", error)
            toast.error(error.message || "Error al cerrar sesión.")
        } finally {
            setLoading(false)
        }
    }, [navigate])

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout,
        // TODO: Potentially add a function to update user data if profile edits are done elsewhere
        // updateUserContext: (updatedData) => setCurrentUser(prev => ({...prev, ...updatedData }))
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
