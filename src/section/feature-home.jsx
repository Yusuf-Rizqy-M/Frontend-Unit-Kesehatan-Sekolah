import React from "react";
import Consult from "../assets/img/consult_img.png";
import Recap from "../assets/img/rekap.png";
import Calculator from "../assets/img/calculator.png";

const FeaturePage = () => {
  return (
    <section className="bg-white w-full min-h-screen py-20 px-4">
      <div className="w-fit mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-[#1C4245] text-center mb-8 pb-2 relative group">
          Feature UKS SMK Raden Umar Said
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 h-[3px] bg-[#4FB7BD] transition-all duration-300 group-hover:w-100"></span>
        </h2>
      </div>


    <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="w-40 md:w-40 flex-shrink-0 pl-6">
                <img src={Consult} 
                alt="consultimg" 
                className="w-40 h-40 object-contain" />
            </div>
                <div className="w-full md:w-3/4 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit">
                        Konsultasi Kesehatan
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]"></span>
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        Fitur Konsultasi UKS adalah sistem yang memungkinkan pengguna untuk melakukan konsultasi kesehatan dengan petugas atau 
                        admin UKS secara daring. Fitur ini dirancang untuk memudahkan siswa atau pengguna dalam menyampaikan keluhan kesehatan dan 
                        mendapatkan tanggapan dari pihak UKS secara efisien.
                    </p>
                    <a href="#" className="mt-3 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987] ">
                        Explore Konsultasi →
                    </a>
            </div>
      </div>


      <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10 mt-10">
            <div className="w-20 md:w-40  flex-shrink-0 pr-6">
                <img src={Recap} alt="recapimg" className="w-full h-auto" />
            </div>
                <div className="w-full md:w-3/4 text-right">
                    <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit ml-auto">
                        Rekap Medis
                        <span className="absolute right-0 bottom-0 w-full h-[2px] bg-[#42B1EC]"></span>
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-2xl ml-auto">
                        Fitur Rekap Medis UKS adalah sistem pencatatan riwayat kesehatan siswa yang memungkinkan pihak UKS untuk menyimpan dan mengelola data medis setiap pengguna. Fitur ini berfungsi sebagai arsip digital yang membantu dalam pemantauan kondisi kesehatan siswa secara lebih efektif.
                    </p>
                    <a href="#" className="mt-4 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987] ">
                        Explore Rekap Medis →
                    </a>
            </div>
      </div>


      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mt-10">
            <div className="w-24 md:w-40  flex-shrink-0 pl-10">
                <img src={Calculator} alt="calculatorimg" className="w-20 h-25 object-contain" />
            </div>
                <div className="w-full md:w-3/4 text-center md:text-left">
                    <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit">
                        Kalkulator BMI
                        <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]"></span>
                    </h3>
                    <p className="mt-2 text-gray-600 max-w-2xl">
                        Cek kesehatanmu dengan Kalkulator BMI! Masukkan berat dan tinggi badan untuk mengetahui kategori berat badanmu—kurang, 
                        ideal, atau berlebih. Dapatkan juga rekomendasi untuk menjaga keseimbangan tubuh yang sehat.
                    </p>
                    <a href="/KalkulatorBmi" className="mt-3 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987] ">
                        Explore Kalkulator BMI →
                    </a>
            </div>
      </div>

    </section>
  );
};

export default FeaturePage;
