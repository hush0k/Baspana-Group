import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/PromotionPage.module.scss';

const PromotionCard = ({ promotion }) => {
    const navigate = useNavigate();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const validity = `${formatDate(promotion.start_date)} - ${formatDate(promotion.end_date)}`;

    return (
        <div className={styles.promotionCard}>
            <div className={styles.image}>
                {promotion.image_url ? (
                    <img src={promotion.image_url} alt={promotion.title} />
                ) : (
                    <div className={styles.placeholder}>
                        <span>🏢</span>
                        <p>{promotion.discount_percentage}% скидка</p>
                    </div>
                )}
            </div>
            <div className={styles.content}>
                <h3>{promotion.title}</h3>
                <p>{promotion.short_description || promotion.description}</p>
                <div className={styles.validity}>
                    <span className={styles.icon}>📅</span>
                    <span>{validity}</span>
                </div>
                <button
                    className={styles.detailsButton}
                    onClick={() => navigate(`/promotions/${promotion.id}`)}
                >
                    Узнать подробнее
                </button>
            </div>
        </div>
    );
};

export default PromotionCard;