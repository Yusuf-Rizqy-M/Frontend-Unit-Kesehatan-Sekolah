// src/hooks/useLogout.js
import { useState } from 'react';
import AuthService from '../services/authService';

const useLogout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token tidak ditemukan');

      const data = await AuthService.logout(token); // pakai AuthService.logout
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};

export default useLogout;
