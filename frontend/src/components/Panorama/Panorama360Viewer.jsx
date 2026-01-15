import React, { useEffect, useRef, useState } from 'react';
import { Viewer } from '@photo-sphere-viewer/core';
import '@photo-sphere-viewer/core/index.css';
import styles from '../../styles/Panorama360Viewer.module.scss';

const Panorama360Viewer = ({ panoramas, height = '600px' }) => {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!panoramas || panoramas.length === 0) return;

    // Очищаем предыдущий viewer
    if (viewerRef.current) {
      viewerRef.current.destroy();
      viewerRef.current = null;
    }

    try {
      const currentPanorama = panoramas[currentIndex];

      // Создаем новый viewer
      viewerRef.current = new Viewer({
        container: containerRef.current,
        panorama: currentPanorama.file_url,
        caption: currentPanorama.title || 'Панорама',
        loadingImg: null,
        navbar: [
          'zoom',
          'move',
          'download',
          'fullscreen',
        ],
        defaultZoomLvl: 50,
        mousewheel: true,
        mousemove: true,
        fisheye: false,
      });

      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки панорамы:', err);
      setError('Не удалось загрузить панораму');
    }

    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
      }
    };
  }, [panoramas, currentIndex]);

  if (!panoramas || panoramas.length === 0) {
    return (
      <div className={styles.noPanoramas}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p>Нет доступных 360° панорам</p>
        <span>Панорамы позволяют осмотреть объект со всех сторон</span>
      </div>
    );
  }

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : panoramas.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < panoramas.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className={styles.panoramaContainer}>
      {error && (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      )}

      <div
        ref={containerRef}
        className={styles.viewer}
        style={{ height }}
      />

      {panoramas.length > 1 && (
        <div className={styles.controls}>
          <button
            className={styles.navButton}
            onClick={handlePrevious}
            title="Предыдущая панорама"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.info}>
            <span className={styles.title}>
              {panoramas[currentIndex].title || `Панорама ${currentIndex + 1}`}
            </span>
            <span className={styles.counter}>
              {currentIndex + 1} / {panoramas.length}
            </span>
          </div>

          <button
            className={styles.navButton}
            onClick={handleNext}
            title="Следующая панорама"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}

      {panoramas.length > 1 && (
        <div className={styles.thumbnails}>
          {panoramas.map((panorama, index) => (
            <div
              key={panorama.id}
              className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
              title={panorama.title || `Панорама ${index + 1}`}
            >
              <img
                src={panorama.file_url}
                alt={panorama.title || `Панорама ${index + 1}`}
              />
              {panorama.title && <span>{panorama.title}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Panorama360Viewer;
