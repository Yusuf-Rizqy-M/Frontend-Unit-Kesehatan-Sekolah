import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/authService";
import UksImg from "../../assets/img/doctor_img_rounded.png";
import LogoImg from "../../assets/img/UKS2.png";

const gradeOptions = {
  RPL: ["RPL 1", "RPL 2"],
  "Animasi 3D": ["Animasi 3D 1", "Animasi 3D 2", "Animasi 3D 3"],
  "Animasi 2D": ["Animasi 2D 4", "Animasi 2D 5"],
  "DKV DG": ["DKV DG 1", "DKV DG 2", "DKV DG 3"],
  "DKV TG": ["DKV TG 4", "DKV TG 5"],
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "user",
    class: "",
    name_department: "",
    name_grades: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name_department") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        name_grades: "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Password dan konfirmasi tidak sama.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await AuthService.register(formData, token);
      setToastMessage("Register Berhasil");
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/dashboard");
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registrasi gagal.";
      setToastMessage(msg);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div className="flex min-h-screen font-poppins bg-white relative">
      {/* Toast */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-green-200 text-green-800 px-4 py-2 rounded-lg shadow-md flex items-center gap-2 animate-fade-in-out z-50">
          <div className="bg-green-600 rounded-full p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414L9 13.414l4.707-4.707z" clipRule="evenodd" />
            </svg>
          </div>
          <span className="font-medium text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Kiri */}
      <div className="w-1/2 bg-[#DDF6FF] flex flex-col justify-center items-center p-12 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 leading-tight">
          Hallo, Teman<br />Selamat Datang!
        </h1>
        <img src={UksImg} alt="Doctor" className="w-60 h-60 mb-8" />
        <hr className="w-24 border-[1.5px] border-gray-400 mb-6" />
        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
          <p className="text-sm text-gray-600 max-w-xs">
            Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau dan meningkatkan kesehatan di sekolah.
          </p>
        </div>
      </div>

      {/* Kanan */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-sm flex flex-col items-start mb-8">
          <img src={LogoImg} alt="Logo" className="w-16 h-16 mb-4 object-contain" />
          <h2 className="text-2xl font-bold text-gray-800">Sign up to your account</h2>
        </div>

        <form className="w-full max-w-sm text-left" onSubmit={handleSubmit}>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Email Address</label>
            <input name="email" type="email" value={formData.email} onChange={handleChange}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Create Username</label>
            <input name="name" type="text" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400" />
          </div>

          <div className="mb-4 relative">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Create Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-cyan-500 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mb-4 relative">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Confirm Password</label>
            <input
              name="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={handleChange}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6 text-gray-500 hover:text-cyan-500 focus:outline-none"
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
            >
              {showConfirmPassword ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Role</label>
            <select name="role" value={formData.role} onChange={handleChange}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-600 mb-1 block">Kelas & Jurusan</label>
            <div className="flex flex-col md:flex-row gap-2">
              <select name="class" value={formData.class} onChange={handleChange}
                className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">Kelas</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>

              <select name="name_department" value={formData.name_department} onChange={handleChange}
                className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="DKV DG">DKV DG</option>
                <option value="DKV TG">DKV TG</option>
                <option value="Animasi 3D">Animasi 3D</option>
                <option value="Animasi 2D">Animasi 2D</option>
              </select>

              <select name="name_grades" value={formData.name_grades} onChange={handleChange}
                disabled={!formData.name_department}
                className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">No. Kelas</option>
                {formData.name_department &&
                  gradeOptions[formData.name_department].map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
              </select>
            </div>
          </div>

          <button type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-md text-sm transition-colors duration-200">
            Sign Up
          </button>

          <button type="button" onClick={() => navigate("/dashboard")}
            className="w-full mt-2 text-cyan-600 text-sm hover:underline text-center">
            Kembali ke Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;