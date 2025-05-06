import { useState } from "react";
import AuthService from "../services/authService";

const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (email, password, remember = true) => {
    setLoading(true);
    setError(null);

    try {
      const data = await AuthService.login(email, password, remember);
      console.log("Login response:", data); // Tambahkan logging untuk debug

      if (!data.token) {
        throw new Error("Token not found in response");
      }

      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("token", data.token);
      storage.setItem("user", JSON.stringify(data.user));

      console.log("Token saved to:", remember ? "localStorage" : "sessionStorage"); // Debug penyimpanan
      return data;
    } catch (err) {
      const message = err.response?.data?.message || "Login gagal";
      console.error("Login error:", err); // Debug error
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};

export default useLogin;