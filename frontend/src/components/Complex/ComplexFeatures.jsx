import React from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexFeatures = ({ complex }) => {
    const features = [
        {
            icon: '🏠',
            title: 'Закрытый двор',
            available: complex?.has_security
        },
        {
            icon: '🅿️',
            title: 'Подземный паркинг',
            available: true // можно добавить поле в модель
        },
        {
            icon: '🏢',
            title: 'Зоны отдыха',
            available: true
        },
        {
            icon: '📍',
            title: 'Удобное расположение',
            available: true
        }
    ];

    return (
        <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
                <div key={index} className={styles.featureCard}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    <span className={styles.featureTitle}>{feature.title}</span>
                </div>
            ))}
        </div>
    );
};

export default ComplexFeatures;