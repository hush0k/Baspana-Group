import React from 'react';
import styles from '../../styles/HeroSection.module.scss';

const HeroSection = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroOverlay}></div>
            <div className={styles.heroContent}>
                <h1 className={styles.heroTitle}>
                    Строим будущее.<br />
                    Надежно и<br />
                    качественно.
                </h1>
                <p className={styles.heroDescription}>
                    Откройте для себя проекты, созданные с заботой о каждой детали и
                    высочайшими стандартами качества.
                </p>
                <button className={styles.heroButton}>
                    Смотреть проекты
                </button>
            </div>
        </section>
    );
};

export default HeroSection;