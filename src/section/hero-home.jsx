import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import DoctorImg from "../assets/img/doctor_img.png";

const HeroSection = () => {
  const [refLeft, inViewLeft] = useInView({ triggerOnce: false });
  const [refRight, inViewRight] = useInView({ triggerOnce: false });

  return (
    <section className="bg-white py-16 px-4 md:px-16 flex flex-col md:flex-row items-center">
      {/* Left Text Area */}
      <motion.div
        ref={refLeft}
        className="md:w-1/2 text-center md:text-left"
        initial={{ opacity: 0, y: 50 }}
        animate={inViewLeft ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-black leading-tight">
          Sehat <br /> Bersama UKS, <br /> Peduli Sejak Dini
        </h1>
        <p className="mt-4 text-gray-600 text-sm md:text-base lg:text-lg">
          UKS (Usaha Kesehatan Sekolah) hadir untuk mendukung kesehatan siswa dengan layanan
          medis yang cepat dan terpercaya. Kami menyediakan konsultasi kesehatan, pemeriksaan ringan,
          serta edukasi untuk membangun kebiasaan hidup sehat sejak dini.
          Bersama UKS, wujudkan lingkungan sekolah yang lebih sehat dan nyaman!
        </p>
      </motion.div>

      {/* Right Image */}
      <motion.div
        ref={refRight}
        className="md:w-1/2 flex justify-center mt-6 md:mt-0"
        initial={{ opacity: 0, x: 100 }}
        animate={inViewRight ? { opacity: 1, x: 0 } : { opacity: 0, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <img
          src={DoctorImg}
          alt="Doctor Illustration"
          className="max-w-xs md:max-w-md lg:max-w-lg"
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
