import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import './Register.css';

const Register: React.FC = () => {
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
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка регистрации');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="auth-container">
                <h2>Зарегистрируйтесь</h2>

                <form className="auth-form">
                    <div className="form-group">
                        <label htmlFor="firstName">Имя:</label>
                        <input type="text" id="firstName" placeholder="Введите ваше имя" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="lastName">Фамилия:</label>
                        <input type="text" id="lastName" placeholder="Введите вашу фамилию" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" placeholder="Введите ваш email" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="dateOfBirth">Дата рождения:</label>
                        <input type="date" id="dateOfBirth" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="phoneNumber">Телефон:</label>
                        <input type="tel" id="phoneNumber" placeholder="+7 (___) ___-__-__" required/>
                    </div>

                    <div className="form-group">
                        <label htmlFor="city">Город:</label>
                        <select id="city" required>
                            <option value="">Выберите город</option>
                            <option value="almaty">Алматы</option>
                            <option value="astana">Астана</option>
                            <option value="shymkent">Шымкент</option>
                            <option value="karaganda">Караганда</option>
                            <option value="aktobe">Актобе</option>
                            <option value="taraz">Тараз</option>
                            <option value="pavlodar">Павлодар</option>
                            <option value="oskemen">Усть-Каменогорск</option>
                            <option value="semey">Семей</option>
                            <option value="kostanay">Костанай</option>
                            <option value="kyzylorda">Кызылорда</option>
                            <option value="atyrau">Атырау</option>
                            <option value="oral">Уральск</option>
                            <option value="petropavl">Петропавловск</option>
                            <option value="turkistan">Туркестан</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Пароль:</label>
                        <input type="password" id="password" placeholder="Введите пароль" required/>
                    </div>

                    <button type="submit" className="auth-btn">
                        <div>
                            <span className="button-text">Зарегистрироваться</span>
                        </div>
                    </button>

                    <p className="auth-link">
                        Уже есть аккаунт? <a href="/login"> Войти</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;