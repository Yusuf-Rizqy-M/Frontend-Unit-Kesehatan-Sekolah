import api from '../api/auth';

const AuthService = {
  login: async (data) => {
    const { email, password, remember = true } = data;
    const response = await api.post('/login', { email, password, remember });
    const resData = response.data;

    if (resData.status) {
      const { token, name, email, role, status } = resData.data;
      if (status !== 'active') {
        throw new Error('Akun Anda tidak aktif. Silakan hubungi admin.');
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem('token', token);
      storage.setItem('user', JSON.stringify({ name, email, role, status }));

      return resData;
    } else {
      throw new Error(resData.message || 'Login gagal');
    }
  },

  logout: async () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    const response = await api.post('/logout');
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    return response.data;
  },

  register: async (formData) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error('Token tidak ditemukan. Silakan login kembali.');
    }

    const response = await api.post('/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: () => {
    return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
  },

  getToken: () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  },
};

export { api };
export default AuthService;