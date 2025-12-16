import React from 'react';
import styles from '../../styles/BlockPage.module.scss';

const BlockCharacteristics = ({ characteristics = {} }) => {
    if (!characteristics || Object.keys(characteristics).length === 0) {
        return (
            <div className={styles.characteristics}>
                <h2>Характеристики</h2>
                <div className={styles.noData}>
                    <p>Характеристики недоступны</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.characteristics}>
            <h2>Характеристики</h2>
            <div className={styles.charGrid}>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Срок сдачи</span>
                    <span className={styles.charValue}>{characteristics.deadline || 'Не указано'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Технология строительства</span>
                    <span className={styles.charValue}>{characteristics.technology || 'Не указано'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Количество этажей</span>
                    <span className={styles.charValue}>{characteristics.floors || 'Не указано'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Высота потолков</span>
                    <span className={styles.charValue}>{characteristics.ceilingHeight || 'Не указано'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Количество квартир</span>
                    <span className={styles.charValue}>{characteristics.apartmentCount || 'Не указано'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Цены</span>
                    <span className={styles.charValue}>{characteristics.priceRange || 'Не указано'}</span>
                </div>
            </div>
        </div>
    );
};

export default BlockCharacteristics;