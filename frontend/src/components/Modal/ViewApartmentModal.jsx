import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apartmentService from '../../services/ApartmentService';
import buildingService from '../../services/BuildingService';
import panoramaService from '../../services/PanoramaService';
import PanoramaViewer from '../Panorama/PanoramaViewer';
import UploadPanoramaModal from './UploadPanoramaModal';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewApartmentModal = ({ isOpen, onClose, apartmentId }) => {
  const { t } = useTranslation();
  const [apartment, setApartment] = useState(null);
  const [building, setBuilding] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [panoramas, setPanoramas] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen && apartmentId) {
      fetchApartmentData();
      fetchPanoramas();
    }
  }, [isOpen, apartmentId]);

  const fetchApartmentData = async () => {
    setLoading(true);
    setError('');
    try {
      const apartmentData = await apartmentService.getApartmentById(apartmentId);
      setApartment(apartmentData);

      // Загружаем данные о здании
      const buildingData = await buildingService.getBuildingById(apartmentData.building_id);
      setBuilding(buildingData);
    } catch (err) {
      console.error('Ошибка загрузки данных квартиры:', err);
      setError(t('modal.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchPanoramas = async () => {
    try {
      const data = await panoramaService.getByApartment(apartmentId);
      setPanoramas(data);
    } catch (err) {
      console.error('Ошибка загрузки панорам:', err);
    }
  };

  const handleDeletePanorama = async (panoramaId) => {
    try {
      await panoramaService.delete(panoramaId);
      fetchPanoramas();
    } catch (err) {
      console.error('Ошибка удаления панорамы:', err);
      alert('Ошибка при удалении панорамы');
    }
  };

  const formatNumber = (value) => {
    if (!value) return '—';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getApartmentTypeLabel = (type) => {
    return t(`apartment.types.${type}`, type);
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

  const getFinishingTypeLabel = (type) => {
    return t(`apartment.finishingTypes.${type}`, type);
  };

  const getOrientationLabel = (orientation) => {
    return t(`apartment.orientations.${orientation}`, orientation);
  };

  const getOrientationLabelOld = (orientation) => {
    const orientationMap = {
      'North': 'Север',
      'South': 'Юг',
      'East': 'Восток',
      'West': 'Запад',
      'North-East': 'Северо-Восток',
      'North-West': 'Северо-Запад',
      'South-East': 'Юго-Восток',
      'South-West': 'Юго-Запад'
    };
    return orientationMap[orientation] || orientation;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{apartment?.number ? `Квартира №${apartment.number}` : 'Загрузка...'}</h2>
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
            <p>Загрузка данных...</p>
          </div>
        ) : apartment ? (
          <div className={styles.content}>
            <div className={styles.infoGrid}>
              {/* Основная информация */}
              <div className={styles.section}>
                <h3>Основная информация</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Номер квартиры:</span>
                  <span className={styles.value}>{apartment.number}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Блок:</span>
                  <span className={styles.value}>{building ? `Блок ${building.block}` : '—'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Этаж:</span>
                  <span className={styles.value}>{apartment.floor}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Тип квартиры:</span>
                  <span className={styles.value}>{getApartmentTypeLabel(apartment.apartment_type)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Статус:</span>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(apartment.status) }}
                  >
                    {getStatusLabel(apartment.status)}
                  </span>
                </div>
              </div>

              {/* Характеристики */}
              <div className={styles.section}>
                <h3>Характеристики</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Площадь квартиры:</span>
                  <span className={styles.value}>{formatNumber(apartment.apartment_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Площадь кухни:</span>
                  <span className={styles.value}>{formatNumber(apartment.kitchen_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Высота потолков:</span>
                  <span className={styles.value}>{formatNumber(apartment.ceiling_height)} м</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Количество санузлов:</span>
                  <span className={styles.value}>{apartment.bathroom_count}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Тип отделки:</span>
                  <span className={styles.value}>{getFinishingTypeLabel(apartment.finishing_type)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Ориентация:</span>
                  <span className={styles.value}>{getOrientationLabel(apartment.orientation)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Наличие балкона:</span>
                  <span className={styles.value}>{apartment.has_balcony ? 'Да' : 'Нет'}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Угловая квартира:</span>
                  <span className={styles.value}>{apartment.isCorner ? 'Да' : 'Нет'}</span>
                </div>
              </div>

              {/* Цены */}
              <div className={styles.section}>
                <h3>Цены</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Цена за м²:</span>
                  <span className={styles.value}>{formatNumber(apartment.price_per_sqr)} ₸</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Общая цена:</span>
                  <span className={styles.value} style={{ fontWeight: 'bold', fontSize: '18px' }}>
                    {formatNumber(apartment.total_price)} ₸
                  </span>
                </div>
              </div>

              {/* Секция 360° Панорам */}
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>360° Панорамы</h3>
                  <button
                    className={styles.uploadBtn}
                    onClick={() => setIsUploadModalOpen(true)}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Загрузить панораму
                  </button>
                </div>
                <PanoramaViewer
                  panoramas={panoramas}
                  onDelete={handleDeletePanorama}
                />
              </div>
            </div>
          </div>
        ) : null}

        <UploadPanoramaModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={fetchPanoramas}
          apartmentId={apartmentId}
        />
      </div>
    </div>
  );
};

export default ViewApartmentModal;
