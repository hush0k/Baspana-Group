import React, { useState, useEffect } from 'react';
import Map2GIS from './Map2GIS';
import infrastructure2GISService from '../../services/Infrastructure2GISService';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexInfrastructure = ({ latitude, longitude, complexName }) => {
    const [infrastructure, setInfrastructure] = useState([]);
    const [markers, setMarkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadInfrastructure = async () => {
            console.log('Загрузка инфраструктуры для координат:', latitude, longitude);

            if (!latitude || !longitude) {
                setError('Координаты не указаны');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const lat = parseFloat(latitude);
                const lon = parseFloat(longitude);

                console.log('Парсированные координаты:', lat, lon);

                // Загружаем инфраструктуру по категориям (радиус 1000 метров)
                const infrastructureData = await infrastructure2GISService.getInfrastructureByCategories(
                    lat,
                    lon,
                    1000
                );

                console.log('Загружено категорий инфраструктуры:', infrastructureData.length);
                setInfrastructure(infrastructureData);

                // Получаем данные для маркеров
                const markersData = await infrastructure2GISService.getAllMarkersData(
                    lat,
                    lon,
                    1000
                );

                console.log('Загружено маркеров:', markersData.length);
                setMarkers(markersData);
                setLoading(false);
            } catch (err) {
                console.error('Error loading infrastructure:', err);
                setError('Не удалось загрузить инфраструктуру');
                setLoading(false);
            }
        };

        loadInfrastructure();
    }, [latitude, longitude]);

    if (loading) {
        return (
            <section className={styles.infrastructureSection}>
                <h2 className={styles.sectionTitle}>Инфраструктура</h2>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Загрузка инфраструктуры...</p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className={styles.infrastructureSection}>
                <h2 className={styles.sectionTitle}>Инфраструктура</h2>
                <div className={styles.errorState}>
                    <p>{error}</p>
                </div>
            </section>
        );
    }

    return (
        <section className={styles.infrastructureSection}>
            <h2 className={styles.sectionTitle}>Инфраструктура</h2>

            {/* Карта с маркерами */}
            <Map2GIS
                latitude={parseFloat(latitude)}
                longitude={parseFloat(longitude)}
                markers={markers}
                complexName={complexName}
            />

            {/* Список инфраструктуры */}
            {infrastructure.length > 0 ? (
                <div className={styles.infrastructureGrid}>
                    {infrastructure.map((category, index) => (
                        <div key={index} className={styles.infrastructureCard}>
                            <div className={styles.categoryHeader}>
                                <span className={styles.categoryIcon}>{category.icon}</span>
                                <h3 className={styles.categoryTitle}>{category.category}</h3>
                            </div>
                            <ul className={styles.itemsList}>
                                {category.items.map((item, idx) => (
                                    <li key={item.id || idx} className={styles.infrastructureItem}>
                                        <span className={styles.itemName}>{item.name}</span>
                                        <span className={styles.itemDistance}>({item.distance})</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={styles.emptyState}>
                    <p>В радиусе 1 км не найдено объектов инфраструктуры</p>
                </div>
            )}
        </section>
    );
};

export default ComplexInfrastructure;