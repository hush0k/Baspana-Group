import React from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexInfo = ({ complex }) => {
    const formatDate = (dateString) => {
        if (!dateString) return 'Не указано';
        const date = new Date(dateString);
        const options = { month: 'long', year: 'numeric' };
        return date.toLocaleDateString('ru-RU', options);
    };

    return (
        <section className={styles.infoSection}>
            <div className={styles.infoHeader}>
                <div className={styles.statusBadge}>
                    Статус проекта: Срок сдачи {formatDate(complex?.construction_end)}
                </div>
            </div>

            <div className={styles.infoContent}>
                <h2 className={styles.infoTitle}>О Комплексе</h2>
                <p className={styles.infoDescription}>
                    {complex?.description}
                </p>
            </div>
        </section>
    );
};

export default ComplexInfo;