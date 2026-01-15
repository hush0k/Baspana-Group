import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexGallery = ({ images }) => {
    const { t } = useTranslation();
    const [selectedImage, setSelectedImage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    if (!images || images.length === 0) {
        return (
            <section className={styles.gallerySection}>
                <h2 className={styles.sectionTitle}>{t('complex.gallery')}</h2>
                <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>
                    {t('complex.noImages')}
                </p>
            </section>
        );
    }

    const handlePrevious = () => {
        setSelectedImage((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const handleNext = () => {
        setSelectedImage((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <section className={styles.gallerySection}>
            <h2 className={styles.sectionTitle}>{t('complex.gallery')}</h2>

            <div className={styles.mainImageContainer} onClick={() => setIsModalOpen(true)}>
                <img
                    src={images[selectedImage]?.img_url}
                    alt={`${t('complex.photo')} ${selectedImage + 1}`}
                    className={styles.mainGalleryImage}
                />
                <div className={styles.imageCounter}>
                    {selectedImage + 1} / {images.length}
                </div>

                {/* Кнопки навигации */}
                {images.length > 1 && (
                    <>
                        <button
                            className={`${styles.navButton} ${styles.navButtonPrev}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handlePrevious();
                            }}
                        >
                            ‹
                        </button>
                        <button
                            className={`${styles.navButton} ${styles.navButtonNext}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleNext();
                            }}
                        >
                            ›
                        </button>
                    </>
                )}
            </div>

            {/* Миниатюры всех изображений */}
            <div className={styles.thumbnailGrid}>
                {images.map((image, index) => (
                    <div
                        key={image.id || index}
                        className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                        onClick={() => setSelectedImage(index)}
                    >
                        <img src={image.img_url} alt={`${t('complex.thumbnail')} ${index + 1}`} />
                    </div>
                ))}
            </div>

            {/* Модальное окно для полноэкранного просмотра */}
            {isModalOpen && (
                <div className={styles.galleryModal} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button
                            className={styles.modalClose}
                            onClick={() => setIsModalOpen(false)}
                        >
                            ✕
                        </button>

                        <img
                            src={images[selectedImage]?.img_url}
                            alt={`${t('complex.photo')} ${selectedImage + 1}`}
                            className={styles.modalImage}
                        />

                        <div className={styles.modalCounter}>
                            {selectedImage + 1} / {images.length}
                        </div>

                        {images.length > 1 && (
                            <>
                                <button
                                    className={`${styles.modalNavButton} ${styles.modalNavButtonPrev}`}
                                    onClick={handlePrevious}
                                >
                                    ‹
                                </button>
                                <button
                                    className={`${styles.modalNavButton} ${styles.modalNavButtonNext}`}
                                    onClick={handleNext}
                                >
                                    ›
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default ComplexGallery;