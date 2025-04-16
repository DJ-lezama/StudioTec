import React, { createContext, useState, useContext, useEffect } from "react";

// Crear el contexto
const AuthContext = createContext(null);

// Hook personalizado para acceder al contexto
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Verificar si hay un usuario guardado en localStorage al cargar
    useEffect(() => {
        const checkUser = () => {
            const savedUser = localStorage.getItem("studioTecUser");
            if (savedUser) {
                setCurrentUser(JSON.parse(savedUser));
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    // Función de login - En una implementación real, esto se conectaría a tu backend
    const login = (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulamos una verificación de credenciales
                if (email === "test@example.com" && password === "password") {
                    const user = {
                        id: "1",
                        name: "Usuario Demo",
                        email,
                        role: "client",
                    };

                    // Guardar el usuario en localStorage para persistencia
                    localStorage.setItem("studioTecUser", JSON.stringify(user));
                    setCurrentUser(user);
                    resolve(user);
                } else {
                    reject(new Error("Credenciales incorrectas"));
                }
            }, 1000);
        });
    };

    // Función de registro - En una implementación real, esto se conectaría a tu backend
    const register = (name, email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulamos el proceso de registro
                const user = {
                    id: Date.now().toString(),
                    name,
                    email,
                    role: "client",
                };

                // Guardar el usuario en localStorage para persistencia
                localStorage.setItem("studioTecUser", JSON.stringify(user));
                setCurrentUser(user);
                resolve(user);
            }, 1000);
        });
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem("studioTecUser");
        setCurrentUser(null);
    };

    const value = {
        currentUser,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};