// src/services/authService.js
import api from '../api/auth';

const AuthService = {
  login: async (email, password, remember = true) => {
    const response = await api.post('/login', {
      email,
      password,
      remember,
    });

    const resData = response.data;

    if (resData.status) {
      const { token, name, email, role } = resData.data;

      return {
        token,
        user: { name, email, role }, // Role ditambahkan di sini
      };
    } else {
      throw new Error(resData.message || "Login gagal");
    }
  },

  logout: async (token) => {
    const response = await api.post('/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};

export default AuthService;
