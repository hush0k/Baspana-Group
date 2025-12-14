import React from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexHero = ({ complex, mainImage }) => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.heroImageContainer}>
                <img
                    src={mainImage || '/placeholder-complex.jpg'}
                    alt={complex?.name}
                    className={styles.heroImage}
                />
            </div>
            <div className={styles.heroOverlay}>
                <div className={styles.heroContent}>
                    <h1 className={styles.heroTitle}>{complex?.name}</h1>
                </div>
            </div>
        </section>
    );
};

export default ComplexHero;