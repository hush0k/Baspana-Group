import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import styles from '../../styles/Register.module.scss';

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

    // Функция для форматирования ошибок
    const formatError = (err) => {
        // Если нет response (проблема с сетью)
        if (!err.response) {
            return 'Ошибка соединения с сервером. Проверьте интернет-соединение.';
        }

        const { data, status } = err.response;

        // Обработка ошибок валидации от Pydantic
        if (data?.detail) {
            // Если detail - массив ошибок валидации
            if (Array.isArray(data.detail)) {
                const errors = data.detail.map(e => {
                    const field = translateField(e.loc[e.loc.length - 1]);
                    const message = translateMessage(e.msg);
                    return `${field}: ${message}`;
                });
                return errors.join('\n');
            }

            // Если detail - строка
            if (typeof data.detail === 'string') {
                return translateMessage(data.detail);
            }
        }

        // Стандартные HTTP ошибки
        switch (status) {
            case 400:
                return 'Неверные данные. Проверьте введенную информацию.';
            case 422:
                return 'Ошибка валидации данных. Проверьте все поля.';
            default:
                return 'Ошибка регистрации. Попробуйте еще раз.';
        }
    };

    // Перевод названий полей
    const translateField = (field) => {
        const translations = {
            'first_name': 'Имя',
            'last_name': 'Фамилия',
            'email': 'Email',
            'password': 'Пароль',
            'date_of_birth': 'Дата рождения',
            'phone_number': 'Телефон',
            'city': 'Город',
            'avatar_url': 'Аватар'
        };
        return translations[field] || field;
    };

    // Перевод сообщений об ошибках
    const translateMessage = (message) => {
        const translations = {
            'Email already registered': 'Email уже зарегистрирован',
            'Phone already registered': 'Телефон уже зарегистрирован',
            'Password must be at least 8 characters': 'Пароль должен содержать минимум 8 символов',
            'Password must contain at least one uppercase letter': 'Пароль должен содержать хотя бы одну заглавную букву',
            'Password must contain at least one lowercase letter': 'Пароль должен содержать хотя бы одну строчную букву',
            'Password must contain at least one digit': 'Пароль должен содержать хотя бы одну цифру',
            'Password must contain at least one special character': 'Пароль должен содержать хотя бы один специальный символ',
            'field required': 'обязательное поле',
            'value is not a valid email address': 'неверный формат email',
            'value is not a valid phone number': 'неверный формат номера телефона',
            'Input should be a valid string': 'должно быть строкой',
            'String should match pattern': 'неверный формат'
        };

        // Проверяем совпадения (регистронезависимо)
        for (const [eng, rus] of Object.entries(translations)) {
            if (message.toLowerCase().includes(eng.toLowerCase())) {
                return rus;
            }
        }

        return message;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Проверка совпадения паролей
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
            console.error('Registration error:', err);
            setError(formatError(err));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.authContainer}>
                <div className={styles.title}>
                    <h2>Зарегистрируйтесь</h2>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error.split('\n').map((line, index) => (
                            <div key={index}>{line}</div>
                        ))}
                    </div>
                )}

                <form className={styles.authForm} onSubmit={handleSubmit}>
                    <div className={styles.formInput}>
                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
                            <label htmlFor="city">Город:</label>
                            <select
                                id="city"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            >
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

                        <div className={styles.formGroup}>
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

                        <div className={styles.formGroup}>
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
                    </div>

                    <div className={styles.formAction}>
                        <button type="submit" className={styles.authBtn} disabled={loading}>
                            <span className={styles.buttonText}>
                                {loading ? 'Загрузка...' : 'Зарегистрироваться'}
                            </span>
                        </button>

                        <p className={styles.authLink}>
                            Уже есть аккаунт? <a href="/login">Войти</a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;