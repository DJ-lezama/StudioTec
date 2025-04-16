import { Navigate, useLocation } from "react-router-dom"
import useAuth from "../features/auth/hooks/useAuth.js"

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

export { ProtectedRoute, StylistRoute }
