import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "./index.css"
import {
    ClientRoute,
    ProtectedRoute,
    StylistRoute,
} from "./components/routes/ProtectedRoute.jsx"

// Layout
import ContentWrapper from "./components/layout/ContentWrapper.jsx"

// Common components
import Navbar from "./components/navbar/Navbar.jsx"
import Footer from "./components/FooterStudioTec.jsx"

// Pages
import HomePage from "./screens/MainPageScreens/HomePage"
import AuthScreen from "./screens/MainPageScreens/AuthenticationScreens/AuthScreen.jsx"
import AboutUsPage from "./AboutUsScreen.jsx"
import CatalogPage from "./CatalogMainScreen.jsx"
import BookingPage from "./BookingScreen.jsx"
import ProfileScreen from "./screens/MainPageScreens/ProfileScreen.jsx"
import CustomVisitForm from "./screens/MainPageScreens/CustomVisitForm.jsx"
import BookingConfirmation from "./screens/MainPageScreens/BookingConfirmation.jsx"

// Stylist screens
import DashboardScreen from "./screens/StylistScreens/DashboardScreen"
import ScheduleScreen from "./screens/StylistScreens/ScheduleScreen"
import ClientsScreen from "./screens/StylistScreens/ClientsScreen"
import RequestsScreen from "./screens/StylistScreens/RequestsScreen"
import ManageServicesScreen from "./screens/StylistScreens/ManageServicesScreen"
import ManageReviewsScreen from "./screens/StylistScreens/ManageReviewsScreen"
import AuthProvider from "./features/auth/context/AuthProvider.jsx"

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <Router>
            <AuthProvider>
                <Navbar />+{" "}
                <ToastContainer
                    autoClose={3000}
                    hideProgressBar
                    position="bottom-right"
                    theme="colored"
                />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route
                        path="/nosotros"
                        element={
                            <ContentWrapper>
                                <AboutUsPage />
                            </ContentWrapper>
                        }
                    />
                    <Route
                        path="/catalogo"
                        element={
                            <ContentWrapper>
                                <CatalogPage />
                            </ContentWrapper>
                        }
                    />
                    <Route
                        path="/agendar"
                        element={
                            <ClientRoute>
                                <ContentWrapper>
                                    <BookingPage />
                                </ContentWrapper>
                            </ClientRoute>
                        }
                    />
                    <Route
                        path="/consulta"
                        element={
                            <ContentWrapper>
                                <CustomVisitForm />
                            </ContentWrapper>
                        }
                    />
                    <Route
                        path="/confirmacion"
                        element={
                            <ContentWrapper>
                                <BookingConfirmation />
                            </ContentWrapper>
                        }
                    />

                    <Route path="/auth" element={<AuthScreen />} />

                    <Route
                        path="/stylist/dashboard"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <DashboardScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />
                    <Route
                        path="/stylist/schedule"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <ScheduleScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />
                    <Route
                        path="/stylist/clientes"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <ClientsScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />
                    <Route
                        path="/stylist/solicitudes"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <RequestsScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />
                    <Route
                        path="/stylist/servicios"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <ManageServicesScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />
                    <Route
                        path="/stylist/reviews"
                        element={
                            <StylistRoute>
                                <ContentWrapper>
                                    <ManageReviewsScreen />
                                </ContentWrapper>
                            </StylistRoute>
                        }
                    />

                    <Route
                        path="/perfil"
                        element={
                            <ProtectedRoute>
                                <ProfileScreen />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="*"
                        element={
                            <ContentWrapper>
                                <div className="p-8 text-center">
                                    <h1 className="text-h2 font-heading">
                                        Página no encontrada
                                    </h1>
                                </div>
                            </ContentWrapper>
                        }
                    />
                </Routes>
                <Footer />
            </AuthProvider>
        </Router>
    </StrictMode>,
)
