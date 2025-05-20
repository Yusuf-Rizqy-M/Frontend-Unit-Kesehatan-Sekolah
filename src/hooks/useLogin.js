import { useState } from 'react';
import AuthService from '../services/authService';

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.login(email, password);
      console.log('Login response:', data); // Logging untuk debug

      if (!data.token) {
        throw new Error('Token not found in response');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      console.log('Token saved to localStorage'); // Debug penyimpanan
      return data;
    } catch (err) {
      const message = err.message || 'Login gagal';
      console.error('Login error:', err); // Debug error
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;