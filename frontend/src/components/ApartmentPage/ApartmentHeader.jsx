import React from 'react';
import styles from '../../styles/ApartmentPage.module.scss';
import { ReactComponent as ApartmentIcon} from "../../assets/icons/apartment.svg";


const ApartmentHeader = ({ apartment }) => {
    const getTypeLabel = (type) => {
        const typeMap = {
            'Studio': 'Студия',
            'One Bedroom': '1-комнатная',
            'Two Bedroom': '2-комнатная',
            'Three Bedroom': '3-комнатная',
            'Penthouse': 'Пентхаус'
        };
        return typeMap[type] || type;
    };

    return (
        <div className={styles.apartmentHeader}>
            <h1>{getTypeLabel(apartment.apartment_type)} квартира, {apartment.apartment_area} м²</h1>
            <p className={styles.complexName}>Квартира №{apartment.number}</p>
            <div className={styles.price}>{parseInt(apartment.total_price).toLocaleString()} ₸</div>

            <div className={styles.details}>
                <div className={styles.detailItem}>
                    <span className={styles.icon}>📐</span>
                    <span>{apartment.apartment_area} м²</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.icon}><ApartmentIcon /></span>
                    <span>{getTypeLabel(apartment.apartment_type)}</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.icon}>🏢</span>
                    <span>{apartment.floor} этаж</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.icon}>🚿</span>
                    <span>{apartment.bathroom_count} санузла</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.icon}>🍳</span>
                    <span>Кухня {apartment.kitchen_area} м²</span>
                </div>
                <div className={styles.detailItem}>
                    <span className={styles.icon}>✨</span>
                    <span>{apartment.finishing_type}</span>
                </div>
            </div>

            <div className={styles.actions}>
                <button className={styles.buyButton}>Купить</button>
                <button className={styles.bookButton}>Забронировать</button>
            </div>
        </div>
    );
};

export default ApartmentHeader;