import React, { useEffect, useRef } from "react"
import { Navigate, useLocation, useNavigate } from "react-router-dom"
import useAuth from "../../features/auth/hooks/useAuth.js"
import { toast } from "react-toastify"

function ProtectedRoute({ children }) {
    const { currentUser, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        )
    }

    if (!currentUser) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    return children
}

function StylistRoute({ children }) {
    const { currentUser, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        )
    }

    if (!currentUser) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    if (currentUser.role !== "stylist") {
        return <Navigate to="/" replace />
    }

    return children
}

function ClientRoute({ children }) {
    const { currentUser, loading } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const hasTriggeredRef = useRef(false)

    useEffect(() => {
        if (!loading && currentUser) {
            if (currentUser.role !== "client") {
                if (!hasTriggeredRef.current) {
                    toast.warn(
                        "Acceso denegado: Solo los clientes pueden agendar citas.",
                    )
                    hasTriggeredRef.current = true
                    navigate("/", { replace: true })
                }
            } else {
                hasTriggeredRef.current = false
            }
        }
    }, [loading, currentUser, navigate])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
        )
    }

    if (!currentUser) {
        return <Navigate to="/auth" state={{ from: location }} replace />
    }

    if (currentUser.role !== "client") {
        return null
    }

    return children
}

export { ProtectedRoute, StylistRoute, ClientRoute }
