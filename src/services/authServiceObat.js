import api from '../api/auth'; // Adjust path as needed

const ObatService = {
  /**
   * Fetches the list of medicines
   * @returns {Promise<Object>} - API response data
   */
  getObats: async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.get('/obats', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Fetches details of a specific medicine by ID
   * @param {number} id - Medicine ID
   * @returns {Promise<Object>} - API response data
   */
  getObatById: async (id) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.get(`/obats/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Adds a new medicine
   * @param {FormData} data - Medicine data including image
   * @returns {Promise<Object>} - API response data
   */
  addObat: async (data) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.post('/obats', data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Updates an existing medicine
   * @param {number} id - Medicine ID
   * @param {FormData} data - Updated medicine data including image
   * @returns {Promise<Object>} - API response data
   */
  updateObat: async (id, data) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    data.append('_method', 'PUT'); // Add _method=PUT for Laravel compatibility
    const response = await api.post(`/obats/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Deletes a medicine by ID
   * @param {number} id - Medicine ID
   * @returns {Promise<Object>} - API response data
   */
  deleteObat: async (id) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const response = await api.delete(`/obats/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  /**
   * Updates the stock of a medicine
   * @param {number} id - Medicine ID
   * @param {number} stok - New stock value
   * @returns {Promise<Object>} - API response data
   */
  updateStock: async (id, stok) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }
    const formData = new FormData();
    formData.append('stok', stok);
    formData.append('_method', 'PUT'); // Add _method=PUT for Laravel compatibility
    const response = await api.post(`/obats/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export { api }; // Export api if needed elsewhere
export default ObatService;