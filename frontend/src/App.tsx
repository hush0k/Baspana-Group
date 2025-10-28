import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Если пользователь заходит на "/", перенаправляем на /login */}
            <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
    );
}

export default App;
