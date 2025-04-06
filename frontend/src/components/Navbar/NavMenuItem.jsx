import React from "react";

function NavMenuItem({ label }) {
  const isCTA = label === "Agendar una cita";

  return (
    <a
      href="#"
      className={
        isCTA
          ? "rounded-full border border-relevantButton bg-relevantButton text-white px-4 py-2 text-button-s font-body transition-all duration-200 hover:brightness-110"
          : "px-2 py-3 hover:underline transition-colors duration-200"
      }
    >
      {label}
    </a>
  );
}

export default NavMenuItem;
