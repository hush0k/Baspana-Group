import api from './api';

const buildingService = {
  // Получить все блоки
  getBuildings: async (params = {}) => {
    try {
      const response = await api.get('/buildings', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении блоков:', error);
      throw error;
    }
  },

  // Получить блок по ID
  getBuildingById: async (id) => {
    try {
      const response = await api.get(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении блока ${id}:`, error);
      throw error;
    }
  },

  // Создать блок
  createBuilding: async (buildingData) => {
    try {
      const response = await api.post('/buildings', buildingData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании блока:', error);
      throw error;
    }
  },

  // Обновить блок
  updateBuilding: async (id, buildingData) => {
    try {
      const response = await api.put(`/buildings/${id}`, buildingData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении блока ${id}:`, error);
      throw error;
    }
  },

  // Удалить блок
  deleteBuilding: async (id) => {
    try {
      const response = await api.delete(`/buildings/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении блока ${id}:`, error);
      throw error;
    }
  },

  // Получить блоки по ЖК
  getBuildingsByComplex: async (complexId) => {
    try {
      const response = await api.get('/buildings', {
        params: { complex_id: complexId }
      });
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении блоков ЖК ${complexId}:`, error);
      throw error;
    }
  }
};

export default buildingService;