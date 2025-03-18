import UksImg1 from "../assets/img/hospital-room-interior.jpg";
import UksImg2 from "../assets/img/hospital-room-interior.jpg";
import UksImg3 from "../assets/img/hospital-room-interior.jpg";

const facilities = [
  { title: "Hospitality", description: "Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.", image: UksImg1 },
  { title: "Emergency Treatment", description: "Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.", image: UksImg2 },
  { title: "Health Check Up", description: "Our Health Haven is equipped with essential medical facilities to ensure students receive the best care in a safe and comfortable environment.", image: UksImg3 },
];

function Facilities() {
  return (
    <section className="bg-white w-full min-h-screen py-20 px-6 md:px-20 relative">
      <div className="relative w-fit md:pl-20">
        <h2 className="text-xl md:text-3xl font-bold text-[#1C4245] text-left mb-10 pb-2 relative group">
          Facilities
          <span className="absolute left-0 bottom-[-4px] w-full h-[3px] bg-[#4FB7BD]"></span>
        </h2>
      </div>

      <div className="space-y-12">
        {facilities.map((facility, index) => (
          <div key={index} className="flex flex-col md:flex-row items-center gap-6 md:gap-10 relative md:pl-20">
            <div className="w-60 md:w-72 flex-shrink-0 md:ml-20">
              <img src={facility.image} alt={facility.title} className="w-full h-auto object-cover rounded-lg shadow-md" />
            </div>
            <div className="w-full md:w-3/4 text-left md:pl-20">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 relative pb-2 w-fit">
                {facility.title}
                <span className="absolute left-0 bottom-0 w-full h-[2px] bg-[#42B1EC]"></span>
              </h3>
              <p className="mt-2 text-gray-600 max-w-2xl text-sm md:text-base">{facility.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Facilities;
