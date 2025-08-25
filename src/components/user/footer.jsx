import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import UksImg2 from "../../assets/img/UKS2.png";

export default function Footer() {
  // Define the routes for the links, matching the Navigation component
  const uksLinks = [
    { name: "Home", href: "/" },
    { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
    { name: "Kondisi", href: "/kondisi" }, // Placeholder route
    { name: "Edukasi Kesehatan", href: "/edukasikesehatan" },
    { name: "Tentang kami", href: "/aboutus" },
  ];

  const layananLinks = [
    { name: "Kalkulator BMI", href: "/kalkulatorbmi" },
    { name: "Sehatbersama", href: "/sehatbersama" }, 
    { name: "Tips Kesehatan", href: "/tips" },
    { name: "Fitur", href: "/feature" }, 
    { name: "FAQ", href: "/faq" }, 
  ];

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
          <p className="flex items-center gap-2 text-gray-800 text-sm justify-center md:justify-start">
            <FaMapMarkerAlt className="text-[#30456A]" />
            Jalan Sukun Raya No.09, Besito Kulon, Besito, Kec. Gebog, Kabupaten Kudus, Jawa Tengah 59333
          </p>
          <p className="flex items-center gap-2 text-gray-800 text-sm justify-center md:justify-start">
            <FaEnvelope className="text-[#30456A]" />
            adminukssmkrus@gmail.com
          </p>
        </div>

        {/* Right Section - Links */}
        <div className="w-full md:w-2/3 flex flex-wrap md:flex-nowrap justify-center md:justify-end gap-10 text-center md:text-left">
          {/* UKS Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#30456A]">UKS</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              {uksLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="cursor-pointer hover:text-[#30456A] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan Section */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[#30456A]">Layanan</h3>
            <ul className="space-y-1 text-gray-700 text-sm">
              {layananLinks.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="cursor-pointer hover:text-[#30456A] transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}