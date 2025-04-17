import React from "react";
import PasswordImg from "../../assets/img/email.png"; // Ganti sesuai path gambarmu
import LogoImg from "../../assets/img/UKS2.png"; // Ganti sesuai path logo UKS

const GantiPasswordPage = () => {
  return (
    <div className="flex min-h-screen font-poppins">
      {/* Left Panel */}
      <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
        {/* Background Shapes */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-700 rounded-full opacity-30 translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-0 left-10 w-0 h-0 border-l-[50px] border-l-transparent border-r-[50px] border-r-transparent border-b-[80px] border-b-[#2AA7B9] opacity-80" />
        <div className="absolute bottom-10 left-10 w-10 h-10 bg-[#2AA7B9] rotate-45" />
        <div className="absolute bottom-20 right-20 w-5 h-5 bg-[#2AA7B9] rotate-45" />

        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Password <br /> Baru
        </h1>

        <img src={PasswordImg} alt="Reset Password" className="w-60 h-60 mb-6 object-contain" />

        <hr className="w-24 border-[1.5px] border-gray-400 mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
        <p className="text-sm text-gray-600 text-center max-w-xs">
          Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
          dan meningkatkan kesehatan di sekolah.
        </p>
      </div>

      {/* Right Panel */}
      <div className="w-1/2 bg-white flex flex-col items-center justify-center p-10">
                <img src={LogoImg} alt="Logo" className="w-16 h-auto mb-6 object-contain" />
  <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
    Masukkan Password Baru
  </h2>

  <div className="w-full max-w-md flex flex-col gap-4">
    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700 text-left">
        Password baru
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
      />
    </div>

    <div className="flex flex-col">
      <label className="mb-1 font-medium text-gray-700 text-left">
        Konfirmasi Password baru
      </label>
      <input
        type="text"
        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
      />
    </div>

    <button className="w-full bg-[#2AA7B9] text-white py-2 rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-200 mt-4">
      Set password baru
    </button>
  </div>
</div>


    </div>
  );
};

export default GantiPasswordPage;
