import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Panorama360Viewer from '../Panorama/Panorama360Viewer';
import panoramaService from '../../services/PanoramaService';
import styles from '../../styles/ApartmentPanorama.module.scss';

const ApartmentPanorama = ({ apartmentId }) => {
  const { t } = useTranslation();
  const [panoramas, setPanoramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (apartmentId) {
      loadPanoramas();
    }
  }, [apartmentId]);

  const loadPanoramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await panoramaService.getByApartment(apartmentId);
      setPanoramas(data);
    } catch (err) {
      console.error('Ошибка загрузки панорам:', err);
      setError('Не удалось загрузить панорамы');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.panoramaSection}>
        <div className={styles.header}>
          <h2>360° Виртуальный тур по квартире</h2>
          <p>Осмотрите квартиру изнутри</p>
        </div>
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Загрузка панорам...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className={styles.panoramaSection}>
        <div className={styles.header}>
          <h2>360° Виртуальный тур по квартире</h2>
          <p>Осмотрите квартиру изнутри</p>
        </div>
        <div className={styles.errorMessage}>
          <p>{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.panoramaSection}>
      <div className={styles.header}>
        <h2>360° Виртуальный тур по квартире</h2>
        <p>Осмотрите планировку и интерьер квартиры с помощью интерактивных панорам</p>
      </div>

      {panoramas && panoramas.length > 0 ? (
        <div className={styles.panoramaWrapper}>
          <div className={styles.instructions}>
            <div className={styles.instructionItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Перетаскивайте для вращения</span>
            </div>
            <div className={styles.instructionItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Колесико для масштабирования</span>
            </div>
            <div className={styles.instructionItem}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Полноэкранный режим</span>
            </div>
          </div>

          <Panorama360Viewer panoramas={panoramas} height="600px" />

          <div className={styles.panoramaInfo}>
            <div className={styles.infoCard}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <div>
                <h4>Интерактивный просмотр</h4>
                <p>Осмотрите каждую комнату и деталь интерьера</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 3v18M15 3v18M3 9h18M3 15h18" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <h4>Реальная планировка</h4>
                <p>Посмотрите, как выглядит квартира в действительности</p>
              </div>
            </div>
            <div className={styles.infoCard}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="2"/>
                <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <div>
                <h4>Виртуальный тур</h4>
                <p>Осмотрите квартиру не выходя из дома</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.noContent}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h3>360° панорамы скоро появятся</h3>
          <p>Мы работаем над созданием виртуального тура для этой квартиры</p>
        </div>
      )}
    </section>
  );
};

export default ApartmentPanorama;
