import { useState } from "react";
import AuthService from "../services/authService";

const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (registerData) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.register(registerData);
      return data;
    } catch (err) {
      console.error("Registration error in hook:", err);
      const message = err.response?.data?.message || err.message || "Registrasi gagal";
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};

export default useRegister;