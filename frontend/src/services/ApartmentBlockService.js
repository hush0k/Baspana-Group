import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export const getApartmentById = async (apartmentId) => {
    try {
        const response = await axios.get(`${API_URL}/apartments/${apartmentId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching apartment:', error);
        throw error;
    }
};

export const bookApartment = async (apartmentId, userData) => {
    try {
        const response = await axios.post(`${API_URL}/apartments/${apartmentId}/book`, userData);
        return response.data;
    } catch (error) {
        console.error('Error booking apartment:', error);
        throw error;
    }
};

export const buyApartment = async (apartmentId, userData) => {
    try {
        const response = await axios.post(`${API_URL}/apartments/${apartmentId}/buy`, userData);
        return response.data;
    } catch (error) {
        console.error('Error buying apartment:', error);
        throw error;
    }
};