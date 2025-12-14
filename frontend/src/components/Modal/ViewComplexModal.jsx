import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewComplexModal = ({ isOpen, onClose, complexId }) => {
  const [complex, setComplex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && complexId) {
      fetchComplexData();
    }
  }, [isOpen, complexId]);

  const fetchComplexData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/complexes/by-id/${complexId}`);
      setComplex(response.data);
    } catch (err) {
      console.error('Ошибка загрузки данных комплекса:', err);
      setError('Не удалось загрузить данные комплекса');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (value) => {
    if (!value) return '—';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const getCityLabel = (city) => {
    const cityMap = {
      'Almaty': 'Алматы',
      'Astana': 'Астана',
      'Shymkent': 'Шымкент',
      'Karaganda': 'Караганда',
      'Aktobe': 'Актобе',
      'Taraz': 'Тараз',
      'Pavlodar': 'Павлодар',
      'Oskemen': 'Усть-Каменогорск',
      'Semey': 'Семей',
      'Kostanay': 'Костанай',
      'Kyzylorda': 'Кызылорда',
      'Atyrau': 'Атырау',
      'Oral': 'Уральск',
      'Petropavl': 'Петропавловск',
      'Turkistan': 'Туркестан'
    };
    return cityMap[city] || city;
  };

  const getMaterialLabel = (material) => {
    const materialMap = {
      'Brick': 'Кирпич',
      'Monolith': 'Монолит',
      'Panel': 'Панель',
      'Block': 'Блок',
      'Mixed': 'Смешанный'
    };
    return materialMap[material] || material;
  };

  const getClassLabel = (buildingClass) => {
    const classMap = {
      'Economic': 'Эконом',
      'Comfort': 'Комфорт',
      'Comfort+': 'Комфорт+',
      'Business': 'Бизнес',
      'Luxury': 'Люкс'
    };
    return classMap[buildingClass] || buildingClass;
  };

  const getStatusLabel = (status) => {
    const statusMap = {
      'Project': 'Проект',
      'Under Construction': 'Строится',
      'Completed': 'Сдан'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      'Project': '#f59e0b',
      'Under Construction': '#3b82f6',
      'Completed': '#10b981'
    };
    return colorMap[status] || '#6b7280';
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{complex?.name || 'Загрузка...'}</h2>
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
        ) : complex ? (
          <div className={styles.content}>
            {complex.main_image && (
              <div className={styles.imageSection}>
                <img src={complex.main_image} alt={complex.name} />
              </div>
            )}

            <div className={styles.infoGrid}>
              {/* Основная информация */}
              <div className={styles.section}>
                <h3>Основная информация</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Статус:</span>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(complex.building_status) }}
                  >
                    {getStatusLabel(complex.building_status)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Город:</span>
                  <span className={styles.value}>{getCityLabel(complex.city)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Адрес:</span>
                  <span className={styles.value}>{complex.address}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Описание:</span>
                  <span className={styles.value}>{complex.description}</span>
                </div>
              </div>

              {/* Характеристики */}
              <div className={styles.section}>
                <h3>Характеристики</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Материал:</span>
                  <span className={styles.value}>{getMaterialLabel(complex.material)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Класс:</span>
                  <span className={styles.value}>{getClassLabel(complex.building_class)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Количество блоков:</span>
                  <span className={styles.value}>{formatNumber(complex.block_counts)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Охрана:</span>
                  <span className={styles.value}>{complex.has_security ? 'Да' : 'Нет'}</span>
                </div>
              </div>

              {/* Площади */}
              <div className={styles.section}>
                <h3>Площади</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Детские площадки:</span>
                  <span className={styles.value}>{formatNumber(complex.playground_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Жилая площадь:</span>
                  <span className={styles.value}>{formatNumber(complex.apartment_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Коммерческая площадь:</span>
                  <span className={styles.value}>{formatNumber(complex.commercial_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Парковка:</span>
                  <span className={styles.value}>{formatNumber(complex.parking_area)} м²</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Земельный участок:</span>
                  <span className={styles.value}>{formatNumber(complex.landing_area)} м²</span>
                </div>
              </div>

              {/* Дополнительная информация */}
              <div className={styles.section}>
                <h3>Дополнительная информация</h3>
                {complex.min_area && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Минимальная площадь:</span>
                    <span className={styles.value}>{formatNumber(complex.min_area)} м²</span>
                  </div>
                )}
                {complex.min_price && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Минимальная цена:</span>
                    <span className={styles.value}>{formatNumber(complex.min_price)} ₸</span>
                  </div>
                )}
                {complex.construction_end && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Дата окончания строительства:</span>
                    <span className={styles.value}>
                      {new Date(complex.construction_end).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
                <div className={styles.infoRow}>
                  <span className={styles.label}>Координаты:</span>
                  <span className={styles.value}>
                    {complex.latitude}, {complex.longitude}
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

export default ViewComplexModal;