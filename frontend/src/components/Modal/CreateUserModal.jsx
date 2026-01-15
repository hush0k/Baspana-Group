import React, { useState } from 'react';
import userService from '../../services/UserService';
import styles from '../../styles/CreateComplexModal.module.scss';

const CreateUserModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        date_of_birth: '',
        phone_number: '',
        city: '',
        password: '',
        confirm_password: '',
        avatar_url: '',
        is_active: true
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const cityOptions = [
        { value: 'Almaty', label: 'Алматы' },
        { value: 'Astana', label: 'Астана' },
        { value: 'Shymkent', label: 'Шымкент' },
        { value: 'Karaganda', label: 'Караганда' },
        { value: 'Aktobe', label: 'Актобе' },
        { value: 'Taraz', label: 'Тараз' },
        { value: 'Pavlodar', label: 'Павлодар' },
        { value: 'Oskemen', label: 'Усть-Каменогорск' },
        { value: 'Semey', label: 'Семей' },
        { value: 'Kostanay', label: 'Костанай' },
        { value: 'Kyzylorda', label: 'Кызылорда' },
        { value: 'Atyrau', label: 'Атырау' },
        { value: 'Oral', label: 'Уральск' },
        { value: 'Petropavl', label: 'Петропавловск' },
        { value: 'Turkistan', label: 'Туркестан' }
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const validatePassword = (password) => {
        if (password.length < 8) {
            return 'Пароль должен быть минимум 8 символов';
        }
        if (!/[A-Z]/.test(password)) {
            return 'Пароль должен содержать хотя бы одну заглавную букву';
        }
        if (!/[a-z]/.test(password)) {
            return 'Пароль должен содержать хотя бы одну строчную букву';
        }
        if (!/\d/.test(password)) {
            return 'Пароль должен содержать хотя бы одну цифру';
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return 'Пароль должен содержать хотя бы один спецсимвол';
        }
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Валидация
        if (formData.password !== formData.confirm_password) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        const passwordError = validatePassword(formData.password);
        if (passwordError) {
            setError(passwordError);
            setLoading(false);
            return;
        }

        try {
            const { confirm_password, ...userData } = formData;
            await userService.createUser(userData);

            onSuccess();
            onClose();

            // Сброс формы
            setFormData({
                first_name: '',
                last_name: '',
                email: '',
                date_of_birth: '',
                phone_number: '',
                city: '',
                password: '',
                confirm_password: '',
                avatar_url: '',
                is_active: true
            });
        } catch (err) {
            console.error('Ошибка создания пользователя:', err);

            let errorMessage = 'Ошибка при создании пользователя';

            if (err.response?.data?.detail) {
                const detail = err.response.data.detail;

                if (Array.isArray(detail)) {
                    errorMessage = detail.map(error => error.msg || JSON.stringify(error)).join(', ');
                } else if (typeof detail === 'string') {
                    errorMessage = detail;
                } else if (typeof detail === 'object') {
                    errorMessage = detail.msg || JSON.stringify(detail);
                }
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>Создать нового пользователя</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>

                {error && (
                    <div className={styles.errorMessage}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        {/* Личная информация */}
                        <div className={styles.formSection}>
                            <h3>Личная информация</h3>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Имя <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введите имя"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Фамилия <span className={styles.required}>*</span></label>
                                    <input
                                        type="text"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Введите фамилию"
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Email <span className={styles.required}>*</span></label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label>Телефон <span className={styles.required}>*</span></label>
                                    <input
                                        type="tel"
                                        name="phone_number"
                                        value={formData.phone_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="+7 777 123 45 67"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Дата рождения <span className={styles.required}>*</span></label>
                                    <input
                                        type="date"
                                        name="date_of_birth"
                                        value={formData.date_of_birth}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Город <span className={styles.required}>*</span></label>
                                <select name="city" value={formData.city} onChange={handleChange} required>
                                    <option value="">Выберите город</option>
                                    {cityOptions.map(option => (
                                        <option key={option.value} value={option.value}>{option.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Пароль и доступ */}
                        <div className={styles.formSection}>
                            <h3>Пароль и доступ</h3>

                            <div className={styles.formGroup}>
                                <label>Пароль <span className={styles.required}>*</span></label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Минимум 8 символов"
                                />
                                <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                    Пароль должен содержать: заглавные и строчные буквы, цифры, спецсимволы
                                </small>
                            </div>

                            <div className={styles.formGroup}>
                                <label>Подтверждение пароля <span className={styles.required}>*</span></label>
                                <input
                                    type="password"
                                    name="confirm_password"
                                    value={formData.confirm_password}
                                    onChange={handleChange}
                                    required
                                    placeholder="Повторите пароль"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label>URL аватара</label>
                                <input
                                    type="url"
                                    name="avatar_url"
                                    value={formData.avatar_url}
                                    onChange={handleChange}
                                    placeholder="https://example.com/avatar.jpg"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        name="is_active"
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                    />
                                    <span>Аккаунт активен</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
                            Отмена
                        </button>
                        <button type="submit" className={styles.submitButton} disabled={loading}>
                            {loading ? 'Создание...' : 'Создать пользователя'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateUserModal;