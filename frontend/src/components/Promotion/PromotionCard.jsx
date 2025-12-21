import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import ViewPromotionModal from '../Modal/ViewPromotionModal';
import styles from '../../styles/PromotionPage.module.scss';

const PromotionCard = ({ promotion }) => {
    const { t } = useTranslation();
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const validity = `${formatDate(promotion.start_date)} - ${formatDate(promotion.end_date)}`;

    // Проверяем наличие изображения
    const hasImage = !!promotion.image_url && promotion.image_url !== '' && promotion.image_url !== 'null' && !imageError;

    console.log('Промоция:', promotion.title, 'image_url:', promotion.image_url, 'hasImage:', hasImage);

    const handleImageError = () => {
        console.error('Ошибка загрузки изображения:', promotion.image_url);
        setImageError(true);
    };

    return (
        <>
            <div className={styles.promotionCard}>
                <div className={styles.image}>
                    {hasImage ? (
                        <img
                            src={promotion.image_url}
                            alt={promotion.title}
                            onError={handleImageError}
                            style={{ display: 'block' }}
                        />
                    ) : (
                        <div className={styles.placeholder}>
                            <span>🏢</span>
                            <p>{promotion.discount_percentage}% {t('promotion.discountLabel')}</p>
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
                        onClick={() => setIsViewModalOpen(true)}
                    >
                        {t('promotion.learnMore')}
                    </button>
                </div>
            </div>

            <ViewPromotionModal
                isOpen={isViewModalOpen}
                onClose={() => setIsViewModalOpen(false)}
                promotionId={promotion.id}
            />
        </>
    );
};

export default PromotionCard;