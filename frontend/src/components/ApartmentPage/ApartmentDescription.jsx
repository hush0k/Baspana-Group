import React from 'react';
import styles from '../../styles/ApartmentPage.module.scss';

const ApartmentDescription = ({ description, apartment }) => {
    // Если есть описание, показываем его
    if (description) {
        return (
            <div className={styles.description}>
                <h2>Описание</h2>
                <p>{description}</p>
            </div>
        );
    }

    // Если нет описания, генерируем краткое описание из данных квартиры
    const getTypeLabel = (type) => {
        const typeMap = {
            'Studio': 'Студия',
            'One Bedroom': 'Однокомнатная',
            'Two Bedroom': 'Двухкомнатная',
            'Three Bedroom': 'Трехкомнатная',
            'Penthouse': 'Пентхаус'
        };
        return typeMap[type] || type;
    };

    const autoDescription = `${getTypeLabel(apartment.apartment_type)} квартира площадью ${apartment.apartment_area} м² на ${apartment.floor} этаже.
    Площадь кухни ${apartment.kitchen_area} м², высота потолков ${apartment.ceiling_height} м.
    ${apartment.has_balcony ? 'Имеется балкон.' : ''}
    Отделка: ${apartment.finishing_type}.
    Количество санузлов: ${apartment.bathroom_count}.`;

    return (
        <div className={styles.description}>
            <h2>Описание</h2>
            <p>{autoDescription}</p>
        </div>
    );
};

export default ApartmentDescription;