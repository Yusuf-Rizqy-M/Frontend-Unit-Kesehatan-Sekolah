import api from '../api/auth';

const AuthService = {
  login: async (email, password, remember = true) => {
    try {
      const response = await api.post('/login', { email, password, remember });
      const resData = response.data;

      if (resData.status) {
        const { token, name, email, role, status } = resData.data;
        if (status !== 'active') {
          throw new Error('Akun Anda tidak aktif. Silakan hubungi admin.');
        }
        return {
          token,
          user: { name, email, role, status },
        };
      } else {
        throw new Error(resData.message || 'Login gagal');
      }
    } catch (error) {
      // Tangani error dari Axios (misalnya, status 403)
      if (error.response) {
        // Error dari server (seperti 403, 401, dll.)
        const errorMessage = error.response.data.message || 'Login gagal';
        throw new Error(errorMessage);
      } else {
        // Error jaringan atau lainnya
        throw new Error('Terjadi kesalahan jaringan. Silakan coba lagi.');
      }
    }
  },

  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },

  register: async (formData) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    if (!token) {
      throw new Error('Token admin tidak ditemukan. Silakan login sebagai admin.');
    }

    const response = await api.post('/register', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const resData = response.data;

    if (resData.status) {
      return resData.data;
    } else {
      throw new Error(resData.message || 'Register gagal');
    }
  },
};

export default AuthService;