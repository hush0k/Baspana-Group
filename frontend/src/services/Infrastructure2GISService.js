import axios from 'axios';

const API_KEY = 'b4bef9b9-dad2-40a6-af72-5ad0f37227f4';
const BASE_URL = 'https://catalog.api.2gis.com/3.0/items';

// Mapping категорий инфраструктуры к поисковым запросам 2ГИС
const CATEGORY_QUERIES = {
    education: ['школа', 'детский сад', 'school', 'kindergarten'],
    shopping: ['супермаркет', 'магазин', 'торговый центр', 'supermarket', 'mall'],
    parks: ['парк', 'сквер', 'park', 'recreation'],
    health: ['больница', 'поликлиника', 'аптека', 'hospital', 'clinic', 'pharmacy']
};

// Иконки для категорий
const CATEGORY_ICONS = {
    education: '🎓',
    shopping: '🛒',
    parks: '🌳',
    health: '🏥'
};

// Названия категорий на русском
const CATEGORY_NAMES = {
    education: 'Образование',
    shopping: 'Покупки и развлечения',
    parks: 'Парки и отдых',
    health: 'Здоровье'
};

/**
 * Сервис для работы с 2ГИС API для поиска инфраструктуры
 */
class Infrastructure2GISService {
    /**
     * Поиск объектов в радиусе от точки
     * @param {number} lat - широта
     * @param {number} lon - долгота
     * @param {string} query - поисковый запрос
     * @param {number} radius - радиус поиска в метрах (по умолчанию 1000м)
     * @param {number} limit - максимальное количество результатов
     * @returns {Promise<Array>} массив найденных объектов
     */
    async searchNearby(lat, lon, query, radius = 1000, limit = 5) {
        try {
            const response = await axios.get(BASE_URL, {
                params: {
                    q: query,
                    point: `${lon},${lat}`, // 2GIS использует формат lon,lat
                    radius: radius,
                    limit: limit,
                    key: API_KEY,
                    fields: 'items.point,items.address,items.contact_groups'
                }
            });

            return response.data.result?.items || [];
        } catch (error) {
            console.error(`Error searching for ${query}:`, error);
            return [];
        }
    }

    /**
     * Получить всю инфраструктуру вокруг точки по категориям
     * @param {number} lat - широта
     * @param {number} lon - долгота
     * @param {number} radius - радиус поиска в метрах
     * @returns {Promise<Object>} объект с категориями и объектами
     */
    async getInfrastructureByCategories(lat, lon, radius = 1000) {
        const infrastructure = [];

        // Проходим по каждой категории
        for (const [categoryKey, queries] of Object.entries(CATEGORY_QUERIES)) {
            const categoryItems = [];

            // Выполняем поиск по каждому запросу в категории
            for (const query of queries) {
                const items = await this.searchNearby(lat, lon, query, radius, 3);

                // Добавляем найденные объекты
                items.forEach(item => {
                    // Проверяем, что объект еще не добавлен (избегаем дубликатов)
                    const alreadyExists = categoryItems.some(
                        existing => existing.id === item.id
                    );

                    if (!alreadyExists && item.name) {
                        categoryItems.push({
                            id: item.id,
                            name: item.name,
                            distance: this.calculateDistance(
                                lat,
                                lon,
                                item.point?.lat,
                                item.point?.lon
                            ),
                            address: item.address?.name || item.address_name || '',
                            point: item.point,
                            category: categoryKey
                        });
                    }
                });

                // Ограничиваем количество объектов на категорию
                if (categoryItems.length >= 5) break;
            }

            // Сортируем по расстоянию и берем топ-5
            categoryItems.sort((a, b) => a.distance - b.distance);
            const topItems = categoryItems.slice(0, 5);

            if (topItems.length > 0) {
                infrastructure.push({
                    icon: CATEGORY_ICONS[categoryKey],
                    category: CATEGORY_NAMES[categoryKey],
                    categoryKey: categoryKey,
                    items: topItems.map(item => ({
                        id: item.id,
                        name: item.name,
                        distance: this.formatDistance(item.distance),
                        address: item.address,
                        point: item.point
                    }))
                });
            }
        }

        return infrastructure;
    }

    /**
     * Вычислить расстояние между двумя точками (формула Haversine)
     * @param {number} lat1 - широта точки 1
     * @param {number} lon1 - долгота точки 1
     * @param {number} lat2 - широта точки 2
     * @param {number} lon2 - долгота точки 2
     * @returns {number} расстояние в метрах
     */
    calculateDistance(lat1, lon1, lat2, lon2) {
        if (!lat2 || !lon2) return 0;

        const R = 6371e3; // Радиус Земли в метрах
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // в метрах
    }

    /**
     * Форматировать расстояние для отображения
     * @param {number} meters - расстояние в метрах
     * @returns {string} отформатированное расстояние
     */
    formatDistance(meters) {
        if (meters < 100) {
            return `${Math.round(meters)} м`;
        } else if (meters < 1000) {
            return `${Math.round(meters / 100) * 100} м`;
        } else {
            return `${(meters / 1000).toFixed(1)} км`;
        }
    }

    /**
     * Получить все объекты для отображения на карте
     * @param {number} lat - широта
     * @param {number} lon - долгота
     * @param {number} radius - радиус поиска в метрах
     * @returns {Promise<Array>} массив всех объектов для маркеров
     */
    async getAllMarkersData(lat, lon, radius = 1000) {
        const infrastructure = await this.getInfrastructureByCategories(lat, lon, radius);
        const markers = [];

        infrastructure.forEach(category => {
            category.items.forEach(item => {
                if (item.point) {
                    markers.push({
                        id: item.id,
                        name: item.name,
                        category: category.category,
                        categoryKey: category.categoryKey,
                        icon: category.icon,
                        point: item.point,
                        address: item.address,
                        distance: item.distance
                    });
                }
            });
        });

        return markers;
    }
}

export default new Infrastructure2GISService();
