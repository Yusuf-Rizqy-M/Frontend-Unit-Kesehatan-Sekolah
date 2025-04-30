// src/hooks/useRegister.js
import { useState } from "react";
import AuthService from "../services/authService";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (formData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.register(formData);
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Register gagal";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;
