import Button from "./components/common/Button.jsx";
import Navbar from "./components/Navbar/Navbar.jsx";
import ReviewsCarousel from "./components/ReviewsVisualizer/ReviewsCarousel.jsx";
import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import DashboardScreen from "./screens/StylistScreens/DashboardScreen";
import ScheduleScreen from "./screens/StylistScreens/ScheduleScreen";
import ClientsScreen from "./screens/StylistScreens/ClientsScreen";
import RequestsScreen from "./screens/StylistScreens/RequestsScreen.jsx";
import ManageServicesScreen from "./screens/StylistScreens/ManageServicesScreen.jsx";
import ManageReviewsScreen from "./screens/StylistScreens/ManageReviewsScreen";

function App() {
  const [featuredReviews, setFeaturedReviews] = useState([]);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-primaryLight text-textMain p-8 space-y-12 font-body">
              <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
                <h1 className="text-h1 font-bold font-heading">Heading 1</h1>
                <h2 className="text-h2 font-bold font-heading">Heading 2</h2>
                <h3 className="text-h3 font-bold font-heading">Heading 3</h3>
                <h4 className="text-h4 font-bold font-heading">Heading 4</h4>
                <h5 className="text-h5 font-bold font-heading">Heading 5</h5>
                <h6 className="text-h6 font-bold font-heading">Heading 6</h6>

                <div className="space-y-2">
                  <p className="text-subtitle-m font-medium">Subtitle M</p>
                  <p className="text-subtitle-s font-medium">Subtitle S</p>
                  <p className="text-body-l">Body L — regular 18px</p>
                  <p className="text-body-m">Body M — regular 16px</p>
                  <p className="text-body-s">Body S — regular 14px</p>
                  <p className="text-body-xs">Body XS — regular 12px</p>
                  <p className="text-body-xxs">Body XXS — regular 10px</p>
                </div>

                <div className="space-x-4 pt-6">
                  <Button type="light">Light Button</Button>
                  <Button type="dark">Dark Button</Button>
                  <Button type="transparent">Transparent Button</Button>
                </div>
                <ReviewsCarousel reviews={featuredReviews} />
                <li>
                  <NavLink to="/stylist/dashboard" className="hover:underline">
                    Dashboard
                  </NavLink>
                </li>
              </div>
            </div>
          }
        />
        <Route path="/stylist/dashboard" element={<DashboardScreen />} />
        <Route path="/stylist/schedule" element={<ScheduleScreen />} />
        <Route path="/stylist/clientes" element={<ClientsScreen />} />
        <Route path="/stylist/solicitudes" element={<RequestsScreen />} />
        <Route path="/stylist/servicios" element={<ManageServicesScreen />} />
        <Route
            path="/stylist/reviews"
            element={
              <ManageReviewsScreen
                  selectedReviews={featuredReviews}
                  onSaveSelected={setFeaturedReviews}
              />
            }
        />
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
