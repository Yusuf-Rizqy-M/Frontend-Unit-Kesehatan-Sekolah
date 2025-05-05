import React, { useState } from "react";
import PasswordImg from "../../assets/img/email.png";
import LogoImg from "../../assets/img/UKS2.png";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
        <div className="absolute top-0 left-0 w-32 h-32 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-2 left-10 w-8 h-8 bg-cyan-500 rotate-45" />
        <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Lupa <br /> Password
        </h1>
        <img src={PasswordImg} alt="Reset Password" className="w-60 h-60 mb-6 object-contain" />
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-10">
        <img src={LogoImg} alt="Logo" className="w-16 h-auto mb-6 object-contain" />
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Masukkan alamat Email anda
        </h2>

        <form className="w-full max-w-sm">
          <div className="mb-5 w-full">
            <label className="block text-xs font-semibold mb-2 text-black">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none text-sm text-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#2AA7B9] text-white py-2 rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-200 mt-4"
          >
            Selanjutnya
          </button>
        </form>

        <Link 
          to="/otp" 
          state={{ email }} 
          className="mt-5 text-sm text-[#2A8D9C] hover:underline flex items-center"
        >
          Lanjut ke OTP
        </Link>
      </div>
    </div>
  );
};

export default ForgotPassword;
