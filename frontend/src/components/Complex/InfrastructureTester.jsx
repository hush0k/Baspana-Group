import React, { useState } from 'react';
import ComplexInfrastructure from './ComplexInfrastructure';

/**
 * Компонент для тестирования изменения координат
 * Этот компонент можно временно добавить на страницу для тестирования
 */
const InfrastructureTester = () => {
    // Тестовые локации
    const testLocations = [
        {
            name: 'Алматы - ЖК Нурсая',
            latitude: 43.238949,
            longitude: 76.889709
        },
        {
            name: 'Алматы - Мегацентр',
            latitude: 43.225969,
            longitude: 76.851522
        },
        {
            name: 'Астана - Khan Shatyr',
            latitude: 51.132588,
            longitude: 71.403840
        },
        {
            name: 'Астана - Байтерек',
            latitude: 51.128422,
            longitude: 71.430564
        }
    ];

    const [currentLocation, setCurrentLocation] = useState(testLocations[0]);
    const [customLat, setCustomLat] = useState('');
    const [customLon, setCustomLon] = useState('');

    const handleLocationChange = (location) => {
        console.log('Смена локации на:', location.name);
        setCurrentLocation(location);
    };

    const handleCustomLocation = () => {
        if (customLat && customLon) {
            const lat = parseFloat(customLat);
            const lon = parseFloat(customLon);

            if (!isNaN(lat) && !isNaN(lon)) {
                console.log('Установка пользовательских координат:', lat, lon);
                setCurrentLocation({
                    name: `Пользовательская (${lat}, ${lon})`,
                    latitude: lat,
                    longitude: lon
                });
            } else {
                alert('Введите корректные координаты');
            }
        }
    };

    const testerStyles = {
        testerContainer: {
            position: 'fixed',
            top: '80px',
            right: '20px',
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            maxWidth: '300px'
        },
        title: {
            fontSize: '16px',
            fontWeight: 'bold',
            marginBottom: '15px',
            color: '#3d2314'
        },
        button: {
            width: '100%',
            padding: '10px',
            marginBottom: '8px',
            border: 'none',
            borderRadius: '6px',
            background: '#3d2314',
            color: 'white',
            cursor: 'pointer',
            fontSize: '13px',
            transition: 'background 0.3s'
        },
        activeButton: {
            background: '#4a90e2'
        },
        divider: {
            height: '1px',
            background: '#e0e0e0',
            margin: '15px 0'
        },
        input: {
            width: '100%',
            padding: '8px',
            marginBottom: '8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            fontSize: '13px'
        },
        currentInfo: {
            fontSize: '12px',
            color: '#666',
            marginTop: '15px',
            padding: '10px',
            background: '#f5f5f5',
            borderRadius: '6px'
        }
    };

    return (
        <>
            <div style={testerStyles.testerContainer}>
                <div style={testerStyles.title}>Тестер координат</div>

                <div>
                    {testLocations.map((location, index) => (
                        <button
                            key={index}
                            style={{
                                ...testerStyles.button,
                                ...(currentLocation.name === location.name ? testerStyles.activeButton : {})
                            }}
                            onClick={() => handleLocationChange(location)}
                        >
                            {location.name}
                        </button>
                    ))}
                </div>

                <div style={testerStyles.divider}></div>

                <div>
                    <input
                        style={testerStyles.input}
                        type="text"
                        placeholder="Широта (latitude)"
                        value={customLat}
                        onChange={(e) => setCustomLat(e.target.value)}
                    />
                    <input
                        style={testerStyles.input}
                        type="text"
                        placeholder="Долгота (longitude)"
                        value={customLon}
                        onChange={(e) => setCustomLon(e.target.value)}
                    />
                    <button
                        style={testerStyles.button}
                        onClick={handleCustomLocation}
                    >
                        Применить координаты
                    </button>
                </div>

                <div style={testerStyles.currentInfo}>
                    <strong>Текущая локация:</strong><br />
                    {currentLocation.name}<br />
                    Lat: {currentLocation.latitude}<br />
                    Lon: {currentLocation.longitude}
                </div>
            </div>

            <ComplexInfrastructure
                latitude={currentLocation.latitude}
                longitude={currentLocation.longitude}
                complexName={currentLocation.name}
            />
        </>
    );
};

export default InfrastructureTester;
