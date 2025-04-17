import React from "react"
import { NavLink } from "react-router-dom"

function NavMenuItem({ label, to }) {
    const isCTA = label === "Agendar una cita"

    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                isCTA
                    ? "rounded-full border border-relevantButton bg-relevantButton text-white px-4 py-2 text-button-s font-body transition-all duration-200 hover:brightness-110"
                    : `px-2 py-3 hover:underline transition-colors duration-200 ${isActive ? "font-semibold" : ""}`
            }
        >
            {label}
        </NavLink>
    )
}

export default NavMenuItem
