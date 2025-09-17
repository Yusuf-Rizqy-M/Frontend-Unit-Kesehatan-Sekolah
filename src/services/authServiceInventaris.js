// src/services/inventoryService.js
import api from '../api/auth'; // Adjust path as needed

const InventoryService = {
  getInventaris: async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.get('/inventaris', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  addInventaris: async (data) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.post('/inventaris', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  updateInventaris: async (id, data) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.put(`/inventaris/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  deleteInventaris: async (id) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.delete(`/inventaris/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export { api }; // Export api if needed elsewhere
export default InventoryService;