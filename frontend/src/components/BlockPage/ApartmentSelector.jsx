import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../../styles/BlockPage.module.scss';

const ApartmentSelector = ({ apartments = [], buildingData = null }) => {
    const navigate = useNavigate();
    const [selectedFloor, setSelectedFloor] = useState('Любой');
    const [selectedType, setSelectedType] = useState('Все');

    // Получаем уникальные этажи из квартир
    const floors = useMemo(() => {
        const uniqueFloors = [...new Set(apartments.map(apt => apt.floor))].sort((a, b) => a - b);
        return uniqueFloors;
    }, [apartments]);

    // Получаем уникальные типы квартир
    const apartmentTypes = useMemo(() => {
        const types = [...new Set(apartments.map(apt => apt.apartment_type))];
        return types;
    }, [apartments]);

    // Фильтруем квартиры
    const filteredApartments = useMemo(() => {
        return apartments.filter(apt => {
            const matchesFloor = selectedFloor === 'Любой' || apt.floor === parseInt(selectedFloor);
            const matchesType = selectedType === 'Все' || apt.apartment_type === selectedType;
            return matchesFloor && matchesType;
        });
    }, [apartments, selectedFloor, selectedType]);

    const getApartmentStatus = (apt) => {
        if (apt?.status === 'Free') return styles.available;
        if (apt?.status === 'Sold') return styles.sold;
        return styles.reserved; // Booked
    };

    const getTypeLabel = (type) => {
        const typeMap = {
            'Studio': 'Студия',
            'One Bedroom': '1-комн',
            'Two Bedroom': '2-комн',
            'Three Bedroom': '3-комн',
            'Penthouse': 'Пентхаус'
        };
        return typeMap[type] || type;
    };

    const handleApartmentClick = (apartmentId) => {
        navigate(`/apartments/${apartmentId}`);
    };

    if (!apartments || apartments.length === 0) {
        return (
            <div className={styles.apartmentSelector}>
                <h2>Выбор квартиры</h2>
                <div className={styles.noData}>
                    <p>Информация о квартирах недоступна</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.apartmentSelector}>
            <h2>Выбор квартиры</h2>

            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <label>Этаж</label>
                    <select value={selectedFloor} onChange={(e) => setSelectedFloor(e.target.value)}>
                        <option>Любой</option>
                        {floors.map(floor => <option key={floor} value={floor}>{floor}</option>)}
                    </select>
                </div>
                <div className={styles.filterGroup}>
                    <label>Тип квартиры</label>
                    <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                        <option>Все</option>
                        {apartmentTypes.map(type => (
                            <option key={type} value={type}>{getTypeLabel(type)}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className={styles.apartmentGrid}>
                {filteredApartments.map((apt) => (
                    <div
                        key={apt.id}
                        className={`${styles.apartment} ${getApartmentStatus(apt)}`}
                        title={`Квартира ${apt.number}, ${apt.apartment_area} м², ${getTypeLabel(apt.apartment_type)}`}
                        onClick={() => handleApartmentClick(apt.id)}
                        style={{ cursor: 'pointer' }}
                    >
                        {apt.number}
                    </div>
                ))}
            </div>

            <div className={styles.legend}>
                <span className={styles.legendItem}>
                    <span className={styles.available}></span> Свободна
                </span>
                <span className={styles.legendItem}>
                    <span className={styles.reserved}></span> Забронирована
                </span>
                <span className={styles.legendItem}>
                    <span className={styles.sold}></span> Продана
                </span>
            </div>
        </div>
    );
};

export default ApartmentSelector;