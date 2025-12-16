import React, { useState } from 'react';
import styles from '../../styles/BlockPage.module.scss';

const ApartmentSelector = ({ apartments = [], floors = [], rooms = [] }) => {
    const [selectedFloor, setSelectedFloor] = useState('Любой');
    const [selectedRoom, setSelectedRoom] = useState('Все');

    const getApartmentStatus = (apt) => {
        if (apt?.status === 'available') return styles.available;
        if (apt?.status === 'sold') return styles.sold;
        return styles.reserved;
    };

    if (!apartments || apartments.length === 0) {
        return (
            <div className={styles.apartmentSelector}>
                <h2>Выбор квартиры</h2>
                <div className={styles.noData}>
                    <p>Информация о квартирах недоступна</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.apartmentSelector}>
            <h2>Выбор квартиры</h2>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Этаж</label>
                    <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                        <option>Любой</option>
                        {floors.map(floor => <option key={floor}>{floor}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label>Комнат</label>
                    <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)}>
                        <option>Все</option>
                        {rooms.map(room => <option key={room}>{room}</option>)}
                    </select>
                </div>
            </div>

            <div className={styles.apartmentGrid}>
                {apartments.map((apt, index) => (
                    <div key={index} className={`${styles.apartment} ${getApartmentStatus(apt)}`}>
                        {apt.number}
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.available}></span> Свободна
        </span>
                <span className={styles.legendItem}>
          <span className={styles.sold}></span> Продана / Бронь
        </span>
            </div>
        </div>
    );
};

export default ApartmentSelector;