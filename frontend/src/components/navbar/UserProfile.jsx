import React, { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react"
import useAuth from "../../features/auth/hooks/useAuth.js" // Import icons

function UserProfile({ className = "ml-6" }) {
    const navigate = useNavigate()
    const { currentUser, logout, loading } = useAuth()
    const [showDropdown, setShowDropdown] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setShowDropdown(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleProfileClick = () => {
        if (currentUser) {
            setShowDropdown(!showDropdown)
        } else if (!loading) {
            navigate("/auth")
        }
    }

    const handleLogout = async () => {
        setShowDropdown(false)
        try {
            await logout()
            navigate("/")
        } catch (error) {
            console.error("Logout failed:", error)
        }
    }

    const getUserInitials = () => {
        if (currentUser?.name) {
            const nameParts = currentUser.name.trim().split(" ")
            if (nameParts.length >= 2) {
                return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
            } else if (nameParts.length === 1 && nameParts[0].length > 0) {
                return nameParts[0][0].toUpperCase()
            }
        }
        // Fallback if name is unavailable or empty
        return <User size={20} />
    }

    if (loading) {
        return (
            <div
                className={`flex justify-center items-center w-12 h-12 bg-gray-200 rounded-full ${className} animate-pulse`}
            ></div>
        )
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleProfileClick}
                className={`flex justify-center items-center w-12 h-12 ${
                    currentUser
                        ? "bg-secondary text-white"
                        : "bg-gray-100 text-gray-500"
                } rounded-full ${className} hover:opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary`}
                aria-label="User profile"
                aria-haspopup="true"
                aria-expanded={showDropdown}
            >
                {currentUser ? (
                    <span className="font-semibold text-sm">
                        {getUserInitials()}
                    </span>
                ) : (
                    <User size={20} />
                )}
            </button>

            {/* Dropdown Menu */}
            {showDropdown && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg z-20 py-1 border border-gray-100">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-textMain truncate">
                            {currentUser.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                            {currentUser.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize mt-1">
                            Rol: {currentUser.role}
                        </p>
                    </div>

                    {/* Menu Items */}
                    <nav className="py-1">
                        <button
                            onClick={() => {
                                setShowDropdown(false)
                                navigate("/perfil")
                            }}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-100"
                        >
                            <User size={16} className="mr-2 opacity-70" />{" "}
                            {/* Icon */}
                            Mi perfil
                        </button>

                        {/* Conditional Stylist Dashboard Link */}
                        {currentUser.role === "stylist" && (
                            <button
                                onClick={() => {
                                    setShowDropdown(false)
                                    navigate("/stylist/dashboard")
                                }}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-100"
                            >
                                <LayoutDashboard
                                    size={16}
                                    className="mr-2 opacity-70"
                                />{" "}
                                {/* Icon */}
                                Panel de estilista
                            </button>
                        )}

                        {/* Settings/Preferences Link (Example) */}
                        {currentUser.role === "client" && (
                            <button
                                onClick={() => {
                                    setShowDropdown(false)
                                    navigate("/perfil?tab=preferences")
                                }}
                                className="flex items-center w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-100"
                            >
                                <Settings
                                    size={16}
                                    className="mr-2 opacity-70"
                                />{" "}
                                {/* Icon */}
                                Preferencias
                            </button>
                        )}

                        {/* Divider */}
                        <div className="border-t border-gray-100 my-1"></div>

                        {/* Logout Button */}
                        <button
                            onClick={handleLogout}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            <LogOut size={16} className="mr-2 opacity-70" />{" "}
                            {/* Icon */}
                            Cerrar sesión
                        </button>
                    </nav>
                </div>
            )}
        </div>
    )
}

export default UserProfile
