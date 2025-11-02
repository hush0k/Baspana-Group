import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/AuthService';
import styles from '../../styles/Home.module.scss';

const Home = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const userData = await authService.getCurrentUser();
                setUser(userData);
            } catch (err) {
                console.error('Error fetching user:', err);
                setError('Не удалось загрузить данные пользователя');
                if (err.response?.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem('access_token');
        if (!token) {
            navigate('/login');
        } else {
            fetchUser();
        }
    }, [navigate]);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    if (loading) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.loadingSpinner}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.pageWrapper}>
                <div className={styles.errorContainer}>
                    <div className={styles.errorIcon}>⚠️</div>
                    <h2>{error}</h2>
                    <button onClick={() => navigate('/login')} className={styles.backBtn}>
                        Вернуться к входу
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.container}>
                {/* Header */}
                <header className={styles.header}>
                    <div className={styles.headerContent}>
                        <div className={styles.logo}>
                            <h1>Baspana Group</h1>
                            <p className={styles.tagline}>Строительство будущего</p>
                        </div>
                        <div className={styles.headerActions}>
                            <div className={styles.userBadge}>
                                <div className={styles.avatar}>
                                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                                </div>
                                <span className={styles.userName}>
                                    {user?.first_name} {user?.last_name}
                                </span>
                            </div>
                            <button onClick={handleLogout} className={styles.logoutBtn}>
                                <span>Выйти</span>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 7L15.59 8.41L18.17 11H8V13H18.17L15.59 15.58L17 17L22 12L17 7Z" fill="currentColor"/>
                                    <path d="M4 5H12V3H4C2.9 3 2 3.9 2 5V19C2 20.1 2.9 21 4 21H12V19H4V5Z" fill="currentColor"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className={styles.mainContent}>
                    {/* Welcome Section */}
                    <section className={styles.welcomeSection}>
                        <div className={styles.welcomeCard}>
                            <h2>Добро пожаловать!</h2>
                            <p>Рады видеть вас в личном кабинете Baspana Group</p>
                            <div className={styles.statusBadge}>
                                <span className={styles.statusLabel}>Ваш статус:</span>
                                <span className={styles.statusValue}>{user?.status_of_user}</span>
                            </div>
                        </div>
                    </section>

                    {/* User Info Section */}
                    <section className={styles.userInfoSection}>
                        <h3 className={styles.sectionTitle}>Личная информация</h3>
                        <div className={styles.infoGrid}>
                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>👤</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Имя и фамилия</span>
                                    <span className={styles.cardValue}>
                                        {user?.first_name} {user?.last_name}
                                    </span>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>📧</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Email</span>
                                    <span className={styles.cardValue}>{user?.email}</span>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>📱</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Телефон</span>
                                    <span className={styles.cardValue}>{user?.phone_number}</span>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>📍</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Город</span>
                                    <span className={styles.cardValue}>{user?.city}</span>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>🎭</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Роль</span>
                                    <span className={styles.cardValue}>{user?.role}</span>
                                </div>
                            </div>

                            <div className={styles.infoCard}>
                                <div className={styles.cardIcon}>🎂</div>
                                <div className={styles.cardContent}>
                                    <span className={styles.cardLabel}>Дата рождения</span>
                                    <span className={styles.cardValue}>
                                        {new Date(user?.date_of_birth).toLocaleDateString('ru-RU')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Quick Actions */}
                    <section className={styles.actionsSection}>
                        <h3 className={styles.sectionTitle}>Быстрые действия</h3>
                        <div className={styles.actionsGrid}>
                            <button className={styles.actionCard}>
                                <div className={styles.actionIcon}>🏢</div>
                                <span>Каталог недвижимости</span>
                            </button>
                            <button className={styles.actionCard}>
                                <div className={styles.actionIcon}>❤️</div>
                                <span>Избранное</span>
                            </button>
                            <button className={styles.actionCard}>
                                <div className={styles.actionIcon}>📋</div>
                                <span>Мои заказы</span>
                            </button>
                            <button className={styles.actionCard}>
                                <div className={styles.actionIcon}>⚙️</div>
                                <span>Настройки</span>
                            </button>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className={styles.footer}>
                    <p>&copy; 2024 Baspana Group. Все права защищены.</p>
                </footer>
            </div>
        </div>
    );
};

export default Home;