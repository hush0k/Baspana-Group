import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from '../../styles/BlockPage.module.scss';

const ApartmentSelector = ({ apartments = [], commercialUnits = [], buildingData = null }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('apartments');
    const [selectedFloor, setSelectedFloor] = useState('any');
    const [selectedType, setSelectedType] = useState('all');

    // Получаем уникальные этажи из квартир
    const floors = useMemo(() => {
        const source = activeTab === 'apartments' ? apartments : commercialUnits;
        const uniqueFloors = [...new Set(source.map(item => item.floor))].sort((a, b) => a - b);
        return uniqueFloors;
    }, [apartments, commercialUnits, activeTab]);

    // Получаем уникальные типы квартир
    const apartmentTypes = useMemo(() => {
        const types = [...new Set(apartments.map(apt => apt.apartment_type))];
        return types;
    }, [apartments]);

    // Получаем уникальные типы коммерческих помещений
    const commercialTypes = useMemo(() => {
        const types = [...new Set(commercialUnits.map(unit => unit.commercial_type))];
        return types;
    }, [commercialUnits]);

    // Фильтруем квартиры
    const filteredApartments = useMemo(() => {
        return apartments.filter(apt => {
            const matchesFloor = selectedFloor === 'any' || apt.floor === parseInt(selectedFloor);
            const matchesType = selectedType === 'all' || apt.apartment_type === selectedType;
            return matchesFloor && matchesType;
        });
    }, [apartments, selectedFloor, selectedType]);

    // Фильтруем коммерческие помещения
    const filteredCommercialUnits = useMemo(() => {
        return commercialUnits.filter(unit => {
            const matchesFloor = selectedFloor === 'any' || unit.floor === parseInt(selectedFloor);
            const matchesType = selectedType === 'all' || unit.commercial_type === selectedType;
            return matchesFloor && matchesType;
        });
    }, [commercialUnits, selectedFloor, selectedType]);

    const getApartmentStatus = (apt) => {
        if (apt?.status === 'Free') return styles.available;
        if (apt?.status === 'Sold') return styles.sold;
        return styles.reserved; // Booked
    };

    const getTypeLabel = (type) => {
        return t(`apartment.types.${type}`, type);
    };

    const getCommercialTypeLabel = (type) => {
        return t(`common.commercialTypes.${type}`, type);
    };

    const handleApartmentClick = (apartmentId) => {
        navigate(`/apartments/${apartmentId}`);
    };

    const handleCommercialUnitClick = (unitId) => {
        navigate(`/commercial-units/${unitId}`);
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedFloor('any');
        setSelectedType('all');
    };

    const currentItems = activeTab === 'apartments' ? filteredApartments : filteredCommercialUnits;
    const currentTypes = activeTab === 'apartments' ? apartmentTypes : commercialTypes;
    const hasApartments = apartments && apartments.length > 0;
    const hasCommercialUnits = commercialUnits && commercialUnits.length > 0;

    if (!hasApartments && !hasCommercialUnits) {
        return (
            <div className={styles.apartmentSelector}>
                <h2>{t('blockPage.selectApartment')}</h2>
                <div className={styles.noData}>
                    <p>{t('blockPage.noDataAvailable')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.apartmentSelector}>
            <h2>{t('blockPage.selectApartment')}</h2>

            {/* Tabs */}
            <div className={styles.tabs}>
                {hasApartments && (
                    <button
                        className={`${styles.tab} ${activeTab === 'apartments' ? styles.active : ''}`}
                        onClick={() => handleTabChange('apartments')}
                    >
                        {t('blockPage.apartments')} ({apartments.length})
                    </button>
                )}
                {hasCommercialUnits && (
                    <button
                        className={`${styles.tab} ${activeTab === 'commercial' ? styles.active : ''}`}
                        onClick={() => handleTabChange('commercial')}
                    >
                        {t('blockPage.commercialUnits')} ({commercialUnits.length})
                    </button>
                )}
            </div>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>{t('blockPage.floor')}</label>
                    <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                        <option value="any">{t('common.any')}</option>
                        {floors.map(floor => <option key={floor} value={floor}>{floor}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label>{activeTab === 'apartments' ? t('blockPage.type') : t('blockPage.commercialType')}</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option value="all">{t('common.all')}</option>
                        {currentTypes.map(type => (
                            <option key={type} value={type}>
                                {activeTab === 'apartments' ? getTypeLabel(type) : getCommercialTypeLabel(type)}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.apartmentGrid}>
                {activeTab === 'apartments' ? (
                    filteredApartments.map((apt) => (
                        <div
                            key={apt.id}
                            className={`${styles.apartment} ${getApartmentStatus(apt)}`}
                            title={`${t('apartment.title')} ${apt.number}, ${apt.apartment_area} ${t('common.sqm')}, ${getTypeLabel(apt.apartment_type)}`}
                            onClick={() => handleApartmentClick(apt.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {apt.number}
                        </div>
                    ))
                ) : (
                    filteredCommercialUnits.map((unit) => (
                        <div
                            key={unit.id}
                            className={`${styles.apartment} ${getApartmentStatus(unit)}`}
                            title={`${t('blockPage.commercialUnit')} ${unit.unit_number}, ${unit.unit_area} ${t('common.sqm')}, ${getCommercialTypeLabel(unit.commercial_type)}`}
                            onClick={() => handleCommercialUnitClick(unit.id)}
                            style={{ cursor: 'pointer' }}
                        >
                            {unit.unit_number}
                        </div>
                    ))
                )}
            </div>

            <div className={styles.legend}>
                <span className={styles.legendItem}>
                    <span className={styles.available}></span> {t('blockPage.available')}
                </span>
                <span className={styles.legendItem}>
                    <span className={styles.reserved}></span> {t('blockPage.reserved')}
                </span>
                <span className={styles.legendItem}>
                    <span className={styles.sold}></span> {t('blockPage.sold')}
                </span>
            </div>
        </div>
    );
};

export default ApartmentSelector;