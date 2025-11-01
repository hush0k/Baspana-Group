import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import './Register.scss';

const Register = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        confirmPassword: '',
        date_of_birth: '',
        phone_number: '',
        city: 'Almaty',
        avatar_url: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Пароли не совпадают');
            return;
        }

        setLoading(true);

        try {
            const { confirmPassword, ...registerData } = formData;
            const response = await authService.register(registerData);
            localStorage.setItem('access_token', response.access_token);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.detail || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Зарегистрируйтесь</h2>

                {error && <div className="error-message">{error}</div>}

                <form className="auth-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="first_name">Имя:</label>
                        <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder="Введите ваше имя"
                            value={formData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="last_name">Фамилия:</label>
                        <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder="Введите вашу фамилию"
                            value={formData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Введите ваш email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="date_of_birth">Дата рождения:</label>
                        <input
                            type="date"
                            id="date_of_birth"
                            name="date_of_birth"
                            value={formData.date_of_birth}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone_number">Телефон:</label>
                        <input
                            type="tel"
                            id="phone_number"
                            name="phone_number"
                            placeholder="+7 (___) ___-__-__"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">Город:</label>
                        <select
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Выберите город</option>
                            <option value="Almaty">Алматы</option>
                            <option value="Astana">Астана</option>
                            <option value="Shymkent">Шымкент</option>
                            <option value="Karaganda">Караганда</option>
                            <option value="Aktobe">Актобе</option>
                            <option value="Taraz">Тараз</option>
                            <option value="Pavlodar">Павлодар</option>
                            <option value="Oskemen">Усть-Каменогорск</option>
                            <option value="Semey">Семей</option>
                            <option value="Kostanay">Костанай</option>
                            <option value="Kyzylorda">Кызылорда</option>
                            <option value="Atyrau">Атырау</option>
                            <option value="Oral">Уральск</option>
                            <option value="Petropavl">Петропавловск</option>
                            <option value="Turkistan">Туркестан</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Введите пароль"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Подтвердите пароль:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Повторите пароль"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        <div>
                            <span className="button-text">
                                {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                            </span>
                        </div>
                    </button>

                    <p className="auth-link">
                        Уже есть аккаунт? <a href="/login">Войти</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;