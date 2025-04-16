import React from "react";
import { motion } from "framer-motion";
import Consult from "../assets/img/consult_img.png";
import Recap from "../assets/img/rekap.png";
import Calculator from "../assets/img/calculator.png";

const fadeInLeft = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
};

const fadeInRight = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
};

const FeaturePage = () => {
  return (
    <section className="relative bg-white w-full min-h-screen py-20 px-4">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
<<<<<<< Updated upstream
        <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-50" />
        <div className="absolute bottom-[30px] right-[5%] w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFE8D6] rotate-12 opacity-60" />
        <div className="absolute top-[300px] right-[900px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
      </div>

      {/* Title */}
      <motion.div
        className="w-fit mx-auto"
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <h2 className="text-2xl md:text-4xl font-bold text-[#1C4245] text-center mb-8 pb-2 relative group">
=======
        <div className="absolute top-100 left-[50px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-70" />
        {/* <div className="absolute bottom-60 right-[-3px] w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFE8D6] rotate-20 opacity-60" /> */}
        <div className="absolute top-[200px] right-[400px] w-[90px] h-[90px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
      </div>

      <div className="w-full text-center mb-8 mt-8">
        <h2 className="text-2xl md:text-4xl font-bold text-[#1C4245] relative group">
>>>>>>> Stashed changes
          Feature UKS SMK Raden Umar Said
          <span className="absolute left-1/2 -translate-x-1/2 bottom-[-4px] w-0 group-hover:w-full transition-all duration-300 h-[3px] bg-[#4FB7BD]" />
        </h2>
      </motion.div>

<<<<<<< Updated upstream
      {/* Feature: Kalkulator BMI */}
      <motion.div
        className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12"
        variants={fadeInLeft}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="w-24 md:w-40 flex-shrink-0">
          <img src={Calculator} alt="calculatorimg" className="w-full h-auto object-contain" />
        </div>
        <div className="w-full md:w-3/4 text-left">
          <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit">
            Kalkulator BMI
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]" />
          </h3>
          <p className="mt-2 text-gray-600 max-w-2xl text-sm">
=======
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12 mt-10">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit mx-auto md:mx-0">
            Kalkulator BMI
            <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]" />
          </h3>
          <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl mx-auto md:mx-0">
>>>>>>> Stashed changes
            Cek kesehatanmu dengan Kalkulator BMI! Masukkan berat dan tinggi badan untuk mengetahui kategori berat badanmu—kurang, ideal, atau berlebih. Dapatkan juga rekomendasi untuk menjaga keseimbangan tubuh yang sehat.
          </p>
          <a
            href="/KalkulatorBmi"
            className="mt-4 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987]"
          >
            Explore Kalkulator BMI →
          </a>
        </div>
<<<<<<< Updated upstream
      </motion.div>

      {/* Feature: Rekap Medis */}
      <motion.div
        className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10 mt-10"
        variants={fadeInRight}
        initial="hidden"
        whileInView="visible"
        transition={{ duration: 0.7, delay: 0.3 }}
        viewport={{ once: false, amount: 0.3 }}
      >
        <div className="w-20 md:w-40 flex-shrink-0 pr-6">
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
          <a
=======
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-10 mt-12">
        <div className="w-full md:w-1/2 text-center md:text-right flex flex-col justify-center items-center md:items-end">
          <h3 className="text-lg font-semibold text-gray-900 relative pb-2 w-fit mx-auto md:mx-0">
            Rekap Medis
            <span className="absolute right-0 bottom-0 w-full h-[2px] bg-[#42B1EC]" />
          </h3>
          <p className="mt-2 text-gray-600 text-sm md:text-base max-w-2xl mx-auto md:mx-0">
            Fitur Rekap Medis UKS adalah sistem pencatatan riwayat kesehatan siswa yang memungkinkan pihak UKS untuk menyimpan dan mengelola data medis setiap pengguna. Fitur ini berfungsi sebagai arsip digital yang membantu dalam pemantauan kondisi kesehatan siswa secara lebih efektif.
          </p>
          {/* <a
>>>>>>> Stashed changes
            href="#"
            className="mt-4 inline-block bg-[#2A8F9E] text-white px-4 py-2 rounded-lg transition duration-300 hover:bg-[#237987]"
          >
            Explore Rekap Medis →
<<<<<<< Updated upstream
          </a>
        </div>
      </motion.div>
=======
          </a> */}
        </div>
      </div>
>>>>>>> Stashed changes
    </section>
  );
};

export default FeaturePage;
