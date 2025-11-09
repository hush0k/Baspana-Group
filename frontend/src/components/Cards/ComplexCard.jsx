import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ComplexCard.module.scss';

const ComplexCard = ({ complex }) => {
    const navigate = useNavigate();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long'
        });
    };

    const getStatusText = (status) => {
        const statusMap = {
            'Completed': 'Сдан',
            'Under Construction': 'Строится',
            'Project': 'Проект'
        };
        return statusMap[status] || status;
    };

    const getClassText = (buildingClass) => {
        const classMap = {
            'Economic': 'Эконом',
            'Comfort': 'Комфорт',
            'Comfort+': 'Комфорт+',
            'Business': 'Бизнес',
            'Luxury': 'Люкс'
        };
        return classMap[buildingClass] || buildingClass;
    };

    const handleCardClick = () => {
        navigate(`/complexes/${complex.id}`);
    };

    return (
        <div className={styles.card} onClick={handleCardClick}>
            <div className={styles.cardGrid}>
                {/* Изображение */}
                <div className={styles.imageContainer}>
                    <img
                        src={complex.main_image}
                        alt={complex.name}
                        className={styles.image}
                    />
                    <div className={styles.badge}>
                        {getClassText(complex.building_class)}
                    </div>
                </div>

                {/* Контент */}
                <div className={styles.content}>
                    <div>
                        <div className={styles.header}>
                            <div className={styles.titleBlock}>
                                <h3 className={styles.title}>{complex.name}</h3>
                                <p className={styles.location}>
                                    <span className={styles.featureIcon}>📍</span>
                                    {complex.address}
                                </p>
                            </div>
                        </div>

                        <p className={styles.description}>
                            {complex.description}
                        </p>

                        {/* Характеристики */}
                        <div className={styles.features}>
                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>🏠</span>
                                <span className={styles.featureText}>
                                    от {complex.min_area} м²
                                </span>
                            </div>

                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>💰</span>
                                <span className={styles.featureText}>
                                    от {formatPrice(complex.min_price)} ₸
                                </span>
                            </div>

                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>
                                    {complex.building_status === 'Completed' ? '✅' : '🏗️'}
                                </span>
                                <span className={`${styles.featureText} ${
                                    complex.building_status === 'Completed'
                                        ? styles.statusTextCompleted
                                        : ''
                                }`}>
                                    {getStatusText(complex.building_status)}
                                </span>
                            </div>

                            <div className={styles.feature}>
                                <span className={styles.featureIcon}>📅</span>
                                <span className={styles.featureText}>
                                    {formatDate(complex.construction_end)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        className={styles.detailsButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        Подробнее
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ComplexCard;