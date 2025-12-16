import React, { useState } from 'react';
import styles from '../../styles/BlockPage.module.scss';

const BlockGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(images[0] || '/placeholder.jpg');

    if (!images || images.length === 0) {
        return (
            <div className={styles.gallery}>
                <div className={styles.mainImage}>
                    <div className={styles.noImage}>
                        <p>Изображения недоступны</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.gallery}>
            <div className={styles.mainImage}>
                <img src={mainImage} alt="Block" />
            </div>
            <div className={styles.thumbnails}>
                {images.map((img, index) => (
                    <div
                        key={index}
                        className={styles.thumbnail}
                        onClick={() => setMainImage(img)}
                    >
                        <img src={img} alt={`View ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockGallery;