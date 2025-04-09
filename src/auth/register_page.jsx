import React from "react";
import DoctorImg from "../assets/img/doctor_img.png";
import UKS2Img from "../assets/img/UKS2.png";

const RegisterPage = () => {
  return (
    <div className="flex w-screen h-screen">
      {/* Left */}
      <div className="w-1/2 bg-[#cbe8f6] relative flex flex-col items-center justify-center text-center p-5">

        <div className="absolute top-[-150px] left-[550px] w-[200px] h-[200px] bg-[#3bb7c6] rounded-full"></div>
        <div className="absolute bottom-1/2 left-[50px] w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-[#3bb7c6]"></div>
        <div className="absolute bottom-[15%] left-[400px] w-[40px] h-[20px] bg-[#3bb7c6] rotate-[30deg]"></div>

        <div className="relative z-10 max-w-[80%] text-center">
          <h1 className="text-3xl font-bold text-[#2F3C40] text-center mb-4">
            Hallo, Teman <br />  Selamat Datang!
          </h1>

          <div className="flex justify-center items-center mb-4">
            <div className="w-[200px] h-[200px] bg-white rounded-full flex items-center justify-center overflow-hidden">
              <img
                src={DoctorImg}
                alt="Doctor"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <h2 className="text-3xl font-semi-bold text-[#2F3C40] text-center mb-4">
            UKS SMK RUS
          </h2>


          <p className="text-base leading-relaxed text-[#444]">
            Jaga kesehatanmu dengan UKS SMK RUS, platform terbaik untuk memantau
            dan meningkatkan kesehatan di sekolah.
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="w-1/2 flex items-center justify-center bg-white text-black">
        {/* Form placeholder */}
        <div className="w-[70%] max-w-[400px] text-center">
          <img alt="Logo" src={UKS2Img} className="h-20 w-auto mb-4" />
          <h2 className="text-xl font-semibold mb-4">Sign in to your account</h2>

          <label className="block text-left mb-1">Email address</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />

          <label className="block text-left mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-2 mb-3 border border-gray-300 rounded"
          />

          <div className="flex justify-between items-center text-sm mb-4">
            <label className="flex items-center">
              <input type="checkbox" className="mr-1" /> Remember me
            </label>
            <a href="#" className="text-[#3bb7c6]">Forgot your password?</a>
          </div>

          <button className="w-full p-2 bg-[#2A8F9E] text-white rounded font-semibold">Sign In</button>

          <p className="mt-4 text-sm">
            Not a user? <a href="#" className="text-[#3bb7c6]">Sign up here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;