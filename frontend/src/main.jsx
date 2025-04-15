import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Componentes comunes
import Navbar from "./components/Navbar/Navbar.jsx";
import Footer from "./components/FooterStudioTec.jsx";

// Página principal
import MainView from "./screens/MainPageScreens/MainView.jsx";
import CharacteristicsGrid from "./screens/MainPageScreens/CharacteristicsGrid.jsx";
import ReviewsSection from "./screens/MainPageScreens/ReviewsSection.jsx";
import ContactPage from "./screens/MainPageScreens/MapView.jsx";

// Otras páginas
import AboutUsPage from "./AboutUsScreen.jsx";
import CatalogPage from "./CatalogMainScreen.jsx";
import BookingPage from "./BookingScreen.jsx";

// Componente HomePage que contiene todos los elementos de la página principal
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
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nosotros" element={<AboutUsPage />} />
          <Route path="/catalogo" element={<CatalogPage />} />
          <Route path="/agendar" element={<BookingPage />} />
        </Routes>
        <Footer />
      </Router>
    </StrictMode>
);