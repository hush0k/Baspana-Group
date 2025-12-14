import React from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexInfrastructure = ({ city }) => {
    const infrastructure = [
        {
            icon: '🎓',
            category: 'Образование',
            items: [
                { name: 'Школа №12', distance: '5 мин' },
                { name: 'Детский сад "Солнышко"', distance: '3 мин' }
            ]
        },
        {
            icon: '🛒',
            category: 'Покупки и развлечения',
            items: [
                { name: 'ТРЦ "Галерея"', distance: '10 мин' },
                { name: 'Супермаркет', distance: '2 мин' }
            ]
        },
        {
            icon: '🌳',
            category: 'Парки и отдых',
            items: [
                { name: 'Центральный парк', distance: '15 мин пешком' }
            ]
        },
        {
            icon: '🏥',
            category: 'Здоровье',
            items: [
                { name: 'Аптека 24/7', distance: '1 мин' },
                { name: 'Поликлиника №3', distance: '7 мин' }
            ]
        }
    ];

    return (
        <section className={styles.infrastructureSection}>
            <h2 className={styles.sectionTitle}>Инфраструктура</h2>

            <div className={styles.infrastructureGrid}>
                {infrastructure.map((category, index) => (
                    <div key={index} className={styles.infrastructureCard}>
                        <div className={styles.categoryHeader}>
                            <span className={styles.categoryIcon}>{category.icon}</span>
                            <h3 className={styles.categoryTitle}>{category.category}</h3>
                        </div>
                        <ul className={styles.itemsList}>
                            {category.items.map((item, idx) => (
                                <li key={idx} className={styles.infrastructureItem}>
                                    <span className={styles.itemName}>{item.name}</span>
                                    <span className={styles.itemDistance}>({item.distance})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ComplexInfrastructure;