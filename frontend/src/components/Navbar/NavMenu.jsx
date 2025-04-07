import React from "react";
import NavMenuItem from "./NavMenuItem";

function NavMenu() {
  const menuItems = [
    "Inicio",
    "¿Quiénes somos?",
    "Nuestro catálogo",
    "Agendar una cita",
  ];

  return (
    <nav className="flex gap-6 items-center text-subtitle-m font-body text-textMain">
      {menuItems.map((item, index) => (
        <NavMenuItem key={index} label={item} />
      ))}
    </nav>
  );
}

export default NavMenu;
