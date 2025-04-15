import React from "react";
import NavMenuItem from "./NavMenuItem";

function NavMenu() {
  const menuItems = [
    { label: "Inicio", to: "/" },
    { label: "¿Quiénes somos?", to: "/nosotros" },
    { label: "Nuestro catálogo", to: "/catalogo" },
    { label: "Agendar una cita", to: "/agendar" },
  ];

  return (
      <nav className="flex gap-6 items-center text-subtitle-m font-body text-textMain">
        {menuItems.map((item, index) => (
            <NavMenuItem key={index} label={item.label} to={item.to} />
        ))}
      </nav>
  );
}

export default NavMenu;