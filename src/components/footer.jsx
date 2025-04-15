import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import UksImg2 from "../assets/img/UKS2.png";

export default function Footer() {
  return (
    <footer className="py-10 px-12 md:px-24 bg-white text-gray-900 border-t border-gray-300">
      <div className="container mx-auto w-full flex justify-between items-start">
        {/* Left Section - UKS Info */}
        <div className="w-1/3 space-y-3 text-left">
          <div className="flex items-center gap-4">
            <img 
              src={UksImg2} 
              alt="UKS SMK RUS" 
              className="w-14 h-14 object-contain aspect-square"
            />
            <h2 className="text-2xl font-bold text-[#30456A]">UKS SMK RUS</h2>
          </div>
          <p className="flex items-center gap-2 text-gray-800">
            <FaMapMarkerAlt className="text-[#30456A]" />
            <span>Jalan Sukun Raya No.09, Besito Kulon, Besito, Kec. Gebog, Kabupaten Kudus, Jawa Tengah 59333</span>
          </p>
          <p className="flex items-center gap-2 text-gray-800">
            <FaEnvelope className="text-[#30456A]" />
            adminukssmkrus@gmail.com
          </p>
          <p className="flex items-center gap-2 text-gray-800">
            <FaWhatsapp className="text-[#30456A]" />
            +6285786673009
          </p>
        </div>

        {/* Right Section - Links */}
        <div className="flex justify-end gap-16 w-2/3 text-left">
          {/* UKS Section */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#30456A]">UKS</h3>
            <ul className="space-y-1 text-gray-700">
              <li className="cursor-pointer">Home</li>
              <li className="cursor-pointer">Kalkulator BMI</li>
              <li className="cursor-pointer">Kondisi</li>
              <li className="cursor-pointer">Edukasi Kesehatan</li>
              <li className="cursor-pointer">About us</li>
            </ul>
          </div>

          {/* Layanan Section */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#30456A]">Layanan</h3>
            <ul className="space-y-1 text-gray-700">
              <li className="cursor-pointer">Kalkulator BMI</li>
              <li className="cursor-pointer">Sehatbersama</li>
              <li className="cursor-pointer">Tips Kesehatan</li>
              <li className="cursor-pointer">Feature</li>
              <li className="cursor-pointer">FAQ</li>
            </ul>
          </div>

          {/* Bantuan Section */}
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[#30456A]">Bantuan</h3>
          </div>
        </div>
      </div>
    </footer>
  );
}
