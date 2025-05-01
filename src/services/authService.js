// src/services/authService.js
import api from '../api/auth';

const AuthService = {
  login: async (email, password, remember = true) => {
    const response = await api.post('/login', { email, password, remember });
    const resData = response.data;

    if (resData.status) {
      const { token, name, email, role } = resData.data;
      return {
        token,
        user: { name, email, role },
      };
    } else {
      throw new Error(resData.message || "Login gagal");
    }
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  register: async (formData) => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");

    if (!token) {
      throw new Error("Token admin tidak ditemukan. Silakan login sebagai admin.");
    }

    const response = await api.post('/register', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const resData = response.data;

    if (resData.status) {
      return resData.data;
    } else {
      throw new Error(resData.message || "Register gagal");
    }
  }
};

export default AuthService;
