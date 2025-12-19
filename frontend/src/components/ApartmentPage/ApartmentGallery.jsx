import React, { useState } from 'react';
import styles from '../../styles/ApartmentPage.module.scss';

const ApartmentGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(images[0] || '/placeholder-apartment.jpg');

    // Если нет изображений, показываем заглушку
    if (!images || images.length === 0) {
        return (
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <img src="/placeholder-apartment.jpg" alt="Apartment" />
                </div>
                <div className={styles.noImages}>
                    <p>Изображения скоро появятся</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                <img src={mainImage} alt="Apartment" />
            </div>
            <div className={styles.thumbnails}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={`${styles.thumbnail} ${mainImage === img ? styles.active : ''}`}
                        onClick={() => setMainImage(img)}
                    >
                        <img src={img} alt={`View ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApartmentGallery;