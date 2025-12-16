import api from './api';

export const getBlockById = async (blockId) => {
    try {
        const response = await api.get(`/buildings/${blockId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching block:', error);
        throw error;
    }
};

export const getBlockApartments = async (blockId, filters = {}) => {
    try {
        const response = await api.get(`/buildings/${blockId}/apartments`, {
            params: filters
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching apartments:', error);
        throw error;
    }
};

const blockService = {
    getBlockById,
    getBlockApartments
};

export default blockService;