import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/ComplexCard.module.scss';

const ComplexCard = ({ complex }) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate(`/complex/${complex.id}`);
    };

    const getImageSrc = (mainImage) => {
        if (!mainImage) {
            return `https://via.placeholder.com/400x300?text=ЖК+${encodeURIComponent(complex.name)}`;
        }
        // Если изображение уже имеет префикс data:image, возвращаем как есть
        if (mainImage.startsWith('data:image')) {
            return mainImage;
        }
        // Если это base64 без префикса, добавляем префикс
        if (mainImage.startsWith('/9j/') || mainImage.startsWith('iVBOR')) {
            return `data:image/jpeg;base64,${mainImage}`;
        }
        // Если это URL, возвращаем как есть
        if (mainImage.startsWith('http')) {
            return mainImage;
        }
        // По умолчанию считаем это base64 JPEG
        return `data:image/jpeg;base64,${mainImage}`;
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const getClassText = (buildingClass) => {
        const classMap = {
            'Economic': 'Эконом',
            'Comfort': 'Комфорт',
            'Comfort+': 'Комфорт+',
            'Business': 'Бизнес',
            'Luxury': 'Премиум'
        };
        return classMap[buildingClass] || buildingClass;
    };

    const getStatusText = (status) => {
        const statusMap = {
            'Project': 'Проект',
            'Under Construction': 'Строится',
            'Completed': 'Сдан'
        };
        return statusMap[status] || status;
    };

    const getStatusIcon = (status) => {
        if (status === 'Completed') return '✓';
        if (status === 'Under Construction') return '🏗️';
        return '📋';
    };

    const getStatusClass = (status) => {
        if (status === 'Completed') return styles.statusCompleted;
        if (status === 'Under Construction') return styles.statusConstruction;
        return styles.statusProject;
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <article className={styles.card} onClick={handleCardClick}>
            <div className={styles.cardGrid}>
                <div className={styles.imageContainer}>
                    <img
                        src={getImageSrc(complex.main_image)}
                        alt={complex.name}
                        className={styles.image}
                    />
                    <div className={`${styles.badge} ${getStatusClass(complex.building_status)}`}>
                        {getClassText(complex.building_class)}
                    </div>
                </div>

                <div className={styles.content}>
                    <div className={styles.header}>
                        <div className={styles.titleBlock}>
                            <h3 className={styles.title}>ЖК '{complex.name}'</h3>
                            <p className={styles.location}>
                                📍 {complex.city}, {complex.address}
                            </p>
                        </div>
                    </div>

                    <p className={styles.description}>
                        {complex.short_description}
                    </p>

                    <div className={styles.features}>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>🏢</span>
                            <span className={styles.featureText}>
                                {complex.min_area
                                    ? `от ${complex.min_area} м²`
                                    : complex.apartment_area
                                        ? `${formatPrice(complex.apartment_area)} м²`
                                        : 'Уточняйте'}
                            </span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>💰</span>
                            <span className={styles.featureText}>
                                {complex.min_price
                                    ? `от ${formatPrice(complex.min_price)} ₸`
                                    : 'Уточняйте'}
                            </span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>📅</span>
                            <span className={styles.featureText}>
                                {complex.building_status === 'Completed'
                                    ? 'Сдан'
                                    : complex.construction_end
                                        ? formatDate(complex.construction_end)
                                        : 'Уточняйте'}
                            </span>
                        </div>
                        <div className={styles.feature}>
                            <span className={styles.featureIcon}>
                                {getStatusIcon(complex.building_status)}
                            </span>
                            <span className={`${styles.featureText} ${
                                complex.building_status === 'Completed'
                                    ? styles.statusTextCompleted
                                    : ''
                            }`}>
                                {getStatusText(complex.building_status)}
                            </span>
                        </div>
                    </div>

                    <button
                        className={styles.detailsButton}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCardClick();
                        }}
                    >
                        Подробнее о проекте
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ComplexCard;