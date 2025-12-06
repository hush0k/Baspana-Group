import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderBlack from '../../components/Header/HeaderBlack';
import FooterBlack from '../../components/Footer/FooterBlack';
import { complexService } from '../../services/ComplexService';
import styles from '../../styles/BuildingsManagement.module.scss';

const BuildingsManagement = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [complexes, setComplexes] = useState([]);
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

                if (parsedUser.role !== 'Manager' && parsedUser.role !== 'Admin') {
                    navigate('/');
                    return;
                }

                const data = await complexService.getComplexes();
                // API возвращает объект с полем results
                setComplexes(data.results || data);
                setLoading(false);
            } catch (error) {
                console.error('Error loading data:', error);
                setLoading(false);
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
                    <h1 className={styles.title}>Панель управления зданиями</h1>

                    <div className={styles.statsCards}>
                        <div className={styles.statCard}>
                            <h3>Всего комплексов</h3>
                            <p className={styles.statNumber}>{complexes.length}</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Активные проекты</h3>
                            <p className={styles.statNumber}>
                                {complexes.filter(c => c.building_status === 'Under Construction').length}
                            </p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Завершенные</h3>
                            <p className={styles.statNumber}>
                                {complexes.filter(c => c.building_status === 'Completed').length}
                            </p>
                        </div>
                    </div>

                    <div className={styles.placeholder}>
                        <p>Здесь будет функционал управления жилыми комплексами</p>
                        <ul>
                            <li>Создание новых комплексов</li>
                            <li>Редактирование существующих</li>
                            <li>Управление квартирами</li>
                            <li>Статистика и отчеты</li>
                        </ul>
                    </div>
                </div>
            </main>
            <FooterBlack />
        </div>
    );
};

export default BuildingsManagement;