import React, { useState } from "react";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

function AuthScreen() {
    const [showLogin, setShowLogin] = useState(true);

    const toggleView = () => {
        setShowLogin(!showLogin);
    };

    return (
        <div className="pt-16">
            {showLogin ? (
                <LoginScreen onSwitch={toggleView} />
            ) : (
                <RegisterScreen onSwitch={toggleView} />
            )}
        </div>
    );
}

export default AuthScreen;