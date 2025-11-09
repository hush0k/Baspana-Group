import api from './api';

export const complexService = {
    getComplexes: async (filters = {}) => {
        try {
            const params = new URLSearchParams();

            if (filters.city) params.append('city', filters.city);
            if (filters.building_class) params.append('building_class', filters.building_class);
            if (filters.building_status) params.append('building_status', filters.building_status);
            if (filters.material) params.append('material', filters.material);
            if (filters.has_security !== undefined) params.append('has_security', filters.has_security);
            if (filters.min_apartment_area) params.append('min_apartment_area', filters.min_apartment_area);
            if (filters.max_apartment_area) params.append('max_apartment_area', filters.max_apartment_area);
            if (filters.search) params.append('search', filters.search);

            if (filters.sort_by) params.append('sort_by', filters.sort_by);
            if (filters.order) params.append('order', filters.order);
            if (filters.limit) params.append('limit', filters.limit);
            if (filters.offset) params.append('offset', filters.offset);

            const response = await api.get(`/complexes?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching complexes:', error);
            throw error;
        }
    },
    getComplexById: async (id) => {
        try {
            const response = await api.get(`/complexes/by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching complex by ID:', error);
            throw error;
        }
    },
    getComplexByName: async (name) => {
        try {
            const response = await api.get(`/complexes/by-name/${name}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching complex by name:', error);
            throw error;
        }
    },
    createComplex: async (complexData) => {
        try {
            const response = await api.post('/complexes', complexData);
            return response.data;
        } catch (error) {
            console.error('Error creating complex:', error);
            throw error;
        }
    },

    updateComplex: async (id, complexData) => {
        try {
            const response = await api.patch(`/complexes/${id}`, complexData);
            return response.data;
        } catch (error) {
            console.error('Error updating complex:', error);
            throw error;
        }
    },
    deleteComplex: async (id) => {
        try {
            const response = await api.delete(`/complexes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting complex:', error);
            throw error;
        }
    }
};

export default complexService;