import React from 'react';
import styles from '../../styles/PromotionPage.module.scss';

const PromotionFilters = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { id: 'all', label: 'Все' },
        { id: 'apartments', label: 'Квартиры' },
        { id: 'parking', label: 'Паркинг' },
        { id: 'mortgage', label: 'Ипотека' }
    ];

    return (
        <div className={styles.filters}>
            {filters.map(filter => (
                <button
                    key={filter.id}
                    className={`${styles.filterButton} ${activeFilter === filter.id ? styles.active : ''}`}
                    onClick={() => onFilterChange(filter.id)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default PromotionFilters;