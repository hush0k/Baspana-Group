import React from 'react';
import styles from '../../styles/ApartmentPage.module.scss';

const ApartmentCharacteristics = ({ apartment }) => {
    return (
        <div className={styles.characteristics}>
            <h2>Характеристики</h2>
            <div className={styles.charGrid}>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Общая площадь</span>
                    <span className={styles.charValue}>{apartment.apartment_area} м²</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Площадь кухни</span>
                    <span className={styles.charValue}>{apartment.kitchen_area} м²</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Высота потолков</span>
                    <span className={styles.charValue}>{apartment.ceiling_height} м</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Отделка</span>
                    <span className={styles.charValue}>{apartment.finishing_type}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Санузлов</span>
                    <span className={styles.charValue}>{apartment.bathroom_count}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Балкон</span>
                    <span className={styles.charValue}>{apartment.has_balcony ? 'Есть' : 'Нет'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Ориентация</span>
                    <span className={styles.charValue}>{apartment.orientation}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Угловая</span>
                    <span className={styles.charValue}>{apartment.isCorner ? 'Да' : 'Нет'}</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Цена за м²</span>
                    <span className={styles.charValue}>{parseInt(apartment.price_per_sqr).toLocaleString()} ₸</span>
                </div>
                <div className={styles.charItem}>
                    <span className={styles.charLabel}>Статус</span>
                    <span className={styles.charValue}>{apartment.status === 'Free' ? 'Свободна' : apartment.status === 'Booked' ? 'Забронирована' : 'Продана'}</span>
                </div>
            </div>
        </div>
    );
};

export default ApartmentCharacteristics;