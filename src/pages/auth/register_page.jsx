import React, { useState } from "react";
import UksImg from "../../assets/img/doctor_img_rounded.png";
import LogoImg from "../../assets/img/UKS2.png";

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="flex min-h-screen font-poppins bg-white">
      {/* Left Section */}
      <div className="w-1/2 bg-[#DDF6FF] flex flex-col justify-center items-center p-12 relative">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 leading-tight">
          Hallo, Teman
          <br />
          Selamat Datang!
        </h1>

        <img src={UksImg} alt="Doctor" className="w-60 h-60 mb-8" />
        <hr className="w-24 border-[1.5px] border-gray-400 mb-6" />

        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
          <p className="text-sm text-gray-600 max-w-xs">
            Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
            dan meningkatkan kesehatan di sekolah.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-sm flex flex-col items-start mb-8">
          <img
            src={LogoImg}
            alt="Logo"
            className="w-16 h-16 mb-4 object-contain"
          />
          <h2 className="text-2xl font-bold text-gray-800">
            Sign up to your account
          </h2>
        </div>

        {/* Form */}
        <form className="w-full max-w-sm text-left">
          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-sm text-black"
            />
          </div>

          {/* Username */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Create Username
            </label>
            <input
              type="text"
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-sm text-black"
            />
          </div>

          {/* Password */}
          <div className="mb-4 relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Create Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-8 text-xs text-cyan-600 hover:underline"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-4 relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-8 text-xs text-cyan-600 hover:underline"
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Role
            </label>
            <select className="w-full px-4 py-1.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-sm text-black">
              <option value="">Pilih Role</option>
              <option value="siswa">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Gabungan: Kelas, Jurusan, Nama Kelas */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Kelas & Jurusan
            </label>
            <div className="flex flex-col md:flex-row gap-2">
              {/* Kelas */}
              <select className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">Kelas</option>
                <option value="10">10</option>
                <option value="11">11</option>
                <option value="12">12</option>
              </select>

              {/* Jurusan */}
              {/* Jurusan */}
              <select className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">Jurusan</option>
                <option value="RPL">RPL</option>
                <option value="DKV_DG">DKV DG</option>
                <option value="DKV_TG">DKV TG</option>
                <option value="Animasi_3D">Animasi 3D</option>
                <option value="Animasi_2D">Animasi 2D</option>
              </select>

              {/* Nama Kelas */}
              <select className="flex-1 px-4 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400">
                <option value="">No. Kelas</option>
                <option value="RPL_1">RPL 1</option>
                <option value="RPL_2">RPL 2</option>
                <option value="DKV_DG_1">DKV DG 1</option>
                <option value="DKV_DG_2">DKV DG 2</option>
                <option value="DKV_DG_3">DKV DG 3</option>
                <option value="DKV_TG_4">DKV TG 4</option>
                <option value="DKV_TG_5">DKV TG 5</option>
                <option value="Animasi_3D_1">Animasi 3D 1</option>
                <option value="Animasi_3D_2">Animasi 3D 2</option>
                <option value="Animasi_3D_3">Animasi 3D 3</option>
                <option value="Animasi_2D_4">Animasi 2D 4</option>
                <option value="Animasi_2D_5">Animasi 2D 5</option>
              </select>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center text-sm text-gray-600">
              <input type="checkbox" defaultChecked className="mr-2" /> Remember
              me
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-md text-sm transition-colors duration-200"
          >
            Sign Up
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-8 text-sm text-gray-700">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Log In here
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
