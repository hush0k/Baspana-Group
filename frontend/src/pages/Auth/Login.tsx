import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import './Login.scss';

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
            navigate('/'); // Перенаправляем на главную после успешного входа
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Добро пожаловать!</h2>
                <form onSubmit={handleSubmit}>
                    {error && <div className="error-message">{error}</div>}

                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </button>
                </form>

                <div className="register-link">
                    <p>
                        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;