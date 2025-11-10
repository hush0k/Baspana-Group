import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import './styles/Global.scss'
import Home from "./pages/test/Home";
import HeaderBlack from "./components/Header/HeaderBlack";
import HeaderWhite from "./components/Header/HeaderWhite";
import FooterBlack from "./components/Footer/FooterBlack";
import FooterWhite from "./components/Footer/FooterWhite";
import Card1 from "./components/Cards/Card1";



const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    return token ? children : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <Routes>
            <Route path="/card1" component={Card1} />
            <Route path = "/footerWhite" element={<FooterWhite />} />
            <Route path = "/footerBlack" element={<FooterBlack />} />
            <Route path="/headerBlack" element={<HeaderBlack />} />
            <Route path="/headerWhite" element={<HeaderWhite />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <Home />
                    </PrivateRoute>
                }
            />
        </Routes>
    );
};

export default App;