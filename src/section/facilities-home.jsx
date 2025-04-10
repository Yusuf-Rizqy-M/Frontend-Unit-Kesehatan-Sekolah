import UksImg1 from "../assets/img/hospital-room-interior.jpg";
import UksImg2 from "../assets/img/hospital-room-interior.jpg";
import UksImg3 from "../assets/img/hospital-room-interior.jpg";

const facilities = [
  { title: "Hospitality", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", image: UksImg1 },
  { title: "Emergency Treatment", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", image: UksImg2 },
  { title: "Health Check Up", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", image: UksImg3 },
];

function Facilities() {
  return (
    <section className="bg-white w-full min-h-screen py-20 px-6 md:px-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#FFD1DC] rounded-full opacity-50" />
        <div className="absolute bottom-20 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
        <div className="absolute top-[300px] right-[100px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />
        <div className="absolute bottom-[150px] left-[100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
      </div>

      {/* Konten */}
      <div className="relative z-10 w-fit md:pl-20">
        <h2 className="text-lg md:text-2xl font-bold text-[#1C4245] text-left mb-10 pb-2 relative group">
          Facilities
          <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#4FB7BD]"></span>
        </h2>
      </div>

      <div className="space-y-12 relative z-10">
        {facilities.map((facility, index) => (
          <div
            key={index}
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