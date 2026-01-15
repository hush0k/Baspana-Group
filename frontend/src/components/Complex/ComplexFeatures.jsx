import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexFeatures = ({ complex }) => {
    const { t } = useTranslation();

    const features = [
        {
            icon: '🏠',
            title: t('complex.features.closedYard'),
            available: complex?.has_security
        },
        {
            icon: '🅿️',
            title: t('complex.features.parking'),
            available: true
        },
        {
            icon: '🏢',
            title: t('complex.features.relaxZones'),
            available: true
        },
        {
            icon: '📍',
            title: t('complex.features.goodLocation'),
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