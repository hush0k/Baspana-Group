import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import styles from '../../styles/Login.module.scss';
import main from '../../assets/image/auth_main_logo.jpg';
import logo from '../../assets/image/Baspana_Logo_black.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login(email, password);
            localStorage.setItem('access_token', response.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка входа. Проверьте данные.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainImg}>
                <img src={main} alt="Background"/>
            </div>
            <div className={styles.authContainer}>
                <div className={styles.authLogo}>
                    <img src={logo} alt="Logo"/>
                </div>

                <h2 className={styles.title}>Добро пожаловать!</h2>

                {error && <div className={styles.errorMessage}>{error}</div>}

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
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

                    <div className={styles.formGroup}>
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

                    <button type="submit" className={styles.authBtn} disabled={loading}>
                        <span className={styles.buttonText}>
                            {loading ? 'Загрузка...' : 'Войти'}
                        </span>
                    </button>

                    <p className={styles.authLink}>
                        Нет аккаунта? <a href="/register">Зарегистрироваться</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;