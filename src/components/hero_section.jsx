import React from "react";
import UKS2Img from "../assets/img/UKS2.png";
import DoctorImg from "../assets/img/doctor_img.png";

const HeroSection = () => {
    return (
      <section className="bg-white py-30 px-2 md:px-16 pl-15 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 text-center md:text-left  pl-17 relative -mt-6">
            <h1 className="text-4xl md:text-6xl font-bold text-black leading-tight">
                Sehat <br /> Bersama UKS, <br /> Peduli Sejak Dini
            </h1>

            <p className="mt-4 text-gray-600">
            UKS (Usaha Kesehatan Sekolah) hadir untuk mendukung kesehatan siswa dengan layanan
             medis yang cepat dan terpercaya. Kami menyediakan konsultasi kesehatan, pemeriksaan ringan, 
             serta edukasi untuk membangun kebiasaan hidup sehat sejak dini.
             Bersama UKS, wujudkan lingkungan sekolah yang lebih sehat dan nyaman!
            </p>
        </div>
        <div className="md:w-1/2 flex justify-center mt-6 md:mt-0 relative -mt-12">
            <img
                src={DoctorImg} 
                alt="Doctor Illustration"
                className="max-w-xs md:max-w-md"
            />
        </div>

      </section>
    );
  };
  
  export default HeroSection;
  

  
  