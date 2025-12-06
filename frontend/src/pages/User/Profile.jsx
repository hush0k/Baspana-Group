import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import { authService } from '../../services/AuthService';
import styles from '../../styles/Profile.module.scss';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const userData = localStorage.getItem('user');
                if (userData) {
                    setUser(JSON.parse(userData));
                } else {
                    const data = await authService.getCurrentUser();
                    setUser(data);
                    localStorage.setItem('user', JSON.stringify(data));
                }
                setLoading(false);
            } catch (error) {
                console.error('Error loading user data:', error);
                navigate('/login');
            }
        };

        loadUserData();
    }, [navigate]);

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <div className={styles.pageWrapper}>
            <HeaderBlack />
            <main className={styles.mainContent}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Личный кабинет</h1>

                    <div className={styles.profileCard}>
                        <div className={styles.profileHeader}>
                            <div className={styles.avatar}>
                                {user?.first_name?.charAt(0).toUpperCase()}
                                {user?.last_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.userInfo}>
                                <h2>{user?.first_name} {user?.last_name}</h2>
                                <p className={styles.role}>{user?.role}</p>
                            </div>
                        </div>

                        <div className={styles.profileDetails}>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user?.email}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Телефон:</span>
                                <span className={styles.value}>{user?.phone_number || 'Не указан'}</span>
                            </div>
                            <div className={styles.detailRow}>
                                <span className={styles.label}>Роль:</span>
                                <span className={styles.value}>{user?.role}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.placeholder}>
                        <p>Здесь будет дополнительный функционал личного кабинета</p>
                    </div>
                </div>
            </main>
            <FooterBlack />
        </div>
    );
};

export default Profile;