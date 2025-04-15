import React from 'react';

import UksImg2 from "../../assets/img/doctor_img.png";
import LogoImg from "../../assets/img/UKS2.png";

const LoginPage = () => {
  return (
    <div className="flex min-h-screen font-poppins bg-white">
      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] flex flex-col justify-center items-center p-12 relative">
        {/* Background Shapes */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-10 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8 leading-tight">
          Hallo, Teman<br />Selamat Datang!
        </h1>

        <img src={UksImg2} alt="Doctor" className="w-60 h-60 mb-8" />

        <hr className="w-24 border-[1.5px] border-gray-400 mb-6" />

        <div className="text-center">
          <h2 className="text-lg font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
          <p className="text-sm text-gray-600 max-w-xs">
            Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau dan meningkatkan kesehatan di sekolah.
          </p>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 flex flex-col justify-center items-center p-12">
  <div className="w-full max-w-sm flex flex-col items-start mb-8">
    <img
      src={LogoImg}
      alt="Logo"
      className="w-16 h-16 mb-4 object-contain"
    />
    <h2 className="text-2xl font-bold text-gray-800">
      Sign in to your account
    </h2>
  </div>

  {/* Form */}
  <form className="w-full max-w-sm text-left">
    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        Email Address
      </label>
      <input
        type="email"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-sm text-black"
      />
    </div>

    <div className="mb-5">
      <label className="block text-xs font-semibold text-gray-600 mb-1">
        Password
      </label>
      <input
        type="password"
        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-sm text-black"
      />
    </div>

    <div className="flex items-center justify-between mb-6">
      <label className="flex items-center text-sm text-gray-600">
        <input type="checkbox" defaultChecked className="mr-2" /> Remember me
      </label>
      <a href="#" className="text-xs text-purple-700 hover:underline">
        Forgot password?
      </a>
    </div>

    <button
      type="submit"
      className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded-md text-sm transition-colors duration-200"
    >
      Sign in
    </button>
  </form>

  {/* Sign up link */}
  <p className="mt-8 text-sm text-gray-700">
    Not a user?{" "}
    <a href="RegisterPage" className="text-blue-600 hover:underline">
      Sign up here
    </a>
  </p>
</div>

    </div>
  );
};

export default LoginPage;
