import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/HeroSection.module.scss';

const HeroSection = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    {t('hero.title')}<br />
                    {t('hero.subtitle')}
                </h1>
                <p className={styles.heroDescription}>
                    {t('hero.description')}
                </p>
                <button className={styles.heroButton}>
                    {t('hero.viewProjects')}
                </button>
            </div>
        </section>
    );
};

export default HeroSection;