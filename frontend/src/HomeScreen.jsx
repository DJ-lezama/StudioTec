import React from "react";
import MainView from "../../frontend/src/screens/MainPageScreens/MainView.jsx";
import CharacteristicsGrid from "../../frontend/src/screens/MainPageScreens/CharacteristicsGrid";
import ReviewsSection from "../../frontend/src/screens/MainPageScreens/ReviewsSection";
import MapView from "../../frontend/src/screens/MainPageScreens/MapView";

function HomeScreen() {
    return (
        <>
            <MainView />
            <CharacteristicsGrid />
            <ReviewsSection />
            <MapView />
        </>
    );
}

export default HomeScreen;