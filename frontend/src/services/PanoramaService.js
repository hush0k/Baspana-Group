import api from './api';

const PanoramaService = {
  // Создать панораму для ЖК
  createForComplex: async (complexId, file, title, type = '360_image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('residential_complex_id', complexId);
    formData.append('type', type);
    if (title) formData.append('title', title);

    const response = await api.post('/panoramas/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Создать панораму для квартиры
  createForApartment: async (apartmentId, file, title, type = '360_image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apartment_id', apartmentId);
    formData.append('type', type);
    if (title) formData.append('title', title);

    const response = await api.post('/panoramas/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },

  // Получить панорамы ЖК
  getByComplex: async (complexId) => {
    const response = await api.get(`/panoramas/complex/${complexId}`);
    return response.data;
  },

  // Получить панорамы квартиры
  getByApartment: async (apartmentId) => {
    const response = await api.get(`/panoramas/apartment/${apartmentId}`);
    return response.data;
  },

  // Удалить панораму
  delete: async (panoramaId) => {
    const response = await api.delete(`/panoramas/${panoramaId}`);
    return response.data;
  }
};

export default PanoramaService;
