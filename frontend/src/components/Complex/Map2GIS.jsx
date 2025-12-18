import React, { useEffect, useRef } from 'react';
import styles from '../../styles/Map2GIS.module.scss';

/**
 * Компонент для отображения карты 2ГИС с маркерами инфраструктуры
 */
const Map2GIS = ({ latitude, longitude, markers = [], complexName }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef([]);
    const complexMarkerRef = useRef(null);
    const [mapInitialized, setMapInitialized] = React.useState(false);

    // Инициализация карты один раз
    useEffect(() => {
        // Загружаем скрипт 2ГИС Maps API
        const loadMapScript = () => {
            return new Promise((resolve, reject) => {
                // Проверяем, не загружен ли уже скрипт
                if (window.DG) {
                    resolve();
                    return;
                }

                const script = document.createElement('script');
                script.src = 'https://maps.api.2gis.ru/2.0/loader.js?pkg=full';
                script.async = true;
                script.onload = () => {
                    // Инициализируем 2ГИС после загрузки скрипта
                    window.DG.then(() => resolve());
                };
                script.onerror = reject;
                document.head.appendChild(script);
            });
        };

        const initializeMap = async () => {
            try {
                await loadMapScript();

                if (!mapContainerRef.current || !window.DG || mapInstanceRef.current) return;

                // Создаем карту
                const map = window.DG.map(mapContainerRef.current, {
                    center: [latitude, longitude],
                    zoom: 15,
                    fullscreenControl: true,
                    zoomControl: true
                });

                mapInstanceRef.current = map;
                setMapInitialized(true);
            } catch (error) {
                console.error('Error initializing 2GIS map:', error);
            }
        };

        initializeMap();

        // Cleanup при размонтировании компонента
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, []);

    // Обновляем центр карты и маркер ЖК при изменении координат
    useEffect(() => {
        if (!mapInitialized || !mapInstanceRef.current || !window.DG) return;

        // Обновляем центр карты
        mapInstanceRef.current.setView([latitude, longitude], 15);

        // Удаляем старый маркер ЖК
        if (complexMarkerRef.current) {
            mapInstanceRef.current.removeLayer(complexMarkerRef.current);
        }

        // Добавляем новый маркер для ЖК
        const complexIcon = window.DG.icon({
            iconUrl: 'https://img.icons8.com/color/48/000000/building.png',
            iconSize: [40, 40],
            iconAnchor: [20, 40]
        });

        const complexMarker = window.DG.marker([latitude, longitude], { icon: complexIcon })
            .addTo(mapInstanceRef.current)
            .bindPopup(`<strong>${complexName}</strong><br>Жилой комплекс`);

        complexMarkerRef.current = complexMarker;
    }, [latitude, longitude, complexName, mapInitialized]);

    // Обновляем маркеры инфраструктуры при изменении данных
    useEffect(() => {
        if (mapInitialized && mapInstanceRef.current && window.DG) {
            addInfrastructureMarkers(mapInstanceRef.current, markers);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [markers, mapInitialized]);

    /**
     * Добавить маркеры инфраструктуры на карту
     */
    const addInfrastructureMarkers = (map, markers) => {
        // Удаляем старые маркеры
        markersRef.current.forEach(marker => {
            map.removeLayer(marker);
        });
        markersRef.current = [];

        // Цвета маркеров для разных категорий
        const categoryColors = {
            education: '#4A90E2',
            shopping: '#F5A623',
            parks: '#7ED321',
            health: '#D0021B'
        };

        // Добавляем новые маркеры
        markers.forEach(item => {
            if (item.point && item.point.lat && item.point.lon) {
                const color = categoryColors[item.categoryKey] || '#666666';

                // Создаем кастомную иконку с эмодзи
                const iconHtml = `
                    <div style="
                        background-color: ${color};
                        border-radius: 50%;
                        width: 32px;
                        height: 32px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 16px;
                        border: 2px solid white;
                        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    ">
                        ${item.icon}
                    </div>
                `;

                const divIcon = window.DG.divIcon({
                    html: iconHtml,
                    iconSize: [32, 32],
                    iconAnchor: [16, 16],
                    className: 'custom-div-icon'
                });

                const marker = window.DG.marker([item.point.lat, item.point.lon], {
                    icon: divIcon
                })
                    .addTo(map)
                    .bindPopup(`
                        <div style="min-width: 200px;">
                            <strong>${item.icon} ${item.name}</strong><br>
                            <span style="color: #666; font-size: 12px;">${item.category}</span><br>
                            ${item.address ? `<span style="font-size: 12px;">${item.address}</span><br>` : ''}
                            <span style="color: #4A90E2; font-weight: bold;">${item.distance}</span>
                        </div>
                    `);

                markersRef.current.push(marker);
            }
        });
    };

    return (
        <div className={styles.mapContainer}>
            <div
                ref={mapContainerRef}
                className={styles.map}
                style={{ width: '100%', height: '500px' }}
            />
            <div className={styles.mapLegend}>
                <div className={styles.legendItem}>
                    <span className={styles.legendIcon} style={{ backgroundColor: '#4A90E2' }}>🎓</span>
                    <span>Образование</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendIcon} style={{ backgroundColor: '#F5A623' }}>🛒</span>
                    <span>Покупки</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendIcon} style={{ backgroundColor: '#7ED321' }}>🌳</span>
                    <span>Парки</span>
                </div>
                <div className={styles.legendItem}>
                    <span className={styles.legendIcon} style={{ backgroundColor: '#D0021B' }}>🏥</span>
                    <span>Здоровье</span>
                </div>
            </div>
        </div>
    );
};

export default Map2GIS;
