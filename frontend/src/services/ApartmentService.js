import api from './api';

const apartmentService = {
  // Получить все квартиры
  getApartments: async (params = {}) => {
    try {
      const response = await api.get('/apartments', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка при получении квартир:', error);
      throw error;
    }
  },

  // Получить квартиру по ID
  getApartmentById: async (id) => {
    try {
      const response = await api.get(`/apartments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при получении квартиры ${id}:`, error);
      throw error;
    }
  },

  // Создать квартиру
  createApartment: async (apartmentData) => {
    try {
      const response = await api.post('/apartments', apartmentData);
      return response.data;
    } catch (error) {
      console.error('Ошибка при создании квартиры:', error);
      throw error;
    }
  },

  // Обновить квартиру
  updateApartment: async (id, apartmentData) => {
    try {
      const response = await api.patch(`/apartments/${id}`, apartmentData);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при обновлении квартиры ${id}:`, error);
      throw error;
    }
  },

  // Удалить квартиру
  deleteApartment: async (id) => {
    try {
      const response = await api.delete(`/apartments/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Ошибка при удалении квартиры ${id}:`, error);
      throw error;
    }
  }
};

export default apartmentService;