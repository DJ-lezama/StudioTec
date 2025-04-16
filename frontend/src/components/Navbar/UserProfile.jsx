import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../screens/MainPageScreens/AuthenticationScreens/AuthContext.jsx";

function UserProfile({ className = "ml-6" }) {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Cierra el menú desplegable al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    if (currentUser) {
      // Si el usuario es un estilista, ir directamente al dashboard de estilista
      if (currentUser.role === "stylist") {
        navigate("/stylist/dashboard");
      } else {
        // Si es un cliente normal, mostrar el menú desplegable
        setShowDropdown(!showDropdown);
      }
    } else {
      // Si no está autenticado, ir a la pantalla de autenticación
      navigate("/auth");
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
      <div className="relative" ref={dropdownRef}>
        <button
            onClick={handleProfileClick}
            className={`flex justify-center items-center w-12 h-12 ${
                currentUser ? "bg-primary" : "bg-[#F2F4F8]"
            } rounded-full ${className} hover:bg-opacity-90 transition-colors duration-200`}
            aria-label="User profile"
        >
          {currentUser ? (
              <div className="text-textMain font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
          ) : (
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 text-textMain"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
          )}
        </button>

        {showDropdown && currentUser && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 py-1">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-textMain">{currentUser.name}</p>
                <p className="text-xs text-gray-500">{currentUser.email}</p>
              </div>

              <button
                  onClick={() => {
                    setShowDropdown(false);
                    navigate("/perfil");
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-100"
              >
                Mi perfil
              </button>

              {currentUser.role === "stylist" && (
                  <button
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/stylist/dashboard");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-textMain hover:bg-gray-100"
                  >
                    Panel de estilista
                  </button>
              )}

              <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Cerrar sesión
              </button>
            </div>
        )}
      </div>
  );
}

export default UserProfile;