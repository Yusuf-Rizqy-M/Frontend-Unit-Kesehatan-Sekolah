import DoctorCard from "../widget/doctorcard";

const doctors = [
  { name: "Dr. John Doe", specialty: "Cardiologist", whatsapp: "6281234567890" },
  { name: "Dr. Jane Smith", specialty: "Pediatrician", whatsapp: "6281234567891" },
  { name: "Dr. Alan Walker", specialty: "Dentist", whatsapp: "6281234567892" },
];

function HealthcareTeam() {
  return (
    <section className="relative mt-12 w-full flex justify-center bg-white mb-16 overflow-visible">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-[-30px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-50" />
        <div className="absolute bottom-50 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] opacity-60" />
        <div className="absolute bottom-50 right-10 w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFFACD] rotate-20 opacity-60" />
        <div className="absolute top-[300px] right-[300px] w-[70px] h-[70px] bg-[#FFD1DC] rotate-12 rounded-md opacity-50" />
        <div className="absolute bottom-[150px] left-[-100px] w-[90px] h-[90px] bg-[#B0E0E6] rounded-full opacity-40" />
      </div>

      {/* CONTENT */}
      <div className="max-w-5xl w-full space-y-12 px-4 relative z-10">
        <div className="text-center w-full">
          <h2 className="text-[20px] font-semibold text-[#2D3E50]">Our Healthcare Team</h2>
          <div className="w-full border-b-4 border-teal-400 mx-auto max-w-[200px]" />
        </div>

        <div className="flex flex-wrap justify-center gap-x-16 gap-y-10 px-6">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} {...doctor} />
          ))}
        </div>
      </div>

    </section>
  );
}

export default HealthcareTeam;
