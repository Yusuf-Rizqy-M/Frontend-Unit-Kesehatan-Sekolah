import Layout from '../../components/layout';
import MentalHealth from '../../assets/img/loveydovey.png';
import KesehatanFisik from '../../assets/img/strong.png';
import PencegahanPenyakit from '../../assets/img/shieldy2.png';
import PolaHidupSehat from '../../assets/img/sleepy.png';
import KebersihanDiri from '../../assets/img/cleaannn.png';
import EducationCard from '../../widget/educationcard';

function EdukasiKesehatan() {
  return (
    <Layout>
      <main>
      <section className="relative w-full flex justify-center items-center bg-white mb-20 min-h-[300px]  mt-[-250px]">
          {/* Kotak */}
          <div className="w-[1200px] h-[200px] bg-[#75CCD1] rounded-[20px] flex items-center shadow-md pl-12 pt-6">
            <h2 className="text-4xl font-bold text-white text-left leading-tight">
              Jelajahi <br /> berbagai <span className="text-[#005A79]">Edukasi kesehatan</span>
            </h2>
          </div>
      </section>


        <h2 className="-mt-17 text-3xl font-semibold text-[#2A8F9E] text-center"> 
          Apa yang ingin <span className="text-[#005A79]">dibaca?</span>
        </h2>
        
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          <EducationCard title="Kesehatan Mental" icon={MentalHealth} onClick={() => console.log("Mental")} />
          <EducationCard title="Pencegahan Penyakit" icon={PencegahanPenyakit} onClick={() => console.log("Pencegahan")} />
          <EducationCard title="Kebersihan Diri" icon={KebersihanDiri} onClick={() => console.log("Kebersihan")} />
          <EducationCard title="Kesehatan Fisik" icon={KesehatanFisik} onClick={() => console.log("Fisik")} />
          <EducationCard title="Pola Hidup Sehat" icon={PolaHidupSehat} onClick={() => console.log("Hidup Sehat")} />
        </div>
      </main>
    </Layout>
  );
}

export default EdukasiKesehatan;