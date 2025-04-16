import {useEffect, useState} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "../../../../firebaseConfig.js";
import AuthContext from "./AuthContext";
import {getUserData, loginUser, logoutUser, registerUser} from "../services/authService";

const AuthProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        return onAuthStateChanged(auth, async (user) => {
            try {
                const userData = await getUserData(user);
                setCurrentUser(userData);
            } catch (error) {
                console.error("Auth state change error:", error);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        });
    }, []);

    const register = async (name, email, password) => {
        setLoading(true);
        try {
            const user = await registerUser(name, email, password);
            setCurrentUser(user);
            return {user};
        } catch (error) {
            console.error("Registration error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        try {
            const {user, redirectTo} = await loginUser(email, password);
            setCurrentUser(user);
            return {redirectTo};
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutUser();
            setCurrentUser(null);
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        currentUser,
        loading,
        register,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;