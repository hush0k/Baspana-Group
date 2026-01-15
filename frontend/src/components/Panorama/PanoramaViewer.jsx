import React, { useState } from 'react';
import styles from '../../styles/PanoramaViewer.module.scss';

const PanoramaViewer = ({ panoramas, onDelete }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!panoramas || panoramas.length === 0) {
    return (
      <div className={styles.noPanoramas}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
          <rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/>
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
        </svg>
        <p>Нет доступных панорам</p>
      </div>
    );
  }

  const selectedPanorama = panoramas[selectedIndex];

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDelete = () => {
    if (window.confirm('Удалить эту панораму?')) {
      onDelete(selectedPanorama.id);
    }
  };

  return (
    <div className={`${styles.panoramaViewer} ${isFullscreen ? styles.fullscreen : ''}`}>
      <div className={styles.viewerContainer}>
        {selectedPanorama.type === '360_image' ? (
          <div className={styles.panoramaImage}>
            <img
              src={selectedPanorama.file_url}
              alt={selectedPanorama.title || 'Панорама'}
            />
          </div>
        ) : selectedPanorama.type === '360_video' ? (
          <div className={styles.panoramaVideo}>
            <video controls src={selectedPanorama.file_url} />
          </div>
        ) : (
          <div className={styles.panoramaEmbed}>
            <iframe
              src={selectedPanorama.file_url}
              title={selectedPanorama.title || 'Панорама'}
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        <div className={styles.controls}>
          <div className={styles.title}>
            {selectedPanorama.title || 'Панорама'}
          </div>

          <div className={styles.buttons}>
            {onDelete && (
              <button
                className={styles.deleteBtn}
                onClick={handleDelete}
                title="Удалить панораму"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18M8 6V4h8v2m-9 0v12a2 2 0 002 2h6a2 2 0 002-2V6H7z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            )}

            <button
              className={styles.fullscreenBtn}
              onClick={handleFullscreen}
              title={isFullscreen ? 'Выйти из полноэкранного режима' : 'Полноэкранный режим'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                {isFullscreen ? (
                  <>
                    <path d="M8 3v3a2 2 0 01-2 2H3M21 8h-3a2 2 0 01-2-2V3M3 16h3a2 2 0 012 2v3M16 21v-3a2 2 0 012-2h3" stroke="currentColor" strokeWidth="2"/>
                  </>
                ) : (
                  <>
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" stroke="currentColor" strokeWidth="2"/>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {panoramas.length > 1 && (
        <div className={styles.thumbnails}>
          {panoramas.map((panorama, index) => (
            <div
              key={panorama.id}
              className={`${styles.thumbnail} ${index === selectedIndex ? styles.active : ''}`}
              onClick={() => setSelectedIndex(index)}
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

export default PanoramaViewer;
