import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

import UksImg1 from "../assets/img/hospital-room-interior.jpg";
import HealthCheckup from "../assets/img/health-checkup.jpg";
import Emergency from "../assets/img/emergency.jpg";

const facilities = [
  {
    title: "Pendampingan Siswa Sakit",
    description:
      "Selamat datang di UKS SMK RUS, tempat di mana kepedulian dan kenyamanan menjadi prioritas utama. Kami hadir sebagai ruang yang aman, bersih, dan ramah untuk mendukung kesehatan fisik maupun mental seluruh warga sekolah. Mulai dari pertolongan pertama, istirahat sementara, hingga konsultasi ringan, UKS siap menjadi tempat andalan ketika kamu merasa kurang fit atau sekadar butuh jeda sejenak. Kami percaya bahwa lingkungan yang sehat adalah kunci untuk belajar dan tumbuh dengan optimal.",
    image: UksImg1,
  },
  {
    title: "Penanganan Darurat",
    description:
      "UKS SMK RUS siap memberikan penanganan pertama untuk kondisi darurat yang terjadi di lingkungan sekolah. Mulai dari luka ringan, pingsan, mimisan, hingga keluhan mendadak lainnya, tim UKS akan sigap memberikan pertolongan sesuai prosedur yang berlaku. Dengan peralatan P3K yang lengkap dan pengurus yang terlatih, kami memastikan setiap situasi darurat ditangani dengan cepat, aman, dan penuh perhatian.",
    image: Emergency,
  },
  {
    title: "Pemeriksaan Kesehatan Berkala",
    description:
      "UKS SMK RUS menyediakan layanan pemeriksaan kesehatan rutin untuk seluruh siswa, sebagai upaya preventif dalam menjaga kondisi tubuh agar tetap fit selama proses belajar mengajar. Pemeriksaan ini mencakup pengecekan tekanan darah, suhu tubuh, berat badan, tinggi badan, hingga observasi gejala umum yang dapat mengganggu aktivitas belajar. Dengan layanan ini, kami berharap siswa dapat menyadari pentingnya menjaga kesehatan sejak dini dan terhindar dari risiko penyakit ringan maupun serius.",
    image: HealthCheckup,
  },
];

function Facilities() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: false,       // animasi bisa muncul berkali-kali
      mirror: true,      // muncul juga saat scroll ke atas
    });
    AOS.refresh();
  }, []);

  return (
    <section className="bg-white w-full min-h-screen py-20 px-6 md:px-20 relative overflow-hidden">
      {/* Background dekorasi */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#FFD1DC] rounded-full opacity-50" />
        <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
        <div className="absolute top-[300px] right-[100px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
        <div className="absolute bottom-[150px] left-[100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
      </div>

      <div className="relative z-10 w-fit md:pl-20">
        <h2 className="text-lg md:text-2xl font-bold text-[#1C4245] text-left mb-10 pb-2 relative group">
          Fasilitas UKS
          <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#4FB7BD]"></span>
        </h2>
      </div>

      <div className="space-y-16 relative z-10">
        {facilities.map((facility, index) => (
          <div
            key={index}
            data-aos="fade-up"
            className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-20 md:pl-20"
          >
            <div className="w-56 md:w-64 flex-shrink-0">
              <img
                src={facility.image}
                alt={facility.title}
                className="w-full h-auto object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="w-full md:w-3/4 text-left">
              <h3 className="text-sm md:text-base font-medium text-[#1C4245] relative pb-2 w-fit">
                {facility.title}
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]"></span>
              </h3>
              <p className="mt-2 text-gray-600 max-w-2xl text-xs md:text-sm">
                {facility.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Facilities;
