import DoctorIllustration from "../assets/img/online-doctor-concept.png";

const faqs = [
  { question: "Apa itu UKS?", answer: "UKS adalah Unit Kesehatan Sekolah." },
  { question: "Kapan saya bisa mengunjungi UKS?", answer: "UKS buka setiap hari kerja selama jam sekolah." },
  { question: "Apakah UKS bisa memberikan obat?", answer: "UKS dapat memberikan obat ringan sesuai kebijakan sekolah." },
  { question: "Apa saja fasilitas yang tersedia di UKS?", answer: "UKS menyediakan tempat tidur istirahat, peralatan P3K, dan konsultasi kesehatan." }
];

function FAQ() {
  return (
    <section className="mt-20 w-full flex justify-center mb-28">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center max-w-4xl w-full">
        <img src={DoctorIllustration} alt="Doctor Illustration" className="w-full max-w-[450px] mx-auto" />
        <div className="w-full max-w-lg text-center">
          <h2 className="text-[20px] font-semibold text-[#2D3E50] leading-[1.2] mb-6">
            Frequently Asked <br /> Question
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="border border-gray-300 rounded-lg overflow-hidden">
                <summary className="cursor-pointer p-4 text-[#2D3E50] flex justify-between">
                  {faq.question}
                </summary>
                <p className="p-4 border-t border-gray-300">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
