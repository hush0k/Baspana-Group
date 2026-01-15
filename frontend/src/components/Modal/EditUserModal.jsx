import React, { useState, useEffect } from 'react';
import userService from '../../services/UserService';
import styles from '../../styles/CreateComplexModal.module.scss';

const EditUserModal = ({ isOpen, onClose, onSuccess, userId }) => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        city: '',
        avatar_url: '',
        date_of_birth: '',
        role: '',
        status_of_user: '',
        is_active: true,
        loyalty_point: 0
    });

    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
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

    const roleOptions = [
        { value: 'Admin', label: 'Администратор' },
        { value: 'Manager', label: 'Менеджер' },
        { value: 'Consumer', label: 'Пользователь' }
    ];

    const statusOptions = [
        { value: 'Bronze', label: 'Бронзовый' },
        { value: 'Silver', label: 'Серебряный' },
        { value: 'Gold', label: 'Золотой' },
        { value: 'None', label: 'Нет' }
    ];

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserData();
        }
    }, [isOpen, userId]);

    const fetchUserData = async () => {
        setLoadingData(true);
        try {
            const user = await userService.getUserById(userId);

            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || '',
                city: user.city || '',
                avatar_url: user.avatar_url || '',
                date_of_birth: user.date_of_birth || '',
                role: user.role || '',
                status_of_user: user.status_of_user || '',
                is_active: user.is_active !== undefined ? user.is_active : true,
                loyalty_point: user.loyalty_point || 0
            });
        } catch (err) {
            console.error('Ошибка загрузки данных пользователя:', err);
            setError('Не удалось загрузить данные пользователя');
        } finally {
            setLoadingData(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Обновляем основные данные пользователя
            const basicData = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                email: formData.email,
                phone_number: formData.phone_number,
                city: formData.city,
                avatar_url: formData.avatar_url
            };

            await userService.updateUser(userId, basicData);

            // 2. Обновляем роль (если изменилась)
            if (formData.role) {
                await userService.updateUserRole(userId, formData.role);
            }

            // 3. Обновляем статус (если изменился)
            if (formData.status_of_user) {
                await userService.updateUserStatus(userId, formData.status_of_user);
            }

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Ошибка обновления пользователя:', err);

            let errorMessage = 'Ошибка при обновлении пользователя';

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
                    <h2>Редактировать пользователя</h2>
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

                {loadingData ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка данных...</p>
                    </div>
                ) : (
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
                                        <label>Дата рождения</label>
                                        <input
                                            type="date"
                                            name="date_of_birth"
                                            value={formData.date_of_birth}
                                            onChange={handleChange}
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
                            </div>

                            {/* Роль и статус */}
                            <div className={styles.formSection}>
                                <h3>Роль и статус</h3>

                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label>Роль <span className={styles.required}>*</span></label>
                                        <select name="role" value={formData.role} onChange={handleChange} required>
                                            <option value="">Выберите роль</option>
                                            {roleOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                            Определяет права доступа пользователя в системе
                                        </small>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label>Статус лояльности <span className={styles.required}>*</span></label>
                                        <select name="status_of_user" value={formData.status_of_user} onChange={handleChange} required>
                                            <option value="">Выберите статус</option>
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                        <small style={{ color: '#6b7280', marginTop: '4px', display: 'block' }}>
                                            Уровень в программе лояльности
                                        </small>
                                    </div>
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
                                    <small style={{ color: '#6b7280', marginTop: '4px', display: 'block', marginLeft: '28px' }}>
                                        Неактивные пользователи не могут войти в систему
                                    </small>
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalFooter}>
                            <button type="button" className={styles.cancelButton} onClick={onClose} disabled={loading}>
                                Отмена
                            </button>
                            <button type="submit" className={styles.submitButton} disabled={loading}>
                                {loading ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EditUserModal;