import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Contexto de autenticación
import { AuthProvider } from "./screens/MainPageScreens/AuthenticationScreens/AuthContext.jsx";
import { ProtectedRoute, StylistRoute } from "./components/ProtectedRoute";

// Componentes comunes
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/FooterStudioTec.jsx";
import WelcomeNotification from "../../frontend/src/screens/MainPageScreens/WelcomeNotification.jsx";

// Página principal
import MainView from "./screens/MainPageScreens/MainView.jsx";
import CharacteristicsGrid from "./screens/MainPageScreens/CharacteristicsGrid.jsx";
import ReviewsSection from "./screens/MainPageScreens/ReviewsSection.jsx";
import ContactPage from "./screens/MainPageScreens/MapView.jsx";

// Autenticación
import AuthScreen from "../src/screens/MainPageScreens/AuthenticationScreens/AuthScreen.jsx";

// Otras páginas
import AboutUsPage from "./AboutUsScreen.jsx";
import CatalogPage from "./CatalogMainScreen.jsx";
import BookingPage from "./BookingScreen.jsx";
import ProfileScreen from "../src/screens/MainPageScreens/ProfileScreen.jsx";

// Panel de estilista
import DashboardScreen from "./screens/StylistScreens/DashboardScreen";
import ScheduleScreen from "./screens/StylistScreens/ScheduleScreen";

const HomePage = () => (
    <>
        <MainView />
        <CharacteristicsGrid />
        <ReviewsSection />
        <ContactPage />
    </>
);

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider>
            <Router>
                <Navbar />
                <WelcomeNotification />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/nosotros" element={<AboutUsPage />} />
                    <Route path="/catalogo" element={<CatalogPage />} />
                    <Route path="/agendar" element={<BookingPage />} />

                    {/* Ruta de autenticación */}
                    <Route path="/auth" element={<AuthScreen />} />

                    {/* Rutas del estilista (protegidas) */}
                    <Route path="/stylist/dashboard" element={<StylistRoute><DashboardScreen /></StylistRoute>} />
                    <Route path="/stylist/schedule" element={<StylistRoute><ScheduleScreen /></StylistRoute>} />

                    {/* Ruta para perfil de usuario (protegida) */}
                    <Route path="/perfil" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />

                    {/* Ruta 404 para manejar páginas no encontradas */}
                    <Route path="*" element={<div className="pt-20 p-8 text-center"><h1 className="text-h2 font-heading">Página no encontrada</h1></div>} />
                </Routes>
                <Footer />
            </Router>
        </AuthProvider>
    </StrictMode>
);