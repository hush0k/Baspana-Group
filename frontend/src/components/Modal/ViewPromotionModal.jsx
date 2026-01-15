import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import promotionService from '../../services/PromotionService';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewPromotionModal = ({ isOpen, onClose, promotionId }) => {
  const { t } = useTranslation();
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && promotionId) {
      fetchPromotionData();
    }
  }, [isOpen, promotionId]);

  const fetchPromotionData = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await promotionService.getPromotionById(promotionId);
      setPromotion(data);
    } catch (err) {
      console.error('Ошибка загрузки данных акции:', err);
      setError(t('modal.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getApartmentTypeLabel = (type) => {
    return t(`apartment.types.${type}`, type);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{promotion?.title || t('modal.loading')}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        {loading ? (
          <div className={styles.loadingState}>{t('modal.loading')}</div>
        ) : promotion ? (
          <div className={styles.contentWrapper}>
            {promotion.image_url && (
              <div className={styles.imageSection}>
                <img
                  src={promotion.image_url}
                  alt={promotion.title}
                  style={{
                    width: '100%',
                    maxHeight: '400px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    marginBottom: '30px'
                  }}
                />
              </div>
            )}

            <div className={styles.infoSection}>
              <div className={styles.statusBadge} style={{
                backgroundColor: promotion.is_active ? '#10b981' : '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {promotion.is_active ? t('modal.active') : t('modal.inactive')}
              </div>

              <div className={styles.discountSection} style={{
                backgroundColor: '#fef3c7',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '30px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#d97706' }}>
                  {promotion.discount_percentage}%
                </div>
                <div style={{ fontSize: '18px', color: '#92400e', marginTop: '8px' }}>
                  {t('modal.discount')}
                </div>
              </div>

              {promotion.short_description && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#2d1810' }}>
                    {t('modal.shortDescription')}
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.6' }}>
                    {promotion.short_description}
                  </p>
                </div>
              )}

              {promotion.description && (
                <div style={{ marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '10px', color: '#2d1810' }}>
                    {t('modal.fullDescription')}
                  </h3>
                  <p style={{ color: '#666', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                    {promotion.description}
                  </p>
                </div>
              )}

              <div className={styles.detailsGrid} style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '20px',
                marginTop: '30px'
              }}>
                <div className={styles.detailItem}>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>
                    {t('modal.startDate')}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d1810' }}>
                    {formatDate(promotion.start_date)}
                  </div>
                </div>

                <div className={styles.detailItem}>
                  <div style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>
                    {t('modal.endDate')}
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d1810' }}>
                    {formatDate(promotion.end_date)}
                  </div>
                </div>

                {promotion.apartment_type && (
                  <div className={styles.detailItem}>
                    <div style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>
                      {t('modal.apartmentType')}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d1810' }}>
                      {getApartmentTypeLabel(promotion.apartment_type)}
                    </div>
                  </div>
                )}

                {promotion.residential_complex_id && (
                  <div className={styles.detailItem}>
                    <div style={{ fontSize: '14px', color: '#999', marginBottom: '5px' }}>
                      {t('modal.complexId')}
                    </div>
                    <div style={{ fontSize: '16px', fontWeight: '600', color: '#2d1810' }}>
                      {promotion.residential_complex_id}
                    </div>
                  </div>
                )}
              </div>

              <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '5px' }}>
                  {t('modal.created')}: {formatDate(promotion.created_at)}
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  {t('modal.updated')}: {formatDate(promotion.updated_at)}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>{t('modal.noData')}</div>
        )}

        <div className={styles.modalFooter}>
          <button
            type="button"
            className={styles.closeButtonFooter}
            onClick={onClose}
            style={{
              padding: '12px 24px',
                margin: '25px',
              backgroundColor: '#4a3428',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {t('modal.close')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewPromotionModal;
