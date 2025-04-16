import React from "react";
import AboutSection from "../../frontend/src/screens/MainPageScreens/AboutUs.jsx";
import ServicesView from "../../frontend/src/screens/MainPageScreens/ServicesView.jsx";
import CertificationsSection from "../../frontend/src/screens/MainPageScreens/CertificationsSection.jsx";
import OurSpaces from "../../frontend/src/screens/MainPageScreens/OurSpaces.jsx";

function AboutUsPage() {
        return (
            <>
                    <AboutSection />
                    <ServicesView />
                    <CertificationsSection />
                    <OurSpaces />
            </>
        );
}

export default AboutUsPage;