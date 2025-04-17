import React from "react"
import { LogOut } from "lucide-react"

const Sidebar = ({ user, menuItems, onLogout }) => {
    return (
        <aside className="md:w-80 bg-secondary text-white p-6 md:p-8">
            {/* Header for mobile view */}
            <div className="hidden md:flex md:flex-col md:items-center text-center mb-8">
                <div className="w-24 h-24 rounded-full bg-primary shadow-lg flex items-center justify-center text-textMain text-3xl font-bold mb-4">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-white/80 text-sm mt-1">{user.email}</p>
                <div className="mt-2 px-4 py-1 bg-white/20 rounded-full text-xs font-medium capitalize">
                    {user.role === "stylist" ? "Estilista" : "Cliente"}
                </div>
            </div>

            {/* Menu items */}
            <nav className="mt-6 space-y-1">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                            item.active
                                ? "bg-white/20 text-white"
                                : "text-white/80 hover:bg-white/10 hover:text-white"
                        }`}
                        onClick={item.action}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}

                {/* Logout button */}
                <button
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-white/80 hover:bg-textMain hover:text-white transition-colors mt-6"
                    onClick={onLogout}
                >
                    <LogOut size={20} />
                    <span>Cerrar sesión</span>
                </button>
            </nav>
        </aside>
    )
}

export default Sidebar
