import { FaWhatsapp } from "react-icons/fa";
import DoctorImage from "../assets/img/11434204.png";

function HealthcareTeam() {
  return (
    <section className="mt-12 w-full flex justify-center bg-white">
      <div className="max-w-5xl w-full space-y-12 px-4">
        <div className="text-center w-full">
          <h2 className="text-[20px] font-semibold text-[#2D3E50]">Our Healthcare Team</h2>
          <div className="w-full border-b-4 border-teal-400 mx-auto max-w-[200px]"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {[1, 2, 3].map((_, index) => (
            <div key={index} className="w-[250px] bg-white shadow-md rounded-lg overflow-hidden">
              <img src={DoctorImage} alt="Doctor" className="w-full h-[250px] object-cover bg-white" />
              <div className="p-4 flex justify-between bg-white">
                <div className="text-left flex-grow">
                  <h3 className="text-md font-semibold text-[#2D3E50]">Doctor Name</h3>
                  <p className="text-sm text-gray-500">Specialist</p>
                </div>
                <a href="https://wa.me/6281234567890" target="_blank" className="text-green-600">
                  <FaWhatsapp size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HealthcareTeam;
