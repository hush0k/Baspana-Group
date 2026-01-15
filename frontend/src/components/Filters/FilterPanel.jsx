import React, { useState } from 'react';
import styles from '../../styles/FilterPanel.module.scss';
import {useTranslation} from "react-i18next";


const FilterPanel = ({ filters, onFilterChange, onReset }) => {
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [isSortOpen, setIsSortOpen] = useState(false);
    const { t } = useTranslation();

    const cities = ['Almaty', 'Astana', 'Shymkent', 'Karaganda', 'Aktobe', 'Taraz'];
    const buildingClasses = ['Economic', 'Comfort', 'Comfort+', 'Business', 'Luxury'];
    const buildingStatuses = ['Project', 'Under Construction', 'Completed'];
    const materials = ['Brick', 'Monolith', 'Panel', 'Block', 'Mixed'];
    const sortOptions = [
        { value: 'name', label: 'По названию' },
        { value: 'min_price', label: 'По цене' },
        { value: 'min_area', label: 'По площади' },
        { value: 'construction_end', label: 'По дате сдачи' }
    ];

    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        if (filters.city) count++;
        if (filters.building_class) count++;
        if (filters.building_status) count++;
        if (filters.material) count++;
        if (filters.has_security !== undefined) count++;
        if (filters.search) count++;
        return count;
    };

    return (
        <div className={styles.filterPanel}>
            <div className={styles.filterButtons}>
                <button
                    className={`${styles.toggleBtn} ${isFiltersOpen ? styles.active : ''}`}
                    onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M2.5 5H17.5M5 10H15M7.5 15H12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {t('filter.filter')}
                    {getActiveFiltersCount() > 0 && (
                        <span className={styles.badge}>{getActiveFiltersCount()}</span>
                    )}
                </button>

                <button
                    className={`${styles.toggleBtn} ${isSortOpen ? styles.active : ''}`}
                    onClick={() => setIsSortOpen(!isSortOpen)}
                >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M6 4V16M6 16L3 13M6 16L9 13M14 4L11 7M14 4L17 7M14 4V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {t('filter.sort')}
                </button>

                {getActiveFiltersCount() > 0 && (
                    <button className={styles.resetBtn} onClick={onReset}>
                        {t('filter.drop')}
                    </button>
                )}
            </div>

            {/* Панель фильтров */}
            {isFiltersOpen && (
                <div className={styles.filterDropdown}>
                    <div className={styles.filterGrid}>
                        {/* Поиск */}
                        <div className={styles.filterGroup}>
                            <label>Поиск</label>
                            <input
                                type="text"
                                placeholder={t('filter.name')}
                                value={filters.search || ''}
                                onChange={(e) => handleChange('search', e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        {/* Город */}
                        <div className={styles.filterGroup}>
                            <label>{t('filter.city')}</label>
                            <select
                                value={filters.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={styles.select}
                            >
                                <option value="">{t('filter.allCity')}</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* Класс */}
                        <div className={styles.filterGroup}>
                            <label>{t('filter.class')}</label>
                            <select
                                value={filters.building_class || ''}
                                onChange={(e) => handleChange('building_class', e.target.value)}
                                className={styles.select}
                            >
                                <option value="">{t('filter.allClass')}</option>
                                {buildingClasses.map(cls => (
                                    <option key={cls} value={cls}>{cls}</option>
                                ))}
                            </select>
                        </div>

                        {/* Статус */}
                        <div className={styles.filterGroup}>
                            <label>{t('filter.status')}</label>
                            <select
                                value={filters.building_status || ''}
                                onChange={(e) => handleChange('building_status', e.target.value)}
                                className={styles.select}
                            >
                                <option value="">{t('filter.allStat')}</option>
                                {buildingStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {/* Материал */}
                        <div className={styles.filterGroup}>
                            <label>{t('filter.material')}</label>
                            <select
                                value={filters.material || ''}
                                onChange={(e) => handleChange('material', e.target.value)}
                                className={styles.select}
                            >
                                <option value="">{t('filter.allMat')}</option>
                                {materials.map(material => (
                                    <option key={material} value={material}>{material}</option>
                                ))}
                            </select>
                        </div>

                        {/* Охрана */}
                        <div className={styles.filterGroup}>
                            <label>{t('filter.security')}</label>
                            <select
                                value={filters.has_security === undefined ? '' : filters.has_security}
                                onChange={(e) => handleChange('has_security', e.target.value === '' ? undefined : e.target.value === 'true')}
                                className={styles.select}
                            >
                                <option value="">{t('filter.noMatters')}</option>
                                <option value="true">Есть</option>
                                <option value="false">Нет</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {/* Панель сортировки */}
            {isSortOpen && (
                <div className={styles.sortDropdown}>
                    <div className={styles.sortGrid}>
                        <div className={styles.filterGroup}>
                            <label>Сортировать по</label>
                            <select
                                value={filters.sort_by || 'name'}
                                onChange={(e) => handleChange('sort_by', e.target.value)}
                                className={styles.select}
                            >
                                {sortOptions.map(option => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.filterGroup}>
                            <label>{t('filter.order')}</label>
                            <select
                                value={filters.order || 'asc'}
                                onChange={(e) => handleChange('order', e.target.value)}
                                className={styles.select}
                            >
                                <option value="asc">{t('filter.asc')}</option>
                                <option value="desc">{t('filter.desc')}</option>
                            </select>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterPanel;