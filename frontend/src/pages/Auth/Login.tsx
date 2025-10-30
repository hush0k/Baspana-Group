import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import './Login.css';
import main from '../../assets/image/auth_main_logo.jpg';
import logo from '../../assets/image/Baspana_Logo_black.png';


const Login: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            localStorage.setItem('access_token', response.access_token);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="main-img">
                <img src={main} alt="Background"/>
            </div>
            <div className="auth-container">

                <div className="auth-logo">
                    <img src={logo} alt="Logo"/>
                </div>

                <h2>Добро пожаловать!</h2>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Введите ваш email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Введите пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        <div>
                            <span className="button-text">
                                {loading ? 'Загрузка...' : 'Войти'}
                            </span>
                        </div>
                    </button>

                    <p className="auth-link">
                        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;