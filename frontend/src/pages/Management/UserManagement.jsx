import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import styles from '../../styles/UserManagement.module.scss';

const UserManagement = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAccess = async () => {
            try {
                const userData = localStorage.getItem('user');
                if (!userData) {
                    navigate('/login');
                    return;
                }

                const parsedUser = JSON.parse(userData);
                setUser(parsedUser);

                if (parsedUser.role !== 'Admin') {
                    navigate('/');
                    return;
                }

                setLoading(false);
            } catch (error) {
                console.error('Error checking access:', error);
                navigate('/login');
            }
        };

        checkAccess();
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
                    <h1 className={styles.title}>Управление пользователями</h1>

                    <div className={styles.actionsBar}>
                        <button className={styles.primaryBtn}>
                            Добавить пользователя
                        </button>
                        <input
                            type="text"
                            placeholder="Поиск пользователей..."
                            className={styles.searchInput}
                        />
                    </div>

                    <div className={styles.placeholder}>
                        <p>Здесь будет функционал управления пользователями</p>
                        <ul>
                            <li>Просмотр всех пользователей</li>
                            <li>Создание новых учетных записей</li>
                            <li>Редактирование прав доступа</li>
                            <li>Изменение ролей пользователей</li>
                            <li>Блокировка/разблокировка аккаунтов</li>
                        </ul>
                    </div>
                </div>
            </main>
            <FooterBlack />
        </div>
    );
};

export default UserManagement;