import React, { useState } from 'react';
import styles from '../../styles/ComplexDetail.module.scss';

const ComplexGallery = ({ images }) => {
    const [selectedImage, setSelectedImage] = useState(0);

    if (!images || images.length === 0) {
        return null;
    }

    return (
        <section className={styles.gallerySection}>
            <div className={styles.mainImageContainer}>
                <img
                    src={images[selectedImage]?.img_url}
                    alt={`Фото ${selectedImage + 1}`}
                    className={styles.mainGalleryImage}
                />
            </div>

            <div className={styles.thumbnailGrid}>
                {images.slice(0, 3).map((image, index) => (
                    <div
                        key={image.id}
                        className={`${styles.thumbnail} ${selectedImage === index ? styles.thumbnailActive : ''}`}
                        onClick={() => setSelectedImage(index)}
                    >
                        <img src={image.img_url} alt={`Миниатюра ${index + 1}`} />
                    </div>
                ))}
                {images.length > 3 && (
                    <div className={styles.morePhotos}>
                        <span>Еще {images.length - 3} фото</span>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ComplexGallery;