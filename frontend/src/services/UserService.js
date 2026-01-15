import api from './api';

const userService = {
    // Получить всех пользователей
    getUsers: async () => {
        try {
            const response = await api.get('/users/');
            return response.data;
        } catch (error) {
            console.error('Ошибка получения пользователей:', error);
            throw error;
        }
    },

    // Получить пользователя по ID
    getUserById: async (id) => {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка получения пользователя:', error);
            throw error;
        }
    },

    // Создать пользователя
    createUser: async (userData) => {
        try {
            const response = await api.post('/users/', userData);
            return response.data;
        } catch (error) {
            console.error('Ошибка создания пользователя:', error);
            throw error;
        }
    },

    // Обновить пользователя
    updateUser: async (id, userData) => {
        try {
            const response = await api.patch(`/users/${id}`, userData);
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления пользователя:', error);
            throw error;
        }
    },

    // Обновить роль пользователя
    updateUserRole: async (id, role) => {
        try {
            const response = await api.patch(`/users/${id}/role`, { role });
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления роли:', error);
            throw error;
        }
    },

    // Обновить статус пользователя
    updateUserStatus: async (id, status) => {
        try {
            const response = await api.patch(`/users/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            throw error;
        }
    },

    // Удалить пользователя
    deleteUser: async (id) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Ошибка удаления пользователя:', error);
            throw error;
        }
    }
};

export default userService;