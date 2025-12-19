import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import imageService from '../../services/ImageService';
import apartmentService from '../../services/ApartmentService';
import styles from '../../styles/ViewComplexModal.module.scss';

const ViewBuildingModal = ({ isOpen, onClose, buildingId }) => {
  const [building, setBuilding] = useState(null);
  const [images, setImages] = useState([]);
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && buildingId) {
      fetchBuildingData();
      fetchBuildingImages();
      fetchBuildingApartments();
    }
  }, [isOpen, buildingId]);

  const fetchBuildingData = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/buildings/${buildingId}`);
      setBuilding(response.data);
    } catch (err) {
      console.error('Ошибка загрузки данных блока:', err);
      setError('Не удалось загрузить данные блока');
    } finally {
      setLoading(false);
    }
  };

  const fetchBuildingImages = async () => {
    try {
      const imagesData = await imageService.getImages(buildingId, 'Building');
      setImages(imagesData || []);
    } catch (err) {
      console.error('Ошибка загрузки изображений:', err);
    }
  };

  const fetchBuildingApartments = async () => {
    try {
      const data = await apartmentService.getApartments({
        building_id: buildingId,
        limit: 1000
      });
      setApartments(data.results || []);
    } catch (err) {
      console.error('Ошибка загрузки квартир:', err);
    }
  };

  const formatNumber = (value) => {
    if (!value) return '—';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
          <h2>{building?.block ? `Блок №${building.block}` : 'Загрузка...'}</h2>
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
        ) : building ? (
          <div className={styles.content}>
            {/* Изображения блока */}
            {images.length > 0 && (
              <div className={styles.imageSection}>
                <div className={styles.imageGrid}>
                  {images.map((image) => (
                    <img key={image.id} src={image.img_url} alt={`Блок ${building.block}`} />
                  ))}
                </div>
              </div>
            )}

            <div className={styles.infoGrid}>
              {/* Основная информация */}
              <div className={styles.section}>
                <h3>Основная информация</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Номер блока:</span>
                  <span className={styles.value}>{building.block}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Статус:</span>
                  <span
                    className={styles.statusBadge}
                    style={{ backgroundColor: getStatusColor(building.status) }}
                  >
                    {getStatusLabel(building.status)}
                  </span>
                </div>
                {building.description && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Описание:</span>
                    <span className={styles.value}>{building.description}</span>
                  </div>
                )}
                {building.short_description && (
                  <div className={styles.infoRow}>
                    <span className={styles.label}>Краткое описание:</span>
                    <span className={styles.value}>{building.short_description}</span>
                  </div>
                )}
              </div>

              {/* Характеристики */}
              <div className={styles.section}>
                <h3>Характеристики</h3>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Количество этажей:</span>
                  <span className={styles.value}>{formatNumber(building.floor_count)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Квартир:</span>
                  <span className={styles.value}>{formatNumber(building.apartments_count)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Коммерческих помещений:</span>
                  <span className={styles.value}>{formatNumber(building.commercials_count)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Парковочных мест:</span>
                  <span className={styles.value}>{formatNumber(building.parking_count)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Лифтов:</span>
                  <span className={styles.value}>{formatNumber(building.elevators_count)}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.label}>Общая площадь:</span>
                  <span className={styles.value}>{formatNumber(building.gross_area)} м²</span>
                </div>
              </div>

              {/* Даты */}
              {(building.construction_start || building.construction_end) && (
                <div className={styles.section}>
                  <h3>Сроки строительства</h3>
                  {building.construction_start && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Начало строительства:</span>
                      <span className={styles.value}>
                        {new Date(building.construction_start).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}
                  {building.construction_end && (
                    <div className={styles.infoRow}>
                      <span className={styles.label}>Окончание строительства:</span>
                      <span className={styles.value}>
                        {new Date(building.construction_end).toLocaleDateString('ru-RU')}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Квартиры в блоке */}
              <div className={styles.section}>
                <h3>Квартиры ({apartments.length})</h3>
                {apartments.length > 0 ? (
                  <div className={styles.apartmentsList}>
                    {apartments.map((apartment) => (
                      <div key={apartment.id} className={styles.apartmentItem}>
                        <div className={styles.apartmentNumber}>№ {apartment.number}</div>
                        <div className={styles.apartmentDetails}>
                          <span>Этаж: {apartment.floor}</span>
                          <span>{apartment.apartment_area} м²</span>
                          <span className={styles.apartmentStatus} style={{
                            backgroundColor: apartment.status === 'Free' ? '#10b981' :
                                           apartment.status === 'Booked' ? '#f59e0b' : '#6b7280'
                          }}>
                            {apartment.status === 'Free' ? 'Свободно' :
                             apartment.status === 'Booked' ? 'Забронировано' : 'Продано'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={styles.noData}>Квартиры не найдены</p>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ViewBuildingModal;
