import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import UksImg2 from "../assets/img/UKS2.png";

export default function Footer() {
  return (
    <footer className="py-10 px-6 md:px-24 bg-white text-gray-900 border-t border-gray-300">
      <div className="container mx-auto w-full flex flex-wrap md:flex-nowrap justify-between items-start gap-8">
        {/* Left Section - UKS Info */}
        <div className="w-full md:w-1/3 space-y-3 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            <img 
              src={UksImg2} 
              alt="UKS SMK RUS" 
              className="w-14 h-14 object-contain aspect-square"
            />
            <h2 className="text-2xl font-semibold text-[#30456A]">UKS SMK RUS</h2>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-2 text-gray-800 text-sm text-left">
              <FaMapMarkerAlt className="text-[#30456A] min-w-[18px] mt-1" />
              <span className="leading-relaxed">
                Jalan Sukun Raya No.09, Besito Kulon, Besito, Kec. Gebog, Kabupaten Kudus, Jawa Tengah 59333
              </span>
            </div>
            <div className="flex items-start gap-2 text-gray-800 text-sm text-left">
              <FaEnvelope className="text-[#30456A] min-w-[18px] mt-1" />
              <span className="leading-relaxed">adminukssmkrus@gmail.com</span>
            </div>
            <div className="flex items-start gap-2 text-gray-800 text-sm text-left">
              <FaWhatsapp className="text-[#30456A] min-w-[18px] mt-1" />
              <span className="leading-relaxed">+6285786673009</span>
            </div>
          </div>
        </div>

        {/* Right Section - Links */}
        <div className="w-full md:w-2/3 flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-10 text-center md:text-left">
          {/* UKS Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#30456A]">UKS</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li className="cursor-pointer">Home</li>
              <li className="cursor-pointer">Kalkulator BMI</li>
              <li className="cursor-pointer">Kondisi</li>
              <li className="cursor-pointer">Edukasi Kesehatan</li>
              <li className="cursor-pointer">About us</li>
            </ul>
          </div>

          {/* Layanan Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#30456A]">Layanan</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              <li className="cursor-pointer">Kalkulator BMI</li>
              <li className="cursor-pointer">Sehatbersama</li>
              <li className="cursor-pointer">Tips Kesehatan</li>
              <li className="cursor-pointer">Feature</li>
              <li className="cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Bantuan Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#30456A]">Bantuan</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}