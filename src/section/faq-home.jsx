import DoctorIllustration from "../assets/img/online-doctor-concept.png";

const faqs = [
  { question: "Apa itu UKS?", answer: "UKS adalah Unit Kesehatan Sekolah." },
  { question: "Kapan saya bisa mengunjungi UKS?", answer: "UKS buka setiap hari kerja selama jam sekolah." },
  { question: "Apakah UKS bisa memberikan obat?", answer: "UKS dapat memberikan obat ringan sesuai kebijakan sekolah." },
  { question: "Apa saja fasilitas yang tersedia di UKS?", answer: "UKS menyediakan tempat tidur istirahat, peralatan P3K, dan konsultasi kesehatan." }
];

function FAQ() {
  return (
    <section className="relative mt-20 w-full flex justify-center mb-28">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 left-[-30px] w-[120px] h-[120px] bg-[#F1FFE2] rounded-full opacity-50" />
        <div className="absolute bottom-[180px] right-[240px] w-0 h-0 border-l-[50px] border-r-[50px] border-b-[80px] border-l-transparent border-r-transparent border-b-[#FFE8D6] rotate-20 opacity-60" />
        <div className="absolute top-[300px] right-[200px] w-[70px] h-[70px] bg-[#E6E6FA] rotate-12 rounded-md opacity-50" />

      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-4xl w-full">
        <img src={DoctorIllustration} alt="Doctor Illustration" className="w-full max-w-[450px] mx-auto" />
        <div className="w-full max-w-lg text-center">
          <h2 className="text-[20px] font-semibold text-black leading-[1.2] mb-6">
            Frequently Asked <br /> Question
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-gray-300 rounded-lg overflow-hidden">
                <summary className="cursor-pointer p-4 text-black flex justify-between">
                  {faq.question}
                </summary>
                <p className="p-4 border-t border-gray-300 text-black">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
