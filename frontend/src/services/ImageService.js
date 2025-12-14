import api from './api';

const imageService = {
    // Получить изображения для объекта
    getImages: async (objectId, objectType) => {
        try {
            const response = await api.get('/images/', {
                params: {
                    object_id: objectId,
                    object_type: objectType
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching images:', error);
            throw error;
        }
    },

    // Получить изображение по ID
    getImageById: async (imageId) => {
        try {
            const response = await api.get(`/images/${imageId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching image:', error);
            throw error;
        }
    },

    // Загрузить изображение (только для admin/manager)
    uploadImage: async (file, objectId, objectType) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('object_id', objectId);
            formData.append('object_type', objectType);

            const response = await api.post('/images/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    },

    // Удалить изображение (только для admin/manager)
    deleteImage: async (imageId) => {
        try {
            const response = await api.delete(`/images/${imageId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }
};

export default imageService;