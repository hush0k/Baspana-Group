import React, { useState, useEffect } from 'react';
import styles from '../../styles/BlockPage.module.scss';

const BlockGallery = ({ images = [] }) => {
    const [mainImage, setMainImage] = useState(null);

    useEffect(() => {
        if (images && images.length > 0) {
            setMainImage(images[0].img_url);
        }
    }, [images]);

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
                        key={img.id || index}
                        className={`${styles.thumbnail} ${mainImage === img.img_url ? styles.active : ''}`}
                        onClick={() => setMainImage(img.img_url)}
                    >
                        <img src={img.img_url} alt={`View ${index + 1}`} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockGallery;