import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getLocalizedDescription, getLocalizedShortDescription } from '../../utils/i18nHelpers';
import commercialUnitService from '../../services/CommercialUnitService';
import buildingService from '../../services/BuildingService';
import complexService from '../../services/ComplexService';
import imageService from '../../services/ImageService';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewCommercialUnitModal = ({ isOpen, onClose, commercialUnitId }) => {
  const { t } = useTranslation();
  const [commercialUnit, setCommercialUnit] = useState(null);
  const [building, setBuilding] = useState(null);
  const [complex, setComplex] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && commercialUnitId) {
      fetchCommercialUnitData();
      fetchCommercialUnitImages();
    }
  }, [isOpen, commercialUnitId]);

  const fetchCommercialUnitData = async () => {
    setLoading(true);
    setError('');
    try {
      const unit = await commercialUnitService.getCommercialUnitById(commercialUnitId);
      setCommercialUnit(unit);

      // Загружаем данные о здании
      const buildingData = await buildingService.getBuildingById(unit.building_id);
      setBuilding(buildingData);

      // Загружаем данные о ЖК
      const complexData = await complexService.getComplexById(buildingData.residential_complex_id);
      setComplex(complexData);
    } catch (err) {
      console.error('Ошибка загрузки данных коммерческого помещения:', err);
      setError(t('modal.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchCommercialUnitImages = async () => {
    try {
      const imagesData = await imageService.getImages(commercialUnitId, 'Commercial');
      setImages(imagesData || []);
    } catch (err) {
      console.error('Ошибка загрузки изображений:', err);
    }
  };

  const formatNumber = (value) => {
    if (!value) return '—';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getCommercialTypeLabel = (type) => {
    return t(`common.commercialTypes.${type}`, type);
  };

  const getStatusLabel = (status) => {
    const statusKey = status.toLowerCase();
    return t(`apartment.${statusKey}`, status);
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Free': '#10b981',
      'Booked': '#f59e0b',
      'Sold': '#6b7280'
    };
    return colorMap[status] || '#6b7280';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>
            {commercialUnit?.unit_number
              ? `${t('blockPage.commercialUnit')} №${commercialUnit.unit_number}`
              : t('modal.loading')}
          </h2>
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
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
            <p>{t('modal.loading')}</p>
          </div>
        ) : commercialUnit ? (
          <div className={styles.content}>
            {/* Изображения */}
            {images.length > 0 && (
              <div className={styles.imageSection}>
                <div className={styles.imageGrid}>
                  {images.map((image) => (
                    <img
                      key={image.id}
                      src={image.img_url}
                      alt={`Коммерческое помещение ${commercialUnit.unit_number}`}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.infoGrid}>
              {/* Основная информация */}
              <div className={styles.section}>
                <h3>{t('modal.basicInfo')}</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('blockPage.commercialUnit')} #:</span>
                  <span className={styles.value}>{commercialUnit.unit_number}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('complex.title')}:</span>
                  <span className={styles.value}>{complex?.name || '—'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('blockPage.block')}:</span>
                  <span className={styles.value}>{t('blockPage.block')} {building?.block || '—'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('apartment.floor')}:</span>
                  <span className={styles.value}>{commercialUnit.floor}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('blockPage.commercialType')}:</span>
                  <span className={styles.value}>
                    {getCommercialTypeLabel(commercialUnit.commercial_type)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('apartment.status')}:</span>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(commercialUnit.status) }}
                  >
                    {getStatusLabel(commercialUnit.status)}
                  </span>
                </div>
                {getLocalizedShortDescription(commercialUnit) && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>{t('modal.shortDescription')}:</span>
                    <span className={styles.value}>{getLocalizedShortDescription(commercialUnit)}</span>
                  </div>
                )}
                {getLocalizedDescription(commercialUnit) && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>{t('apartment.description')}:</span>
                    <span className={styles.value}>{getLocalizedDescription(commercialUnit)}</span>
                  </div>
                )}
              </div>

              {/* Характеристики и цены */}
              <div className={styles.section}>
                <h3>{t('modal.characteristics')} & {t('modal.pricing')}</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('apartment.area')}:</span>
                  <span className={styles.value}>{formatNumber(commercialUnit.unit_area)} {t('common.sqm')}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('apartment.pricePerSqm')}:</span>
                  <span className={styles.value}>{formatNumber(commercialUnit.price_per_sqr)} {t('common.tenge')}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>{t('apartment.price')}:</span>
                  <span className={styles.value} style={{ fontSize: '18px', fontWeight: '600' }}>
                    {formatNumber(commercialUnit.total_price)} {t('common.tenge')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ViewCommercialUnitModal;
