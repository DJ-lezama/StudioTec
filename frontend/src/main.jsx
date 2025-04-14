import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import MainView from "../src/screens/MainView.jsx";
import Navbar from "../src/components/Navbar/Navbar.jsx";
import CharacteristicsGrid from "../src/screens/CharacteristicsGrid.jsx";
import ReviewsSection from "../src/screens/ReviewsSection.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Navbar />
    <MainView />
      <CharacteristicsGrid />
      <ReviewsSection />
  </StrictMode>,
);
