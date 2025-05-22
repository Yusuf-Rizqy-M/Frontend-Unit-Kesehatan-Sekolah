import { FaWhatsapp } from "react-icons/fa";

const DoctorCard = ({ name, specialty, whatsapp, image }) => {
  return (
    <div className="w-[250px] bg-white shadow-md rounded-lg overflow-hidden">
      <img
        src={image}
        alt={name}
        className="w-full h-[250px] object-cover bg-blue-100"
        onError={(e) => (e.target.src = "/placeholder.png")} // Fallback jika gambar gagal dimuat
      />
      <div className="p-4 flex justify-between bg-white">
        <div className="text-left flex-grow">
          <h3 className="text-md font-semibold text-[#2D3E50]">{name}</h3>
          <p className="text-sm text-gray-500">{specialty}</p>
        </div>
        <a href={`https://wa.me/+62${whatsapp}`} target="_blank" className="text-green-600">
          <FaWhatsapp size={18} />
        </a>
      </div>
    </div>
  );
};

export default DoctorCard;