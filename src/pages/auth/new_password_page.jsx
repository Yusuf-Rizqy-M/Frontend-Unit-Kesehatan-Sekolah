import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import PasswordImg from "../../assets/img/email.png"; // Ganti sesuai path gambarmu
import LogoImg from "../../images/uks2.png"; // Updated to match Edit Profile path
import UKS2Img from "../../images/uks2.png"; // Impor gambar UKS2Img, sesuaikan path

const GantiPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmation: false,
  });

  const email = location.state?.email || "";
  const token = location.state?.token || localStorage.getItem("resetToken") || "";

  // Set favicon and title (matching Edit Profile)
  useEffect(() => {
    // Mengatur judul tab
    document.title = 'Reset Password';
    
    // Mengatur favicon
    const favicon = document.querySelector("link[rel='icon']") || document.createElement('link');
    favicon.rel = 'icon';
    favicon.href = UKS2Img; // Menggunakan UKS2Img sebagai favicon
    document.head.appendChild(favicon);

    // Debugging logs
    console.log("GantiPasswordPage component mounted");
    console.log("Initial document title:", document.title);
    console.log("UKS2Img import path:", UKS2Img);
    console.log("Initial favicon href:", favicon ? favicon.href : "No favicon found");
    console.log("Set favicon href to:", favicon.href);

    // Check title and favicon after rendering
    const timeout = setTimeout(() => {
      console.log("Document title after render:", document.title);
      const updatedFavicon = document.querySelector("link[rel='icon']");
      console.log("Favicon after render:", updatedFavicon ? updatedFavicon.href : "No favicon found");
    }, 1000);

    return () => {
      clearTimeout(timeout);
      console.log("GantiPasswordPage component unmounted");
    };
  }, []);

  useEffect(() => {
    if (!email || !token) {
      console.log("Missing email or token, redirecting to forgot password");
      navigate("/forgot-password", { replace: true });
    } else {
      console.log("Email and token received:", email, token);
    }
  }, [email, token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShowToast(false);
    setToastMessage("");

    // Validation
    if (formData.password.length < 8) {
      setError("Password harus minimal 8 karakter.");
      setToastMessage("Password harus minimal 8 karakter.");
      setIsSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    if (formData.password !== formData.password_confirmation) {
      setError("Konfirmasi password tidak cocok.");
      setToastMessage("Konfirmasi password tidak cocok.");
      setIsSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://api-uks.rplrus.com/api/reset-password",
        {
          email,
          token,
          password: formData.password,
          password_confirmation: formData.password_confirmation,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        }
      );

      console.log("Reset password response:", response.data);

      if (response.data.status === true || response.data.success === true || response.status === 200) {
        setToastMessage("Password berhasil diubah!");
        setIsSuccess(true);
        setShowToast(true);
        localStorage.removeItem("resetToken");
        setTimeout(() => {
          setShowToast(false);
          navigate("/login", {
            replace: true,
            state: { notification: "Password berhasil diubah. Silakan login dengan password baru Anda." },
          });
        }, 2000);
      } else {
        setError(response.data.message || "Gagal mengubah password.");
        setToastMessage(response.data.message || "Gagal mengubah password.");
        setIsSuccess(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      const errorMessage = err.response?.data?.message || "Terjadi kesalahan saat mengubah password.";
      setError(errorMessage);
      setToastMessage(errorMessage);
      setIsSuccess(false);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50 ${
            isSuccess ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
          }`}
        >
          <div
            className={`rounded-full p-1 ${isSuccess ? "bg-green-600" : "bg-red-600"}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              {isSuccess ? (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-12 h-12 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Password <br /> Baru
        </h1>
        <img
          src={PasswordImg}
          alt="Password"
          className="w-60 h-auto mb-6 object-contain"
        />
        <hr className="w-24 border-[1.5px] border-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
        <p className="text-sm text-gray-600 text-center max-w-xs">
          Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
          dan meningkatkan kesehatan di sekolah.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-white">
        <img
          src={LogoImg}
          alt="Logo"
          className="w-16 h-auto mb-6 object-contain"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Masukkan Password Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="w-full max-w-sm">
          {/* Password field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password baru
            </label>
            <div className="relative">
              <input
                type={passwordVisible.password ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm text-black"
                placeholder="Masukkan password baru"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={passwordVisible.password ? "Sembunyikan password" : "Tampilkan password"}
              >
                {passwordVisible.password ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi Password baru
            </label>
            <div className="relative">
              <input
                type={passwordVisible.confirmation ? "text" : "password"}
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-sm text-black"
                placeholder="Konfirmasi password baru"
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirmation")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                aria-label={passwordVisible.confirmation ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
              >
                {passwordVisible.confirmation ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7A9.97 9.97 0 014.02 8.971m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-[#2A8D9C] text-white py-2 rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-200 mb-4 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Memproses..." : "Set password baru"}
          </button>

          <a
            href="/login"
            className="text-sm text-[#2A8D9C] hover:underline flex items-center justify-center"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Kembali ke login
          </a>
        </form>
      </div>
    </div>
  );
};

export default GantiPasswordPage;