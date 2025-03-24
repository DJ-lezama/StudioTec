import React from "react";

function NavMenuItem({ label }) {
    return (
        <a
            href="#"
            className="px-2 py-3 hover:underline transition-colors duration-200"
        >
            {label}
        </a>
    );
}

export default NavMenuItem;
