import React from "react";
import OtpImg from "../../assets/img/email.png";
import LogoImg from "../../assets/img/UKS2.png";

const OtpPage = () => {
    return (
        <div className="flex min-h-screen font-poppins">
            {/* Left Panel */}
            <div className="w-1/2 bg-[#DDF6FF] relative flex flex-col items-center justify-center p-10">
                {/* Background Shapes */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-cyan-500 rounded-full opacity-40 -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-10 left-10 w-12 h-12 bg-cyan-500 rotate-45" />
                <div className="absolute top-20 right-10 w-6 h-6 bg-cyan-500 rotate-45" />

                {/* Content */}
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                    Kode <br /> OOTP
                </h1>
                <img src={OtpImg} alt="OTP" className="w-60 h-auto mb-6 object-contain" />
                <hr className="w-24 border-[1.5px] border-gray-400 mb-4" />
                <h2 className="text-xl font-bold text-gray-800 mb-2">UKS SMK RUS</h2>
                <p className="text-sm text-gray-600 text-center max-w-xs">
                    Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
                    dan meningkatkan kesehatan di sekolah.
                </p>
            </div>

            {/* Right Panel */}
            <div className="w-1/2 flex flex-col items-center justify-center p-10 bg-white"> {/* Menambahkan bg-white */}
                <img src={LogoImg} alt="Logo" className="w-16 h-auto mb-6 object-contain" />
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Masuk Kode OOTP Anda
                </h2>

                <label className="text-sm font-medium text-gray-700 mb-2">
                    Kode OOTP
                </label>

                <div className="flex gap-4 mb-6">
                    {[1, 2, 3, 4].map((i, index) => (
                        <input
                            key={i}
                            type="text"
                            maxLength={1}
                            className="w-12 h-12 text-center border border-gray-400 rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-cyan-400 text-black"
                            onInput={(e) => {
                                // Hanya izinkan angka
                                e.target.value = e.target.value.replace(/[^0-9]/g, '');

                                // Pindahkan fokus ke input selanjutnya setelah angka dimasukkan
                                if (e.target.value && index < 3) {
                                    document.getElementById(`otp-input-${index + 1}`).focus();
                                }
                            }}
                            id={`otp-input-${index}`}  // Set ID agar bisa diakses secara individual
                        />
                    ))}
                </div>

                <button className="w-full max-w-xs bg-[#2A8D9C] text-white py-2 rounded-md font-semibold hover:bg-cyan-700 transition-colors duration-200 mb-4">
                    Masuk
                </button>

                <a href="/login" className="text-sm text-[#2A8D9C] hover:underline flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to log in
                </a>
            </div>

        </div>
    );
};

export default OtpPage;
