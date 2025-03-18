import DoctorCard from "../widget/doctorcard";

const doctors = [
  { name: "Dr. John Doe", specialty: "Cardiologist", whatsapp: "6281234567890" },
  { name: "Dr. Jane Smith", specialty: "Pediatrician", whatsapp: "6281234567891" },
  { name: "Dr. Alan Walker", specialty: "Dentist", whatsapp: "6281234567892" },
];

function HealthcareTeam() {
  return (
    <section className="mt-12 w-full flex justify-center bg-white mb-16">
      <div className="max-w-5xl w-full space-y-12 px-4">
        <div className="text-center w-full">
          <h2 className="text-[20px] font-semibold text-[#2D3E50]">Our Healthcare Team</h2>
          <div className="w-full border-b-4 border-teal-400 mx-auto max-w-[200px]"></div>
        </div>
        <div className="flex flex-wrap justify-center gap-10">
          {doctors.map((doctor, index) => (
            <DoctorCard key={index} {...doctor} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default HealthcareTeam;
