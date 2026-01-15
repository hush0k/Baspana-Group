import React, { useState, useEffect } from 'react';
import userService from '../../services/UserService';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewUserModal = ({ isOpen, onClose, userId }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen && userId) {
            fetchUserData();
        }
    }, [isOpen, userId]);

    const fetchUserData = async () => {
        setLoading(true);
        setError('');
        try {
            const userData = await userService.getUserById(userId);
            setUser(userData);
        } catch (err) {
            console.error('Ошибка загрузки данных пользователя:', err);
            setError('Не удалось загрузить данные пользователя');
        } finally {
            setLoading(false);
        }
    };

    const getRoleLabel = (role) => {
        const roleMap = {
            'Admin': 'Администратор',
            'Manager': 'Менеджер',
            'Consumer': 'Пользователь'
        };
        return roleMap[role] || role;
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            'Bronze': 'Бронзовый',
            'Silver': 'Серебряный',
            'Gold': 'Золотой',
            'None': 'Нет'
        };
        return statusMap[status] || status;
    };

    const getCityLabel = (city) => {
        const cityMap = {
            'Almaty': 'Алматы',
            'Astana': 'Астана',
            'Shymkent': 'Шымкент',
            'Karaganda': 'Караганда',
            'Aktobe': 'Актобе',
            'Taraz': 'Тараз',
            'Pavlodar': 'Павлодар',
            'Oskemen': 'Усть-Каменогорск',
            'Semey': 'Семей',
            'Kostanay': 'Костанай',
            'Kyzylorda': 'Кызылорда',
            'Atyrau': 'Атырау',
            'Oral': 'Уральск',
            'Petropavl': 'Петропавловск',
            'Turkistan': 'Туркестан'
        };
        return cityMap[city] || city;
    };

    const getRoleColor = (role) => {
        const colorMap = {
            'Admin': '#ef4444',
            'Manager': '#3b82f6',
            'Consumer': '#10b981'
        };
        return colorMap[role] || '#6b7280';
    };

    const getStatusColor = (status) => {
        const colorMap = {
            'Bronze': '#cd7f32',
            'Silver': '#c0c0c0',
            'Gold': '#ffd700',
            'None': '#6b7280'
        };
        return colorMap[status] || '#6b7280';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU');
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2>{user ? `${user.first_name} ${user.last_name}` : 'Загрузка...'}</h2>
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

                {loading ? (
                    <div className={styles.loadingContainer}>
                        <div className={styles.spinner}></div>
                        <p>Загрузка данных...</p>
                    </div>
                ) : user ? (
                    <div className={styles.content}>
                        {user.avatar_url && (
                            <div className={styles.imageSection}>
                                <img
                                    src={user.avatar_url}
                                    alt={`${user.first_name} ${user.last_name}`}
                                    style={{ borderRadius: '50%', width: '150px', height: '150px', objectFit: 'cover' }}
                                />
                            </div>
                        )}

                        <div className={styles.infoGrid}>
                            {/* Основная информация */}
                            <div className={styles.section}>
                                <h3>Основная информация</h3>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>ID:</span>
                                    <span className={styles.value}>{user.id}</span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Роль:</span>
                                    <span
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: getRoleColor(user.role) }}
                                    >
                    {getRoleLabel(user.role)}
                  </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Статус:</span>
                                    <span
                                        className={styles.statusBadge}
                                        style={{ backgroundColor: getStatusColor(user.status_of_user) }}
                                    >
                    {getStatusLabel(user.status_of_user)}
                  </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Аккаунт активен:</span>
                                    <span className={styles.value}>
                    {user.is_active ? (
                        <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Да</span>
                    ) : (
                        <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ Нет</span>
                    )}
                  </span>
                                </div>
                            </div>

                            {/* Контактная информация */}
                            <div className={styles.section}>
                                <h3>Контактная информация</h3>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Email:</span>
                                    <span className={styles.value}>
                    <a href={`mailto:${user.email}`} style={{ color: '#3b82f6' }}>
                      {user.email}
                    </a>
                  </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Телефон:</span>
                                    <span className={styles.value}>
                    <a href={`tel:${user.phone_number}`} style={{ color: '#3b82f6' }}>
                      {user.phone_number}
                    </a>
                  </span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Город:</span>
                                    <span className={styles.value}>{getCityLabel(user.city)}</span>
                                </div>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Дата рождения:</span>
                                    <span className={styles.value}>{formatDate(user.date_of_birth)}</span>
                                </div>
                            </div>

                            {/* Дополнительная информация */}
                            <div className={styles.section}>
                                <h3>Дополнительная информация</h3>

                                <div className={styles.infoRow}>
                                    <span className={styles.label}>Дата регистрации:</span>
                                    <span className={styles.value}>{formatDate(user.created_at)}</span>
                                </div>

                                {user.updated_at && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Последнее обновление:</span>
                                        <span className={styles.value}>{formatDate(user.updated_at)}</span>
                                    </div>
                                )}

                                {user.loyalty_point !== undefined && (
                                    <div className={styles.infoRow}>
                                        <span className={styles.label}>Бонусные баллы:</span>
                                        <span className={styles.value} style={{ fontWeight: '600', color: '#f59e0b' }}>
                      {user.loyalty_point} баллов
                    </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ViewUserModal;