import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Panorama360Viewer from '../Panorama/Panorama360Viewer';
import panoramaService from '../../services/PanoramaService';
import styles from '../../styles/ComplexPanorama.module.scss';

const ComplexPanorama = ({ complexId }) => {
  const { t } = useTranslation();
  const [panoramas, setPanoramas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (complexId) {
      loadPanoramas();
    }
  }, [complexId]);

  const loadPanoramas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await panoramaService.getByComplex(complexId);
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
          <h2>360° Виртуальный тур</h2>
          <p>Осмотрите жилой комплекс изнутри</p>
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
          <h2>360° Виртуальный тур</h2>
          <p>Осмотрите жилой комплекс изнутри</p>
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
        <h2>360° Виртуальный тур</h2>
        <p>Осмотрите жилой комплекс изнутри с помощью интерактивных панорам</p>
      </div>

      {panoramas && panoramas.length > 0 ? (
        <div className={styles.panoramaWrapper}>
          <div className={styles.instructions}>
            <div className={styles.instructionItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" strokeWidth="2"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Перетаскивайте мышью для вращения</span>
            </div>
            <div className={styles.instructionItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Используйте колесо мыши для масштабирования</span>
            </div>
            <div className={styles.instructionItem}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 3H5a2 2 0 00-2 2v3m18 0V5a2 2 0 00-2-2h-3m0 18h3a2 2 0 002-2v-3M3 16v3a2 2 0 002 2h3" stroke="currentColor" strokeWidth="2"/>
              </svg>
              <span>Полноэкранный режим для лучшего погружения</span>
            </div>
          </div>

          <Panorama360Viewer panoramas={panoramas} height="700px" />
        </div>
      ) : (
        <div className={styles.noContent}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <h3>Скоро здесь появятся 360° панорамы</h3>
          <p>Мы работаем над созданием виртуального тура по этому комплексу</p>
        </div>
      )}
    </section>
  );
};

export default ComplexPanorama;
