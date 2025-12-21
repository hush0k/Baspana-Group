import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import './i18n'; // Инициализация i18next
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import './styles/Global.scss'
import Home from "./pages/test/Home";
import HeaderBlack from "./components/Header/HeaderBlack";
import HeaderWhite from "./components/Header/HeaderWhite";
import FooterBlack from "./components/Footer/FooterBlack";
import FooterWhite from "./components/Footer/FooterWhite";
import ComplexCard from "./components/Cards/ComplexCard";
import MortgageCalculator from "./components/Calculator/MortgageCalculator";
import HeroSection from "./components/Hero/HeroSection";
import MainHome from "./pages/Main/MainHome";
import Profile from "./pages/User/Profile";
import UserManagement from "./pages/Management/UserManagement";
import ComplexManagement from "./pages/Management/ComplexManagement";
import BuildingManagement from "./pages/Management/BuildingManagement";
import ApartmentManagement from "./pages/Management/ApartmentManagement";
import PromotionManagement from "./pages/Management/PromotionManagement";
import CommercialUnitManagement from "./pages/Management/CommercialUnitManagement";
import ComplexDetailPage from "./pages/Complex/ComplexDetailPage";
import BlockPage from "./pages/Block/BlockPage";
import ApartmentPage from "./pages/Apartment/ApartmentPage";
import CommercialUnitPage from "./pages/CommercialUnit/CommercialUnitPage";
import PromotionsPage from "./pages/OnePages/PromotionsPage";
import PaymentPage from "./pages/OnePages/PaymentPage";
import AIChat from "./components/AIAssistant/AIChat";



const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<MainHome />} />
                <Route path="/heroSection" element={<HeroSection />} />
                <Route path="/mortgageCalculator" element={<MortgageCalculator />} />
                <Route path="/complexCard" component={<ComplexCard />} />
                <Route path = "/footerWhite" element={<FooterWhite />} />
                <Route path = "/footerBlack" element={<FooterBlack />} />
                <Route path="/headerBlack" element={<HeaderBlack />} />
                <Route path="/headerWhite" element={<HeaderWhite />} />
                <Route path="/buildings/:blockId" element={<BlockPage />} />
                <Route path="/promotions" element={<PromotionsPage />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/payment-methods" element={<PaymentPage />} />
                <Route path="/complex/:id" element={<ComplexDetailPage />} />
                <Route path="/apartments/:apartmentId" element={<ApartmentPage />} />
                <Route path="/commercial-units/:unitId" element={<CommercialUnitPage />} />
                <Route path="/complex-management" element={<PrivateRoute><ComplexManagement /></PrivateRoute>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/projects" element={<MainHome />} />

                {/* Protected Routes */}
                <Route
                    path="/profile"
                    element={
                        <PrivateRoute>
                            <Profile />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/buildings-management"
                    element={
                        <PrivateRoute>
                            <BuildingManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/user-management"
                    element={
                        <PrivateRoute>
                            <UserManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/building-management"
                    element={
                        <PrivateRoute>
                            <BuildingManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/apartments-management"
                    element={
                        <PrivateRoute>
                            <ApartmentManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/promotions-management"
                    element={
                        <PrivateRoute>
                            <PromotionManagement />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/commercial-units-management"
                    element={
                        <PrivateRoute>
                            <CommercialUnitManagement />
                        </PrivateRoute>
                    }
                />
            </Routes>

            {/* AI Chat Assistant - доступен на всех страницах */}
            <AIChat />
        </>
    );
};

export default App;