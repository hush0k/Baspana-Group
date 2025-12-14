import api from './api';

const complexService = {
  // Получить все комплексы с фильтрами
  getComplexes: async (params = {}) => {
    try {
      const response = await api.get('/complexes/', { params });
      return response.data;
    } catch (error) {
      console.error('Ошибка получения комплексов:', error);
      throw error;
    }
  },

  // Получить комплекс по ID
  getComplexById: async (id) => {
    try {
      const response = await api.get(`/complexes/by-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения комплекса:', error);
      throw error;
    }
  },

  // Получить комплекс по имени
  getComplexByName: async (name) => {
    try {
      const response = await api.get(`/complexes/by-name/${name}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка получения комплекса:', error);
      throw error;
    }
  },

  // Создать новый комплекс
  createComplex: async (data) => {
    try {
      const response = await api.post('/complexes/', data);
      return response.data;
    } catch (error) {
      console.error('Ошибка создания комплекса:', error);
      throw error;
    }
  },

  // Обновить комплекс
  updateComplex: async (id, data) => {
    try {
      const response = await api.put(`/complexes/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Ошибка обновления комплекса:', error);
      throw error;
    }
  },

  // Удалить комплекс
  deleteComplex: async (id) => {
    try {
      const response = await api.delete(`/complexes/${id}`);
      return response.data;
    } catch (error) {
      console.error('Ошибка удаления комплекса:', error);
      throw error;
    }
  }
};

export default complexService;