import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/card1.module.scss';

const ComplexCard = ({ complex }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/complexes/${complex.id}`);
    };

    // Форматирование цены
    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    // Перевод статуса на русский
    const getStatusText = (status) => {
        const statusMap = {
            'Project': 'Проект',
            'Under Construction': 'Строится',
            'Completed': 'Сдан'
        };
        return statusMap[status] || status;
    };

    // Определяем цвет статуса
    const getStatusClass = (status) => {
        if (status === 'Completed') return styles.statusCompleted;
        if (status === 'Under Construction') return styles.statusConstruction;
        return styles.statusProject;
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.imageContainer}>
                <img
                    src={complex.main_image || '/placeholder-building.jpg'}
                    alt={complex.name}
                    className={styles.image}
                />
                <div className={`${styles.status} ${getStatusClass(complex.building_status)}`}>
                    {getStatusText(complex.building_status)}
                </div>
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>ЖК '{complex.name}'</h3>

                <p className={styles.location}>
                    {complex.city}, {complex.address}
                </p>

                <div className={styles.priceBlock}>
                    <span className={styles.priceLabel}>от</span>
                    <span className={styles.price}>{formatPrice(complex.min_price)} ₸</span>
                </div>

                {complex.construction_end && (
                    <p className={styles.deadline}>
                        Сдача в {new Date(complex.construction_end).toLocaleDateString('ru-RU', {
                        month: 'long',
                        year: 'numeric'
                    })}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ComplexCard;