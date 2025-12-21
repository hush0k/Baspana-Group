import api from './api';

const commercialUnitService = {
  // Получить все коммерческие помещения
  getCommercialUnits: async (params = {}) => {
    try {
      const response = await api.get('/commercial_units', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении коммерческих помещений:', error);
      throw error;
    }
  },

  // Получить коммерческое помещение по ID
  getCommercialUnitById: async (id) => {
    try {
      const response = await api.get(`/commercial_units/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении коммерческого помещения ${id}:`, error);
      throw error;
    }
  },

  // Создать коммерческое помещение
  createCommercialUnit: async (data) => {
    try {
      const response = await api.post('/commercial_units', data);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании коммерческого помещения:', error);
      throw error;
    }
  },

  // Обновить коммерческое помещение
  updateCommercialUnit: async (id, data) => {
    try {
      const response = await api.patch(`/commercial_units/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении коммерческого помещения ${id}:`, error);
      throw error;
    }
  },

  // Удалить коммерческое помещение
  deleteCommercialUnit: async (id) => {
    try {
      const response = await api.delete(`/commercial_units/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении коммерческого помещения ${id}:`, error);
      throw error;
    }
  }
};

export default commercialUnitService;
