import api from './api';

const promotionService = {
    getPromotions: async (params = {}) => {
        try {
            const response = await api.get('/promotions/', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching promotions:', error);
            throw error;
        }
    },

    getPromotionById: async (id) => {
        try {
            const response = await api.get(`/promotions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching promotion:', error);
            throw error;
        }
    },

    createPromotion: async (promotionData) => {
        try {
            const response = await api.post('/promotions/', promotionData);
            return response.data;
        } catch (error) {
            console.error('Error creating promotion:', error);
            throw error;
        }
    },

    updatePromotion: async (id, promotionData) => {
        try {
            const response = await api.patch(`/promotions/${id}`, promotionData);
            return response.data;
        } catch (error) {
            console.error('Error updating promotion:', error);
            throw error;
        }
    },

    deletePromotion: async (id) => {
        try {
            const response = await api.delete(`/promotions/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting promotion:', error);
            throw error;
        }
    },

    uploadPromotionImage: async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await api.post('/promotions/upload-image', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading promotion image:', error);
            throw error;
        }
    }
};

export const getPromotions = promotionService.getPromotions;
export const getPromotionById = promotionService.getPromotionById;
export const uploadPromotionImage = promotionService.uploadPromotionImage;
export const requestConsultation = async (phone) => {
    try {
        const response = await api.post('/consultations', { phone });
        return response.data;
    } catch (error) {
        console.error('Error requesting consultation:', error);
        throw error;
    }
};

export default promotionService;