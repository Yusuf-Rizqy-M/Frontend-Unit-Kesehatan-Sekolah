import React from "react";
import Consult from "../assets/img/consult_img.png";
import Recap from "../assets/img/rekap.png";
import Calculator from "../assets/img/calculator.png";

const FeaturePage = () => {
  return (
    <section className="relative bg-white w-full min-h-screen py-20 px-4">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-50" />
        <div className="absolute bottom-60 right-70 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFE8D6] rotate-15 opacity-60" />
        <div className="absolute top-[300px] right-[900px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
        {/* <div className="absolute bottom-[100px] left-[800px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" /> */}
      </div>
      <div className="w-fit mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-[#1C4245] text-center mb-8 pb-2 relative group">
          Feature UKS SMK Raden Umar Said
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 group-hover:w-full transition-all duration-300 h-[3px] bg-[#4FB7BD]" />
        </h2>
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="w-24 md:w-40 flex-shrink-0">
            <img src={Calculator} alt="calculatorimg" className="w-full h-auto object-contain" />
          </div>
          <div className="w-full md:w-3/4 text-left">
            <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit">
              Kalkulator BMI
              <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]" />
            </h3>
            <p className="mt-2 text-gray-600 max-w-2xl text-sm">
              Cek kesehatanmu dengan Kalkulator BMI! Masukkan berat dan tinggi badan untuk mengetahui kategori berat badanmu—kurang, ideal, atau berlebih. Dapatkan juga rekomendasi untuk menjaga keseimbangan tubuh yang sehat.
            </p>
            <a
              href="/KalkulatorBmi"
              className="mt-4 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987]"
            >
              Explore Kalkulator BMI →
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
    </section>
  );
};

export default FeaturePage;
